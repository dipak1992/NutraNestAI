/**
 * 4-Pillar Product Architecture Configuration
 *
 * The entire MealEase experience is organized into 4 visible pillars:
 *   1. Tonight        – Fast meal ideas for your real situation
 *   2. Plan           – Weekly planning that saves time
 *   3. Scan & Decide  – Smart food decisions at home or eating out
 *   4. Household      – Preferences, family profiles, memory
 *
 * Everything else is either:
 *   - A mode inside a pillar
 *   - An invisible intelligence layer
 *   - A secondary tool
 */

import type { SubscriptionTier } from '@/types'

// ── Pillar IDs ────────────────────────────────────────────────────────────────

export type PillarId = 'tonight' | 'plan' | 'cook' | 'household'

// ── Tonight sub-modes ─────────────────────────────────────────────────────────

export type TonightMode =
  | 'fast'        // Quick / low-energy meals
  | 'budget'      // Budget-friendly meals (PRO)
  | 'kids'        // Kid-safe tonight meals (FAMILY)
  | 'date-night'  // Dinner date night (PRO)
  | 'guests'      // Hosting guests tonight (FAMILY)

// ── Plan sub-modes ────────────────────────────────────────────────────────────

export type PlanMode =
  | 'manual'      // Manual weekly planning (FREE)
  | 'autopilot'   // Weekly autopilot (PRO)

// ── Cook sub-modes ────────────────────────────────────────────────────────────

export type CookMode =
  | 'snap'        // Snap & Cook (FREE basic)
  | 'pantry'      // Pantry meals (PRO)
  | 'menu-scan'   // Smart Menu Scan (PRO)
  | 'food-check'  // Food Check (PRO)
  | 'leftover'    // Leftover reuse (PRO)

// ── Tonight chip config ───────────────────────────────────────────────────────

export interface TonightChip {
  id: TonightMode
  label: string
  emoji: string
  requiredTier: SubscriptionTier
}

export const TONIGHT_CHIPS: TonightChip[] = [
  { id: 'fast',       label: 'Fast',       emoji: '⚡', requiredTier: 'free' },
  { id: 'budget',     label: 'Budget',     emoji: '💰', requiredTier: 'pro' },
  { id: 'kids',       label: 'Kids',       emoji: '👶', requiredTier: 'family' },
  { id: 'date-night', label: 'Date Night', emoji: '🕯️', requiredTier: 'pro' },
  { id: 'guests',     label: 'Guests',     emoji: '🍽️', requiredTier: 'family' },
]

// ── Pillar card definitions ───────────────────────────────────────────────────

export interface PillarCard {
  id: PillarId
  emoji: string
  title: string
  subtitle: string
  href: string
  gradient: string
  borderColor: string
  hoverBorder: string
  /** Optional premium CTA shown inside the card */
  premiumCta?: {
    label: string
    requiredTier: SubscriptionTier
  }
}

export const PILLAR_CARDS: PillarCard[] = [
  {
    id: 'tonight',
    emoji: '🌙',
    title: 'Tonight',
    subtitle: 'Fast meal ideas for your real situation',
    href: '/dashboard/tonight',
    gradient: 'from-orange-50 to-amber-50/80',
    borderColor: 'border-orange-200/60',
    hoverBorder: 'hover:border-orange-300',
  },
  {
    id: 'plan',
    emoji: '📅',
    title: 'Plan',
    subtitle: 'Weekly planning that saves time',
    href: '/planner',
    gradient: 'from-blue-50 to-indigo-50/80',
    borderColor: 'border-blue-200/60',
    hoverBorder: 'hover:border-blue-300',
    premiumCta: {
      label: 'Run Autopilot',
      requiredTier: 'pro',
    },
  },
  {
    id: 'cook',
    emoji: '📸',
    title: 'Scan & Decide',
    subtitle: 'Smart food decisions at home or eating out',
    href: '/dashboard/cook',
    gradient: 'from-emerald-50 to-teal-50/80',
    borderColor: 'border-emerald-200/60',
    hoverBorder: 'hover:border-emerald-300',
  },
  {
    id: 'household',
    emoji: '🏠',
    title: 'Household',
    subtitle: 'Preferences, family profiles, memory',
    href: '/dashboard/household',
    gradient: 'from-violet-50 to-purple-50/80',
    borderColor: 'border-violet-200/60',
    hoverBorder: 'hover:border-violet-300',
  },
]

