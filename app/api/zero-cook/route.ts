import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { ZeroCookRequest, ZeroCookResponse } from '@/lib/zero-cook/types'
import { recommendZeroCookOptions } from '@/lib/zero-cook/recommendation'

// ── Route handler ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 20, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  try {
    const body = (await req.json()) as ZeroCookRequest

    if (!body.household) {
      return NextResponse.json({ error: 'Missing required field: household' }, { status: 400 })
    }

    const meals = recommendZeroCookOptions(body)

    return NextResponse.json({ meals } satisfies ZeroCookResponse)
  } catch (error) {
    logger.error('[zero-cook] Error', { error: error instanceof Error ? error.message : String(error) })
    return apiError('Failed to generate delivery picks')
  }
}
