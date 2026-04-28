'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Circle, Sparkles, Lock } from 'lucide-react'
import { CardShell } from './shared/CardShell'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { cn } from '@/lib/utils'
import type { DayPlan } from '@/lib/dashboard/types'

// Free users get Mon–Wed (3 days) unlocked; Thu–Sun are locked
const FREE_UNLOCKED_DAYS = 3

export function WeekPlanStrip() {
  const weekPlan = useDashboardStore((s) => s.weekPlan)
  const user = useDashboardStore((s) => s.user)
  const budgetHydrated = useBudgetStore((s) => s.hydrated)
  const budgetPlan = useBudgetStore((s) => s.plan)
  const weeklyLimit = useBudgetStore((s) => s.settings.weeklyLimit)
  const weekSpent = useBudgetStore((s) => s.weekSpent)
  const alertLevel = useBudgetStore((s) => s.alertLevel)
  const openDrawer = useBudgetStore((s) => s.openDrawer)

  if (!weekPlan) return null

  const isPlusMember = user?.plan === 'plus' || user?.plan === 'family'
  const hasPlan = weekPlan.days.some((d) => d.recipe)

  // Budget inline display
  const showBudget =
    budgetHydrated && budgetPlan !== 'free' && weeklyLimit != null

  const budgetColorClass =
    alertLevel === 'over'
      ? 'text-red-600 dark:text-red-400'
      : alertLevel === 'caution'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-700 dark:text-emerald-400'

  // Empty state — no plan yet
  if (!hasPlan) {
    return (
      <CardShell className="overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/60 to-rose-50 dark:from-[#1e1208] dark:via-neutral-900 dark:to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,_rgba(217,119,87,0.12),_transparent)]" />

        <div className="relative z-10 p-6 md:p-8">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span aria-hidden>📅</span>
              <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50">
                This week
              </h2>
            </div>
            {showBudget && (
              <button
                onClick={openDrawer}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1',
                  'bg-white/70 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 transition-colors',
                  budgetColorClass
                )}
                aria-label="Open budget details"
              >
                <span aria-hidden>💰</span>
                <span>${weekSpent.toFixed(0)}/{weeklyLimit}</span>
                {alertLevel === 'caution' && <span aria-label="Warning">⚠️</span>}
                {alertLevel === 'over' && <span aria-label="Over budget">🚨</span>}
              </button>
            )}
          </div>

          {isPlusMember ? (
            /* Plus: full autopilot CTA */
            <div className="text-center py-2">
              <div className="text-3xl mb-3" aria-hidden>🗓️</div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                Plan your whole week in one tap
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                Generate 7 dinners with Autopilot — personalised to your household and budget.
              </p>
              <Link
                href="/planner?autopilot=true"
                className="mt-5 inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-semibold rounded-full px-5 py-3 min-h-[48px] transition-colors shadow-md shadow-orange-200/40 dark:shadow-none"
              >
                <Sparkles className="w-4 h-4" />
                Run Autopilot
              </Link>
            </div>
          ) : (
            /* Free: show 3-day preview + locked days + upgrade nudge */
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Your first 3 days are ready. Upgrade to plan the full week.
              </p>

              {/* 7-day grid with locked days */}
              <div className="grid grid-cols-7 gap-1.5 mb-5">
                {weekPlan.days.map((d, i) => (
                  <FreeDayCell key={d.id} day={d} locked={i >= FREE_UNLOCKED_DAYS} />
                ))}
              </div>

              {/* Upgrade CTA */}
              <div className="rounded-2xl bg-neutral-900 dark:bg-neutral-800 border border-[#D97757]/30 p-4 flex items-center gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#D97757]/20">
                  <Sparkles className="w-5 h-5 text-[#D97757]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Autopilot — Plus feature</p>
                  <p className="text-xs text-neutral-400 mt-0.5">7 dinners planned in one tap</p>
                </div>
                <Link
                  href="/pricing"
                  className="shrink-0 inline-flex items-center gap-1 bg-[#D97757] hover:bg-[#C86646] text-white text-xs font-bold rounded-full px-3 py-1.5 transition-colors"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardShell>
    )
  }

  return (
    <CardShell className="p-5 md:p-6" ariaLabel="This week's meal plan">
      {/* Header row: title + budget badge + autopilot link */}
      <header className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden>📅</span>
          <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 whitespace-nowrap">
            This week
          </h2>
          {showBudget && (
            <button
              onClick={openDrawer}
              className={cn(
                'flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 ml-1',
                'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors',
                budgetColorClass
              )}
              aria-label="Open budget details"
            >
              <span aria-hidden>💰</span>
              <span>${weekSpent.toFixed(0)}/{weeklyLimit}</span>
              {alertLevel === 'caution' && <span aria-label="Warning">⚠️</span>}
              {alertLevel === 'over' && <span aria-label="Over budget">🚨</span>}
            </button>
          )}
        </div>

        {isPlusMember ? (
          <Link
            href="/planner"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#D97757] hover:text-[#C86646] transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Autopilot →
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D97757] bg-[#D97757]/10 hover:bg-[#D97757]/20 rounded-full px-2.5 py-1 transition-colors whitespace-nowrap shrink-0"
          >
            <Lock className="w-3 h-3" />
            Plus
          </Link>
        )}
      </header>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {weekPlan.days.map((d, i) => (
          isPlusMember ? (
            <DayCell key={d.id} day={d} />
          ) : (
            <FreeDayCell key={d.id} day={d} locked={i >= FREE_UNLOCKED_DAYS} />
          )
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 space-y-1.5">
        <div
          className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={weekPlan.completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${weekPlan.completionPercentage}% of week cooked`}
        >
          <div
            className="h-full bg-[#D97757] transition-all duration-500"
            style={{ width: `${weekPlan.completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>{weekPlan.completionPercentage}% cooked</span>
          {isPlusMember && (
            <span>Est. ${weekPlan.estimatedTotalCost.toFixed(0)} this week</span>
          )}
        </div>
      </div>

      {/* Free user upgrade nudge below grid */}
      {!isPlusMember && (
        <div className="mt-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#D97757] shrink-0" />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 flex-1">
            Days 4–7 are locked. <span className="font-semibold text-neutral-800 dark:text-neutral-200">Upgrade to Plus</span> for full-week Autopilot.
          </p>
          <Link
            href="/pricing"
            className="shrink-0 text-xs font-bold text-[#D97757] hover:underline"
          >
            Upgrade →
          </Link>
        </div>
      )}
    </CardShell>
  )
}

// ─── DayCell (Plus users — fully interactive) ─────────────────────────────────

function DayCell({ day }: { day: DayPlan }) {
  return (
    <Link
      href={`/planner?day=${day.id}`}
      className={cn(
        'group relative flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors',
        'hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
      )}
      aria-label={`${day.dayAbbrev} ${day.date}: ${day.recipe?.name ?? 'empty'}`}
    >
      <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        {day.dayAbbrev}
      </div>
      <div className="text-xs text-neutral-400">{day.date}</div>

      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200/60 dark:ring-neutral-700/60">
        {day.recipe ? (
          <Image
            src={day.recipe.image}
            alt=""
            fill
            sizes="(max-width: 768px) 14vw, 100px"
            className="object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700">
            <Circle className="w-4 h-4" />
          </div>
        )}

        {day.status === 'cooked' && (
          <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {day.recipe && (
        <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
          ${day.recipe.costTotal.toFixed(0)}
        </div>
      )}
    </Link>
  )
}

// ─── FreeDayCell (free users — locked days show padlock) ──────────────────────

function FreeDayCell({ day, locked }: { day: DayPlan; locked: boolean }) {
  if (locked) {
    return (
      <Link
        href="/pricing"
        className="group relative flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors hover:bg-[#D97757]/5"
        aria-label={`${day.dayAbbrev} — Plus required`}
      >
        <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          {day.dayAbbrev}
        </div>
        <div className="text-xs text-neutral-300 dark:text-neutral-600">{day.date}</div>

        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200/60 dark:ring-neutral-700/60">
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/80">
            <Lock className="w-3.5 h-3.5 text-[#D97757]/60" />
          </div>
        </div>

        <div className="text-[9px] font-bold text-[#D97757]/70 uppercase tracking-wide">
          Plus
        </div>
      </Link>
    )
  }

  return <DayCell day={day} />
}
