import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRotatingTonightSuggestion } from '@/lib/dashboard/tonight-intelligence'
import type { Plan } from '@/lib/dashboard/types'

/**
 * POST /api/dashboard/tonight/regenerate
 * Returns a new tonight suggestion different from the current one.
 */

type RegenerateBody = {
  currentMealId?: string
  excludeIds?: string[]
}

async function readBody(req: Request): Promise<RegenerateBody> {
  try {
    const text = await req.text()
    if (!text) return {}
    const parsed = JSON.parse(text) as RegenerateBody
    return {
      currentMealId: typeof parsed.currentMealId === 'string' ? parsed.currentMealId : undefined,
      excludeIds: Array.isArray(parsed.excludeIds)
        ? parsed.excludeIds.filter((id): id is string => typeof id === 'string').slice(0, 25)
        : [],
    }
  } catch {
    return {}
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .maybeSingle()

  const tierMap: Record<string, Plan> = {
    pro: 'plus',
    plus: 'plus',
    family: 'family',
    free: 'free',
  }
  const plan = tierMap[profile?.subscription_tier ?? 'free'] ?? 'free'
  const body = await readBody(req)
  const excludeIds = Array.from(
    new Set([
      ...(body.excludeIds ?? []),
      ...(body.currentMealId ? [body.currentMealId] : []),
    ]),
  ).slice(0, 25)

  const suggestion = getRotatingTonightSuggestion(user.id, plan, excludeIds)

  return NextResponse.json(suggestion, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
