'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, RefreshCw, ChefHat, Loader2 } from 'lucide-react'
import type { SmartMealResult } from '@/lib/engine/types'
import { useLightOnboardingStore } from '@/lib/store'
import { MicroFeedback } from './MicroFeedback'

// ── Card style map (mirrors MealSwipeStack) ───────────────────────────────────

const CARD_STYLES: Record<string, { bg: string; emoji: string }> = {
  italian:       { bg: 'from-rose-500 via-orange-400 to-amber-300',   emoji: '🍝' },
  mexican:       { bg: 'from-amber-500 via-yellow-400 to-lime-300',    emoji: '🌮' },
  asian:         { bg: 'from-teal-600 via-emerald-500 to-green-400',   emoji: '🥢' },
  american:      { bg: 'from-orange-500 via-amber-400 to-yellow-300',  emoji: '🍔' },
  indian:        { bg: 'from-orange-600 via-amber-500 to-yellow-300',  emoji: '🍛' },
  mediterranean: { bg: 'from-sky-500 via-teal-400 to-emerald-300',     emoji: '🥗' },
  comfort:       { bg: 'from-emerald-500 via-teal-400 to-cyan-300',    emoji: '🫕' },
  global:        { bg: 'from-violet-500 via-purple-400 to-indigo-300', emoji: '🌏' },
}

function getCardStyle(cuisine?: string) {
  const key = (cuisine?.toLowerCase() ?? '').split(' ')[0]
  return CARD_STYLES[key] ?? CARD_STYLES.comfort
}

type CardState = 'idle' | 'tried' | 'done'

export function TodayCard() {
  const [meal, setMeal] = useState<SmartMealResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState(false)
  const [cardState, setCardState] = useState<CardState>('idle')

  const { cookingTimeMinutes, cuisines, lowEnergy, hasKids, householdType } = useLightOnboardingStore()

  function buildHousehold() {
    return {
      adultsCount: householdType === 'solo' ? 1 : 2,
      kidsCount: hasKids ? 1 : 0,
      toddlersCount: 0,
      babiesCount: 0,
    }
  }

  async function fetchMeal(excludeId?: string): Promise<SmartMealResult | null> {
    try {
      const res = await fetch('/api/smart-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household: buildHousehold(),
          lowEnergy: lowEnergy ?? false,
          cuisinePreferences: cuisines?.length ? cuisines : undefined,
          maxCookTime: cookingTimeMinutes ?? undefined,
          excludeIds: excludeId ? [excludeId] : [],
        }),
      })
      if (!res.ok) return null
      const data = await res.json()
      // Handle both { meal: SmartMealResult } and direct SmartMealResult formats
      const result = (data?.meal ?? data) as SmartMealResult
      return result?.id ? result : null
    } catch {
      return null
    }
  }

  useEffect(() => {
    fetchMeal().then(m => {
      setMeal(m)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSwap() {
    if (!meal) return
    setSwapping(true)
    setCardState('idle')
    const next = await fetchMeal(meal.id)
    if (next) setMeal(next)
    setSwapping(false)
  }

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="w-full rounded-3xl bg-muted/40 border border-border flex items-center justify-center h-44">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Thinking about tonight…</p>
        </div>
      </div>
    )
  }

  if (!meal) return null

  const { bg, emoji } = getCardStyle(meal.cuisineType)

  return (
    <div className="w-full">
      {/* Card header row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-foreground">Tonight&apos;s suggestion</h3>
        <button
          onClick={handleSwap}
          disabled={swapping}
          className="flex items-center gap-1 text-xs text-primary hover:opacity-75 transition-opacity disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${swapping ? 'animate-spin' : ''}`} />
          Swap
        </button>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-br ${bg}`}
          style={{ minHeight: 188 }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Large emoji */}
          <span
            className="absolute top-3 right-4 opacity-55 leading-none select-none pointer-events-none"
            style={{ fontSize: 76 }}
          >
            {emoji}
          </span>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-4 pt-14 bg-gradient-to-t from-black/80 via-black/25 to-transparent rounded-b-3xl">
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium mb-0.5">
              {meal.cuisineType}
            </p>
            <h2 className="text-white text-lg font-bold leading-tight mb-2">{meal.title}</h2>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-xs font-medium">
                <Clock className="h-3 w-3" />
                {meal.totalTime}m
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-xs font-medium capitalize">
                <ChefHat className="h-3 w-3" />
                {meal.difficulty}
              </div>
              {meal.tags?.includes('kid-friendly') && (
                <div className="bg-white/20 rounded-full px-2.5 py-1 text-white text-xs font-medium">
                  Kid-friendly
                </div>
              )}
            </div>

            {/* CTA states */}
            {cardState === 'idle' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setCardState('tried')}
                className="w-full py-2.5 rounded-2xl bg-white text-gray-900 text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                Try tonight 🍽️
              </motion.button>
            )}

            {cardState === 'tried' && (
              <MicroFeedback
                meal={meal}
                onComplete={() => setCardState('done')}
              />
            )}

            {cardState === 'done' && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white text-sm font-medium py-1.5"
              >
                Enjoy your meal! ✨
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
