import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { quickActionsConfig } from '@/config/quick-actions'
import { getGreeting } from '@/lib/dashboard/greeting'
import { calcBudget } from '@/lib/dashboard/budget'
import { getTonightSuggestion } from '@/lib/dashboard/tonight-intelligence'
import { buildNudgeCandidates, pickNudge } from '@/lib/dashboard/nudges'
import { loadBudgetPayload } from '@/app/(app)/budget/loader'
import { getDaysUntilExpiry, getUrgency } from '@/lib/leftovers/expiration-calculator'
import type {
  DashboardPayload,
  Leftover,
  Plan,
} from '@/lib/dashboard/types'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getDashboardPayload(user.id)
  return NextResponse.json(payload)
}

/**
 * Shared loader used by both the API route and the server page.
 * TODO: Replace mock blocks with real Supabase queries as schema lands.
 */
export async function getDashboardPayload(
  userId: string
): Promise<DashboardPayload> {
  const supabase = await createClient()

  // --- Real profile fetch ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_tier, plan, onboarding_complete, created_at')
    .eq('id', userId)
    .maybeSingle()

  const emailRes = await supabase.auth.getUser()
  const authUser = emailRes.data.user
  const email = authUser?.email ?? ''
  const emailPrefix = email.split('@')[0]

  const rawName =
    profile?.full_name ??
    emailPrefix ??
    'there'

  // Extract first name only
  const firstName = rawName.trim().split(/[\s._-]/)[0] ?? 'there'

  // Map subscription_tier to Plan
  const tierMap: Record<string, Plan> = {
    pro: 'plus',
    plus: 'plus',
    free: 'free',
  }
  const plan: Plan =
    tierMap[profile?.subscription_tier ?? 'free'] ??
    tierMap[profile?.plan ?? 'free'] ??
    'free'

  // Onboarding complete — default true if column doesn't exist yet
  const onboardingComplete: boolean = profile?.onboarding_complete ?? true

  // User creation date — prefer auth metadata, fall back to profile, then now
  const createdAt: string =
    authUser?.created_at ??
    profile?.created_at ??
    new Date().toISOString()

  const greetingInfo = getGreeting()

  const tonight = await getTonightSuggestion(supabase, userId, plan)

  const leftovers = await loadDashboardLeftovers(userId)

  let budget = calcBudget(null, 0)
  try {
    const budgetPayload = await loadBudgetPayload(userId, plan === 'free' ? 'free' : 'plus')
    budget = calcBudget(
      budgetPayload.settings.weeklyLimit,
      budgetPayload.currentWeek.spent,
    )
  } catch {
    // Honest fallback: no budget data connected yet.
  }

  const household = { memberCount: 1, maxMembers: 6 }
  const scansLimit = plan === 'free' ? 5 : 999
  const scansUsed = await loadScanCount(userId)
  const limits = {
    scansUsed,
    scansLimit,
    scansRemaining: Math.max(0, scansLimit - scansUsed),
  }

  const quickActions = quickActionsConfig.map((a) => {
    let status: string | undefined
    if (a.id === 'leftovers')
      status = leftovers.length > 0 ? `${leftovers.length} item${leftovers.length === 1 ? '' : 's'}` : undefined
    if (a.id === 'scan' && plan === 'free')
      status = `${limits.scansRemaining} scans left`
    return { ...a, status }
  })

  const _now = new Date()
  const _hour = _now.getHours()

  const base: DashboardPayload = {
    user: {
      id: userId,
      firstName,
      plan,
      hasSeenTour: true,
      onboardingComplete,
      createdAt,
    },
    greeting: greetingInfo,
    tonight,
    leftovers: {
      active: leftovers,
      expiringSoon: leftovers.filter((l) => l.daysUntilExpiry <= 2),
      suggestedRecipes: [],
    },
    budget,
    retention: {
      expiringSoon: leftovers.filter((l) => l.daysUntilExpiry <= 2).length,
      isSunday: _now.getDay() === 0,
      isDinnerWindow: _hour >= 16 && _hour < 20,
      plannedDays: 0,
      weeklyBudgetRemaining:
        budget.weeklyLimit != null
          ? Math.max(0, budget.weeklyLimit - budget.weekSpent)
          : null,
    },
    quickActions,
    nudge: null,
    household,
    limits,
  }

  const nudges = buildNudgeCandidates(base)
  base.nudge = pickNudge(nudges)

  return base
}

async function loadDashboardLeftovers(userId: string): Promise<Leftover[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leftovers')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('expires_at', { ascending: true })
    .limit(10)

  if (error) {
    try {
      const { data: household } = await supabase
        .from('households')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle()

      if (!household?.id) return []

      const { data: householdRows, error: householdError } = await supabase
        .from('leftovers')
        .select('*')
        .eq('household_id', household.id)
        .eq('status', 'active')
        .order('expires_at', { ascending: true })
        .limit(10)

      if (householdError) return []
      return (householdRows ?? []).map(toDashboardLeftover)
    } catch {
      return []
    }
  }

  return (data ?? []).map(toDashboardLeftover)
}

function toDashboardLeftover(row: Record<string, unknown>): Leftover {
  const expiresAt =
    (row.expires_at as string | null) ??
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  const name =
    (row.name as string | null) ??
    (row.display_name as string | null) ??
    (row.source_recipe_name as string | null) ??
    'Cooked meal'

  return {
    id: String(row.id),
    name,
    image: (row.image as string | null) ?? '/landing/family-dinner.jpg',
    servingsRemaining:
      Number(row.servings_remaining ?? row.estimated_servings_remaining ?? 1) || 1,
    sourceRecipeId: String(row.source_recipe_id ?? row.source_meal_id ?? ''),
    createdAt:
      (row.created_at as string | null) ??
      (row.cooked_at as string | null) ??
      new Date().toISOString(),
    expiresAt,
    daysUntilExpiry: getDaysUntilExpiry(expiresAt),
    urgency: getUrgency(expiresAt),
  }
}

async function loadScanCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('scans')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())

  if (error) return 0
  return count ?? 0
}
