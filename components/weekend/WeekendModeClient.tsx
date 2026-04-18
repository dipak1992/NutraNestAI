'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { EntertainmentResult } from '@/types'
import type { SmartMealResult } from '@/lib/engine/types'
import { useLightOnboardingStore } from '@/lib/store'

interface WeekendModeData {
  meal: SmartMealResult
  entertainment: EntertainmentResult
}

interface WeekendModeClientProps {
  initialData: WeekendModeData
}

export default function WeekendModeClient({ initialData }: WeekendModeClientProps) {
  const [data, setData] = useState<WeekendModeData>(initialData)
  const [swappingMeal, setSwappingMeal] = useState(false)
  const [swappingEnt, setSwappingEnt] = useState(false)
  const [saved, setSaved] = useState(false)
  const [usedTonight, setUsedTonight] = useState(false)
  const [recipeExpanded, setRecipeExpanded] = useState(false)
  const [seenTitles, setSeenTitles] = useState<string[]>([initialData.entertainment.title])
  const entertainmentPrefs = useLightOnboardingStore((s) => s.entertainmentPrefs)

  const fetchNew = useCallback(
    async (opts: { swapMeal?: boolean; swapEntertainment?: boolean }) => {
      const excludeTitles = opts.swapEntertainment ? seenTitles : []
      const res = await fetch('/api/weekend-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...opts, excludeTitles, entertainmentPrefs: entertainmentPrefs ?? undefined }),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json() as Promise<WeekendModeData>
    },
    [seenTitles, entertainmentPrefs],
  )

  async function handleSwapMeal() {
    setSwappingMeal(true)
    try {
      const next = await fetchNew({ swapMeal: true })
      setData(prev => ({ ...prev, meal: next.meal }))
    } catch {
      // silent
    } finally {
      setSwappingMeal(false)
    }
  }

  async function handleSwapEntertainment() {
    setSwappingEnt(true)
    try {
      const next = await fetchNew({ swapEntertainment: true })
      setSeenTitles(prev => [...prev, next.entertainment.title])
      setData(prev => ({ ...prev, entertainment: next.entertainment }))
    } catch {
      // silent
    } finally {
      setSwappingEnt(false)
    }
  }

  function handleSaveForTomorrow() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(
      'nutrinest-weekend-saved',
      JSON.stringify({ date: today, meal: data.meal, entertainment: data.entertainment }),
    )
    setSaved(true)
  }

  function handleUseTonightsPlan() {
    setUsedTonight(true)
  }

  const { meal, entertainment } = data

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-10 pt-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl">🎬</span>
        <h1 className="mt-2 text-2xl font-bold text-amber-900">Weekend Mode</h1>
        <p className="mt-1 text-sm text-amber-700/80">Your perfect Friday/Saturday night plan</p>
      </div>

      {/* Meal card */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Tonight's Dinner
          </span>
        </div>
        <h2 className="text-xl font-bold text-amber-900">{meal.title}</h2>
        <p className="mt-1 text-sm text-amber-800/80">{meal.tagline || meal.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            ⏱ {meal.totalTime} min
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            👨‍🍳 {meal.difficulty}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            🍽 {meal.servings} servings
          </span>
        </div>

        <div className="mt-3">
          <p className="text-xs font-semibold text-amber-700">Key ingredients</p>
          <p className="mt-1 text-xs text-amber-800/70">
            {meal.ingredients
              .slice(0, 5)
              .map(i => i.name)
              .join(', ')}
            {meal.ingredients.length > 5 ? ` +${meal.ingredients.length - 5} more` : ''}
          </p>
        </div>

        {/* Expandable recipe details */}
        <button
          onClick={() => setRecipeExpanded(prev => !prev)}
          className="mt-3 w-full text-left text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors"
        >
          {recipeExpanded ? '▾ Hide recipe details' : '▸ Show recipe details'}
        </button>

        {recipeExpanded && (
          <div className="mt-3 space-y-4 border-t border-amber-200 pt-3">
            {/* Full ingredients */}
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1.5">🧾 All Ingredients</p>
              <ul className="space-y-1">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-amber-900/80 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      <span className="font-medium">{ing.quantity} {ing.unit}</span> {ing.name}
                      {ing.note && <span className="text-amber-600/70 ml-1">({ing.note})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            {meal.steps && meal.steps.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1.5">👩‍🍳 Steps</p>
                <ol className="space-y-2">
                  {meal.steps.map((step, i) => (
                    <li key={i} className="text-xs text-amber-900/80 flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Variations */}
            {meal.variations && meal.variations.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1.5">👨‍👩‍👧‍👦 Family Variations</p>
                <div className="space-y-2">
                  {meal.variations.map((v, i) => (
                    <div key={i} className="rounded-lg bg-amber-100/50 border border-amber-200/60 p-2.5">
                      <p className="text-xs font-semibold text-amber-900">
                        {v.emoji} {v.label} <span className="text-amber-600 font-normal capitalize">({v.stage})</span>
                      </p>
                      {v.description && <p className="text-xs text-amber-800/70 mt-0.5">{v.description}</p>}
                      {v.modifications.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {v.modifications.map((mod, j) => (
                            <li key={j} className="text-xs text-amber-800/60">• {mod}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leftover tip */}
            {meal.leftoverTip && (
              <p className="text-xs text-amber-700 bg-amber-100/40 rounded-lg p-2">
                🥡 <span className="font-semibold">Leftover tip:</span> {meal.leftoverTip}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Entertainment card */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">🎥</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Tonight's Watch
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-4xl">{entertainment.posterEmoji}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-900">{entertainment.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs text-amber-700">{entertainment.year}</span>
              <span className="text-xs text-amber-700">·</span>
              <span className="text-xs font-medium capitalize text-amber-700">
                {entertainment.type}
              </span>
              <span className="text-xs text-amber-700">·</span>
              <span className="text-xs text-amber-700">{entertainment.rating}</span>
              {entertainment.imdbScore && (
                <>
                  <span className="text-xs text-amber-700">·</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-800">
                    ⭐ {entertainment.imdbScore.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-amber-800/80">{entertainment.reason}</p>

        {entertainment.whereToWatch.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {entertainment.whereToWatch.map(platform => (
              <span
                key={platform}
                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
              >
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {!usedTonight ? (
          <button
            onClick={handleUseTonightsPlan}
            className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 active:scale-95"
          >
            ✅ Use Tonight's Plan
          </button>
        ) : (
          <div className="w-full rounded-2xl bg-amber-100 py-3.5 text-center text-sm font-bold text-amber-700">
            🎉 Enjoy your evening!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSwapMeal}
            disabled={swappingMeal}
            className="rounded-2xl border border-amber-200 bg-white py-3 text-sm font-semibold text-amber-800 transition-all hover:border-amber-400 hover:bg-amber-50 active:scale-95 disabled:opacity-50"
          >
            {swappingMeal ? '⏳ Swapping…' : '🔄 Swap Meal'}
          </button>
          <button
            onClick={handleSwapEntertainment}
            disabled={swappingEnt}
            className="rounded-2xl border border-amber-200 bg-white py-3 text-sm font-semibold text-amber-800 transition-all hover:border-amber-400 hover:bg-amber-50 active:scale-95 disabled:opacity-50"
          >
            {swappingEnt ? '⏳ Swapping…' : '🎬 Swap Movie'}
          </button>
        </div>

        {!saved ? (
          <button
            onClick={handleSaveForTomorrow}
            className="w-full rounded-2xl border border-amber-200 bg-white py-3 text-sm font-semibold text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-50 active:scale-95"
          >
            📅 Save for Tomorrow
          </button>
        ) : (
          <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 py-3 text-center text-sm font-semibold text-amber-700">
            ✓ Saved for tomorrow
          </div>
        )}
      </div>

      {/* Settings link */}
      <p className="text-center text-xs text-amber-600/70">
        Change preferences in{' '}
        <Link href="/settings?tab=entertainment" className="underline underline-offset-2">
          Settings → Entertainment
        </Link>
      </p>
    </div>
  )
}
