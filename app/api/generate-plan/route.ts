import { NextRequest, NextResponse } from 'next/server'
import { generateMealPlan } from '@/lib/ai/meal-generator'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { AIGenerationRequest } from '@/types'

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  try {
    const body = await req.json() as AIGenerationRequest

    if (!body.household || !body.members || !body.week_start) {
      return NextResponse.json({ error: 'Missing required fields: household, members, week_start' }, { status: 400 })
    }

    const plan = await generateMealPlan(body)
    return NextResponse.json(plan)
  } catch (err) {
    logger.error('[generate-plan] Unhandled error', { error: err instanceof Error ? err.message : String(err) })
    return apiError('Failed to generate meal plan')
  }
}
