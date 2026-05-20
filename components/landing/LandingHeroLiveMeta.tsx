'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const WEEKDAY_LABELS = [
  'Sunday Reset',
  'Quick Monday',
  'Budget Tuesday',
  'Family Wednesday',
  'Pantry Thursday',
  'Friday Night',
  'Comfort Saturday',
]

function getGreeting(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatStatusTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })
}

function formatPromptTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getWeekdayLabel(date: Date) {
  return WEEKDAY_LABELS[date.getDay()] ?? 'Tonight'
}

function useLiveHeroTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return now
}

export function LandingHeroStatusTime() {
  const now = useLiveHeroTime()

  return (
    <span suppressHydrationWarning className="text-[13px] font-bold tracking-tight">
      {formatStatusTime(now)}
    </span>
  )
}

export function LandingHeroGreeting() {
  const now = useLiveHeroTime()

  return (
    <h3
      suppressHydrationWarning
      className="mt-3 font-serif text-[32px] font-bold leading-[0.98] tracking-tight text-neutral-950"
    >
      {getGreeting(now)},
      <br />
      Foodie!
    </h3>
  )
}

export function LandingHeroWeekdayBadge() {
  const now = useLiveHeroTime()

  return (
    <span
      suppressHydrationWarning
      className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF6EC] px-3 py-1.5 text-[12px] font-bold text-[#C86646] ring-1 ring-orange-200"
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      {getWeekdayLabel(now)}
    </span>
  )
}

export function LandingHeroPromptTime() {
  const now = useLiveHeroTime()

  return (
    <span suppressHydrationWarning>
      {formatPromptTime(now)}
    </span>
  )
}
