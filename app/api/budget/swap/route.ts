import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'

// ─── POST /api/budget/swap ────────────────────────────────────────────────────
// Stub: returns mock cheaper meal swap suggestions.
// In production this would call an AI model with the user's current week plan.

export async function POST() {
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

  // ── Load current week spend & budget ──────────────────────────────────────
  const { data: budgetRow } = await supabase
    .from('budgets')
    .select('weekly_limit')
    .eq('user_id', user.id)
    .maybeSingle()

  const weeklyLimit = budgetRow?.weekly_limit ?? null

  // If under budget, return empty swaps
  if (!weeklyLimit) {
    return NextResponse.json({ swaps: [] })
  }

  // ── Mock swap suggestions ─────────────────────────────────────────────────
  // TODO: Replace with AI-powered suggestions based on user's actual week plan
  const mockSwaps = [
    {
      originalMeal: 'Salmon with Asparagus',
      swapMeal: 'Tilapia with Broccoli',
      originalCost: 18.5,
      swapCost: 11.2,
      savings: 7.3,
      reason: 'Tilapia is 40% cheaper than salmon with similar protein content.',
    },
    {
      originalMeal: 'Beef Stir Fry',
      swapMeal: 'Chicken Stir Fry',
      originalCost: 15.8,
      swapCost: 9.4,
      savings: 6.4,
      reason: 'Chicken thighs deliver similar flavor at a fraction of the cost.',
    },
    {
      originalMeal: 'Lamb Chops',
      swapMeal: 'Pork Chops',
      originalCost: 22.0,
      swapCost: 12.5,
      savings: 9.5,
      reason: 'Pork chops are a budget-friendly alternative with great flavor.',
    },
  ]

  return NextResponse.json({ swaps: mockSwaps })
}
