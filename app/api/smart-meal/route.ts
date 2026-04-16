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

    const result = generateSmartMeal(
      {
        ...mealRequest,
        household: { adultsCount, kidsCount, toddlersCount, babiesCount },
      },
      learnedBoosts,
    )

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
  return JSON.parse(cleaned) as SmartMealResult
}
