'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Camera, ReceiptText, Refrigerator } from 'lucide-react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { useScanStore } from '@/stores/scanStore'
import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { BudgetBar } from '@/components/budget/BudgetBar'
import { BudgetDrawer } from '@/components/budget/BudgetDrawer'
import { BudgetSetupModal } from '@/components/budget/BudgetSetupModal'
import { TonightCard } from '@/components/dashboard/TonightCard'
import { LeftoversCard } from '@/components/dashboard/LeftoversCard'
import { WeekPlanStrip } from '@/components/dashboard/WeekPlanStrip'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ContextualNudge } from '@/components/dashboard/ContextualNudge'
import { hapticTap } from '@/lib/scan/haptics'
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
  const openScan = useScanStore((s) => s.open)

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

        {/* Primary decision: make tonight's dinner obvious before utilities compete for attention. */}
        <div className="grid xl:grid-cols-[minmax(0,1fr)_22rem] gap-4 md:gap-6 items-start">
          <div>
            <TonightCard state={displayTonight} />
          </div>
          <div className="hidden xl:block">
            <LeftoversCard state={displayLeftovers} />
          </div>
        </div>

        <section aria-label="Quick dinner helpers" className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { hapticTap(); openScan('auto') }}
            className="group flex min-h-[76px] items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-neutral-200/80 transition hover:-translate-y-0.5 hover:ring-[#D97757]/40 hover:shadow-sm dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Camera className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-neutral-950 dark:text-neutral-50">Snap fridge</span>
              <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">Cook what you have</span>
            </span>
          </button>
          <Link
            href="/leftovers"
            className="group flex min-h-[76px] items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-neutral-200/80 transition hover:-translate-y-0.5 hover:ring-[#D97757]/40 hover:shadow-sm dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#D97757] dark:bg-orange-900/30">
              <Refrigerator className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-neutral-950 dark:text-neutral-50">Use leftovers</span>
              <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">Turn extras into dinner</span>
            </span>
          </Link>
        </section>

        <div className="xl:hidden">
          <LeftoversCard state={displayLeftovers} />
        </div>

        <WeekPlanStrip />

        {displayTonight.recipe && (
          <section className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100 dark:bg-neutral-900 dark:ring-neutral-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <ReceiptText className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                    Tonight is about ${displayTonight.recipe.costPerServing.toFixed(2)} per serving
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Budget Intelligence can surface cheaper swaps before your grocery list grows.
                  </p>
                </div>
              </div>
              <Link
                href={displayUser.plan === 'free' ? '/upgrade?feature=budget' : '/budget?tab=swaps'}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {displayUser.plan === 'free' ? 'Unlock savings' : 'See swaps'}
              </Link>
            </div>
          </section>
        )}

        <BudgetBar />

        <ContextualNudge />

        <QuickActions />
      </div>

      <BudgetSetupModal />
      <BudgetDrawer />
    </>
  )
}
