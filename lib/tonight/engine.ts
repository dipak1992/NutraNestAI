/**
 * Unified Tonight Engine
 * 
 * Single canonical source for Tonight meal suggestions.
 * Serves two contexts:
 * 
 * 1. Landing page (public, no auth) — curated daily rotation
 * 2. Dashboard (authenticated) — free generic OR plus personalized
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Plan, TonightState, Recipe } from '@/lib/dashboard/types'
import {
  type CuratedMeal,
  TONIGHT_CATALOG,
  WEEKDAY_THEMES,
  getMealsByTheme,
  getMealImage,
  dailyHash,
  pickDailyMeal,
  getMealDayOfWeek,
} from './catalog'

// ─── LANDING PAGE ENGINE ────────────────────────────────────────────────────────

export type LandingTonightMeal = {
  id: string
  name: string
  tagline: string
  cookTimeMin: number
  benefits: string[]
  image: string
  category: string
  weekdayLabel: string
}

/**
 * Get today's landing page meal.
 * Deterministic per day — same meal shown to all visitors all day.
 * Changes at 7am CT based on weekday theme.
 */
export function getLandingTonightMeal(): LandingTonightMeal {
  const day = getMealDayOfWeek()
  const { theme, label } = WEEKDAY_THEMES[day]
  const themed = getMealsByTheme(theme)
  const meal = pickDailyMeal(themed, 'landing-public')

  return {
    id: meal.id,
    name: meal.name,
    tagline: meal.tagline,
    cookTimeMin: meal.cookTimeMin,
    benefits: meal.benefits,
    image: getMealImage(meal),
    category: meal.category,
    weekdayLabel: label,
  }
}

// ─── DASHBOARD ENGINE ───────────────────────────────────────────────────────────

type PersonalizationContext = {
  dietary: string[]
  cuisines: string[]
  goals: string[]
  pantry: string[]
  groceryItems: string[]
  leftovers: string[]
  savedMeals: string[]
  dislikes: string[]
  weeklyBudget: number | null
  weekSpent: number
  maxCookTimeMin: number | null
}

/** Convert CuratedMeal → TonightState for dashboard consumption */
function toTonightState(meal: CuratedMeal, reason: string, extras?: Partial<TonightState>): TonightState {
  const recipe: Recipe = {
    id: meal.id,
    name: meal.name,
    image: getMealImage(meal),
    cookTimeMin: meal.cookTimeMin,
    difficulty: meal.difficulty,
    servings: meal.servings,
    costTotal: Math.round(meal.costPerServing * meal.servings * 100) / 100,
    costPerServing: meal.costPerServing,
    tags: meal.tags,
    chefVerified: meal.chefVerified ?? true, // All curated catalog meals are chef-verified
  }

  return {
    recipe,
    reason,
    alternativesAvailable: 3,
    isFromPantry: meal.weekdayTheme === 'pantry',
    usesLeftover: null,
    ...extras,
  }
}

/**
 * Get tonight suggestion for FREE users.
 * Deterministic per user per day. Themed by weekday.
 */
export function getFreeTonightSuggestion(userId: string): TonightState {
  const day = getMealDayOfWeek()
  const { theme, reason } = WEEKDAY_THEMES[day]
  const themed = getMealsByTheme(theme)
  const meal = pickDailyMeal(themed, `free:${userId}`)

  return toTonightState(meal, reason, { alternativesAvailable: 3 })
}

/**
 * Get tonight suggestion for PLUS users.
 * Personalized based on preferences, pantry, leftovers, grocery items, budget.
 */
