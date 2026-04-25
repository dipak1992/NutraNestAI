'use client'

import { motion } from 'framer-motion'
import { TrendingDown, DollarSign, Share2, Leaf } from 'lucide-react'
import type { LeftoverInsights as LeftoverInsightsType } from '@/lib/leftovers/types'

type Props = {
  insights: LeftoverInsightsType
}

export function LeftoverInsights({ insights }: Props) {
  const {
    totalSaved,
    totalWasted,
    activeCount,
    expiringSoonCount,
    usedThisWeek,
    wasteReductionPercent,
  } = insights

  async function handleShare() {
    const text = `I've saved $${totalSaved.toFixed(2)} in food costs and reduced waste by ${wasteReductionPercent}% with MealEase AI! 🌱`
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Your Impact</h3>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Share2 className="h-3 w-3" />
          Share
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-500/10 p-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Saved</span>
          </div>
          <p className="text-xl font-bold text-white">${totalSaved.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-500">from leftovers used</p>
        </div>

        <div className="rounded-xl bg-red-500/10 p-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs font-medium">Wasted</span>
          </div>
          <p className="text-xl font-bold text-white">${totalWasted.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-500">discarded / expired</p>
        </div>
      </div>

      {/* Waste reduction bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-zinc-400">
            <Leaf className="h-3 w-3 text-emerald-400" />
            Waste reduction
          </span>
          <span className="font-semibold text-white">{wasteReductionPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(wasteReductionPercent, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 border-t border-white/10 pt-3">
        <span>
          <span className="font-semibold text-white">{activeCount}</span> active
        </span>
        {expiringSoonCount > 0 && (
          <span className="text-amber-400">
            <span className="font-semibold">{expiringSoonCount}</span> expiring soon
          </span>
        )}
        <span>
          <span className="font-semibold text-white">{usedThisWeek}</span> used this week
        </span>
      </div>
    </div>
  )
}
