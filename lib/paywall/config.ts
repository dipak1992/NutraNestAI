import type { SubscriptionTier } from '@/types'

export const FREE_TONIGHT_SWIPE_LIMIT = 2
export const FREE_PLAN_PREVIEW_DAYS = 3

export const PRO_UNLOCKS = [
  'Full 7-day weekly planner',
  'Auto-built grocery list',
  'Pantry and insights tools',
  'Plan publishing and advanced utilities',
] as const

export function normalizeTier(tier: string | null | undefined): SubscriptionTier {
  if (tier === 'plus' || tier === 'pro') return tier
  return 'free'
}

export function isProTier(tier: SubscriptionTier | string | null | undefined): boolean {
  return normalizeTier(typeof tier === 'string' ? tier : undefined) === 'pro'
}
