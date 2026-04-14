'use client'

import { useMemo } from 'react'
import { useLearningStore } from '@/lib/learning/store'

export function InsightCards() {
  const { feedbackHistory } = useLearningStore()

  const insights = useMemo(() => {
    if (!feedbackHistory || feedbackHistory.length < 3) return []

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

    if (liked >= 3) results.push(`You loved ${liked} meals this week 🎯`)
    else if (liked >= 1) results.push(`${liked} meal${liked > 1 ? 's' : ''} hit the spot this week 👍`)

    if (saved >= 2) results.push(`${saved} meals saved for later 📌`)

    const total = recent.length
    if (total >= 5) results.push(`You've tried ${total} new ideas this week 🔥`)

    return results.slice(0, 2)
  }, [feedbackHistory])

  if (insights.length === 0) {
    return (
      <div className="flex items-center gap-2 px-1 mt-3">
        <span className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-full px-3 py-1.5">
          Meals learn your taste 🧠
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
