'use client'

import { useState, useCallback } from 'react'
import type { ZeroCookMeal, ZeroCookRequest } from '@/lib/zero-cook/types'

interface UseZeroCookState {
  meals: ZeroCookMeal[]
  isLoading: boolean
  error: string | null
  fetch: (req: ZeroCookRequest) => Promise<void>
}

export function useZeroCookRecommend(): UseZeroCookState {
  const [meals, setMeals] = useState<ZeroCookMeal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async (req: ZeroCookRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await globalThis.fetch('/api/zero-cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed (${res.status})`)
      }
      const data = await res.json()
      setMeals(data.meals ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { meals, isLoading, error, fetch }
}
