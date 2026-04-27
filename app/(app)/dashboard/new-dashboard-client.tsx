'use client'

import { useEffect, useMemo } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { BudgetBar } from '@/components/budget/BudgetBar'
import { BudgetDrawer } from '@/components/budget/BudgetDrawer'
import { BudgetSetupModal } from '@/components/budget/BudgetSetupModal'
import { TonightCard } from '@/components/dashboard/TonightCard'
import { LeftoversCard } from '@/components/dashboard/LeftoversCard'
import { WeekPlanStrip } from '@/components/dashboard/WeekPlanStrip'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ContextualNudge } from '@/components/dashboard/ContextualNudge'
import { FloatingScanButton } from '@/components/dashboard/FloatingScanButton'
import type { DashboardPayload } from '@/lib/dashboard/types'

export function NewDashboardClient({ initial }: { initial: DashboardPayload }) {
  const hydrate = useDashboardStore((s) => s.hydrate)
  const hydrateBudget = useBudgetStore((s) => s.hydrate)
  const user = useDashboardStore((s) => s.user)
  const tonight = useDashboardStore((s) => s.tonight)
  const leftovers = useDashboardStore((s) => s.leftovers)
  const budget = useDashboardStore((s) => s.budget)

  // Build budget payload once to avoid re-creating on every render
  const budgetPayload = useMemo(() => ({
    settings: {
      weeklyLimit: initial.budget.weeklyLimit,
      strictMode: false,
      zipCode: null,
      preferredStore: null,
    },
    currentWeek: {
      weekStart: new Date().toISOString().split('T')[0],
      spent: initial.budget.weekSpent,
      estimated: 0,
      mealsCooked: 0,
      breakdown: [],
    },
    history: [],
    plan: initial.user.plan,
  }), [initial])

  useEffect(() => {
    hydrate(initial)
    hydrateBudget(budgetPayload)
  }, [initial, budgetPayload, hydrate, hydrateBudget])

  // Use initial data directly while store hydrates — avoids blank screen
  const displayUser = user ?? initial.user
  const displayTonight = tonight ?? initial.tonight
  const displayLeftovers = leftovers ?? initial.leftovers

  return (
    <>
      <div
        id="main"
        className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-16 space-y-6 md:space-y-8"
      >
        <GreetingHeader firstName={displayUser.firstName} budget={budget} />

        <BudgetBar />

        <ContextualNudge />

        {/* Tonight + Leftovers — 2/3 + 1/3 on desktop */}
        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          <div className="lg:col-span-2">
            <TonightCard state={displayTonight} />
          </div>
          <div className="lg:col-span-1">
            <LeftoversCard state={displayLeftovers} />
          </div>
        </div>

        <WeekPlanStrip />

        <QuickActions />
      </div>

      <BudgetSetupModal />
      <BudgetDrawer />
      <FloatingScanButton />
    </>
  )
}
