'use client'

import Link from 'next/link'
import { ChevronLeft, Wallet } from 'lucide-react'
import { useBudgetStore } from '@/stores/budgetStore'
import { cn } from '@/lib/utils'

export default function BudgetPage() {
  const hydrated = useBudgetStore((s) => s.hydrated)
  const plan = useBudgetStore((s) => s.plan)
  const settings = useBudgetStore((s) => s.settings)
  const weekSpent = useBudgetStore((s) => s.weekSpent)
  const percentUsed = useBudgetStore((s) => s.percentUsed)
  const alertLevel = useBudgetStore((s) => s.alertLevel)
  const openSetupModal = useBudgetStore((s) => s.openSetupModal)

  const colorClass =
    alertLevel === 'over'
      ? 'text-red-600 dark:text-red-400'
      : alertLevel === 'caution'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-700 dark:text-emerald-400'

  const barColor =
    alertLevel === 'over'
      ? 'bg-red-500'
      : alertLevel === 'caution'
        ? 'bg-amber-500'
        : 'bg-emerald-500'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl" aria-hidden>💰</span>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Budget Intelligence
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track your weekly grocery spending and stay on target.
          </p>
        </div>
      </div>

      {!hydrated ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-10 text-center animate-pulse">
          <div className="h-6 w-48 mx-auto rounded bg-neutral-200 dark:bg-neutral-700 mb-4" />
          <div className="h-4 w-64 mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      ) : plan === 'free' ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-10 text-center">
          <Wallet className="w-12 h-12 mx-auto text-[#D97757] mb-4" />
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Budget tracking is a Plus feature
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
            Upgrade to Plus to track weekly spending, get cost estimates for meals, and stay within your grocery budget.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
          >
            Upgrade to Plus
          </Link>
        </div>
      ) : settings.weeklyLimit == null ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-10 text-center">
          <div className="text-5xl mb-4 opacity-60" aria-hidden>💰</div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Set your weekly budget
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
            Tell us your weekly grocery budget and we&rsquo;ll help you stay on track with cost-aware meal suggestions.
          </p>
          <button
            onClick={openSetupModal}
            className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
          >
            Set budget
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Budget overview card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">This week</h2>
              <span className={cn('text-lg font-bold', colorClass)}>
                ${weekSpent.toFixed(0)} / ${settings.weeklyLimit}
              </span>
            </div>

            <div
              className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-2"
              role="progressbar"
              aria-valuenow={percentUsed}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={cn('h-full transition-all duration-500 rounded-full', barColor)}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>{percentUsed}% used</span>
              <span>${Math.max(0, (settings.weeklyLimit ?? 0) - weekSpent).toFixed(0)} remaining</span>
            </div>

            {alertLevel !== 'safe' && (
              <div className={cn(
                'mt-4 rounded-xl px-4 py-3 text-sm',
                alertLevel === 'over'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
              )}>
                {alertLevel === 'over'
                  ? "You're over budget this week. Consider lower-cost meals for the rest of the week."
                  : "You're approaching your budget limit. Plan carefully for remaining meals."}
              </div>
            )}
          </div>

          <button
            onClick={openSetupModal}
            className="w-full text-sm font-medium text-[#D97757] hover:text-[#C86646] transition-colors"
          >
            Adjust weekly budget →
          </button>
        </div>
      )}
    </div>
  )
}
