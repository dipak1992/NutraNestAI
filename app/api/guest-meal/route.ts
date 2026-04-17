import { NextRequest, NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiRateLimited } from '@/lib/api-response'

/**
 * Guest meal endpoint — no auth required.
 * Returns generic (non-personalised) meal suggestions using the local engine.
 * Rate-limited per IP to 10 requests/minute.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: `guest:${rateLimitKeyFromRequest(req)}`, limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  let excludeIds: string[] = []
  try {
    const body = await req.json()
    if (Array.isArray(body?.excludeIds)) {
      excludeIds = body.excludeIds.filter((id: unknown) => typeof id === 'string').slice(0, 20)
    }
  } catch {
    // body is optional — continue with defaults
  }

  const result = generateSmartMeal(
    {
      household: { adultsCount: 2, kidsCount: 0, toddlersCount: 0, babiesCount: 0 },
      lowEnergy: true,
      maxCookTime: 30,
      excludeIds,
    },
    undefined, // no personalisation for guests
  )

  return NextResponse.json(result)
}
