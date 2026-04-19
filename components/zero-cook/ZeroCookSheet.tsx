'use client'

import { useEffect, useMemo } from 'react'
import { usePostHog } from 'posthog-js/react'
import { toast } from 'sonner'
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
import type { HouseholdMode, ZeroCookMeal, ZeroCookRequest } from '@/lib/zero-cook/types'

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
  const { meals, isLoading, error, fetch: fetchRecommendations } = useZeroCookRecommend()
  const cta = useMemo(() => getSmartCTA(), [])
  const description = useMemo(() => getModeDescription(householdType), [householdType])

  async function handleSave(meal: ZeroCookMeal) {
    const savable = {
      id: `zero-${meal.id}`,
      title: meal.name,
      tagline: meal.reason,
      description: meal.reason,
      cuisineType: meal.cuisineType,
      prepTime: 0,
      cookTime: 0,
      totalTime: 0,
      estimatedCost: 0,
      servings: 1,
      difficulty: 'easy' as const,
      tags: ['zero-cook', 'delivery'],
      ingredients: [],
      steps: ['Open preferred delivery provider and place your order.'],
      variations: [],
      leftoverTip: null,
      shoppingList: [],
      meta: {
        score: 8,
        matchedPantryItems: [],
        pantryUtilization: 0,
        simplifiedForEnergy: true,
        pickyEaterAdjusted: false,
        localityApplied: false,
        selectionReason: 'Saved from Zero-Cook mode',
      },
    }

    const res = await fetch('/api/content/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal: savable }),
    })

    if (res.ok) {
      toast.success('Meal saved', { description: 'Find it in Saved Meals.' })
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      toast.error(data?.error ?? 'Could not save this meal')
    }
  }

  useEffect(() => {
    if (!open) return
    posthog?.capture('delivery_feature_opened', {
      household_mode: householdType,
    })
    fetchRecommendations({
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
              onSave={handleSave}
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
