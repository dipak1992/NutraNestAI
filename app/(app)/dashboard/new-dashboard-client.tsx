'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, ReceiptText, Refrigerator, Sparkles, ArrowRight } from 'lucide-react'
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
import { RetentionEngineCard } from '@/components/dashboard/RetentionEngineCard'
import { ReviewPromptCard } from '@/components/dashboard/ReviewPromptCard'
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
  const retention = useDashboardStore((s) => s.retention)
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
  const displayRetention = retention ?? initial.retention

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

        {/* Budget cost insight — premium card */}
        {displayTonight.recipe && (
          <section className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-emerald-100 dark:bg-neutral-900 dark:ring-neutral-800">
            {/* Subtle green tint background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/80 to-transparent dark:from-emerald-950/20 dark:to-transparent" />
            <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <ReceiptText className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                    Tonight is about ${displayTonight.recipe.costPerServing.toFixed(2)} per serving
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Budget Intelligence can find cheaper swaps before the grocery list grows.
                  </p>
                </div>
              </div>
              <Link
                href={displayUser.plan === 'free' ? '/upgrade?feature=budget' : '/budget?tab=swaps'}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 shrink-0"
              >
                {displayUser.plan === 'free' ? 'Preview savings' : 'See swaps'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* Free plan upsell — premium dark card with image */}
        {displayUser.plan === 'free' && (
          <section
            aria-label="Free plan limits"
            className="relative overflow-hidden rounded-2xl"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/landing/family-dinner.jpg"
                alt=""
                fill
                sizes="(min-width: 1400px) 1400px, 100vw"
                className="object-cover object-center md:object-[center_58%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/92 via-neutral-950/85 to-neutral-950/70 md:from-neutral-950/90 md:via-neutral-950/74 md:to-neutral-950/28" />
            </div>

            <div className="relative z-10 p-4 sm:p-5 md:p-6">
              {/* Header row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D97757]/20 border border-[#D97757]/30 text-[#E8895A] text-xs font-bold px-2.5 py-1">
                  <Sparkles className="w-3 h-3" />
                  Free Plan
                </span>
                <span className="text-xs text-white/50">·</span>
                <span className="text-xs text-white/60">Upgrade to unlock everything</span>
              </div>

              {/* Feature pills */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-white/8 ring-1 ring-white/10 px-3 py-2.5">
                  <p className="text-xs font-bold text-white">3 swaps/day</p>
                  <p className="text-[11px] text-white/55 mt-0.5">Change tonight without guessing.</p>
                </div>
                <div className="rounded-xl bg-white/8 ring-1 ring-white/10 px-3 py-2.5">
                  <p className="text-xs font-bold text-white">3-day plan preview</p>
                  <p className="text-[11px] text-white/55 mt-0.5">Try the weekly rhythm first.</p>
                </div>
                <div className="rounded-xl bg-white/8 ring-1 ring-white/10 px-3 py-2.5">
                  <p className="text-xs font-bold text-white">Basic Snap &amp; Cook</p>
                  <p className="text-[11px] text-white/55 mt-0.5">Turn fridge photos into dinner.</p>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-white/50">Want unlimited swaps, full week planning &amp; smart picks?</p>
                <Link
                  href="/upgrade"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D97757] to-[#E8895A] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-[#D97757]/30 hover:from-[#C86646] hover:to-[#D97757] transition-all"
                >
                  Upgrade to Plus
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions — image-backed premium cards */}
        <section aria-label="Quick dinner helpers" className="grid grid-cols-2 gap-3">
          {/* Snap fridge card */}
          <button
            type="button"
            onClick={() => { hapticTap(); openScan('auto') }}
            className="group relative overflow-hidden flex min-h-[88px] items-end rounded-2xl text-left transition hover:-translate-y-0.5 hover:shadow-md md:min-h-[150px] md:rounded-3xl"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/cards/snap.jpg"
                alt=""
                fill
                sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 md:object-[center_42%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/40 to-neutral-950/10 md:from-neutral-950/88 md:via-neutral-950/34 md:to-transparent" />
            </div>
            {/* Content */}
            <div className="relative z-10 p-3.5 w-full md:p-5">
              <span className="flex h-8 w-8 mb-1.5 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 md:h-10 md:w-10 md:mb-2">
                <Camera className="h-4 w-4 text-white md:h-5 md:w-5" />
              </span>
              <span className="block text-sm font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] md:text-lg">Snap fridge</span>
              <span className="block text-[11px] text-white/70 mt-0.5 md:text-sm md:text-white/78">Cook what you have</span>
            </div>
          </button>

          {/* Use leftovers card */}
          <Link
            href="/leftovers"
            className="group relative overflow-hidden flex min-h-[88px] items-end rounded-2xl text-left transition hover:-translate-y-0.5 hover:shadow-md md:min-h-[150px] md:rounded-3xl"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/cards/leftover.jpg"
                alt=""
                fill
                sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 md:object-[center_42%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/40 to-neutral-950/10 md:from-neutral-950/88 md:via-neutral-950/34 md:to-transparent" />
            </div>
            {/* Content */}
            <div className="relative z-10 p-3.5 w-full md:p-5">
              <span className="flex h-8 w-8 mb-1.5 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 md:h-10 md:w-10 md:mb-2">
                <Refrigerator className="h-4 w-4 text-white md:h-5 md:w-5" />
              </span>
              <span className="block text-sm font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] md:text-lg">Use leftovers</span>
              <span className="block text-[11px] text-white/70 mt-0.5 md:text-sm md:text-white/78">Turn extras into dinner</span>
            </div>
          </Link>
        </section>

        <div className="xl:hidden">
          <LeftoversCard state={displayLeftovers} />
        </div>

        <WeekPlanStrip />

        <RetentionEngineCard retention={displayRetention} />

        <ReviewPromptCard user={displayUser} retention={displayRetention} />

        <BudgetBar />

        <ContextualNudge />

        <QuickActions />
      </div>

      <BudgetSetupModal />
      <BudgetDrawer />
    </>
  )
}
