import type { SubscriptionTier } from '@/types'

// ── Pricing tiers & values (SOURCE OF TRUTH) ─────────────────────────────────
// All price IDs must be configured in Vercel ENV vars before checkout works

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: undefined,
    yearlyPriceId: undefined,
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 7.99,
    yearlyPrice: 59,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
  },
  family: {
    name: 'Family Plus',
    monthlyPrice: 12.99,
    yearlyPrice: 99,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_YEARLY,
  },
} as const

// ── Stripe trial days (configurable via ENV) ──────────────────────────────────
export const STRIPE_TRIAL_DAYS = parseInt(process.env.STRIPE_TRIAL_DAYS || '7', 10)

// ── Free plan limits ──────────────────────────────────────────────────────

export const FREE_TONIGHT_SWIPE_LIMIT = 3 // Free users: 3 swipes/day
export const FREE_PLAN_PREVIEW_DAYS = 3   // Free users: 3-day week preview
export const FREE_DAILY_GENERATIONS = 3   // Free users: 3 meal generations/day
export const FREE_KIDS_RECIPE_LIMIT = 3   // Free users: 3 kid recipe variations

// ── Pro tier unlocks ─────────────────────────────────────────────────────

export const PRO_UNLOCKS = [
  '2 member profiles',
  'Unlimited meal generations',
  'Full 7-day weekly planner',
  'Save preferences',
  'Household memory (1 household)',
  'Smart Menu Scan — order smarter at restaurants',
  'Food Check — snap any food, see calories & fit',
  'Budget meal mode',
  'Healthy mode',
  'Meal history',
  'Unlimited regenerations',
  'Faster AI responses',
] as const

// ── Family Plus tier unlocks (everything in Pro + these) ────────────────

export const FAMILY_PLUS_UNLOCKS = [
  'Up to 6 family members',
  'Kids Mode with picky eater settings',
  'Smart Menu Scan & Food Check',
  'Lunchbox Planner',
  'Pantry Mode (turn leftovers into dinner)',
  'Shared grocery lists',
  'Family dashboard',
  'Multi-profile meal balancing',
  'Smart family weekly planning',
  'Household autopilot',
] as const

// ── Savings calculations ──────────────────────────────────────────────────

export const PRO_ANNUAL_SAVINGS = Math.round((1 - PRICING_TIERS.pro.yearlyPrice / (PRICING_TIERS.pro.monthlyPrice * 12)) * 100) // 38%
export const FAMILY_ANNUAL_SAVINGS = Math.round((1 - PRICING_TIERS.family.yearlyPrice / (PRICING_TIERS.family.monthlyPrice * 12)) * 100) // 36%

// ── Tier normalization & checks ───────────────────────────────────────────

export function normalizeTier(tier: string | null | undefined): SubscriptionTier {
  if (tier === 'pro' || tier === 'family') return tier as SubscriptionTier
  return 'free'
}

export function isProTier(tier: SubscriptionTier | string | null | undefined): boolean {
  const normalized = typeof tier === 'string' ? normalizeTier(tier) : 'free'
  return normalized === 'pro' || normalized === 'family'
}

export function isFamilyTier(tier: SubscriptionTier | string | null | undefined): boolean {
  const normalized = typeof tier === 'string' ? normalizeTier(tier) : 'free'
  return normalized === 'family'
}
