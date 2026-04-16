'use client'

import { AnimatePresence } from 'framer-motion'
import { MealCard } from './MealCard'
import type { SmartMealResult } from '@/lib/engine/types'

interface PantryMatch {
  meal: SmartMealResult
  pantryPercent: number
}

interface Props {
  matches: PantryMatch[]
  onCook: (meal: SmartMealResult) => void
  onSwap: (meal: SmartMealResult) => void
  onOrder: (meal: SmartMealResult) => void
}

export function PantryMatchList({ matches, onCook, onSwap, onOrder }: Props) {
  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-6 text-center">
        <span className="text-3xl block mb-2">🥫</span>
        <p className="text-sm font-semibold text-foreground">No pantry matches yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Add items to your pantry to see meals you can make right now.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {matches.slice(0, 3).map((m) => (
          <MealCard
            key={m.meal.id}
            meal={m.meal}
            pantryMatch={m.pantryPercent}
            onCook={() => onCook(m.meal)}
            onSwap={() => onSwap(m.meal)}
            onOrder={() => onOrder(m.meal)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
