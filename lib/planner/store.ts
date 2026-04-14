// ============================================================
// Weekly Planner — Zustand Store
// Persists the week plan and grocery list to localStorage
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeekDay, WeeklyPlan, GroceryList, StoreFormat } from './types'
import { reformatGroceryList } from './grocery'

// ── Helpers ───────────────────────────────────────────────────

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay() // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day // adjust to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

function makeDays(weekStart: string): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return {
      dayIndex: i,
      date: d.toISOString().split('T')[0],
      meal: null,
    }
  })
}

function makeEmptyPlan(): WeeklyPlan {
  const weekStart = getWeekStart()
  return {
    id: `plan-${weekStart}`,
    weekStart,
    days: makeDays(weekStart),
    generatedAt: new Date().toISOString(),
  }
}

// ── Store interface ───────────────────────────────────────────

interface WeeklyPlanStore {
  plan: WeeklyPlan
  selectedDayIndex: number
  groceryList: GroceryList | null
  storeFormat: StoreFormat
  isGeneratingWeek: boolean
  generatingDayIndex: number | null

  // Plan actions
  setPlan: (plan: WeeklyPlan) => void
  setSelectedDayIndex: (i: number) => void
  clearPlan: () => void

  // Grocery actions
  setGroceryList: (list: GroceryList) => void
  setStoreFormat: (format: StoreFormat) => void
  togglePantryItem: (id: string) => void
  toggleChecked: (id: string) => void
  checkAllInCategory: (category: string) => void
  uncheckAll: () => void
  clearGrocery: () => void

  // Loading flags
  setIsGeneratingWeek: (v: boolean) => void
  setGeneratingDayIndex: (i: number | null) => void
}

// ── Store ─────────────────────────────────────────────────────

export const useWeeklyPlanStore = create<WeeklyPlanStore>()(
  persist(
    (set, get) => ({
      plan: makeEmptyPlan(),
      selectedDayIndex: 0,
      groceryList: null,
      storeFormat: 'standard',
      isGeneratingWeek: false,
      generatingDayIndex: null,

      setPlan: (plan) => set({ plan, selectedDayIndex: 0 }),
      setSelectedDayIndex: (i) => set({ selectedDayIndex: i }),
      clearPlan: () => set({ plan: makeEmptyPlan(), groceryList: null }),

      setGroceryList: (list) => set({ groceryList: list }),
      setStoreFormat: (format) => {
        const { groceryList } = get()
        if (!groceryList) {
          set({ storeFormat: format })
          return
        }
        set({ storeFormat: format, groceryList: reformatGroceryList(groceryList, format) })
      },
      togglePantryItem: (id) =>
        set((s) => {
          if (!s.groceryList) return s
          return {
            groceryList: {
              ...s.groceryList,
              items: s.groceryList.items.map((item) =>
                item.id === id ? { ...item, isInPantry: !item.isInPantry } : item
              ),
            },
          }
        }),
      toggleChecked: (id) =>
        set((s) => {
          if (!s.groceryList) return s
          return {
            groceryList: {
              ...s.groceryList,
              items: s.groceryList.items.map((item) =>
                item.id === id ? { ...item, isChecked: !item.isChecked } : item
              ),
            },
          }
        }),
      checkAllInCategory: (category) =>
        set((s) => {
          if (!s.groceryList) return s
          return {
            groceryList: {
              ...s.groceryList,
              items: s.groceryList.items.map((item) =>
                item.category === category ? { ...item, isChecked: true } : item
              ),
            },
          }
        }),
      uncheckAll: () =>
        set((s) => {
          if (!s.groceryList) return s
          return {
            groceryList: {
              ...s.groceryList,
              items: s.groceryList.items.map((item) => ({ ...item, isChecked: false })),
            },
          }
        }),
      clearGrocery: () => set({ groceryList: null }),
      setIsGeneratingWeek: (v) => set({ isGeneratingWeek: v }),
      setGeneratingDayIndex: (i) => set({ generatingDayIndex: i }),
    }),
    {
      name: 'nutrinest-weekly-plan',
      partialize: (s) => ({
        plan: s.plan,
        groceryList: s.groceryList,
        storeFormat: s.storeFormat,
        selectedDayIndex: s.selectedDayIndex,
      }),
    }
  )
)
