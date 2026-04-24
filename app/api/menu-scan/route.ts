// ============================================================
// API: POST /api/menu-scan
//
// Accepts a menu photo (base64) + goal, returns AI-powered
// restaurant ordering recommendations based on personal profile.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { isProTier } from '@/lib/paywall/config'
import logger from '@/lib/logger'
import type { MenuScanGoal, MenuScanResult, PersonalPreferences } from '@/types/cook-tools'
import { DEFAULT_PERSONAL_PREFS } from '@/types/cook-tools'

export const runtime = 'nodejs'

const VALID_GOALS: MenuScanGoal[] = [
  'best_for_me', 'healthiest', 'high_protein',
  'budget_pick', 'kid_friendly', 'treat_yourself',
]

function buildSystemPrompt(prefs: Omit<PersonalPreferences, 'user_id'>, goal: MenuScanGoal): string {
  const goalDescriptions: Record<MenuScanGoal, string> = {
    best_for_me: 'Find the items that best match the user\'s personal profile (weight goal, dietary restrictions, preferences).',
    healthiest: 'Find the healthiest, lowest-calorie, most nutritious options on the menu.',
    high_protein: 'Find the highest protein options on the menu.',
    budget_pick: 'Find the best value-for-money items (cheapest that are still good).',
    kid_friendly: 'Find items that are safe, mild, and appealing for children.',
    treat_yourself: 'Find the most indulgent, delicious items — it\'s a treat day!',
  }

  return `You are a smart restaurant ordering assistant. Analyze the menu in the image and recommend items.

USER PROFILE:
- Weight goal: ${prefs.weight_goal}
- Protein focus: ${prefs.protein_focus ? 'Yes' : 'No'}
- Vegetarian: ${prefs.is_vegetarian ? 'Yes' : 'No'}
- Allergies: ${prefs.allergies.length > 0 ? prefs.allergies.join(', ') : 'None'}
- Foods to avoid: ${prefs.avoid_foods.length > 0 ? prefs.avoid_foods.join(', ') : 'None'}

GOAL: ${goalDescriptions[goal]}

RULES:
- Recommend 2-4 items from the menu
- For each recommendation, explain WHY it's good for this goal
- List 1-3 items to AVOID and why
- Suggest 1-3 customizations (e.g. "ask for dressing on the side", "substitute fries for salad")
- Write a brief 1-sentence summary
- If you cannot read the menu clearly, still try your best with what you can see
- NEVER recommend items containing the user's allergens

Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    { "name": "Item Name", "why": "Reason it's recommended", "price_range": "$X-$Y or null", "nutrition_note": "Brief nutrition note" }
  ],
  "avoid": [
    { "name": "Item Name", "reason": "Why to avoid" }
  ],
  "customizations": ["Suggestion 1", "Suggestion 2"],
  "summary": "One sentence summary of the best choice"
}`
}

async function analyzeMenuWithAnthropic(
  image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
  systemPrompt: string,
): Promise<MenuScanResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
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
  return parseMenuScanResponse(text)
}

async function analyzeMenuWithOpenAI(
  image: string,
  mimeType: string,
  systemPrompt: string,
): Promise<MenuScanResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey })

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1000,
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
  return parseMenuScanResponse(text)
}

function parseMenuScanResponse(text: string): MenuScanResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return {
      recommendations: [],
      avoid: [],
      customizations: [],
      summary: 'Could not analyze the menu. Please try a clearer photo.',
    }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as MenuScanResult
    return {
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid : [],
      customizations: Array.isArray(parsed.customizations) ? parsed.customizations : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    }
  } catch {
    return {
      recommendations: [],
      avoid: [],
      customizations: [],
      summary: 'Could not parse menu analysis. Please try again.',
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
      return apiError('Smart Menu Scan requires a Pro or Family Plus subscription.', 403)
    }

    const body = await req.json()
    const { image, mimeType, goal } = body as {
      image?: string
      mimeType?: string
      goal?: MenuScanGoal
    }

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 })
    }

    if (!goal || !VALID_GOALS.includes(goal)) {
      return NextResponse.json({ error: 'Invalid or missing goal' }, { status: 400 })
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
    const systemPrompt = buildSystemPrompt(prefs, goal)
    const castMime = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    let result: MenuScanResult

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        result = await analyzeMenuWithAnthropic(image, castMime, systemPrompt)
      } catch (err) {
        logger.warn('[menu-scan] Anthropic failed, falling back to OpenAI', {
          error: err instanceof Error ? err.message : String(err),
        })
        result = await analyzeMenuWithOpenAI(image, mimeType, systemPrompt)
      }
    } else if (process.env.OPENAI_API_KEY) {
      result = await analyzeMenuWithOpenAI(image, mimeType, systemPrompt)
    } else {
      return apiError('Image analysis is not configured.', 503)
    }

    // Save to scan history (fire-and-forget)
    supabase
      .from('scan_history')
      .insert({
        user_id: user.id,
        scan_type: 'menu_scan',
        goal,
        result,
      })
      .then(() => {}, () => {})

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    logger.error('[menu-scan] Error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to analyze menu')
  }
}
