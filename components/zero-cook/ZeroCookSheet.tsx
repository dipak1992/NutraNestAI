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
import type { HouseholdMode, ZeroCookRequest } from '@/lib/zero-cook/types'

interface ZeroCookSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  householdType: HouseholdMode
  household: ZeroCookRequest['household']
  cuisinePreferences?: string[]
  budget?: 'low' | 'medium' | 'high'
  dietaryRestrictions?: string[]
  allergies?: string[]
  dislikedFoods?: string[]
  pickyEater?: boolean
  healthyGoal?: boolean
  lowEnergy?: boolean
  countryCode?: string
}

function getModeDescription(mode: HouseholdMode): string {
  if (mode === 'single') return 'Too busy to cook? We picked tonight\'s best options.'
  if (mode === 'couple') return 'Dinner for two without the debate.'
  return 'Feed everyone fast tonight.'
}

export function ZeroCookSheet({
  open,
  onOpenChange,
  householdType,
  household,
  cuisinePreferences,
  budget,
  dietaryRestrictions,
  allergies,
  dislikedFoods,
  pickyEater,
  healthyGoal,
  lowEnergy,
  countryCode,
}: ZeroCookSheetProps) {
  const posthog = usePostHog()
  const { meals, isLoading, error, fetch } = useZeroCookRecommend()
  const cta = useMemo(() => getSmartCTA(), [])
  const description = useMemo(() => getModeDescription(householdType), [householdType])

  useEffect(() => {
    if (!open) return
    posthog?.capture('delivery_feature_opened', {
      household_mode: householdType,
    })
    fetch({
      householdType,
      household,
      cuisinePreferences,
      budget,
      dietaryRestrictions,
      allergies,
      dislikedFoods,
      pickyEater,
      healthyGoal,
      lowEnergy,
      location: { countryCode },
    })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>🛵 {cta}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
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
              countryCode={countryCode}
              onProviderSelect={(provider, meal, url, source) => {
                try {
                  localStorage.setItem(
                    'mealease_delivery_last_used_at',
                    new Date().toISOString(),
                  )
                } catch {
                  // non-fatal
                }

                posthog?.capture('suggestion_clicked', {
                  meal_id: meal.id,
                  meal_name: meal.name,
                  household_mode: householdType,
                  source,
                })
                posthog?.capture('provider_selected', {
                  provider,
                  meal_id: meal.id,
                  meal_name: meal.name,
                  cuisine: meal.cuisineType,
                  household_mode: householdType,
                })
                posthog?.capture('redirect_completed', {
                  provider,
                  url,
                  household_mode: householdType,
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
