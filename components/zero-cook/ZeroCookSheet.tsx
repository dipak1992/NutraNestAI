'use client'

import { useEffect, useMemo } from 'react'
import { usePostHog } from 'posthog-js/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useZeroCookRecommend } from './useZeroCookRecommend'
import { ZeroCookMealCard } from './ZeroCookMealCard'
import { getSmartCTA } from '@/lib/zero-cook/providers'
import type { ZeroCookRequest } from '@/lib/zero-cook/types'

interface ZeroCookSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  household: ZeroCookRequest['household']
  cuisinePreferences?: string[]
  budget?: 'low' | 'medium' | 'high'
}

export function ZeroCookSheet({
  open,
  onOpenChange,
  household,
  cuisinePreferences,
  budget,
}: ZeroCookSheetProps) {
  const posthog = usePostHog()
  const { meals, isLoading, error, fetch } = useZeroCookRecommend()
  const cta = useMemo(() => getSmartCTA(), [])

  useEffect(() => {
    if (!open) return
    posthog?.capture('zero_cook_opened')
    fetch({ household, cuisinePreferences, budget })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>🛵 {cta}</SheetTitle>
          <SheetDescription>
            We picked the best delivery options for your household — just tap to order.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4">
          {isLoading && (
            <>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-2xl" />
              ))}
            </>
          )}

          {error && (
            <p className="text-sm text-destructive text-center py-8">
              {error}
            </p>
          )}

          {!isLoading && !error && meals.map((meal, i) => (
            <ZeroCookMealCard
              key={meal.id}
              meal={meal}
              index={i}
              onProviderSelect={(provider, meal, url) => {
                posthog?.capture('zero_cook_provider_selected', {
                  provider,
                  meal_id: meal.id,
                  meal_name: meal.name,
                  cuisine: meal.cuisineType,
                })
                posthog?.capture('zero_cook_redirect_started', {
                  provider,
                  url,
                })
              }}
            />
          ))}

          {!isLoading && !error && meals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recommendations found — try updating your preferences.
            </p>
          )}
        </div>

        <SheetFooter>
          <p className="text-xs text-muted-foreground text-center">
            Prices & ETAs are estimates. You&apos;ll confirm in the delivery app.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
