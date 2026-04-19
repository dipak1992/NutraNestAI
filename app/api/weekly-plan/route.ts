// ============================================================
// API: POST /api/weekly-plan
// Generates 7 unique SmartMealResults using the smart engine,
// then builds a full grocery list for the week.
// ============================================================

import { NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { buildGroceryList } from '@/lib/planner/grocery'
import { getPaywallStatus } from '@/lib/paywall/server'
import { FREE_PLAN_PREVIEW_DAYS } from '@/lib/paywall/config'
import { createClient } from '@/lib/supabase/server'
import { getUserDietaryPrefs, applyPrefsToEngineRequest } from '@/lib/meal-engine/preferences'
import type { SmartMealRequest } from '@/lib/engine/types'
import type { LearnedBoosts } from '@/lib/learning/types'
import type { StoreFormat } from '@/lib/planner/types'
import { buildFamilyEngineOverrides, getFamilyMembers, mergeUnique } from '@/lib/family/service'

interface WeeklyPlanRequest {
  baseRequest: SmartMealRequest
  learnedBoosts?: LearnedBoosts | null
  storeFormat?: StoreFormat
  weekStart: string
  pantryItems?: string[]
}

export async function POST(req: Request) {
  try {
    const paywall = await getPaywallStatus()

    if (!paywall.isAuthenticated) {
      return NextResponse.json(
        { error: 'Login required to generate a weekly plan' },
        { status: 401 },
      )
    }

    const body = (await req.json()) as WeeklyPlanRequest

    if (!body.baseRequest?.household) {
      return NextResponse.json(
        { error: 'Missing required field: baseRequest.household' },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const prefs = user ? await getUserDietaryPrefs(user.id) : null
    const { baseRequest: rawBaseRequest, learnedBoosts, storeFormat = 'standard', weekStart, pantryItems = [] } = body
    const baseRequest = prefs ? applyPrefsToEngineRequest(rawBaseRequest, prefs) : rawBaseRequest

    let familyOverrides: ReturnType<typeof buildFamilyEngineOverrides> | null = null
    if (user && paywall.isFamily) {
      try {
        const members = await getFamilyMembers(supabase as any, user.id)
        if (members.length > 0) {
          familyOverrides = buildFamilyEngineOverrides(members)
        }
      } catch {
        // Non-fatal: keep current planner fallback behavior.
      }
    }

    const household = familyOverrides?.household ?? baseRequest.household
    const { adultsCount = 1, kidsCount = 0, toddlersCount = 0, babiesCount = 0 } = household
    if (adultsCount + kidsCount + toddlersCount + babiesCount === 0) {
      return NextResponse.json(
        { error: 'Household must have at least one member' },
        { status: 400 },
      )
    }

    // Generate 7 unique meals — each excludes previously chosen ids for variety
    const meals = []
    const usedIds: string[] = []

    for (let i = 0; i < 7; i++) {
      const meal = generateSmartMeal(
        {
          ...baseRequest,
          allergies: mergeUnique(baseRequest.allergies, familyOverrides?.allergies),
          dietaryRestrictions: mergeUnique(baseRequest.dietaryRestrictions, familyOverrides?.dietaryRestrictions),
          cuisinePreferences: mergeUnique(baseRequest.cuisinePreferences, familyOverrides?.cuisinePreferences),
          preferredProteins: mergeUnique(baseRequest.preferredProteins, familyOverrides?.preferredProteins),
          pickyEater: familyOverrides?.pickyEater?.active
            ? {
                active: true,
                dislikedFoods: mergeUnique(baseRequest.pickyEater?.dislikedFoods, familyOverrides.pickyEater.dislikedFoods),
              }
            : baseRequest.pickyEater,
          household: { adultsCount, kidsCount, toddlersCount, babiesCount },
          excludeIds: usedIds,
        },
        learnedBoosts,
      )
      meals.push(meal)
      usedIds.push(meal.id)
    }

    // Build grocery list from all 7 meals combined
    const groceryList = buildGroceryList(meals, pantryItems, storeFormat, weekStart)

    if (!paywall.isPro) {
      const previewDays = paywall.effectivePlanPreviewDays ?? FREE_PLAN_PREVIEW_DAYS
      // Strip locked meals to a teaser payload — enough to render a blurred
      // card (title, cuisine, time) but not enough to cook from.
      const teaseredMeals = meals.map((meal, i) => {
        if (i < previewDays) return meal
        return {
          ...meal,
          description: '',
          ingredients: [],
          steps: [],
          variations: [],
          shoppingList: [],
          leftoverTip: null,
          estimatedCost: 0,
          isLocked: true,
        }
      })
      return NextResponse.json({
        meals: teaseredMeals,
        groceryList: null,
        isPreview: true,
        previewDays,
      })
    }

    return NextResponse.json({
      meals,
      groceryList,
      isPreview: false,
      previewDays: 7,
    })
  } catch (error) {
    console.error('[WeeklyPlan] Engine error:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly plan' },
      { status: 500 },
    )
  }
}
