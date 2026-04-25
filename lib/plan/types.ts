import type { Recipe } from '@/lib/dashboard/types'

export type DayStatus = 'planned' | 'cooked' | 'skipped' | 'empty'

export type PlanDay = {
  id: string
  dayIndex: number       // 0 = Mon, 6 = Sun
  dayAbbrev: string      // "Mon"
  dayLabel: string       // "Monday"
  date: string           // ISO date YYYY-MM-DD
  dateLabel: string      // "Dec 3"
  recipe: Recipe | null
  status: DayStatus
  locked: boolean
  estimatedCost: number | null
  notes: string | null
}

export type WeekPlan = {
  id: string
  weekStart: string      // ISO date (Monday)
  weekEnd: string        // ISO date (Sunday)
  isAutopilot: boolean
  days: PlanDay[]
  stats: {
    plannedCount: number
    cookedCount: number
    emptyCount: number
    totalEstimatedCost: number
    completionPercentage: number
  }
}

export type SwapCandidate = {
  recipe: Recipe
  reason: string
  matchScore: number     // 0..1
  usesLeftover: boolean
  withinBudget: boolean
}

export type AutopilotOptions = {
  respectLocked: boolean
  overwriteEmptyOnly: boolean
  budgetCap?: number
  mealType?: 'breakfast' | 'lunch' | 'dinner'
}

export type AutopilotResult = {
  weekPlan: WeekPlan
  summary: {
    daysGenerated: number
    estimatedTotalCost: number
    leftoversUsed: number
    uniqueProteins: number
  }
}
