'use client'

import { useState, useEffect } from 'react'

/**
 * Client component providing dynamic time-of-day values
 * for the Hero phone mockup status bar and greeting.
 *
 * Handles hydration safely: renders static fallbacks until mounted.
 */
export function usePhoneClock() {
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const hour = now.getHours()
  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
        ? 'Good Afternoon'
        : hour < 21
          ? 'Good Evening'
          : 'Good Night'

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })

  return {
    mounted,
    greeting: mounted ? greeting : 'Good Afternoon',
    timeStr: mounted ? timeStr : '9:41 AM',
    dayName: mounted ? dayName : 'Saturday',
  }
}

/**
 * Renders the status bar time in the phone mockup.
 */
export function PhoneStatusTime() {
  const { timeStr } = usePhoneClock()
  return <span className="text-[10px] font-semibold text-neutral-500">{timeStr}</span>
}

/**
 * Renders the greeting subtitle in the phone mockup header.
 */
export function PhoneGreeting() {
  const { greeting } = usePhoneClock()
  return (
    <p className="mt-0.5 text-[10px] font-semibold text-neutral-500">
      {greeting} — tonight&apos;s pick
    </p>
  )
}

/**
 * Renders the dynamic day tag in the meal card.
 */
export function PhoneDayTag() {
  const { dayName } = usePhoneClock()
  return (
    <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#B85F43] ring-1 ring-orange-100">
      {dayName}
    </span>
  )
}
