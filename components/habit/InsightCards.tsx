'use client'

import { useMemo } from 'react'
import { useLearningStore } from '@/lib/learning/store'

export function InsightCards() {
  const { feedbackHistory, getSignal } = useLearningStore()

  const insights = useMemo(() => {
    if (!feedbackHistory || feedbackHistory.length < 3) return []

    const signal = getSignal()
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const recent = feedbackHistory.filter((f: { timestamp?: number }) =>
      !f.timestamp || f.timestamp >= sevenDaysAgo
    )

    const liked = recent.filter((f: { action?: string; liked?: boolean }) =>
      f.action === 'like' || f.liked === true
    ).length
    const saved = recent.filter((f: { action?: string; saved?: boolean }) =>
      f.action === 'save' || f.saved === true
    ).length

    const results: string[] = []

    // Show top cuisine preference if signal exists
    if (signal && signal.totalInteractions >= 5) {
      const topCuisines = Object.entries(signal.cuisineAffinities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .filter(([, v]) => v > 0.2)
        .map(([c]) => c.charAt(0).toUpperCase() + c.slice(1))
      if (topCuisines.length > 0) {
        results.push(`You love ${topCuisines.join(' & ')} 🎯`)
      }

      // Show time preference
      if (signal.preferredTimeRange) {
        const max = signal.preferredTimeRange.max
        if (max <= 30) results.push('Quick meals in under 30 min ⚡')
        else if (max <= 45) results.push('Sweet spot: 30-45 min meals ⏱️')
      }

      // Show difficulty preference
      if (signal.preferredDifficulty === 'easy') {
        results.push('You prefer easy, stress-free meals 😌')
      }
    }

    if (liked >= 3) results.push(`You loved ${liked} meals this week 🔥`)
    else if (liked >= 1) results.push(`${liked} meal${liked > 1 ? 's' : ''} hit the spot 👍`)

    if (saved >= 2) results.push(`${saved} meals saved for later 📌`)

    const total = recent.length
    if (total >= 5 && results.length < 3) results.push(`${total} new ideas explored this week 🚀`)

    return results.slice(0, 3)
  }, [feedbackHistory, getSignal])

  if (insights.length === 0) {
    return (
      <div className="flex items-center gap-2 px-1 mt-3">
        <span className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-full px-3 py-1.5">
          🧠 MealEase learns your taste — like or skip meals to personalize
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-0.5 scrollbar-none">
      {insights.map((text, i) => (
        <span
          key={i}
          className="shrink-0 text-xs text-foreground/80 bg-primary/8 border border-primary/15 rounded-full px-3 py-1.5 font-medium"
        >
          {text}
        </span>
      ))}
    </div>
  )
}
