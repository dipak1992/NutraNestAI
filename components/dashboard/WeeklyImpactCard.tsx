'use client'

import Link from 'next/link'
import { ArrowRight, PiggyBank, Recycle, CalendarDays } from 'lucide-react'
import type { DashboardPayload } from '@/lib/dashboard/types'

type Props = {
  retention: DashboardPayload['retention']
}

export function WeeklyImpactCard({ retention }: Props) {
  const hasImpact =
    retention.estimatedSavedThisWeek > 0 ||
    retention.leftoverMealsReusedThisWeek > 0 ||
    retention.plannedDays > 0

  if (!hasImpact) return null

  return (
    <section
      aria-label="Weekly food impact"
      className="grid gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
          This week&apos;s food wins
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold text-neutral-950">
          MealEase is already protecting time, food, and budget.
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 md:min-w-[27rem]">
        <ImpactMetric
          icon={PiggyBank}
          label="Estimated saved"
          value={`$${retention.estimatedSavedThisWeek.toFixed(0)}`}
          sublabel={retention.weeklyBudgetRemaining != null ? 'budget + rescued food' : 'rescued food estimate'}
        />
        <ImpactMetric
          icon={Recycle}
          label="Leftovers reused"
          value={String(retention.leftoverMealsReusedThisWeek)}
          sublabel="meals kept out of trash"
        />
        <ImpactMetric
          icon={CalendarDays}
          label="Planned dinners"
          value={`${retention.plannedDays}/7`}
          sublabel="less decision fatigue"
        />
      </div>

      <Link
        href="/budget?tab=swaps"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline md:col-span-2"
      >
        Keep the streak going
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}

function ImpactMetric({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: typeof PiggyBank
  label: string
  value: string
  sublabel: string
}) {
  return (
    <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-emerald-100">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-700" />
        <p className="text-[11px] font-semibold text-neutral-500">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-neutral-950">{value}</p>
      <p className="text-[10px] leading-4 text-neutral-500">{sublabel}</p>
    </div>
  )
}
