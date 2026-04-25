'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { useLearningStore } from '@/lib/learning/store'
import { buildGroceryList } from '@/lib/planner/grocery'
import { DAY_FULL } from '@/lib/planner/types'
import posthog from 'posthog-js'
import { Analytics } from '@/lib/analytics'

import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { WeeklyPlannerGrid } from './WeeklyPlannerGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Sparkles,
  ShoppingCart,
  Loader2,
  CalendarDays,
  RefreshCcw,
  Globe,
} from 'lucide-react'
import type { SmartMealRequest, SmartMealResult } from '@/lib/engine/types'
import type { WeeklyPlan } from '@/lib/planner/types'

interface WeeklyPlanResponse {
  meals: SmartMealResult[]
  groceryList: ReturnType<typeof buildGroceryList> | null
  isPreview: boolean
  previewDays: number
}

// ── Request builder ───────────────────────────────────────────

function buildDateLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(weekStart + 'T00:00:00')
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

// ── Main component ────────────────────────────────────────────

export function WeeklyPlannerV2() {
  const router = useRouter()
  const { status, loading: paywallLoading } = usePaywallStatus()
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [showPlannerLock, setShowPlannerLock] = useState(false)

  const {
    plan,
    selectedDayIndex,
    groceryList,
    storeFormat,
    isGeneratingWeek,
    generatingDayIndex,
    setPlan,
    setSelectedDayIndex,
    setGroceryList,
    setIsGeneratingWeek,
    setGeneratingDayIndex,
    clearPlan,
    clearGrocery,
  } = useWeeklyPlanStore()

  const {
    hasKids,
    pickyEater,
    dislikedFoods,
    cuisines,
    lowEnergy,
    country,
    cookingTimeMinutes,
    householdType,
  } = useLightOnboardingStore()

  const getBoosts = useLearningStore((s) => s.getBoosts)
  const feedbackHistory = useLearningStore((s) => s.feedbackHistory)
  const { state: { members } } = useOnboardingStore()
  const mealsPlanned = plan.days.filter((d) => d.meal !== null).length

  // ── Personalized paywall copy ─────────────────────────────
  const memberCount = members?.length || (householdType === 'solo' ? 1 : householdType === 'couple' ? 2 : 3)
  const savedMeals = (feedbackHistory ?? []).filter((f: { action?: string }) => f.action === 'save').length
  const explored = (feedbackHistory ?? []).length

  const personalizedInlineTitle = memberCount > 1
    ? `Your free preview covers 3 dinners — but your family of ${memberCount} deserves the full week`
    : 'Your free preview stops after 3 dinners'

  const personalizedInlineDesc = savedMeals > 0
    ? `You've saved ${savedMeals} meal${savedMeals !== 1 ? 's' : ''} so far. Start a 7-day free trial to build a full week around them — with the grocery list and Pantry Magic included.`
    : 'You\'ve seen the value. Start a 7-day free trial to unlock every day, the full grocery list, and Pantry Magic.'

  const personalizedDialogTitle = memberCount > 1
    ? `${memberCount} mouths to feed — let MealEase handle the whole week`
    : 'Ready to stop thinking about dinner?'

  const personalizedDialogDesc = explored > 0
    ? `You've explored ${explored} meal${explored !== 1 ? 's' : ''}${savedMeals > 0 ? ` and saved ${savedMeals}` : ''}. Unlock 7 days of personalized meals, a smart grocery list, and Pantry Magic — for less than one takeout order.`
    : 'Unlock 7 days of personalized meals, a smart grocery list, and Pantry Magic — for less than one takeout order.'

  useEffect(() => {
    if (!status.isPro && selectedDayIndex >= (status.effectivePlanPreviewDays ?? 3)) {
      setSelectedDayIndex(0)
    }
  }, [selectedDayIndex, setSelectedDayIndex, status.isPro])

  // ── Build SmartMealRequest from onboarding prefs ──────────
  const buildRequest = useCallback(
    (excludeIds?: string[]): SmartMealRequest => {
      const adultsCount =
        householdType === 'solo' ? 1 : householdType === 'couple' ? 2 : 2
      const kidsCount = hasKids ? 1 : 0
      return {
        household: { adultsCount, kidsCount, toddlersCount: 0, babiesCount: 0 },
        cuisinePreferences: cuisines.length > 0 ? cuisines : undefined,
        lowEnergy,
        locality: country || undefined,
        maxCookTime: cookingTimeMinutes > 0 ? cookingTimeMinutes : 45,
        pickyEater: pickyEater ? { active: true, dislikedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined } : undefined,
        excludeIds,
      }
    },
    [hasKids, pickyEater, dislikedFoods, cuisines, lowEnergy, country, cookingTimeMinutes, householdType],
  )

  // ── Generate full week ────────────────────────────────────
  const handleGenerateWeek = useCallback(async () => {
    setIsGeneratingWeek(true)
    try {
      const res = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseRequest: buildRequest(),
          learnedBoosts: getBoosts(),
          storeFormat,
          weekStart: plan.weekStart,
        }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Log in to generate your weekly plan.')
          router.push('/login?redirect=/planner')
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const data = (await res.json()) as WeeklyPlanResponse

      const newPlan: WeeklyPlan = {
        ...plan,
        days: plan.days.map((day, i) => ({
          ...day,
          meal: data.meals[i] ?? null,
        })),
        generatedAt: new Date().toISOString(),
      }
      setPlan(newPlan)

      if (data.groceryList) {
        setGroceryList(data.groceryList)
      } else {
        clearGrocery()
      }

      if (data.isPreview) {
        setShowPlannerLock(true)
        setPaywallOpen(true)
        toast.success('3-day preview ready!', {
          description: 'Upgrade to Pro to unlock the full week and grocery list.',
        })
      } else {
        setShowPlannerLock(false)
        if (status.isFamily) {
          posthog.capture(Analytics.FAMILY_PLAN_GENERATED, {
            household_size: memberCount,
            planned_days: 7,
          })
        }
        toast.success('Week planned!', { description: '7 meals + grocery list ready.' })
      }
    } catch {
      toast.error('Hmm, that didn\'t work. Give it another try?')
    } finally {
      setIsGeneratingWeek(false)
    }
  }, [
    plan,
    storeFormat,
    buildRequest,
    getBoosts,
    setPlan,
    setGroceryList,
    setIsGeneratingWeek,
    clearGrocery,
    router,
  ])

  // ── Regenerate a single day ───────────────────────────────
  const handleRegenerateDay = useCallback(
    async (dayIndex: number) => {
      if (!status.isPro && dayIndex >= (status.effectivePlanPreviewDays ?? 3)) {
        setPaywallOpen(true)
        return
      }

      setGeneratingDayIndex(dayIndex)
      try {
        const existingIds = plan.days
          .filter((d) => d.meal !== null && d.dayIndex !== dayIndex)
          .map((d) => d.meal!.id)

        const res = await fetch('/api/smart-meal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...buildRequest(existingIds),
            learnedBoosts: getBoosts(),
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const meal: SmartMealResult = await res.json()

        const newPlan: WeeklyPlan = {
          ...plan,
          days: plan.days.map((d) =>
            d.dayIndex === dayIndex ? { ...d, meal } : d
          ),
        }
        setPlan(newPlan)

        // Rebuild grocery list if one already exists
        if (groceryList) {
          const allMeals = newPlan.days
            .filter((d) => d.meal !== null)
            .map((d) => d.meal!)
          const pantryNames = groceryList.items
            .filter((i) => i.isInPantry)
            .map((i) => i.name)
          const newGrocery = buildGroceryList(allMeals, pantryNames, storeFormat, plan.weekStart)
          setGroceryList(newGrocery)
        }

        toast.success(`${DAY_FULL[dayIndex]} updated!`)
      } catch {
        toast.error('That swap didn\'t go through — try once more.')
      } finally {
        setGeneratingDayIndex(null)
      }
    },
    [
      plan,
      groceryList,
      storeFormat,
      buildRequest,
      getBoosts,
      setPlan,
      setGroceryList,
      setGeneratingDayIndex,
      status.isPro,
    ],
  )

  // ── "Get everything" → ensure grocery list then navigate ─
  const handleGetEverything = useCallback(async () => {
    if (!status.isPro) {
      setPaywallOpen(true)
      return
    }

    const mealsWithFood = plan.days.filter((d) => d.meal !== null)
    if (mealsWithFood.length === 0) {
      toast.error('Generate your week first!', {
        description: 'Tap "Generate Week" to plan your meals.',
      })
      return
    }
    if (!groceryList) {
      // Build grocery list from current meals on the fly
      const meals = mealsWithFood.map((d) => d.meal!)
      const list = buildGroceryList(meals, [], storeFormat, plan.weekStart)
      setGroceryList(list)
    }
    router.push('/grocery-list')
  }, [plan, groceryList, storeFormat, setGroceryList, router, status.isPro])

  // ── Publish plan as public shareable link ─────────────────
  const handlePublishPlan = useCallback(async () => {
    if (!status.isPro) {
      setPaywallOpen(true)
      return
    }

    if (mealsPlanned === 0) {
      toast.error('Generate your week first!')
      return
    }
    try {
      const res = await fetch('/api/content/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) throw new Error('Failed to publish')
      const { slug } = await res.json() as { slug: string }
      const url = `${window.location.origin}/share/plan/${slug}`
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Plan published! Link copied.', { description: url })
      } catch {
        toast.success('Plan published!', { description: `Share: ${url}` })
      }
    } catch {
      toast.error('Couldn\'t share right now — try again in a moment.')
    }
  }, [plan, mealsPlanned, status.isPro])

  const weekLabel = buildDateLabel(plan.weekStart)
  const lockedDayIndexes = !status.isPro && mealsPlanned > 0
    ? plan.days.slice(status.effectivePlanPreviewDays ?? 3).map((day) => day.dayIndex)
    : []

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Weekly Meal Plan</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {weekLabel}
            {mealsPlanned > 0 && (
              <span className="ml-2">
                <Badge variant="secondary" className="text-xs">
                  {mealsPlanned}/7 planned
                </Badge>
              </span>
            )}
          </p>
          {!paywallLoading && !status.isPro && (
            <p className="mt-1 text-xs text-amber-700">
              Free includes instant previews, {status.freeTonightSwipeLimit} Tonight swipes, and {status.effectivePlanPreviewDays} planned dinners.
            </p>
          )}
        </div>

        <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {mealsPlanned > 0 && (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" className="text-muted-foreground" />}>
                <RefreshCcw className="h-4 w-4 mr-1.5" />
                Clear
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear this week's plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {mealsPlanned} planned meal{mealsPlanned !== 1 ? 's' : ''}. You can generate a new plan anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { clearPlan(); toast('Plan cleared.') }}>
                    Clear plan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {mealsPlanned > 0 && (
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="sm" onClick={handlePublishPlan} />}>
                <Globe className="h-4 w-4 mr-1.5" />
                Publish plan
              </TooltipTrigger>
              <TooltipContent>Share a public link to your weekly plan</TooltipContent>
            </Tooltip>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleGenerateWeek}
            disabled={isGeneratingWeek || generatingDayIndex !== null}
          >
            {isGeneratingWeek ? (
              <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-1.5" />{mealsPlanned > 0 ? 'Regenerate Week' : 'Generate Week'}</>
            )}
          </Button>

          <Button
            variant={mealsPlanned > 0 ? 'default' : 'outline'}
            size="sm"
            onClick={handleGetEverything}
            disabled={isGeneratingWeek}
            className={mealsPlanned > 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Get everything for this week
            {groceryList && (
              <Badge
                className="ml-1.5 bg-white/20 text-white text-xs border-0 px-1.5 py-0"
              >
                {groceryList.items.filter((i) => !i.isInPantry).length}
              </Badge>
            )}
          </Button>
        </div>
        </TooltipProvider>
      </div>

      {/* ── Planner grid ── */}
      <WeeklyPlannerGrid
        days={plan.days}
        selectedDayIndex={selectedDayIndex}
        generatingDayIndex={generatingDayIndex}
        lockedDayIndexes={lockedDayIndexes}
        onSelectDay={setSelectedDayIndex}
        onLockedDayClick={() => setPaywallOpen(true)}
        onRegenerate={handleRegenerateDay}
      />

      {!paywallLoading && !status.isPro && (showPlannerLock || mealsPlanned > 0) && (
        <ProPaywallCard
          title={personalizedInlineTitle}
          description={personalizedInlineDesc}
          isAuthenticated={status.isAuthenticated}
          redirectPath="/planner"
        />
      )}

      {/* ── Empty state hint ── */}
      {mealsPlanned === 0 && !isGeneratingWeek && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <p className="mb-2">No meals planned yet for this week.</p>
          <p>
            Tap <strong className="text-foreground">Generate Week</strong> to auto-plan 7 unique dinners
            based on your preferences.
          </p>
        </div>
      )}

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title={personalizedDialogTitle}
        description={personalizedDialogDesc}
        isAuthenticated={status.isAuthenticated}
        redirectPath="/planner"
      />
    </div>
  )
}