export async function getPlusTonightSuggestion(
  supabase: SupabaseClient,
  userId: string,
): Promise<TonightState> {
  const day = getMealDayOfWeek()
  const { theme } = WEEKDAY_THEMES[day]

  try {
    const context = await loadPersonalizationContext(supabase, userId)
    const themed = getMealsByTheme(theme)
    const allMeals = themed.length >= 2 ? themed : TONIGHT_CATALOG

    // Try personalization in priority order
    const personalized = personalizeSelection(allMeals, context, userId)

    return toTonightState(personalized.meal, personalized.reason, {
      alternativesAvailable: 99,
      isFromPantry: personalized.isFromPantry,
      usesLeftover: personalized.usesLeftover,
    })
  } catch {
    // Fallback: deterministic daily pick per user from plus pool
    const themed = getMealsByTheme(theme)
    const meal = pickDailyMeal(themed.length ? themed : TONIGHT_CATALOG, `plus:${userId}`)
    return toTonightState(meal, WEEKDAY_THEMES[day].reason, { alternativesAvailable: 99 })
  }
}

/**
 * Get a swap suggestion (no-repeat guarantee).
 * For plus users: respects dietary restrictions and dislikes.
 * Returns a different meal from the same theme, excluding already-seen IDs.
 */
export function getSwapSuggestion(
  userId: string,
  excludeIds: string[],
  plan: Plan,
  context?: Pick<PersonalizationContext, 'dietary' | 'dislikes' | 'cuisines'>,
): TonightState {
  const day = getMealDayOfWeek()
  const { theme, reason } = WEEKDAY_THEMES[day]
  const themed = getMealsByTheme(theme)

  // Filter out already-seen meals
  let available = themed.filter((m) => !excludeIds.includes(m.id))

  // For plus/family users with context: also filter dislikes and dietary
  if (context && (plan === 'plus' || plan === 'family')) {
    available = applyHardFilters(available, context)
    // If filtering leaves nothing, fall back to just exclude-filtered pool
    if (available.length === 0) {
      available = themed.filter((m) => !excludeIds.includes(m.id))
    }
  }

  // If all themed meals exhausted, pull from full catalog
  const pool = available.length > 0
    ? available
    : TONIGHT_CATALOG.filter((m) => !excludeIds.includes(m.id))

  // If truly exhausted (unlikely with 21 meals), wrap around
  const finalPool = pool.length > 0 ? pool : TONIGHT_CATALOG

  const offset = excludeIds.length
  const meal = finalPool[dailyHash(`${userId}:swap:${offset}`) % finalPool.length]

  return toTonightState(meal, reason, {
    alternativesAvailable: plan === 'plus' || plan === 'family' ? 99 : Math.max(0, 3 - excludeIds.length),
  })
}

// ─── PERSONALIZATION LOGIC ──────────────────────────────────────────────────────

type PersonalizedResult = {
  meal: CuratedMeal
  reason: string
  isFromPantry: boolean
  usesLeftover: { leftoverId: string; leftoverName: string } | null
}

/**
 * Apply hard dietary/dislike filters to a pool.
 * Returns filtered pool (may be empty if nothing passes).
 */
function applyHardFilters(
  pool: CuratedMeal[],
  context: Pick<PersonalizationContext, 'dietary' | 'dislikes'>,
): CuratedMeal[] {
  let filtered = pool

  // Filter out dislikes
  if (context.dislikes.length > 0) {
    filtered = filtered.filter((m) =>
      !context.dislikes.some((d) =>
        m.name.toLowerCase().includes(d.toLowerCase()) ||
        m.keyIngredients.some((ing) => ing.toLowerCase().includes(d.toLowerCase()))
      )
    )
  }

  // Filter vegetarian/vegan
  const lowerDietary = context.dietary.map((d) => d.toLowerCase())
  if (lowerDietary.includes('vegan')) {
    const vegan = filtered.filter((m) => m.tags.includes('vegan') || m.tags.includes('vegetarian'))
    if (vegan.length > 0) filtered = vegan
  } else if (lowerDietary.includes('vegetarian')) {
    const veg = filtered.filter((m) => m.tags.includes('vegetarian'))
    if (veg.length > 0) filtered = veg
  }

  return filtered
}

