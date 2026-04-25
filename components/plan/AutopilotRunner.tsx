'use client'

import { useState } from 'react'
import { Sparkles, Check, RefreshCw } from 'lucide-react'
import { usePlanStore } from '@/stores/planStore'
import { cn } from '@/lib/utils'

export function AutopilotRunner() {
  const plan = usePlanStore((s) => s.plan)
  const isRunning = usePlanStore((s) => s.isRunningAutopilot)
  const progress = usePlanStore((s) => s.autopilotProgress)
  const lastSummary = usePlanStore((s) => s.lastAutopilotSummary)
  const runAutopilot = usePlanStore((s) => s.runAutopilot)
  const error = usePlanStore((s) => s.error)

  const [overwriteAll, setOverwriteAll] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  if (!plan) return null

  const hasAny = plan.days.some((d) => d.recipe)
  const allFilled = plan.days.every((d) => d.recipe)

  async function handleRun() {
    const result = await runAutopilot({
      overwriteEmptyOnly: !overwriteAll,
      respectLocked: true,
    })
    if (result) setShowSummary(true)
  }

  // ── Running state ──────────────────────────────────────────────────────────
  if (isRunning) {
    return (
      <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 px-5 py-6 text-center">
        <div className="flex justify-center gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#D97757] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Planning your week
        </p>
        <p className="text-xs text-neutral-500">{progress || 'Working on it…'}</p>
      </div>
    )
  }

  // ── Summary state ──────────────────────────────────────────────────────────
  if (showSummary && lastSummary) {
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-200 dark:ring-emerald-800 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                Your week is ready
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                Planned {lastSummary.daysGenerated} day{lastSummary.daysGenerated === 1 ? '' : 's'}{' '}
                · Estimated ${lastSummary.estimatedTotalCost.toFixed(0)} for the week
                {lastSummary.leftoversUsed > 0 && (
                  <> · Uses {lastSummary.leftoversUsed} leftover{lastSummary.leftoversUsed === 1 ? '' : 's'}</>
                )}
                {' '}· {lastSummary.uniqueProteins} different protein{lastSummary.uniqueProteins === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSummary(false)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  // ── Default CTA ────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#D97757]/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-[#D97757]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {hasAny ? 'Autopilot your week' : 'Plan your whole week in one tap'}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
            {allFilled
              ? 'Refresh the plan while keeping your locked meals.'
              : hasAny
              ? "Fill the empty days — we'll keep what you've already picked."
              : 'Seven dinners personalized to your household, leftovers, and budget.'}
          </p>

          {/* Options */}
          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={overwriteAll}
              onChange={(e) => setOverwriteAll(e.target.checked)}
              className="w-4 h-4 accent-[#D97757]"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Replace all non-locked days
            </span>
          </label>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={handleRun}
          className="flex items-center justify-center gap-2 w-full bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
        >
          {hasAny ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {hasAny ? 'Run Autopilot' : 'Generate my week'}
        </button>
      </div>

      {error && (
        <p className="px-5 pb-4 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
