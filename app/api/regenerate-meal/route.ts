import { NextRequest, NextResponse } from 'next/server'
import { regenerateMeals } from '@/lib/ai/meal-generator'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { AIGenerationRequest } from '@/types'

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  try {
    const body = await req.json() as { request: AIGenerationRequest; modifier: string }

    if (!body.request || !body.modifier) {
      return NextResponse.json({ error: 'Missing required fields: request, modifier' }, { status: 400 })
    }

    const plan = await regenerateMeals(body.request, body.modifier)
    return NextResponse.json(plan)
  } catch (err) {
    logger.error('[regenerate-meal] Error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to regenerate meals')
  }
}
