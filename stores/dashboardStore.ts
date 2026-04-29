import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  DashboardPayload,
  TonightState,
  LeftoversState,
  WeekPlanState,
  BudgetState,
  RetentionState,
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
  retention: RetentionState | null
  quickActions: QuickAction[]
  nudge: Nudge | null
  household: DashboardPayload['household'] | null
  limits: DashboardPayload['limits'] | null

  // Async / error state
  isRefreshing: boolean
  error: string | null
  lastFetchedAt: number | null

  // UI state
  isRegeneratingTonight: boolean
  dismissedNudgeIds: string[]
  budgetDrawerOpen: boolean

  // Actions
  hydrate: (payload: DashboardPayload) => void
  /** Alias for hydrate — spec uses setData */
  setData: (payload: DashboardPayload) => void
  /** Re-fetch dashboard data from the API */
  refresh: () => Promise<void>
  regenerateTonight: () => Promise<void>
  markCooked: (dayId: string) => Promise<void>
  setBudget: (amount: number | null) => Promise<void>
  dismissNudge: (id: string) => void
  openBudgetDrawer: () => void
  closeBudgetDrawer: () => void
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      tonight: null,
      leftovers: null,
      weekPlan: null,
      budget: null,
      retention: null,
      quickActions: [],
      nudge: null,
      household: null,
      limits: null,
      isRefreshing: false,
      error: null,
      lastFetchedAt: null,
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
          retention: payload.retention,
          quickActions: payload.quickActions,
          nudge: payload.nudge,
          household: payload.household,
          limits: payload.limits,
          error: null,
          lastFetchedAt: Date.now(),
        }),

      setData: (payload) => get().hydrate(payload),

      refresh: async () => {
        if (get().isRefreshing) return
        set({ isRefreshing: true, error: null })
        try {
          const res = await fetch('/api/dashboard', { cache: 'no-store' })
          if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`)
          const payload: DashboardPayload = await res.json()
          // Preserve dismissed nudge IDs across refresh
          const dismissed = get().dismissedNudgeIds
          const nudge =
            payload.nudge && dismissed.includes(payload.nudge.id)
              ? null
              : payload.nudge
          set({
            hydrated: true,
            user: payload.user,
            tonight: payload.tonight,
            leftovers: payload.leftovers,
            weekPlan: payload.weekPlan,
            budget: payload.budget,
            retention: payload.retention,
            quickActions: payload.quickActions,
            nudge,
            household: payload.household,
            limits: payload.limits,
            isRefreshing: false,
            error: null,
            lastFetchedAt: Date.now(),
          })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error'
          set({ isRefreshing: false, error: message })
          console.error('[DashboardStore] refresh error:', e)
        }
      },

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
    }),
    {
      name: 'dashboard-store',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist UI state — server data is always re-fetched
      partialize: (state) => ({
        dismissedNudgeIds: state.dismissedNudgeIds,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
)
