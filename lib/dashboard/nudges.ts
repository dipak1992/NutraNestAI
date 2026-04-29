import type { Nudge, NudgeVariant, DashboardPayload } from './types'

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

const NUDGE_VARIANT: Record<Nudge['type'], NudgeVariant> = {
  onboarding_incomplete: 'info',
  leftover_expiring_today: 'warning',
  budget_alert: 'danger',
  free_scan_limit: 'promo',
  household_invite: 'info',
  upgrade_prompt: 'promo',
  autopilot_education: 'info',
  pantry_scan_reminder: 'info',
  referral: 'success',
}

/** Legacy alias — kept for backward compatibility */
export function pickNudge(
  candidates: Nudge[],
  dismissed: string[] = []
): Nudge | null {
  const available = candidates.filter((n) => !dismissed.includes(n.id))
  if (available.length === 0) return null
  return available.sort((a, b) => b.priority - a.priority)[0]
}

/**
 * Full nudge priority engine.
 * Evaluates all 9 nudge types and returns the highest-priority non-dismissed nudge.
 */
export function selectNudge(
  ctx: Pick<
    DashboardPayload,
    'user' | 'leftovers' | 'budget' | 'limits' | 'household' | 'weekPlan'
  >,
  dismissed: string[] = []
): Nudge | null {
  const candidates = buildNudgeCandidates(ctx)
  return pickNudge(candidates, dismissed)
}

export function buildNudgeCandidates(
  ctx: Pick<
    DashboardPayload,
    'user' | 'leftovers' | 'budget' | 'limits' | 'household' | 'weekPlan'
  >
): Nudge[] {
  const candidates: Nudge[] = []

  // 1. Onboarding incomplete — highest priority
  if (!ctx.user.onboardingComplete) {
    candidates.push({
      id: 'nudge-onboarding',
      type: 'onboarding_incomplete',
      priority: NUDGE_PRIORITY.onboarding_incomplete,
      title: 'Finish setting up',
      body: 'Two minutes and your suggestions get dramatically better.',
      ctaLabel: 'Finish setup',
      ctaHref: '/onboarding',
      dismissible: false,
      variant: NUDGE_VARIANT.onboarding_incomplete,
    })
  }

  // 2. Leftover expiring today
  const urgent = ctx.leftovers.active.find((l) => l.urgency === 'today')
  if (urgent) {
    candidates.push({
      id: `nudge-leftover-${urgent.id}`,
      type: 'leftover_expiring_today',
      priority: NUDGE_PRIORITY.leftover_expiring_today,
      title: 'Use it tonight',
      body: `Your ${urgent.name.toLowerCase()} expires today. Want three quick meals that use it?`,
      ctaLabel: 'Show meals',
      ctaHref: '/leftovers',
      dismissible: true,
      variant: NUDGE_VARIANT.leftover_expiring_today,
    })
  }

  // 3. Budget alert
  if (ctx.budget.alertLevel === 'over' || ctx.budget.percentUsed >= 90) {
    candidates.push({
      id: 'nudge-budget',
      type: 'budget_alert',
      priority: NUDGE_PRIORITY.budget_alert,
      title:
        ctx.budget.alertLevel === 'over'
          ? "You're over budget"
          : "90% of this week's budget used",
      body: 'Want us to swap the rest of the week to lower-cost meals?',
      ctaLabel: 'Adjust plan',
      ctaHref: '/planner?mode=budget',
      dismissible: true,
      variant: NUDGE_VARIANT.budget_alert,
    })
  }

  // 4. Free scan limit reached
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
      ctaHref: '/upgrade?feature=scan',
      dismissible: true,
      variant: NUDGE_VARIANT.free_scan_limit,
    })
  }

  // 5. Household invite (free users with single member)
  if (ctx.user.plan === 'free' && ctx.household.memberCount === 1) {
    candidates.push({
      id: 'nudge-household-invite',
      type: 'household_invite',
      priority: NUDGE_PRIORITY.household_invite,
      title: 'Cook together',
      body: 'Invite your partner or family to share meal plans and grocery lists.',
      ctaLabel: 'Invite family',
      ctaHref: '/family',
      dismissible: true,
      variant: NUDGE_VARIANT.household_invite,
    })
  }

  // 6. Upgrade prompt (free users who have been around a while)
  if (ctx.user.plan === 'free') {
    const createdAt = new Date(ctx.user.createdAt)
    const daysSinceJoin = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceJoin >= 7) {
      candidates.push({
        id: 'nudge-upgrade',
        type: 'upgrade_prompt',
        priority: NUDGE_PRIORITY.upgrade_prompt,
        title: 'Unlock the full kitchen',
        body: 'Budget tracking, unlimited scans, autopilot meal planning — all on Plus.',
        ctaLabel: 'Upgrade to Plus',
        ctaHref: '/upgrade',
        dismissible: true,
        variant: NUDGE_VARIANT.upgrade_prompt,
      })
    }
  }

  // 7. Autopilot education (plus users who haven't enabled autopilot)
  if (
    (ctx.user.plan === 'plus' || ctx.user.plan === 'family') &&
    !ctx.weekPlan.isAutopilotEnabled
  ) {
    candidates.push({
      id: 'nudge-autopilot',
      type: 'autopilot_education',
      priority: NUDGE_PRIORITY.autopilot_education,
      title: 'Let autopilot plan your week',
      body: 'We can fill your whole week with meals that match your budget and preferences.',
      ctaLabel: 'Enable autopilot',
      ctaHref: '/planner?mode=autopilot',
      dismissible: true,
      variant: NUDGE_VARIANT.autopilot_education,
    })
  }

  // 8. Pantry scan reminder (no scans used yet)
  if (ctx.limits.scansUsed === 0) {
    candidates.push({
      id: 'nudge-pantry-scan',
      type: 'pantry_scan_reminder',
      priority: NUDGE_PRIORITY.pantry_scan_reminder,
      title: 'Snap your fridge',
      body: 'Point your camera at your fridge and we\'ll suggest meals from what you have.',
      ctaLabel: 'Try it now',
      ctaHref: '/dashboard/cook',
      dismissible: true,
      variant: NUDGE_VARIANT.pantry_scan_reminder,
    })
  }

  // 9. Referral (plus users who have been active for 14+ days)
  if (ctx.user.plan === 'plus' || ctx.user.plan === 'family') {
    const createdAt = new Date(ctx.user.createdAt)
    const daysSinceJoin = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceJoin >= 14) {
      candidates.push({
        id: 'nudge-referral',
        type: 'referral',
        priority: NUDGE_PRIORITY.referral,
        title: 'Share MealEase with a friend',
        body: 'Know someone who struggles with "what\'s for dinner?" — send them a link.',
        ctaLabel: 'Share',
        ctaHref: '/referral',
        dismissible: true,
        variant: NUDGE_VARIANT.referral,
      })
    }
  }

  return candidates
}
