'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function isWeekendWindow(): boolean {
  const day = new Date().getDay()
  // Show Friday, Saturday, Sunday
  return day === 5 || day === 6 || day === 0
}

interface Props {
  weekendTitle?: string
  weekendSubtitle?: string
}

export function WeekendModeCard({ weekendTitle, weekendSubtitle }: Props) {
  const show = useMemo(() => isWeekendWindow(), [])

  if (!show) return null

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <Link
          href="/weekend"
          className="block rounded-2xl overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50 p-5 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎬</span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-amber-900">{weekendTitle ?? 'Weekend Mode'}</p>
              <p className="text-xs text-amber-700/80 mt-0.5">
                {weekendSubtitle ?? 'Dinner + movie night — curated for you'}
              </p>
            </div>
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 rounded-full px-2.5 py-1 whitespace-nowrap">
              It&apos;s the weekend!
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
