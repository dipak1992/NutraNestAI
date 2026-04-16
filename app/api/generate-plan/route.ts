import { NextRequest, NextResponse } from 'next/server'
import { generateMealPlan } from '@/lib/ai/meal-generator'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { AIGenerationRequest } from '@/types'

const DAILY_PLAN_LIMIT = 10

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  // Daily AI budget guard
  const today = new Date().toISOString().slice(0, 10)
  const { data: usage } = await supabase
    .from('feature_usage')
    .select('usage_count')
    .eq('user_id', user.id)
    .eq('feature_key', 'ai_plan_generation')
    .eq('usage_date', today)
    .maybeSingle()

  if (usage && usage.usage_count >= DAILY_PLAN_LIMIT) {
    return apiError(`Daily AI generation limit (${DAILY_PLAN_LIMIT}) reached. Try again tomorrow.`, 429)
  }

  try {
    const body = await req.json() as AIGenerationRequest

    if (!body.household || !body.members || !body.week_start) {
      return NextResponse.json({ error: 'Missing required fields: household, members, week_start' }, { status: 400 })
    }

    const plan = await generateMealPlan(body)

    // Increment daily usage counter
    await supabase.rpc('increment_feature_usage', {
      p_user_id: user.id,
      p_feature_key: 'ai_plan_generation',
    }).then(() => {}, () => {})

    return NextResponse.json(plan)
  } catch (err) {
    logger.error('[generate-plan] Unhandled error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to generate meal plan')
  }
}
