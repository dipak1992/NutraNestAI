'use client'

import { useEffect, useState } from 'react'
import WeekendModeClient from './WeekendModeClient'
import type { EntertainmentResult } from '@/types'
import type { SmartMealResult } from '@/lib/engine/types'

interface WeekendModeData {
  meal: SmartMealResult
  entertainment: EntertainmentResult
}

export default function WeekendModeFetcher() {
  const [data, setData] = useState<WeekendModeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/weekend-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load weekend plan')
        return res.json() as Promise<WeekendModeData>
      })
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Something went wrong'))
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-2xl">😕</p>
        <p className="mt-2 text-sm font-medium text-amber-800">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setData(null)
            fetch('/api/weekend-mode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            })
              .then(res => res.json() as Promise<WeekendModeData>)
              .then(setData)
              .catch(e => setError(e instanceof Error ? e.message : 'Something went wrong'))
          }}
          className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <span className="animate-bounce text-4xl">🎬</span>
          <p className="text-sm font-medium text-amber-800">Curating your weekend plan…</p>
        </div>
      </div>
    )
  }

  return <WeekendModeClient initialData={data} />
}
