'use client'

import Link from 'next/link'
import { Recycle, ChevronLeft, AlertTriangle } from 'lucide-react'
import { useDashboardStore } from '@/stores/dashboardStore'

export default function LeftoversPage() {
  const leftovers = useDashboardStore((s) => s.leftovers)

  const active = leftovers?.active ?? []
  const expiringSoon = leftovers?.expiringSoon ?? []

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
        <span className="text-3xl" aria-hidden>🍱</span>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Leftovers AI
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track leftovers and get smart meal suggestions to reduce waste.
          </p>
        </div>
      </div>

      {active.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-10 text-center">
          <div className="text-5xl mb-4 opacity-60" aria-hidden>🍱</div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            No leftovers yet
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
            When you mark a meal as cooked from your weekly plan, we&rsquo;ll automatically track
            any leftovers and suggest creative ways to use them.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
          >
            <Recycle className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Expiring soon alert */}
          {expiringSoon.length > 0 && (
            <div className="rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30 px-4 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <span className="font-semibold">{expiringSoon.length} leftover{expiringSoon.length === 1 ? '' : 's'}</span>{' '}
                expiring soon. Use them before they go to waste!
              </p>
            </div>
          )}

          {/* Leftover items */}
          <ul className="space-y-3">
            {active.map((item) => {
              const isUrgent = item.urgency === 'today' || item.urgency === 'soon'
              const expiryText =
                item.urgency === 'today'
                  ? 'Expires today'
                  : item.urgency === 'expired'
                    ? 'Expired'
                    : `Expires in ${item.daysUntilExpiry} day${item.daysUntilExpiry === 1 ? '' : 's'}`

              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl shrink-0">
                    🍲
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{item.servingsRemaining} serving{item.servingsRemaining === 1 ? '' : 's'}</span>
                      <span>·</span>
                      <span className={isUrgent ? 'font-medium text-orange-600 dark:text-orange-400' : ''}>
                        {isUrgent && '⚠️ '}{expiryText}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#D97757] whitespace-nowrap">
                    Use it →
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
