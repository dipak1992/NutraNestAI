import { NextRequest, NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { generateText } from '@/lib/ai/service'
import logger from '@/lib/logger'
import { generateSlug } from '@/lib/content/types'
import type { SmartMealRequest, SmartMealResult } from '@/lib/engine/types'
import type { LearnedBoosts } from '@/lib/learning/types'

function dedupeStrings(values: Array<string | undefined | null>): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v)))
}

function getTimeAwareDefaults(now = new Date()): Pick<SmartMealRequest, 'maxCookTime' | 'lowEnergy' | 'cuisinePreferences'> {
  const hour = now.getHours()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6

  if (isWeekend) {
    return {
      maxCookTime: 50,
      lowEnergy: false,
      cuisinePreferences: ['comfort'],
    }
  }

  if (hour < 11) {
    return {
      maxCookTime: 20,
      lowEnergy: true,
      cuisinePreferences: ['mediterranean'],
    }
  }

  if (hour < 17) {
    return {
      maxCookTime: 25,
      lowEnergy: true,
      cuisinePreferences: ['asian'],
    }
  }

  return {
    maxCookTime: 40,
    lowEnergy: false,
    cuisinePreferences: ['comfort'],
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 30, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  try {
    const body = (await req.json()) as SmartMealRequest & { learnedBoosts?: LearnedBoosts }

    if (!body.household) {
      return NextResponse.json(
        { error: 'Missing required field: household' },
        { status: 400 },
      )
    }

    const { adultsCount = 0, kidsCount = 0, toddlersCount = 0, babiesCount = 0 } = body.household
    if (adultsCount + kidsCount + toddlersCount + babiesCount === 0) {
      return NextResponse.json(
        { error: 'Household must have at least one member' },
        { status: 400 },
      )
    }

    const { learnedBoosts, ...mealRequest } = body

    let historyExcludeIds: string[] = []
    try {
      const { data: recent } = await supabase
        .from('recently_shown_meals')
        .select('meal_id, shown_at')
        .eq('user_id', user.id)
        .in('source_mode', ['smart-meal', 'weekly-plan', 'tonight'])
        .order('shown_at', { ascending: false })
        .limit(20)
      historyExcludeIds = (recent ?? []).map((r) => r.meal_id).filter(Boolean)
    } catch {
      historyExcludeIds = []
    }

    const timeDefaults = getTimeAwareDefaults()

    const mergedRequest: SmartMealRequest = {
      ...mealRequest,
      household: { adultsCount, kidsCount, toddlersCount, babiesCount },
      maxCookTime: mealRequest.maxCookTime ?? timeDefaults.maxCookTime,
      lowEnergy: mealRequest.lowEnergy ?? timeDefaults.lowEnergy,
      cuisinePreferences:
        mealRequest.cuisinePreferences && mealRequest.cuisinePreferences.length > 0
          ? mealRequest.cuisinePreferences
          : timeDefaults.cuisinePreferences,
      excludeIds: dedupeStrings([...(mealRequest.excludeIds ?? []), ...historyExcludeIds]),
    }

    const result = generateSmartMeal(
      mergedRequest,
      learnedBoosts,
    )

    try {
      await supabase.from('recently_shown_meals').insert({
        user_id: user.id,
        meal_id: result.id,
        source_mode: 'smart-meal',
        metadata: {
          title: result.title,
          hour: new Date().getHours(),
          weekend: [0, 6].includes(new Date().getDay()),
        },
      })
    } catch {
      // non-fatal
    }

    // ── AI escape hatch: pool exhausted → generate via AI ───
    if (result.meta.poolExhausted) {
      logger.info('[smart-meal] Pool exhausted, falling through to AI', {
        viableScore: result.meta.score,
      })

      try {
        const aiMeal = await generateAIMeal(mealRequest, body.household)
        // Cache in saved_meals with system_generated flag
        const slug = generateSlug(aiMeal.title)
        await supabase.from('saved_meals').insert({
          user_id: user.id,
          slug,
          title: aiMeal.title,
          description: aiMeal.description ?? null,
          cuisine_type: aiMeal.cuisineType ?? null,
          meal_data: { ...aiMeal, system_generated: true },
          is_public: false,
        })

        return NextResponse.json(aiMeal)
      } catch (aiError) {
        logger.warn('[smart-meal] AI fallback failed, returning engine result', {
          error: aiError instanceof Error ? aiError.message : String(aiError),
        })
        // Fall through to engine result if AI also fails
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error('[smart-meal] Engine error', { error: error instanceof Error ? error.message : String(error) })
    return apiError('Failed to generate meal')
  }
}

/** Generate a single meal via AI when the deterministic engine pool is exhausted. */
async function generateAIMeal(
  request: SmartMealRequest,
  household: { adultsCount?: number; kidsCount?: number; toddlersCount?: number; babiesCount?: number },
): Promise<SmartMealResult> {
  const constraints: string[] = []
  if (request.allergies?.length) constraints.push(`Allergies: ${request.allergies.join(', ')}`)
  if (request.dietaryRestrictions?.length) constraints.push(`Dietary: ${request.dietaryRestrictions.join(', ')}`)
  if (request.cuisinePreferences?.length) constraints.push(`Preferred cuisines: ${request.cuisinePreferences.join(', ')}`)
  if (request.preferredProteins?.length) constraints.push(`Preferred proteins: ${request.preferredProteins.join(', ')}`)
  if (request.pantryItems?.length) constraints.push(`Pantry items to use: ${request.pantryItems.join(', ')}`)
  if (request.lowEnergy) constraints.push('Low-energy/simple meal preferred')

  const servings =
    (household.adultsCount ?? 0) +
    (household.kidsCount ?? 0) +
    (household.toddlersCount ?? 0) +
    Math.ceil((household.babiesCount ?? 0) * 0.5)

  const system = `You are a family meal planner. Return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "id": "ai-<short-uuid>",
  "title": string,
  "tagline": string,
  "description": string,
  "cuisineType": string,
  "imageUrl": string (a short keyword describing the dish for image lookup, e.g. "pasta bolognese" or "chicken curry"),
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "totalTime": number,
  "estimatedCost": number (USD),
  "servings": number,
  "difficulty": "easy"|"moderate"|"hard",
  "tags": string[],
  "ingredients": [{"name":string,"quantity":string,"unit":string,"fromPantry":boolean,"category":string}],
  "steps": string[],
  "variations": [],
  "leftoverTip": string|null,
  "shoppingList": [{"name":string,"quantity":string,"unit":string,"category":string}],
  "meta": {"score":0,"matchedPantryItems":[],"pantryUtilization":0,"simplifiedForEnergy":false,"pickyEaterAdjusted":false,"localityApplied":false,"selectionReason":"AI-generated: pool exhausted","poolExhausted":true}
}`

  const user = `Generate one meal for ${servings} servings.\n${constraints.length ? constraints.join('\n') : 'No special constraints.'}`

  const { text } = await generateText({ system, user, maxTokens: 4096 })

  logger.info('[smart-meal] AI single-meal generated', { feature: 'generate-plan' })

  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  const meal = JSON.parse(cleaned) as SmartMealResult

  // Convert AI's imageUrl keyword into a cuisine-based image if it's not a full URL
  if (!meal.imageUrl || !meal.imageUrl.startsWith('http')) {
    const CUISINE_FALLBACK: Record<string, string> = {
      italian: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&h=400&fit=crop',
      mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop',
      asian: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=400&fit=crop',
      indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop',
      thai: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=400&fit=crop',
      chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=400&fit=crop',
      japanese: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=400&fit=crop',
      korean: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=400&fit=crop',
      mediterranean: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=400&fit=crop',
      american: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=400&fit=crop',
      nepali: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=400&fit=crop',
    }
    const key = (meal.cuisineType ?? '').toLowerCase()
    meal.imageUrl = CUISINE_FALLBACK[key]
      ?? Object.entries(CUISINE_FALLBACK).find(([k]) => key.includes(k))?.[1]
      ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop'
  }

  return meal
}
