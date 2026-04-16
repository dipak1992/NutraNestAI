'use client'

import { motion } from 'framer-motion'
import { Clock, ChefHat, RefreshCw, ShoppingCart, Flame } from 'lucide-react'
import type { SmartMealResult } from '@/lib/engine/types'

// ── Helpers ─────────────────────────────────────────────────

function formatTime(mins: number): string {
  if (mins <= 0) return '—'
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function DifficultyDots({ difficulty }: { difficulty: 'easy' | 'moderate' | 'hard' }) {
  const filled = difficulty === 'easy' ? 1 : difficulty === 'moderate' ? 2 : 3
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulty: ${difficulty}`}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < filled ? 'bg-amber-500' : 'bg-muted'}`}
        />
      ))}
    </span>
  )
}

// ── Props ───────────────────────────────────────────────────

interface Props {
  meal: SmartMealResult
  /** Optional pantry match percentage (0-100) */
  pantryMatch?: number
  /** Swap button is animating */
  swapping?: boolean
  onCook: () => void
  onSwap: () => void
  onOrder: () => void
}

// ── Component ───────────────────────────────────────────────

export function MealCard({ meal, pantryMatch, swapping, onCook, onSwap, onOrder }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="rounded-3xl border border-border/60 bg-white overflow-hidden shadow-sm"
    >
      <div className="p-5">
        <h3 className="text-base font-bold text-foreground leading-snug">{meal.title}</h3>
        <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{meal.tagline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <Clock className="h-3 w-3" />
            {formatTime(meal.totalTime)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-foreground/80 rounded-full px-2.5 py-0.5">
            <DifficultyDots difficulty={meal.difficulty} />
            <span className="capitalize">{meal.difficulty}</span>
          </span>
          {pantryMatch != null && pantryMatch > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2.5 py-0.5">
              <Flame className="h-3 w-3" />
              {pantryMatch}% pantry
            </span>
          )}
          {!pantryMatch && meal.meta.pantryUtilization > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2.5 py-0.5">
              <Flame className="h-3 w-3" />
              {Math.round(meal.meta.pantryUtilization * 100)}% pantry
            </span>
          )}
        </div>
      </div>

      {/* 3-button footer — Cook / Swap / Order */}
      <div className="grid grid-cols-3 border-t border-border/60">
        <button
          onClick={onCook}
          className="flex flex-col items-center justify-center gap-1 py-3.5 hover:bg-emerald-50 transition-colors group"
        >
          <ChefHat className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">Cook</span>
        </button>
        <button
          onClick={onSwap}
          disabled={swapping}
          className="flex flex-col items-center justify-center gap-1 py-3.5 border-x border-border/60 hover:bg-muted transition-colors group disabled:opacity-60"
        >
          <RefreshCw className={`h-5 w-5 text-foreground/70 ${swapping ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
            {swapping ? 'Swapping…' : 'Swap'}
          </span>
        </button>
        <button
          onClick={onOrder}
          className="flex flex-col items-center justify-center gap-1 py-3.5 hover:bg-blue-50 transition-colors group"
        >
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-800">Order</span>
        </button>
      </div>
    </motion.div>
  )
}
