import { NextRequest, NextResponse } from 'next/server'
import { regenerateMeals } from '@/lib/ai/meal-generator'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { enforceFeatureQuota, incrementFeatureQuota } from '@/lib/usage/feature-quota'
import logger from '@/lib/logger'
import type { AIGenerationRequest } from '@/types'

const REGENERATE_QUOTA = {
  key: 'ai_meal_regeneration',
  limit: 20,
  label: 'meal regeneration',
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)
  const quotaResponse = await enforceFeatureQuota(supabase, user.id, REGENERATE_QUOTA)
  if (quotaResponse) return quotaResponse

  try {
    const body = await req.json() as { request: AIGenerationRequest; modifier: string; currentMealContext?: Record<string, unknown> }

    if (!body.request || !body.modifier) {
      return NextResponse.json({ error: 'Missing required fields: request, modifier' }, { status: 400 })
    }

    const plan = await regenerateMeals(body.request, body.modifier, body.currentMealContext)
    await incrementFeatureQuota(supabase, REGENERATE_QUOTA)
    // Track last meaningful activity for reactivation/winback emails
    supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('user_id', user.id).then(() => {}, () => {})
    return NextResponse.json(plan)
  } catch (err) {
    logger.error('[regenerate-meal] Error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to regenerate meals')
  }
}
