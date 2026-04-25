import type { Nudge, DashboardPayload } from './types'

export const NUDGE_PRIORITY: Record<Nudge['type'], number> = {
  onboarding_incomplete: 100,
  leftover_expiring_today: 95,
  budget_alert: 90,
  free_scan_limit: 85,
  household_invite: 80,
  upgrade_prompt: 75,
  autopilot_education: 60,
  pantry_scan_reminder: 55,
  referral: 50,
}

export function pickNudge(
  candidates: Nudge[],
  dismissed: string[] = []
): Nudge | null {
  const available = candidates.filter((n) => !dismissed.includes(n.id))
  if (available.length === 0) return null
  return available.sort((a, b) => b.priority - a.priority)[0]
}

export function buildNudgeCandidates(
  ctx: Pick<
    DashboardPayload,
    'user' | 'leftovers' | 'budget' | 'limits' | 'household' | 'weekPlan'
  >
): Nudge[] {
  const candidates: Nudge[] = []

  if (!ctx.user.hasSeenTour) {
    candidates.push({
      id: 'nudge-onboarding',
      type: 'onboarding_incomplete',
      priority: NUDGE_PRIORITY.onboarding_incomplete,
      title: 'Finish setting up',
      body: 'Two minutes and your suggestions get dramatically better.',
      ctaLabel: 'Finish setup',
      ctaHref: '/onboarding',
      dismissible: false,
    })
  }

  const urgent = ctx.leftovers.active.find((l) => l.urgency === 'today')
  if (urgent) {
    candidates.push({
      id: `nudge-leftover-${urgent.id}`,
      type: 'leftover_expiring_today',
      priority: NUDGE_PRIORITY.leftover_expiring_today,
      title: 'Use it tonight',
      body: `Your ${urgent.name.toLowerCase()} expires today. Want three quick meals that use it?`,
      ctaLabel: 'Show meals',
      ctaHref: `/leftovers/${urgent.id}/use`,
      dismissible: true,
    })
  }

  if (ctx.budget.alertLevel === 'over' || ctx.budget.percentUsed >= 90) {
    candidates.push({
      id: 'nudge-budget',
      type: 'budget_alert',
      priority: NUDGE_PRIORITY.budget_alert,
      title:
        ctx.budget.alertLevel === 'over'
          ? "You're over budget"
          : '90% of this week\'s budget used',
      body: 'Want us to swap the rest of the week to lower-cost meals?',
      ctaLabel: 'Adjust plan',
      ctaHref: '/planner?mode=budget',
      dismissible: true,
    })
  }

  if (
    ctx.user.plan === 'free' &&
    ctx.limits.scansUsed >= ctx.limits.scansLimit
  ) {
    candidates.push({
      id: 'nudge-scan-limit',
      type: 'free_scan_limit',
      priority: NUDGE_PRIORITY.free_scan_limit,
      title: "You're out of free scans this month",
      body: 'Unlimited fridge scans on Plus — plus leftovers and budget tracking.',
      ctaLabel: 'See Plus',
      ctaHref: '/pricing',
      dismissible: true,
    })
  }

  return candidates
}
