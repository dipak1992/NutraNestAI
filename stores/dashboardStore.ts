import { create } from 'zustand'
import type {
  DashboardPayload,
  TonightState,
  LeftoversState,
  WeekPlanState,
  BudgetState,
  Nudge,
  QuickAction,
} from '@/lib/dashboard/types'
import { calcBudget } from '@/lib/dashboard/budget'
import { parseMainIngredients } from '@/lib/leftovers/ingredient-parser'
import { calculateExpirationDate } from '@/lib/leftovers/expiration-calculator'

type DashboardStore = {
  // Core state
  hydrated: boolean
  user: DashboardPayload['user'] | null
  tonight: TonightState | null
  leftovers: LeftoversState | null
  weekPlan: WeekPlanState | null
  budget: BudgetState | null
  quickActions: QuickAction[]
  nudge: Nudge | null
  household: DashboardPayload['household'] | null
  limits: DashboardPayload['limits'] | null

  // UI state
  isRegeneratingTonight: boolean
  dismissedNudgeIds: string[]
  budgetDrawerOpen: boolean

  // Actions
  hydrate: (payload: DashboardPayload) => void
  regenerateTonight: () => Promise<void>
  markCooked: (dayId: string) => Promise<void>
  setBudget: (amount: number | null) => Promise<void>
  dismissNudge: (id: string) => void
  openBudgetDrawer: () => void
  closeBudgetDrawer: () => void
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  hydrated: false,
  user: null,
  tonight: null,
  leftovers: null,
  weekPlan: null,
  budget: null,
  quickActions: [],
  nudge: null,
  household: null,
  limits: null,
  isRegeneratingTonight: false,
  dismissedNudgeIds: [],
  budgetDrawerOpen: false,

  hydrate: (payload) =>
    set({
      hydrated: true,
      user: payload.user,
      tonight: payload.tonight,
      leftovers: payload.leftovers,
      weekPlan: payload.weekPlan,
      budget: payload.budget,
      quickActions: payload.quickActions,
      nudge: payload.nudge,
      household: payload.household,
      limits: payload.limits,
    }),

  regenerateTonight: async () => {
    set({ isRegeneratingTonight: true })
    try {
      const res = await fetch('/api/dashboard/tonight/regenerate', {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Regenerate failed')
      const next: TonightState = await res.json()
      set({ tonight: next, isRegeneratingTonight: false })
    } catch (e) {
      set({ isRegeneratingTonight: false })
      console.error(e)
    }
  },

  markCooked: async (dayId) => {
    const prev = get().weekPlan
    // Optimistic update
    const weekPlan = get().weekPlan
    const cookedDay = weekPlan?.days.find((d) => d.id === dayId)

    if (weekPlan) {
      const updatedDays = weekPlan.days.map((d) =>
        d.id === dayId ? { ...d, status: 'cooked' as const } : d
      )
      const cookedCount = updatedDays.filter((d) => d.status === 'cooked').length
      set({
        weekPlan: {
          ...weekPlan,
          days: updatedDays,
          completionPercentage: Math.round((cookedCount / updatedDays.length) * 100),
        },
      })
    }

    // Fire the cooked prompt if the day had a recipe
    if (cookedDay?.recipe) {
      const recipe = cookedDay.recipe
      const mainIngredients = parseMainIngredients({ name: recipe.name })
      const expiresAt = calculateExpirationDate(mainIngredients)
      // Lazy import to avoid circular dependency
      import('@/stores/leftoversStore').then(({ useLeftoversStore }) => {
        useLeftoversStore.getState().openCookedPrompt({
          recipeId: recipe.id,
          recipeName: recipe.name,
          recipeImage: recipe.image,
          servings: recipe.servings,
          costPerServing: recipe.costPerServing,
          mainIngredients,
        })
      })
    }

    try {
      const res = await fetch(`/api/dashboard/week/${dayId}/cook`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Cook update failed')
      const updated: Partial<DashboardPayload> = await res.json()
      set({
        ...(updated.leftovers ? { leftovers: updated.leftovers } : {}),
        ...(updated.weekPlan ? { weekPlan: updated.weekPlan } : {}),
        ...(updated.budget ? { budget: updated.budget } : {}),
      })
    } catch (e) {
      set({ weekPlan: prev })
      console.error(e)
    }
  },

  setBudget: async (amount) => {
    const prev = get().budget
    const current = get().budget
    if (current) {
      set({ budget: calcBudget(amount, current.weekSpent) })
    }

    try {
      const res = await fetch('/api/dashboard/budget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyLimit: amount }),
      })
      if (!res.ok) throw new Error('Budget update failed')
    } catch (e) {
      set({ budget: prev })
      console.error(e)
    }
  },

  dismissNudge: (id) => {
    set((state) => ({
      dismissedNudgeIds: [...state.dismissedNudgeIds, id],
      nudge: state.nudge?.id === id ? null : state.nudge,
    }))
    fetch('/api/dashboard/nudge/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  },

  openBudgetDrawer: () => set({ budgetDrawerOpen: true }),
  closeBudgetDrawer: () => set({ budgetDrawerOpen: false }),
}))
