import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { quickActionsConfig } from '@/config/quick-actions'
import { getGreeting } from '@/lib/dashboard/greeting'
import { calcBudget } from '@/lib/dashboard/budget'
import { buildNudgeCandidates, pickNudge } from '@/lib/dashboard/nudges'
import type {
  DashboardPayload,
  Leftover,
  DayPlan,
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
    .select('full_name, subscription_tier')
    .eq('id', userId)
    .maybeSingle()

  const emailRes = await supabase.auth.getUser()
  const email = emailRes.data.user?.email ?? ''
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
    family: 'plus',
    free: 'free',
  }
  const plan: Plan = tierMap[profile?.subscription_tier ?? 'free'] ?? 'free'

  const greetingInfo = getGreeting()

  // --- Mock tonight (replace with AI/DB call) ---
  const tonight = {
    recipe: {
      id: 'rec_tonight',
      name: 'Honey garlic chicken',
      image: '/landing/family-dinner.jpg',
      cookTimeMin: 30,
      difficulty: 'easy' as const,
      servings: 4,
      costTotal: 14,
      costPerServing: 3.5,
      tags: ['family-friendly', 'high-protein'],
    },
    reason: "Based on the chicken in your fridge + an easy weeknight prep window.",
    alternativesAvailable: 3,
    isFromPantry: true,
    usesLeftover: null,
  }

  // --- Mock leftovers (replace with DB query) ---
  const leftovers: Leftover[] = []

  // --- Mock week plan (replace with DB query) ---
  const days: DayPlan[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (abbr, i) => ({
      id: `day_${i}`,
      dayAbbrev: abbr,
      date: `${i + 2}`,
      recipe: null,
      status: 'empty' as const,
    })
  )

  const weekPlan = {
    days,
    completionPercentage: 0,
    isAutopilotEnabled: false,
    estimatedTotalCost: 0,
  }

  // --- Mock budget (replace with DB query) ---
  const budget = calcBudget(null, 0)

  const household = { memberCount: 1, maxMembers: 6 }
  const limits = { scansUsed: 0, scansLimit: plan === 'free' ? 5 : 999 }

  const quickActions = quickActionsConfig.map((a) => {
    let status: string | undefined
    if (a.id === 'leftovers')
      status = leftovers.length > 0 ? `${leftovers.length} item${leftovers.length === 1 ? '' : 's'}` : undefined
    if (a.id === 'scan' && plan === 'free')
      status = `${limits.scansLimit - limits.scansUsed} scans left`
    return { ...a, status }
  })

  const base: DashboardPayload = {
    user: { id: userId, firstName, plan, hasSeenTour: true },
    greeting: greetingInfo,
    tonight,
    weekPlan,
    leftovers: {
      active: leftovers,
      expiringSoon: leftovers.filter((l) => l.daysUntilExpiry <= 2),
      suggestedRecipes: [],
    },
    budget,
    quickActions,
    nudge: null,
    household,
    limits,
  }

  const nudges = buildNudgeCandidates(base)
  base.nudge = pickNudge(nudges)

  return base
}
