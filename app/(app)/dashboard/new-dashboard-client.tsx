'use client'

import { useEffect, useRef } from 'react'
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

const REFRESH_INTERVAL_MS = 60_000 // 60 seconds

export function NewDashboardClient({ initial }: { initial: DashboardPayload }) {
  const hydrate = useDashboardStore((s) => s.hydrate)
  const refresh = useDashboardStore((s) => s.refresh)
  const hydrateBudget = useBudgetStore((s) => s.hydrate)
  const user = useDashboardStore((s) => s.user)
  const tonight = useDashboardStore((s) => s.tonight)
  const leftovers = useDashboardStore((s) => s.leftovers)
  const budget = useDashboardStore((s) => s.budget)
  const error = useDashboardStore((s) => s.error)

  // Only hydrate once on mount — avoid re-render loop from changing `initial` reference
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    hydrate(initial)
    hydrateBudget({
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
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 60-second auto-refresh — keeps dashboard data fresh without full page reload
  useEffect(() => {
    const timer = setInterval(() => {
      refresh()
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        {/* Non-blocking error banner — shown when background refresh fails */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <span className="shrink-0 text-base">⚠️</span>
            <span>
              Could not refresh dashboard data.{' '}
              <button
                onClick={() => refresh()}
                className="font-medium underline underline-offset-2 hover:no-underline"
              >
                Try again
              </button>
            </span>
          </div>
        )}

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