function personalizeSelection(
  pool: CuratedMeal[],
  context: PersonalizationContext,
  userId: string,
): PersonalizedResult {
  // Apply hard filters first (dislikes + dietary)
  const safePool = applyHardFilters(pool, context).length > 0
    ? applyHardFilters(pool, context)
    : pool

  // Priority 1: Use leftovers — highest value signal
  if (context.leftovers.length > 0) {
    const leftoverMatch = findIngredientMatch(safePool, context.leftovers)
    if (leftoverMatch) {
      return {
        meal: leftoverMatch.meal,
        reason: `Uses your leftover ${leftoverMatch.matched} — less waste, more flavor.`,
        isFromPantry: true,
        usesLeftover: { leftoverId: 'context-leftover', leftoverName: leftoverMatch.matched },
      }
    }
  }

  // Priority 2: Match pantry ingredients
  if (context.pantry.length > 0) {
    const pantryMatch = findIngredientMatch(safePool, context.pantry)
    if (pantryMatch) {
      return {
        meal: pantryMatch.meal,
        reason: `Matches the ${pantryMatch.matched} you already have — no extra shopping needed.`,
        isFromPantry: true,
        usesLeftover: null,
      }
    }
  }

  // Priority 3: Match grocery items already bought
  if (context.groceryItems.length > 0) {
    const groceryMatch = findIngredientMatch(safePool, context.groceryItems)
    if (groceryMatch) {
      return {
        meal: groceryMatch.meal,
        reason: `Uses the ${groceryMatch.matched} already on your grocery list — cook it tonight.`,
        isFromPantry: true,
        usesLeftover: null,
      }
    }
  }

  // Priority 4: Budget constraint — if over 80% of weekly budget, pick cheapest
  if (context.weeklyBudget != null && context.weeklyBudget > 0) {
    const budgetRemaining = context.weeklyBudget - context.weekSpent
    const perMealBudget = context.weeklyBudget / 7
    if (budgetRemaining < perMealBudget * 1.5) {
      // Under budget pressure — find cheapest meal in safe pool
      const sorted = [...safePool].sort((a, b) => a.costPerServing - b.costPerServing)
      const budgetMeal = sorted[0]
      if (budgetMeal) {
        return {
          meal: budgetMeal,
          reason: `Budget-friendly pick — ~$${budgetMeal.costPerServing.toFixed(2)}/serving to keep your week on track.`,
          isFromPantry: false,
          usesLeftover: null,
        }
      }
    }
  }

  // Priority 5: Respect dietary preferences
  if (context.dietary.length > 0) {
    const dietaryMeal = findDietaryMatch(safePool, context.dietary)
    if (dietaryMeal) {
      return {
        meal: dietaryMeal,
        reason: `Aligned with your ${context.dietary[0]} preferences.`,
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Priority 6: Cuisine preference
  if (context.cuisines.length > 0) {
    const cuisineMeal = findCuisineMatch(safePool, context.cuisines)
    if (cuisineMeal) {
      return {
        meal: cuisineMeal,
        reason: `Matches your ${context.cuisines[0]} cuisine preference.`,
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Priority 7: Cook time constraint
  if (context.maxCookTimeMin != null) {
    const quickMeals = safePool.filter((m) => m.cookTimeMin <= context.maxCookTimeMin!)
    if (quickMeals.length > 0) {
      const meal = pickDailyMeal(quickMeals, `plus:${userId}`)
      return {
        meal,
        reason: `Ready in ${meal.cookTimeMin} minutes — fits your cooking time preference.`,
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Priority 8: Budget goal from profile
  if (context.goals.includes('save_money')) {
    const budgetMeal = safePool.find((m) => m.tags.includes('budget'))
    if (budgetMeal) {
      return {
        meal: budgetMeal,
        reason: 'Chosen to keep tonight affordable — aligned with your budget goal.',
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Fallback: per-user deterministic pick from safe pool
  const meal = pickDailyMeal(safePool, `plus:${userId}`)

  return {
    meal,
    reason: 'Personalized from your preferences, pantry, and meal history.',
    isFromPantry: false,
    usesLeftover: null,
  }
}

function findIngredientMatch(
  pool: CuratedMeal[],
  ingredients: string[],
): { meal: CuratedMeal; matched: string } | null {
  const lowerIngredients = ingredients.map((i) => i.toLowerCase())

  for (const meal of pool) {
    for (const key of meal.keyIngredients) {
      const keyLower = key.toLowerCase()
      const match = lowerIngredients.find((ing) =>
        ing.includes(keyLower) || keyLower.includes(ing)
      )
      if (match) {
        return { meal, matched: match }
      }
    }
  }
  return null
}

function findDietaryMatch(pool: CuratedMeal[], dietary: string[]): CuratedMeal | null {
  const lowerDietary = dietary.map((d) => d.toLowerCase())

  if (lowerDietary.includes('vegetarian') || lowerDietary.includes('vegan')) {
    return pool.find((m) => m.tags.includes('vegetarian')) ?? null
  }
  if (lowerDietary.includes('high-protein') || lowerDietary.includes('keto')) {
    return pool.find((m) => m.tags.includes('high-protein')) ?? null
  }
  if (lowerDietary.includes('gluten-free')) {
    return pool.find((m) => m.tags.includes('gluten-free')) ?? null
  }
  return null
}

function findCuisineMatch(pool: CuratedMeal[], cuisines: string[]): CuratedMeal | null {
  const lowerCuisines = cuisines.map((c) => c.toLowerCase())
  return pool.find((m) =>
    lowerCuisines.some((c) =>
      m.tags.some((t) => t.toLowerCase().includes(c)) ||
      m.name.toLowerCase().includes(c) ||
      m.category.toLowerCase().includes(c)
    )
  ) ?? null
}

// ─── DATA LOADING ───────────────────────────────────────────────────────────────

async function loadPersonalizationContext(
  supabase: SupabaseClient,
  userId: string,
): Promise<PersonalizationContext> {
  const context: PersonalizationContext = {
    dietary: [],
    cuisines: [],
    goals: [],
    pantry: [],
    groceryItems: [],
    leftovers: [],
    savedMeals: [],
    dislikes: [],
    weeklyBudget: null,
    weekSpent: 0,
    maxCookTimeMin: null,
  }

  // ── Load preferences — try household_preferences first (written by onboarding) ──
  const { data: householdPrefs } = await supabase
    .from('household_preferences')
    .select('dietary_restrictions, disliked_ingredients, cuisines, cooking_time_minutes, weekly_budget, goals')
    .eq('user_id', userId)
    .maybeSingle()

  if (householdPrefs) {
    context.dietary = Array.isArray(householdPrefs.dietary_restrictions)
      ? (householdPrefs.dietary_restrictions as string[]).filter(Boolean)
      : []
    context.dislikes = Array.isArray(householdPrefs.disliked_ingredients)
      ? (householdPrefs.disliked_ingredients as string[]).filter(Boolean)
      : []
    context.cuisines = Array.isArray(householdPrefs.cuisines)
      ? (householdPrefs.cuisines as string[]).filter(Boolean)
      : []
    if (typeof householdPrefs.cooking_time_minutes === 'number' && householdPrefs.cooking_time_minutes > 0) {
      context.maxCookTimeMin = householdPrefs.cooking_time_minutes
    }
    if (typeof householdPrefs.weekly_budget === 'number' && householdPrefs.weekly_budget > 0) {
      context.weeklyBudget = householdPrefs.weekly_budget
    }
    context.goals = Array.isArray(householdPrefs.goals)
      ? (householdPrefs.goals as string[]).filter(Boolean)
      : []
  }

  // ── Fallback: user_dietary_preferences (older table) ──
  if (context.dietary.length === 0 && context.dislikes.length === 0) {
    const { data: prefs } = await supabase
      .from('user_dietary_preferences')
      .select('eating_style, goals, dislikes')
      .eq('user_id', userId)
      .maybeSingle()

    if (prefs) {
      context.dietary = [prefs.eating_style].filter(Boolean) as string[]
      if (context.goals.length === 0) {
        context.goals = Array.isArray(prefs.goals) ? (prefs.goals as string[]) : []
      }
      context.dislikes = Array.isArray(prefs.dislikes) ? (prefs.dislikes as string[]) : []
    }
  }

  // ── Load budget from budgets table if not already set ──
  if (context.weeklyBudget === null) {
    const { data: budgetRow } = await supabase
      .from('budgets')
      .select('weekly_limit')
      .eq('user_id', userId)
      .maybeSingle()
    if (typeof budgetRow?.weekly_limit === 'number' && budgetRow.weekly_limit > 0) {
      context.weeklyBudget = budgetRow.weekly_limit
    }
  }

  // ── Load current week spend ──
  if (context.weeklyBudget != null) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const { data: weekRow } = await supabase
      .from('budget_weekly_spend')
      .select('spent')
      .eq('user_id', userId)
      .gte('week_start', weekStart.toISOString().slice(0, 10))
      .maybeSingle()
    context.weekSpent = typeof weekRow?.spent === 'number' ? weekRow.spent : 0
  }

  // ── Load household pantry ──
  const { data: household } = await supabase
    .from('households')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()

  if (household?.id) {
    const { data: pantry } = await supabase
      .from('pantry_items')
      .select('name')
      .eq('household_id', household.id)
      .limit(30)
    context.pantry = (pantry ?? []).map((item) => item.name as string).filter(Boolean)

    const { data: leftovers } = await supabase
      .from('leftovers')
      .select('display_name, main_ingredients')
      .eq('household_id', household.id)
      .eq('status', 'active')
      .limit(10)
    context.leftovers = (leftovers ?? []).flatMap((item) => [
      item.display_name as string,
      ...(Array.isArray(item.main_ingredients) ? (item.main_ingredients as string[]) : []),
    ]).filter(Boolean)
  }

  // ── Fallback: user-level leftovers ──
  if (context.leftovers.length === 0) {
    const { data: leftovers } = await supabase
      .from('leftovers')
      .select('name, main_ingredients')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(10)
    context.leftovers = (leftovers ?? []).flatMap((item) => [
      item.name as string,
      ...(Array.isArray(item.main_ingredients) ? (item.main_ingredients as string[]) : []),
    ]).filter(Boolean)
  }

  // ── Load grocery list items (things already bought / on list) ──
  const { data: groceryRows } = await supabase
    .from('grocery_list_items')
    .select('name')
    .eq('user_id', userId)
    .eq('checked', true)   // items already bought
    .limit(20)
  if (groceryRows && groceryRows.length > 0) {
    context.groceryItems = groceryRows.map((r) => r.name as string).filter(Boolean)
  } else {
    // Also try unchecked items — things on the list to buy tonight
    const { data: uncheckedRows } = await supabase
      .from('grocery_list_items')
      .select('name')
      .eq('user_id', userId)
      .eq('checked', false)
      .limit(20)
    context.groceryItems = (uncheckedRows ?? []).map((r) => r.name as string).filter(Boolean)
  }

  // ── Load saved meals for context ──
  const { data: saved } = await supabase
    .from('saved_meals')
    .select('title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  context.savedMeals = (saved ?? []).map((item) => item.title as string).filter(Boolean)

  return context
}

// ─── REGENERATE (SERVER ACTION) ─────────────────────────────────────────────────

/**
 * Called by the regenerate/swap API endpoint.
 * Returns a new TonightState excluding previously shown meals.
 */
export function regenerateTonight(
  userId: string,
  plan: Plan,
  excludeIds: string[],
): TonightState {
  return getSwapSuggestion(userId, excludeIds, plan)
}
