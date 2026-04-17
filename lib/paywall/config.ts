import type { SubscriptionTier } from '@/types'

export const FREE_TONIGHT_SWIPE_LIMIT = 2
export const FREE_PLAN_PREVIEW_DAYS = 3
export const FREE_KIDS_RECIPE_LIMIT = 3

export const PRO_UNLOCKS = [
  'Full 7-day meal planner',
  'Smart grocery list — auto-built',
  'Pantry Magic & food insights',
  'Weekend Mode — dinner + movie night 🎬',
  'Unlimited Tonight swipes',
  'Family-adapted meals for every age',
  'Zero-Cook Mode — delivery picks 🛵',
] as const

export function normalizeTier(tier: string | null | undefined): SubscriptionTier {
  if (tier === 'plus' || tier === 'pro') return tier
  return 'free'
}

export function isProTier(tier: SubscriptionTier | string | null | undefined): boolean {
  return normalizeTier(typeof tier === 'string' ? tier : undefined) === 'pro'
}
