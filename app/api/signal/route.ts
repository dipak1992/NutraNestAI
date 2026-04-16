import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited, apiSuccess } from '@/lib/api-response'
import logger from '@/lib/logger'

const VALID_SIGNALS = ['accepted', 'rejected', 'swapped', 'cooked', 'skipped', 'saved'] as const
type Signal = typeof VALID_SIGNALS[number]

interface SignalBody {
  mealId: string
  signal: Signal
  context?: Record<string, unknown>
}

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: rateLimitKeyFromRequest(req), limit: 60, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  let body: SignalBody
  try {
    body = (await req.json()) as SignalBody
  } catch {
    return apiError('Invalid JSON', 400)
  }

  if (!body.mealId || typeof body.mealId !== 'string') {
    return apiError('Missing mealId', 400)
  }
  if (!VALID_SIGNALS.includes(body.signal)) {
    return apiError('Invalid signal', 400)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  const now = new Date()
  const context = {
    hour: now.getHours(),
    dayOfWeek: now.getDay(),
    ...(body.context ?? {}),
  }

  const { error } = await supabase.from('meal_signals').insert({
    user_id: user.id,
    meal_id: body.mealId,
    signal: body.signal,
    context,
  })

  if (error) {
    logger.error('[signal] insert failed', { error: error.message })
    return apiError('Failed to record signal')
  }

  return apiSuccess({ recorded: true })
}
