import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'
import { loadBudgetPayload } from '@/app/budget/loader'

// ─── GET /api/budget ──────────────────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paywall = await getPaywallStatus()
  const plan = paywall.isPro ? 'plus' : 'free'

  const payload = await loadBudgetPayload(user.id, plan)
  return NextResponse.json(payload)
}

// ─── PUT /api/budget ──────────────────────────────────────────────────────────

export async function PUT(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paywall = await getPaywallStatus()
  if (!paywall.isPro) {
    return NextResponse.json({ error: 'Plus plan required' }, { status: 403 })
  }

  const body = await req.json()
  const { weeklyLimit, strictMode, zipCode, preferredStore } = body

  const { error } = await supabase.from('budgets').upsert(
    {
      user_id: user.id,
      weekly_limit: weeklyLimit ?? null,
      strict_mode: strictMode ?? false,
      zip_code: zipCode ?? null,
      preferred_store: preferredStore ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) {
    console.error('[api/budget PUT]', error)
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
