'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChefHat, RefreshCw, ShoppingCart, Flame, ChevronDown, ChevronUp, Leaf, ExternalLink } from 'lucide-react'
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
  const [showIngredients, setShowIngredients] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const router = useRouter()

  const pantryItems = meal.ingredients?.filter((i) => i.fromPantry) ?? []
  const toBuyItems = meal.ingredients?.filter((i) => !i.fromPantry) ?? []

  function handleViewRecipe() {
    try { sessionStorage.setItem('__meal', JSON.stringify(meal)) } catch {}
    router.push('/tonight/recipe')
  }

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

      {/* Pantry usage hint */}
      {pantryItems.length > 0 && (
        <div className="flex items-center gap-1.5 px-5 pb-2 text-xs text-emerald-700 font-medium">
          <Leaf className="h-3 w-3" />
          Uses {pantryItems.length} pantry item{pantryItems.length > 1 ? 's' : ''}:{' '}
          {pantryItems.slice(0, 3).map((i) => i.name).join(', ')}
          {pantryItems.length > 3 && ` +${pantryItems.length - 3} more`}
        </div>
      )}

      {/* Expandable: Ingredients */}
      {meal.ingredients && meal.ingredients.length > 0 && (
        <div className="border-t border-border/40">
          <button
            onClick={() => setShowIngredients((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <span>🛒 {toBuyItems.length} to buy · {pantryItems.length} from pantry</span>
            {showIngredients ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <AnimatePresence>
            {showIngredients && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-3 space-y-2">
                  {toBuyItems.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Need to buy</p>
                      <div className="flex flex-wrap gap-1.5">
                        {toBuyItems.map((i, idx) => (
                          <span key={idx} className="text-xs bg-red-50 text-red-800 border border-red-200 rounded-full px-2 py-0.5">
                            {i.quantity} {i.unit} {i.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {pantryItems.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">From pantry</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pantryItems.map((i, idx) => (
                          <span key={idx} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-2 py-0.5">
                            {i.quantity} {i.unit} {i.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Expandable: Cooking steps */}
      {meal.steps && meal.steps.length > 0 && (
        <div className="border-t border-border/40">
          <button
            onClick={() => setShowSteps((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <span>📋 {meal.steps.length} cooking step{meal.steps.length !== 1 ? 's' : ''}</span>
            {showSteps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <AnimatePresence>
            {showSteps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ol className="px-5 pb-3 space-y-1.5 list-decimal list-inside">
                  {meal.steps.map((step, idx) => (
                    <li key={idx} className="text-xs leading-relaxed text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* View Full Recipe link */}
      <div className="border-t border-border/40">
        <button
          onClick={handleViewRecipe}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Full Recipe
        </button>
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
