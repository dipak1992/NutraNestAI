import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { generateText, stripJsonFences } from '@/lib/ai/service'
import logger from '@/lib/logger'
import { getUserDietaryPrefs, buildPreferenceContext } from '@/lib/meal-engine/preferences'

export type KidsToolIntent = 'lunchbox' | 'snack' | 'bake' | 'picky' | 'fast'

export interface LunchboxResult {
  intent: 'lunchbox'
  section_title: string
  main_item: string
  fruit: string
  side_snack: string
  optional_treat: string
  prep_time: string
  tip: string
}

export interface SnackResult {
  intent: 'snack'
  section_title: string
  name: string
  category: string
  ingredients: string[]
  prep_time: string
  why_kids_love_it: string
}

export interface BakeResult {
  intent: 'bake'
  section_title: string
  activity_name: string
  kid_age_fit: string
  prep_time: string
  mess_level: 'low' | 'medium' | 'high'
  ingredients: string[]
  steps: string[]
  fun_tip: string
}

export interface PickyResult {
  intent: 'picky'
  section_title: string
  meal_name: string
  acceptance_score: number
  why_it_may_work: string
  optional_upgrade_path: string
  serving_tip: string
}

export interface FastResult {
  intent: 'fast'
  section_title: string
  meal_name: string
  ready_in_minutes: number
  ingredients_needed: string[]
  urgency_score: number
  shortcut_tip: string
}

export type KidsToolResult = LunchboxResult | SnackResult | BakeResult | PickyResult | FastResult

function buildPrompt(intent: KidsToolIntent, prefContext: string): { system: string; user: string } {
  const prefSuffix = prefContext ? `\n\n${prefContext}` : ''
  switch (intent) {
    case 'lunchbox':
      return {
        system: `You are a friendly kids nutrition expert helping parents pack school lunchboxes. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}`,
        user: `Generate one creative and nutritious school lunchbox idea. Return this exact JSON shape:
{
  "intent": "lunchbox",
  "section_title": "Lunchbox Ideas",
  "main_item": "the main sandwich/wrap/meal item e.g. Turkey & Cheese Roll-Up",
  "fruit": "the fruit to include e.g. Sliced apple with cinnamon",
  "side_snack": "a healthy side snack e.g. Carrot sticks with hummus",
  "optional_treat": "a small treat e.g. 2 mini chocolate chip cookies",
  "prep_time": "how long to prepare e.g. 5 min",
  "tip": "a practical packing tip for parents"
}
Be creative but practical. Keep everything kid-friendly ages 4-12.`,
      }

    case 'snack':
      return {
        system: `You are a kids snack specialist helping parents find quick, healthy after-school snacks. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}`,
        user: `Generate one great after-school snack idea for kids. Return this exact JSON shape:
{
  "intent": "snack",
  "section_title": "Snack Rescue",
  "name": "snack name e.g. Apple Nachos with Peanut Butter",
  "category": "one of: after_school, healthy, quick, filling, light",
  "ingredients": ["3-5 simple ingredients"],
  "prep_time": "e.g. 3 min",
  "why_kids_love_it": "a fun reason why kids enjoy this"
}
Keep it healthy, fast, and fun for kids aged 4-12.`,
      }

    case 'bake':
      return {
        system: `You are a family baking expert who specializes in fun baking activities for parents and kids. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}`,
        user: `Generate one fun baking activity parents and kids can do together. Return this exact JSON shape:
{
  "intent": "bake",
  "section_title": "Bake Together",
  "activity_name": "name of the baking activity e.g. Rainbow Sprinkle Sugar Cookies",
  "kid_age_fit": "best age range e.g. 4-10 years",
  "prep_time": "total time e.g. 35 min",
  "mess_level": "exactly one of: low, medium, high",
  "ingredients": ["5-8 simple ingredients"],
  "steps": ["4-6 simple kid-friendly steps"],
  "fun_tip": "a tip to make it more fun for kids"
}
Make it genuinely fun, achievable for kids, with manageable mess.`,
      }

    case 'picky':
      return {
        system: `You are a pediatric feeding specialist helping parents with picky eaters. You specialize in bridge meals — familiar foods kids are likely to accept. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}`,
        user: `Generate one picky eater bridge meal a picky child is likely to accept. Return this exact JSON shape:
{
  "intent": "picky",
  "section_title": "Picky Eater Wins",
  "meal_name": "meal name e.g. Sneaky Mac & Cheese with Hidden Cauliflower",
  "acceptance_score": 8,
  "why_it_may_work": "brief explanation of why a picky eater might accept this",
  "optional_upgrade_path": "how to expand this meal when they are ready",
  "serving_tip": "practical tip for getting picky eaters to try it"
}
acceptance_score is an integer 1-10 (10 = highest picky-eater acceptance). Focus on familiar textures and flavors.`,
      }

    case 'fast':
      return {
        system: `You are a quick-meal expert for busy parents who need food on the table in 5 minutes or less. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}`,
        user: `Generate one ultra-fast meal ready in 5 minutes or less for hungry kids. Return this exact JSON shape:
{
  "intent": "fast",
  "section_title": "Ready in 5 Minutes",
  "meal_name": "meal name e.g. Peanut Butter Banana Roll-Up",
  "ready_in_minutes": 5,
  "ingredients_needed": ["3-5 simple pantry or fridge staples"],
  "urgency_score": 9,
  "shortcut_tip": "the key trick that makes this so fast"
}
ready_in_minutes must be 5 or less. urgency_score is an integer 1-10. No cooking required if possible.`,
      }
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 20, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  try {
    const body = (await req.json()) as { intent?: string }
    const intent = body.intent as KidsToolIntent | undefined

    if (!intent || !['lunchbox', 'snack', 'bake', 'picky', 'fast'].includes(intent)) {
      return NextResponse.json({ error: 'Invalid intent. Use: lunchbox, snack, bake, picky, fast' }, { status: 400 })
    }

    const prefs = await getUserDietaryPrefs(user.id)
    const prefContext = prefs ? buildPreferenceContext(prefs, { includeKidsSettings: true }) : ''

    const { system, user: userPrompt } = buildPrompt(intent, prefContext)
    const { text } = await generateText({ system, user: userPrompt, maxTokens: 1024 })
    const clean = stripJsonFences(text)
    const result = JSON.parse(clean) as KidsToolResult

    return NextResponse.json(result)
  } catch (error) {
    logger.error('[kids-tool] Error generating result', {
      error: error instanceof Error ? error.message : String(error),
    })
    return apiError('Failed to generate kids tool result')
  }
}
