import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRotatingTonightSuggestion } from '@/lib/dashboard/tonight-intelligence'
import type { Plan } from '@/lib/dashboard/types'

/**
 * POST /api/dashboard/tonight/regenerate
 * Returns a new tonight suggestion different from the current one.
 */

export async function POST() {
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
  const suggestion = getRotatingTonightSuggestion(user.id, plan, Date.now())

  return NextResponse.json(suggestion)
}
