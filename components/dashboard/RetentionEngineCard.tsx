'use client'

import Link from 'next/link'
import { Bell, CalendarDays, CircleDollarSign, Refrigerator, Sparkles, ArrowRight, TrendingDown } from 'lucide-react'
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
          accent: 'orange' as const,
        }
      : retention.isSunday
        ? {
            icon: CalendarDays,
            label: 'Sunday plan ritual',
            title: retention.plannedDays > 0 ? `${retention.plannedDays} day${retention.plannedDays === 1 ? '' : 's'} planned` : 'Set this week up now',
            href: '/planner',
            cta: 'Plan week',
            accent: 'violet' as const,
          }
        : retention.isDinnerWindow
          ? {
              icon: Bell,
              label: 'Dinner reminder',
              title: 'Dinner window is here',
              href: '/dashboard',
              cta: 'Pick tonight',
              accent: 'orange' as const,
            }
          : {
              icon: Sparkles,
              label: 'Food-life rhythm',
              title: 'Keep tonight, leftovers, and groceries connected',
              href: '/planner',
              cta: 'Review week',
              accent: 'orange' as const,
            }

  const PrimaryIcon = primary.icon

  const accentClasses = {
    orange: {
      iconBg: 'bg-[#D97757]/10 dark:bg-[#D97757]/15',
      iconColor: 'text-[#D97757]',
      label: 'text-[#D97757]',
      cta: 'bg-[#D97757] hover:bg-[#C86646]',
      ring: 'ring-[#D97757]/20 hover:ring-[#D97757]/40',
    },
    violet: {
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      label: 'text-violet-600 dark:text-violet-400',
      cta: 'bg-violet-600 hover:bg-violet-700',
      ring: 'ring-violet-200/60 hover:ring-violet-400/40 dark:ring-violet-800/40',
    },
  }

  const ac = accentClasses[primary.accent]

  return (
    <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_18rem]" aria-label="MealEase retention summary">
      {/* Primary action card */}
      <Link
        href={primary.href}
        className={`group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-neutral-900 dark:ring-neutral-800 ${ac.ring}`}
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${ac.iconBg} ${ac.iconColor}`}>
          <PrimaryIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[11px] font-bold uppercase tracking-wide ${ac.label}`}>{primary.label}</span>
          <span className="block truncate text-sm font-bold text-neutral-950 dark:text-neutral-50">{primary.title}</span>
        </span>
        <span className={`shrink-0 inline-flex items-center gap-1 rounded-full ${ac.cta} px-3 py-1.5 text-xs font-bold text-white transition-colors`}>
          {primary.cta}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>

      {/* Budget card */}
      <Link
        href={retention.weeklyBudgetRemaining != null ? '/budget?tab=swaps' : '/upgrade?feature=budget'}
        className="group flex items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-emerald-300/50 dark:from-emerald-950/20 dark:to-teal-950/10 dark:ring-emerald-900/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-emerald-700 dark:bg-neutral-900 dark:text-emerald-300">
          {retention.weeklyBudgetRemaining != null ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <CircleDollarSign className="h-5 w-5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {retention.weeklyBudgetRemaining != null
              ? `$${retention.weeklyBudgetRemaining.toFixed(0)} budget room left`
              : 'Savings recap'}
          </span>
          <span className="block truncate text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Keep this week under control
          </span>
        </span>
        <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </section>
  )
}
