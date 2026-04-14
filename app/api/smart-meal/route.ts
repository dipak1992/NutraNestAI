import { NextRequest, NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { SmartMealRequest } from '@/lib/engine/types'
import type { LearnedBoosts } from '@/lib/learning/types'

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: rateLimitKeyFromRequest(req), limit: 30, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

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

    return NextResponse.json(result)
  } catch (error) {
    logger.error('[smart-meal] Engine error', { error: error instanceof Error ? error.message : String(error) })
    return apiError('Failed to generate meal')
  }
}
