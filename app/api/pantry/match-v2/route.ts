import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited, apiSuccess, withErrorHandler } from '@/lib/api-response'
import { MEAL_DATABASE } from '@/lib/engine/meals'
import {
  filterMealsForPantry,
  rankPantryMeals,
  calculateTrustScore,
} from '@/lib/pantry/constraint-engine'
import type { SmartMealRequest } from '@/lib/engine/types'
import type { PantryMatchResponse } from '@/lib/pantry/types'

interface PantryMatchV2Body {
  // From vision scan or manual entry
  confirmed: string[]            // High confidence
  probable?: string[]            // Medium confidence (optional)
  
  // User preferences (all still apply)
  household: SmartMealRequest['household']
  allergies?: string[]
  dietaryRestrictions?: string[]
  budget?: 'low' | 'medium' | 'high'
  maxCookTime?: number
  
  // Control behavior
  includeProbable?: boolean      // If false, only use confirmed items
  maxMissingForAlmostReady?: number // Default 1
}

export const POST = withErrorHandler('pantry/match-v2', async (req: Request) => {
  const nextReq = req as unknown as NextRequest
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(nextReq), limit: 20, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const body = (await req.json()) as PantryMatchV2Body
  
  // Validate required fields
  if (!Array.isArray(body.confirmed) || body.confirmed.length === 0) {
    return apiError('confirmed items array required and cannot be empty', 400)
  }
  if (!body.household) {
    return apiError('household data required', 400)
  }

  // Build available pantry list
  // Confirmed items always included
  // Probable items included only if requested
  const available = [
    ...body.confirmed.map(i => i.toLowerCase().trim()),
    ...(body.includeProbable ? body.probable?.map(i => i.toLowerCase().trim()) ?? [] : []),
  ].filter(Boolean)

  const maxMissing = body.maxMissingForAlmostReady ?? 1

  // ── Filter meals by constraints ──────────────────────────

  // Step 1: Filter by allergies and dietary restrictions (hard constraints)
  const candidates = MEAL_DATABASE.filter(meal => {
    // Allergen check
    if (body.allergies?.length) {
      for (const allergy of body.allergies) {
        const allergyLower = allergy.toLowerCase()
        const allergyTerms = getAllergyTerms(allergyLower)
        for (const ing of meal.ingredients) {
          const ingLower = ing.name.toLowerCase()
          if (allergyTerms.some(t => ingLower.includes(t))) {
            return false // Skip this meal
          }
        }
      }
    }

    // Dietary restriction check
    if (body.dietaryRestrictions?.length) {
      for (const restriction of body.dietaryRestrictions) {
        const restrictionLower = restriction.toLowerCase()
        if (restrictionLower === 'vegetarian' && isNonVegetarian(meal)) {
          return false
        }
        if (restrictionLower === 'vegan' && !isVegan(meal)) {
          return false
        }
        if (restrictionLower === 'pescatarian' && meal.proteinType === 'beef' || meal.proteinType === 'pork' || meal.proteinType === 'chicken') {
          return false
        }
      }
    }

    return true
  })

  // Step 2: Categorize by pantry match (make_now, almost_ready, shopping_upgrade)
  const classified = filterMealsForPantry(candidates, available, maxMissing, true)

  // Step 3: Rank by category and confidence
  const ranked = rankPantryMeals(classified)

  // Step 4: Apply remaining filters (budget, time, etc)
  let filtered = ranked.filter(r => {
    if (body.budget) {
      const levels = { low: 1, medium: 2, high: 3 }
      const mealCostLevel = r.estimatedCost < 10 ? 'low' : r.estimatedCost < 20 ? 'medium' : 'high'
      if (levels[mealCostLevel] > levels[body.budget]) {
        return false
      }
    }

    if (body.maxCookTime && r.totalTime > body.maxCookTime) {
      return false
    }

    return true
  })

  // ── Build response ──────────────────────────────────────

  const makeNow = filtered.filter(r => r.type === 'make_now').slice(0, 3)
  const almostReady = filtered.filter(r => r.type === 'almost_ready').slice(0, 3)
  const shoppingUpgrade = filtered.filter(r => r.type === 'shopping_upgrade').slice(0, 3)

  const totalFiltered = makeNow.length + almostReady.length + shoppingUpgrade.length
  const avgConfidence = totalFiltered > 0
    ? Math.round(filtered.slice(0, 9).reduce((sum, r) => sum + r.confidence, 0) / Math.min(totalFiltered, 9))
    : 0

  const trustScore = calculateTrustScore(available.length, totalFiltered, avgConfidence)

  const response: PantryMatchResponse = {
    statusCode: totalFiltered > 0 ? 200 : 207,
    scannedIngredients: {
      confirmed: body.confirmed,
      probable: body.probable ?? [],
      uncertain: [],
      manuallyAdded: [],
      lastUpdated: new Date().toISOString(),
    },
    suggestions: {
      make_now: makeNow,
      almost_ready: almostReady,
      shopping_upgrade: shoppingUpgrade,
    },
    trustScore,
    editIngredientsSuggested: makeNow.length < 2,
  }

  return apiSuccess(response, response.statusCode === 207 ? 207 : 200)
})

// ── Helper functions ────────────────────────────────────────

function getAllergyTerms(allergy: string): string[] {
  const terms: Record<string, string[]> = {
    peanuts: ['peanut', 'peanut butter'],
    tree_nuts: ['almond', 'walnut', 'cashew', 'pecan', 'nut'],
    milk: ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
    eggs: ['egg', 'mayo'],
    wheat: ['flour', 'bread', 'pasta', 'noodle'],
    soy: ['soy sauce', 'tofu', 'edamame'],
    fish: ['salmon', 'tuna', 'cod', 'fish'],
    shellfish: ['shrimp', 'crab', 'lobster'],
    sesame: ['sesame'],
    honey: ['honey'],
  }
  return terms[allergy] ?? [allergy]
}

function isNonVegetarian(meal: any): boolean {
  const vegetarian = ['tofu', 'tempeh', 'beans', 'lentils', 'chickpea', 'vegetable']
  return !meal.proteinType.split(',').some((p: string) => 
    vegetarian.some(v => p.toLowerCase().includes(v))
  )
}

function isVegan(meal: any): boolean {
  const nonVegan = ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'eggs', 'milk', 'cheese', 'cream', 'butter', 'yogurt']
  const protein = meal.proteinType.toLowerCase()
  return !nonVegan.some(nv => protein.includes(nv))
}