// ── Feature gating per tier ───────────────────────────────────────────────────

export interface TierFeatures {
  // Tonight
  tonightBasic: boolean
  tonightBudget: boolean
  tonightDateNight: boolean
  tonightGuests: boolean
  tonightKidsSafe: boolean

  // Plan
  manualPlanning: boolean
  weeklyAutopilot: boolean

  // Cook
  snapCookBasic: boolean
  pantryMeals: boolean
  smartLeftovers: boolean
  smartMenuScan: boolean
  foodCheck: boolean

  // Household
  oneProfile: boolean
  householdMemory: boolean
  multiMember: boolean
  kidsTools: boolean
  guestHostingPlanner: boolean
  conflictBalancing: boolean
  sharedPlanning: boolean
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    tonightBasic: true,
    tonightBudget: false,
    tonightDateNight: false,
    tonightGuests: false,
    tonightKidsSafe: false,
    manualPlanning: true,
    weeklyAutopilot: false,
    snapCookBasic: true,
    pantryMeals: false,
    smartLeftovers: false,
    smartMenuScan: false,
    foodCheck: false,
    oneProfile: true,
    householdMemory: false,
    multiMember: false,
    kidsTools: false,
    guestHostingPlanner: false,
    conflictBalancing: false,
    sharedPlanning: false,
  },
  pro: {
    tonightBasic: true,
    tonightBudget: true,
    tonightDateNight: true,
    tonightGuests: false,
    tonightKidsSafe: false,
    manualPlanning: true,
    weeklyAutopilot: true,
    snapCookBasic: true,
    pantryMeals: true,
    smartLeftovers: true,
    smartMenuScan: true,
    foodCheck: true,
    oneProfile: true,
    householdMemory: true,
    multiMember: false,
    kidsTools: false,
    guestHostingPlanner: false,
    conflictBalancing: false,
    sharedPlanning: false,
  },
  family: {
    tonightBasic: true,
    tonightBudget: true,
    tonightDateNight: true,
    tonightGuests: true,
    tonightKidsSafe: true,
    manualPlanning: true,
    weeklyAutopilot: true,
    snapCookBasic: true,
    pantryMeals: true,
    smartLeftovers: true,
    smartMenuScan: true,
    foodCheck: true,
    oneProfile: true,
    householdMemory: true,
    multiMember: true,
    kidsTools: true,
    guestHostingPlanner: true,
    conflictBalancing: true,
    sharedPlanning: true,
  },
}

// ── Tier check helpers ────────────────────────────────────────────────────────

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, pro: 1, family: 2 }

export function hasAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier]
}

export function getFeatures(tier: SubscriptionTier): TierFeatures {
  return TIER_FEATURES[tier]
}

// ── Contextual upgrade triggers ───────────────────────────────────────────────

export interface UpgradeTrigger {
  id: string
  condition: string
  targetTier: SubscriptionTier
  message: string
  cta: string
}

export const UPGRADE_TRIGGERS: UpgradeTrigger[] = [
  {
    id: 'repeated-manual-plans',
    condition: 'User has manually planned 3+ weeks',
    targetTier: 'pro',
    message: 'You plan every week — Autopilot can do it for you in one tap.',
    cta: 'Try Autopilot',
  },
  {
    id: 'budget-edits',
    condition: 'User has filtered by budget 3+ times',
    targetTier: 'pro',
    message: 'Budget Mode finds meals under your target — automatically.',
    cta: 'Unlock Budget Mode',
  },
  {
    id: 'kids-filters',
    condition: 'User has used kids filters 3+ times',
    targetTier: 'family',
    message: 'Kids tools make every meal safe and picky-eater approved.',
    cta: 'Unlock Kids Tools',
  },
  {
    id: 'household-adjustments',
    condition: 'User has edited household settings 3+ times',
    targetTier: 'pro',
    message: 'Household Memory remembers everything — no more re-entering preferences.',
    cta: 'Unlock Memory',
  },
  {
    id: 'snap-cook-limit',
    condition: 'User has used Snap & Cook 5+ times',
    targetTier: 'pro',
    message: 'Pro unlocks pantry meals and smart leftover reuse.',
    cta: 'Upgrade to Pro',
  },
  {
    id: 'multi-member',
    condition: 'User tried to add more than 1 household member',
    targetTier: 'family',
    message: 'Family Plus supports up to 6 members with conflict balancing.',
    cta: 'Unlock Family Plus',
  },
]
