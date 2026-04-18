'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChefHat, RefreshCw, ShoppingCart, Flame } from 'lucide-react'
import posthog from 'posthog-js'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { useLearningStore } from '@/lib/learning/store'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { showRewardToast } from '@/lib/reward-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  decideMeal,
  sendSignal,
  householdFromMembers,
  fallbackHousehold,
} from '@/lib/decide/client'
import type { SmartMealResult } from '@/lib/engine/types'

interface Props {
  refreshKey: number
}

export function TonightRecommendation({ refreshKey }: Props) {
  const router = useRouter()
  const [meal, setMeal] = useState<SmartMealResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState(false)
  const [cooked, setCooked] = useState(false)
  const [groceryPromptOpen, setGroceryPromptOpen] = useState(false)
  const shownIdsRef = useRef<string[]>([])

  const { state: { members } } = useOnboardingStore()
  const light = useLightOnboardingStore()
  const { getBoosts, recordLike, recordReject } = useLearningStore()
  const { addCustomItem } = useWeeklyPlanStore()

  const getHousehold = useCallback(() =>
    members?.length
      ? householdFromMembers(members)
      : fallbackHousehold(light.householdType, light.hasKids, light.kidsAgeGroup),
    [members, light.householdType, light.hasKids, light.kidsAgeGroup])

  const fetchMeal = useCallback(async () => {
    setLoading(true)
    setCooked(false)
    try {
      const res = await decideMeal({
        mode: 'tonight',
        household: getHousehold(),
        cuisinePreferences: light.cuisines,
        lowEnergy: true,
        maxCookTime: light.cookingTimeMinutes || 25,
        excludeIds: shownIdsRef.current,
        learnedBoosts: getBoosts() ?? undefined,
        pickyEater: light.pickyEater
          ? { active: true, dislikedFoods: light.dislikedFoods }
          : undefined,
      })
      setMeal(res.meal)
      shownIdsRef.current = [...shownIdsRef.current, res.meal.id].slice(-15)
    } catch {
      setMeal(null)
    } finally {
      setLoading(false)
    }
  }, [getHousehold, light.cuisines, light.cookingTimeMinutes, light.pickyEater, light.dislikedFoods, getBoosts])

  useEffect(() => {
    void fetchMeal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  const handleCook = useCallback(() => {
    if (!meal) return
    recordLike(meal)
    sendSignal(meal.id, 'cooked', { mode: 'tonight' })
    posthog.capture('meal_cooked', { meal_id: meal.id, meal_name: meal.title, mode: 'tonight' })
    showRewardToast('mealCooked')
    sessionStorage.setItem('tonight-meal', JSON.stringify(meal))
    setCooked(true)
    setGroceryPromptOpen(true)
  }, [meal, recordLike])

  const handleSwap = useCallback(async () => {
    if (!meal) return
    recordReject(meal)
    sendSignal(meal.id, 'swapped', { mode: 'tonight' })
    posthog.capture('meal_swapped', { meal_id: meal.id, meal_name: meal.title, mode: 'tonight' })
    setSwapping(true)
    try {
      await fetchMeal()
    } finally {
      setSwapping(false)
    }
  }, [meal, recordReject, fetchMeal])

  const handleOrder = useCallback(() => {
    if (!meal) return
    sendSignal(meal.id, 'accepted', { intent: 'order_ingredients' })
    posthog.capture('meal_order', { meal_id: meal.id, meal_name: meal.title })
    for (const item of meal.shoppingList) {
      addCustomItem({
        name: item.name,
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit,
        category: item.category,
      })
    }
    router.push('/grocery-list')
  }, [meal, addCustomItem, router])

  const handleAddToGrocery = useCallback(() => {
    if (!meal) return
    for (const item of meal.shoppingList) {
      addCustomItem({
        name: item.name,
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit,
        category: item.category,
      })
    }
    setGroceryPromptOpen(false)
    router.push('/tonight/recipe')
  }, [meal, addCustomItem, router])

  const handleSkipGrocery = useCallback(() => {
    setGroceryPromptOpen(false)
    router.push('/tonight/recipe')
  }, [router])

  const h = new Date().getHours()
  const mealLabel = h < 14 ? "Today's lunch pick" : "Tonight's pick"

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {mealLabel}
        </h2>
        {meal && !loading && (
          <button
            onClick={() => void handleSwap()}
            disabled={swapping}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`h-3 w-3 ${swapping ? 'animate-spin' : ''}`} />
            Swap
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-white border border-border/60 p-6"
          >
            <div className="h-5 w-2/3 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-muted/60 rounded-lg animate-pulse mt-3" />
            <div className="flex gap-2 mt-4">
              <div className="h-7 w-16 bg-muted/40 rounded-full animate-pulse" />
              <div className="h-7 w-20 bg-muted/40 rounded-full animate-pulse" />
            </div>
          </motion.div>
        ) : meal ? (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-white border border-border/60 overflow-hidden shadow-sm"
          >
            {/* Meal image */}
            <div className="relative w-full h-40 overflow-hidden">
              {meal.imageUrl ? (
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-amber-50 to-orange-100 flex items-center justify-center">
                  <span className="text-5xl">🍽️</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground leading-snug">
                {meal.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {meal.tagline}
              </p>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/[0.06] text-primary border border-primary/15 rounded-full px-2.5 py-1">
                  <Clock className="h-3 w-3" />
                  {meal.totalTime}m
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground rounded-full px-2.5 py-1 capitalize">
                  <ChefHat className="h-3 w-3" />
                  {meal.difficulty}
                </span>
                {meal.tags?.includes('kid-friendly') && (
                  <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full px-2.5 py-1">
                    👶 Kid-friendly
                  </span>
                )}
                {meal.meta.pantryUtilization > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200/60 rounded-full px-2.5 py-1">
                    <Flame className="h-3 w-3" />
                    {Math.round(meal.meta.pantryUtilization * 100)}% pantry
                  </span>
                )}
              </div>

              {/* Selection reason */}
              {meal.meta.selectionReason && (
                <p className="mt-3 text-xs text-muted-foreground/80 italic leading-relaxed">
                  &ldquo;{meal.meta.selectionReason}&rdquo;
                </p>
              )}
            </div>

            {/* Action buttons */}
            {cooked ? (
              <div className="border-t border-border/60 py-3.5 text-center">
                <p className="text-sm font-medium text-primary">Enjoy your meal! ✨</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 border-t border-border/60">
                <button
                  onClick={handleCook}
                  className="flex items-center justify-center gap-2 py-3.5 hover:bg-primary/[0.04] transition-colors"
                >
                  <ChefHat className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Cook this</span>
                </button>
                <button
                  onClick={handleOrder}
                  className="flex items-center justify-center gap-2 py-3.5 border-l border-border/60 hover:bg-blue-50/50 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Order</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-border/60 bg-white p-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load a suggestion right now.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grocery prompt after Cook */}
      <Dialog open={groceryPromptOpen} onOpenChange={setGroceryPromptOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Add to grocery list? 🛒</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              We can add the ingredients for <span className="font-semibold">{meal?.title}</span> to your grocery list.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleAddToGrocery}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold py-3 text-sm hover:from-emerald-600 hover:to-green-600 transition-all"
            >
              Yes, add ingredients
            </button>
            <button
              onClick={handleSkipGrocery}
              className="w-full text-sm text-muted-foreground py-2"
            >
              Skip, show me the recipe
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
