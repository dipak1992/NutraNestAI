'use client'

import Link from 'next/link'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useScanStore } from '@/stores/scanStore'
import { isActionGated } from '@/config/quick-actions'
import { hapticTap } from '@/lib/scan/haptics'
import { cn } from '@/lib/utils'

// IDs that should open the scan modal instead of navigating
const SCAN_ACTION_IDS = ['scan']

export function QuickActions() {
  const actions = useDashboardStore((s) => s.quickActions)
  const user = useDashboardStore((s) => s.user)
  const openScan = useScanStore((s) => s.open)

  if (!user || actions.length === 0) return null

  return (
    <section aria-labelledby="quick-actions-heading">
      <h2
        id="quick-actions-heading"
        className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-3"
      >
        🎯 Quick actions
      </h2>

      {/* Horizontal scrollable pill row — matches spec layout */}
      <div className="flex flex-wrap gap-2.5">
        {actions.map((a) => {
          const gated = isActionGated(a.requiredPlan, user.plan)
          const isScanAction = SCAN_ACTION_IDS.includes(a.id)

          const pillBase = cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2.5 min-h-[44px]',
            'text-sm font-semibold transition-all',
            'ring-1 ring-neutral-200/80 dark:ring-neutral-700',
            'bg-white dark:bg-neutral-900',
            'hover:ring-[#D97757]/50 hover:bg-[#D97757]/5 hover:-translate-y-0.5 hover:shadow-sm',
            gated && 'opacity-60'
          )

          if (isScanAction && !gated) {
            return (
              <button
                key={a.id}
                onClick={() => { hapticTap(); openScan('auto') }}
                className={pillBase}
                aria-label={a.label}
              >
                <span aria-hidden className="text-base">{a.icon}</span>
                <span>{a.label}</span>
                {a.status && (
                  <span className="text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
                    ({a.status})
                  </span>
                )}
              </button>
            )
          }

          return (
            <Link
              key={a.id}
              href={gated ? `/upgrade?feature=${a.id}` : a.href}
              className={pillBase}
              aria-label={gated ? `${a.label} — requires Plus` : a.label}
            >
              <span aria-hidden className="text-base">{a.icon}</span>
              <span>{a.label}</span>
              {gated && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#D97757] bg-[#D97757]/10 rounded-full px-1.5 py-0.5">
                  Plus
                </span>
              )}
              {!gated && a.status && (
                <span className="text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
                  ({a.status})
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
