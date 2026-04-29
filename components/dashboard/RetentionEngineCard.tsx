'use client'

import Link from 'next/link'
import { Bell, CalendarDays, CircleDollarSign, Refrigerator, Sparkles } from 'lucide-react'
import type { DashboardPayload } from '@/lib/dashboard/types'

type Props = {
  retention: DashboardPayload['retention']
}

export function RetentionEngineCard({ retention }: Props) {
  const primary =
    retention.expiringSoon > 0
      ? {
          icon: Refrigerator,
          label: 'Use before it expires',
          title: `${retention.expiringSoon} leftover${retention.expiringSoon === 1 ? '' : 's'} need attention`,
          href: '/leftovers',
          cta: 'Use leftovers',
        }
      : retention.isSunday
        ? {
            icon: CalendarDays,
            label: 'Sunday plan ritual',
            title: retention.plannedDays > 0 ? `${retention.plannedDays} day${retention.plannedDays === 1 ? '' : 's'} planned` : 'Set this week up now',
            href: '/planner',
            cta: 'Plan week',
          }
        : retention.isDinnerWindow
          ? {
              icon: Bell,
              label: 'Dinner reminder',
              title: 'Dinner window is here',
              href: '/dashboard',
              cta: 'Pick tonight',
            }
          : {
              icon: Sparkles,
              label: 'Food-life rhythm',
              title: 'Keep tonight, leftovers, and groceries connected',
              href: '/planner',
              cta: 'Review week',
            }

  const PrimaryIcon = primary.icon

  return (
    <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_18rem]" aria-label="MealEase retention summary">
      <Link
        href={primary.href}
        className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-orange-100 transition hover:-translate-y-0.5 hover:ring-[#D97757]/40 hover:shadow-sm dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#D97757] dark:bg-orange-900/30">
          <PrimaryIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-[#D97757]">{primary.label}</span>
          <span className="block truncate text-sm font-bold text-neutral-950 dark:text-neutral-50">{primary.title}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[#D97757] px-3 py-1.5 text-xs font-bold text-white">{primary.cta}</span>
      </Link>

      <Link
        href={retention.weeklyBudgetRemaining != null ? '/budget?tab=swaps' : '/upgrade?feature=budget'}
        className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:shadow-sm dark:bg-emerald-950/20 dark:ring-emerald-900/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 dark:bg-neutral-900 dark:text-emerald-300">
          <CircleDollarSign className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {retention.weeklyBudgetRemaining != null
              ? `$${retention.weeklyBudgetRemaining.toFixed(0)} budget room`
              : 'Savings recap'}
          </span>
          <span className="block truncate text-xs text-emerald-700/80 dark:text-emerald-400">
            Keep this week under control
          </span>
        </span>
      </Link>
    </section>
  )
}
