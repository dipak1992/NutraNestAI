// ============================================================
// API: POST /api/food-check
//
// Accepts a food photo (base64), returns AI-powered nutritional
// analysis and goal-fit assessment based on personal profile.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { isProTier } from '@/lib/paywall/config'
import logger from '@/lib/logger'
import type { FoodCheckResult, PersonalPreferences } from '@/types/cook-tools'
import { DEFAULT_PERSONAL_PREFS } from '@/types/cook-tools'

export const runtime = 'nodejs'

function buildSystemPrompt(prefs: Omit<PersonalPreferences, 'user_id'>): string {
  return `You are a food nutrition analyst. Analyze the food in the image and assess whether it fits the user's goals.

USER PROFILE:
- Weight goal: ${prefs.weight_goal}
- Protein focus: ${prefs.protein_focus ? 'Yes' : 'No'}
- Vegetarian: ${prefs.is_vegetarian ? 'Yes' : 'No'}
- Allergies: ${prefs.allergies.length > 0 ? prefs.allergies.join(', ') : 'None'}
- Foods to avoid: ${prefs.avoid_foods.length > 0 ? prefs.avoid_foods.join(', ') : 'None'}

RULES:
- Identify the food in the image
- Estimate a calorie RANGE (e.g. "350-500 cal"), not an exact number
- Set calorie_confidence to "low" if you're guessing, "medium" if reasonable estimate, "high" only if very confident
- Assess protein level as "low", "moderate", or "high"
- Give a verdict: "healthy", "balanced", or "indulgent"
- Determine if this food fits the user's goal (weight_goal + protein_focus)
- Write a brief goal_note explaining why it fits or doesn't
- Suggest 1-3 smart swaps (healthier alternatives or modifications)
- Write a brief 1-sentence summary
- Do NOT promise exact calories unless confidence is high
- If the image doesn't contain food, say so in the summary

Respond ONLY with valid JSON in this exact format:
{
  "food_name": "Name of the food",
  "calorie_range": "350-500 cal",
  "calorie_confidence": "low" | "medium" | "high",
  "protein_level": "low" | "moderate" | "high",
  "verdict": "healthy" | "balanced" | "indulgent",
  "fits_goal": true | false,
  "goal_note": "Brief explanation of goal fit",
  "smart_swaps": ["Swap 1", "Swap 2"],
  "summary": "One sentence summary"
}`
}

async function analyzeWithAnthropic(
  image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
  systemPrompt: string,
): Promise<FoodCheckResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: image } },
          { type: 'text', text: systemPrompt },
        ],
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return parseFoodCheckResponse(text)
}

async function analyzeWithOpenAI(
  image: string,
  mimeType: string,
  systemPrompt: string,
): Promise<FoodCheckResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey })

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
          { type: 'text', text: systemPrompt },
        ],
      },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''
  return parseFoodCheckResponse(text)
}

function parseFoodCheckResponse(text: string): FoodCheckResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return {
      food_name: 'Unknown',
      calorie_range: 'Unknown',
      calorie_confidence: 'low',
      protein_level: 'low',
      verdict: 'balanced',
      fits_goal: false,
      goal_note: 'Could not analyze the food. Please try a clearer photo.',
      smart_swaps: [],
      summary: 'Could not analyze the food in this image.',
    }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as FoodCheckResult
    return {
      food_name: typeof parsed.food_name === 'string' ? parsed.food_name : 'Unknown',
      calorie_range: typeof parsed.calorie_range === 'string' ? parsed.calorie_range : 'Unknown',
      calorie_confidence: ['low', 'medium', 'high'].includes(parsed.calorie_confidence)
        ? parsed.calorie_confidence
        : 'low',
      protein_level: ['low', 'moderate', 'high'].includes(parsed.protein_level)
        ? parsed.protein_level
        : 'low',
      verdict: ['healthy', 'balanced', 'indulgent'].includes(parsed.verdict)
        ? parsed.verdict
        : 'balanced',
      fits_goal: typeof parsed.fits_goal === 'boolean' ? parsed.fits_goal : false,
      goal_note: typeof parsed.goal_note === 'string' ? parsed.goal_note : '',
      smart_swaps: Array.isArray(parsed.smart_swaps) ? parsed.smart_swaps : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    }
  } catch {
    return {
      food_name: 'Unknown',
      calorie_range: 'Unknown',
      calorie_confidence: 'low',
      protein_level: 'low',
      verdict: 'balanced',
      fits_goal: false,
      goal_note: 'Could not parse food analysis.',
      smart_swaps: [],
      summary: 'Could not parse food analysis. Please try again.',
    }
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return apiError('Unauthenticated', 401)

    // Check tier — Pro or Family required
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (!isProTier(profile?.subscription_tier)) {
      return apiError('Food Check requires a Pro or Family Plus subscription.', 403)
    }

    const body = await req.json()
    const { image, mimeType } = body as { image?: string; mimeType?: string }

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 })
    }

    const MAX_BASE64_SIZE = 7_000_000
    if (image.length > MAX_BASE64_SIZE) {
      return NextResponse.json({ error: 'Image too large. Maximum size is 5MB.' }, { status: 413 })
    }

    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!ALLOWED_MIME.includes(mimeType)) {
      return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 })
    }

    // Fetch personal preferences
    const { data: prefsData } = await supabase
      .from('personal_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const prefs = prefsData ?? DEFAULT_PERSONAL_PREFS
    const systemPrompt = buildSystemPrompt(prefs)
    const castMime = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    let result: FoodCheckResult

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        result = await analyzeWithAnthropic(image, castMime, systemPrompt)
      } catch (err) {
        logger.warn('[food-check] Anthropic failed, falling back to OpenAI', {
          error: err instanceof Error ? err.message : String(err),
        })
        result = await analyzeWithOpenAI(image, mimeType, systemPrompt)
      }
    } else if (process.env.OPENAI_API_KEY) {
      result = await analyzeWithOpenAI(image, mimeType, systemPrompt)
    } else {
      return apiError('Image analysis is not configured.', 503)
    }

    // Save to scan history (fire-and-forget)
    void supabase
      .from('scan_history')
      .insert({
        user_id: user.id,
        scan_type: 'food_check',
        result,
      })
      .then(() => {}, () => {})

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    logger.error('[food-check] Error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to analyze food')
  }
}
