export type PlanId = 'free' | 'plus' | 'family'

export type PlanDef = {
  id: PlanId
  name: string
  priceMonthly: number
  stripePriceId: string | null
  tagline: string
  badge?: string
  highlighted?: boolean
  features: string[]
  limits: {
    fridgeScansPerWeek: number | 'unlimited'
    menuScansPerMonth: number | 'unlimited'
    aiLeftoverSuggestions: 'limited' | 'unlimited'
    budgetTracking: boolean
    autopilot: boolean
    householdMembers: number
    prioritySupport: boolean
  }
}

export const PLANS: Record<PlanId, PlanDef> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    stripePriceId: null,
    tagline: 'Start here',
    features: [
      'Tonight suggestions',
      '3 fridge scans per week',
      '3 menu scans per month',
      'Unlimited food checks',
      'Basic meal planning',
    ],
    limits: {
      fridgeScansPerWeek: 3,
      menuScansPerMonth: 3,
      aiLeftoverSuggestions: 'limited',
      budgetTracking: false,
      autopilot: false,
      householdMembers: 1,
      prioritySupport: false,
    },
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    priceMonthly: 7.99,
    stripePriceId: process.env.STRIPE_PLUS_PRICE_ID ?? null,
    tagline: 'Most popular',
    badge: 'Most popular',
    highlighted: true,
    features: [
      'Everything in Free',
      'Unlimited fridge & menu scans',
      'Unlimited Leftovers AI',
      'Weekly Autopilot',
      'Budget Intelligence',
      'Grocery list export',
      'Up to 6 household members',
      'Shared meal plans & grocery lists',
      'Kid-friendly suggestions',
    ],
    limits: {
      fridgeScansPerWeek: 'unlimited',
      menuScansPerMonth: 'unlimited',
      aiLeftoverSuggestions: 'unlimited',
      budgetTracking: true,
      autopilot: true,
      householdMembers: 6,
      prioritySupport: false,
    },
  },
  family: {
    id: 'family',
    name: 'Family',
    priceMonthly: 14.99,
    stripePriceId: process.env.STRIPE_FAMILY_PRICE_ID ?? null,
    tagline: 'For bigger households',
    badge: 'Best for families',
    features: [
      'Everything in Plus',
      'Up to 6 household members',
      'Shared meal plans & grocery lists',
      'Kid-friendly suggestions',
      'Multi-profile meal balancing',
    ],
    limits: {
      fridgeScansPerWeek: 'unlimited',
      menuScansPerMonth: 'unlimited',
      aiLeftoverSuggestions: 'unlimited',
      budgetTracking: true,
      autopilot: true,
      householdMembers: 6,
      prioritySupport: false,
    },
  },
}

export function planRank(plan: PlanId): number {
  return { free: 0, plus: 1, family: 2 }[plan]
}

export function isAtLeast(userPlan: PlanId, required: PlanId): boolean {
  return planRank(userPlan) >= planRank(required)
}
