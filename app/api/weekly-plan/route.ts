// ============================================================
// API: POST /api/weekly-plan
// Generates 7 unique SmartMealResults using the smart engine,
// then builds a full grocery list for the week.
// ============================================================

import { NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { buildGroceryList } from '@/lib/planner/grocery'
import type { SmartMealRequest } from '@/lib/engine/types'
import type { LearnedBoosts } from '@/lib/learning/types'
import type { StoreFormat } from '@/lib/planner/types'

interface WeeklyPlanRequest {
  baseRequest: SmartMealRequest
  learnedBoosts?: LearnedBoosts | null
  storeFormat?: StoreFormat
  weekStart: string
  pantryItems?: string[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WeeklyPlanRequest

    if (!body.baseRequest?.household) {
      return NextResponse.json(
        { error: 'Missing required field: baseRequest.household' },
        { status: 400 },
      )
    }

    const { baseRequest, learnedBoosts, storeFormat = 'standard', weekStart, pantryItems = [] } = body

    const { adultsCount = 1, kidsCount = 0, toddlersCount = 0, babiesCount = 0 } = baseRequest.household
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

    return NextResponse.json({ meals, groceryList })
  } catch (error) {
    console.error('[WeeklyPlan] Engine error:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly plan' },
      { status: 500 },
    )
  }
}
