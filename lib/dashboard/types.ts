export type Plan = 'free' | 'plus' | 'family'

export type AlertLevel = 'safe' | 'caution' | 'over'

export type UsageLimits = {
  scansUsed: number
  scansLimit: number
  scansRemaining: number
}

export type Recipe = {
  id: string
  name: string
  image: string
  cookTimeMin: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  costTotal: number
  costPerServing: number
  tags?: string[]
}

export type TonightState = {
  recipe: Recipe | null
  reason: string
  alternativesAvailable: number
  isFromPantry: boolean
  usesLeftover?: {
    leftoverId: string
    leftoverName: string
  } | null
}

export type Leftover = {
  id: string
  name: string
  image: string
  servingsRemaining: number
  sourceRecipeId: string
  createdAt: string
  expiresAt: string
  daysUntilExpiry: number
  urgency: 'fresh' | 'soon' | 'today' | 'expired'
}

export type LeftoversState = {
  active: Leftover[]
  expiringSoon: Leftover[]
  suggestedRecipes: Recipe[]
}

export type BudgetState = {
  weeklyLimit: number | null
  weekSpent: number
  percentUsed: number
  alertLevel: AlertLevel
}

export type DayPlan = {
  id: string
  dayAbbrev: string
  date: string
  recipe: Recipe | null
  status: 'planned' | 'cooked' | 'skipped' | 'empty'
}

export type WeekPlanState = {
  days: DayPlan[]
  completionPercentage: number
  isAutopilotEnabled: boolean
  estimatedTotalCost: number
}

export type ContextualNudgeType =
  | 'onboarding_incomplete'
  | 'leftover_expiring_today'
  | 'budget_alert'
  | 'free_scan_limit'
  | 'household_invite'
  | 'upgrade_prompt'
  | 'autopilot_education'
  | 'pantry_scan_reminder'
  | 'referral'

export type NudgeVariant = 'info' | 'warning' | 'danger' | 'success' | 'promo'

export type Nudge = {
  id: string
  type: ContextualNudgeType
  priority: number
  title: string
  body: string
  /** Alias for body — spec uses message, body is canonical */
  message?: string
  ctaLabel: string
  ctaHref: string
  dismissible: boolean
  variant: NudgeVariant
}

export type QuickAction = {
  id: 'scan' | 'autopilot' | 'leftovers' | 'budget' | 'grocery'
  label: string
  icon: string
  href: string
  requiredPlan: Plan
  status?: string
}

export type DashboardPayload = {
  user: {
    id: string
    firstName: string
    plan: Plan
    hasSeenTour: boolean
    onboardingComplete: boolean
    createdAt: string
  }
  greeting: {
    greeting: string
    timeString: string
    contextMessage: string
  }
  tonight: TonightState
  weekPlan: WeekPlanState
  leftovers: LeftoversState
  budget: BudgetState
  quickActions: QuickAction[]
  nudge: Nudge | null
  household: { memberCount: number; maxMembers: number }
  limits: UsageLimits
}
