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
 * Changes at midnight based on weekday theme.
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
  goals: string[]
  pantry: string[]
  leftovers: string[]
  savedMeals: string[]
  dislikes: string[]
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
 * Personalized based on preferences, pantry, leftovers, history.
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
    const personalized = personalizeSelection(allMeals, context)

    return toTonightState(personalized.meal, personalized.reason, {
      alternativesAvailable: 99,
      isFromPantry: personalized.isFromPantry,
      usesLeftover: personalized.usesLeftover,
    })
  } catch {
    // Fallback: deterministic daily pick from plus pool
    const themed = getMealsByTheme(theme)
    const meal = pickDailyMeal(themed.length ? themed : TONIGHT_CATALOG, `plus:${userId}`)
    return toTonightState(meal, WEEKDAY_THEMES[day].reason, { alternativesAvailable: 99 })
  }
}

/**
 * Get a swap suggestion (no-repeat guarantee).
 * Returns a different meal from the same theme, excluding already-seen IDs.
 */
export function getSwapSuggestion(userId: string, excludeIds: string[], plan: Plan): TonightState {
  const day = getMealDayOfWeek()
  const { theme, reason } = WEEKDAY_THEMES[day]
  const themed = getMealsByTheme(theme)

  // Filter out already-seen meals
  const available = themed.filter((m) => !excludeIds.includes(m.id))

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

function personalizeSelection(
  pool: CuratedMeal[],
  context: PersonalizationContext,
): PersonalizedResult {
  // Priority 1: Use leftovers
  if (context.leftovers.length > 0) {
    const leftoverMatch = findIngredientMatch(pool, context.leftovers)
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
    const pantryMatch = findIngredientMatch(pool, context.pantry)
    if (pantryMatch) {
      return {
        meal: pantryMatch.meal,
        reason: `Matches the ${pantryMatch.matched} you already have — no extra shopping needed.`,
        isFromPantry: true,
        usesLeftover: null,
      }
    }
  }

  // Priority 3: Respect dietary preferences
  if (context.dietary.length > 0) {
    const dietaryMeal = findDietaryMatch(pool, context.dietary)
    if (dietaryMeal) {
      return {
        meal: dietaryMeal,
        reason: `Aligned with your ${context.dietary[0]} preferences.`,
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Priority 4: Budget goal
  if (context.goals.includes('save_money')) {
    const budgetMeal = pool.find((m) => m.tags.includes('budget'))
    if (budgetMeal) {
      return {
        meal: budgetMeal,
        reason: 'Chosen to keep tonight affordable — aligned with your budget goal.',
        isFromPantry: false,
        usesLeftover: null,
      }
    }
  }

  // Priority 5: Avoid dislikes, pick from remaining
  const filtered = context.dislikes.length > 0
    ? pool.filter((m) => !context.dislikes.some((d) =>
        m.name.toLowerCase().includes(d.toLowerCase()) ||
        m.keyIngredients.some((ing) => ing.toLowerCase().includes(d.toLowerCase()))
      ))
    : pool

  const finalPool = filtered.length > 0 ? filtered : pool
  const meal = pickDailyMeal(finalPool, `plus-personalized`)

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
  return null
}

// ─── DATA LOADING ───────────────────────────────────────────────────────────────

async function loadPersonalizationContext(
  supabase: SupabaseClient,
  userId: string,
): Promise<PersonalizationContext> {
  const context: PersonalizationContext = {
    dietary: [],
    goals: [],
    pantry: [],
    leftovers: [],
    savedMeals: [],
    dislikes: [],
  }

  // Load dietary preferences
  const { data: prefs } = await supabase
    .from('user_dietary_preferences')
    .select('eating_style, goals, dislikes')
    .eq('user_id', userId)
    .maybeSingle()

  if (prefs) {
    context.dietary = [prefs.eating_style].filter(Boolean) as string[]
    context.goals = Array.isArray(prefs.goals) ? prefs.goals : []
    context.dislikes = Array.isArray(prefs.dislikes) ? prefs.dislikes : []
  }

  // Load household pantry
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
    context.pantry = (pantry ?? []).map((item) => item.name).filter(Boolean)

    const { data: leftovers } = await supabase
      .from('leftovers')
      .select('display_name, main_ingredients')
      .eq('household_id', household.id)
      .eq('status', 'active')
      .limit(10)
    context.leftovers = (leftovers ?? []).flatMap((item) => [
      item.display_name,
      ...(Array.isArray(item.main_ingredients) ? item.main_ingredients : []),
    ]).filter(Boolean)
  }

  // Fallback: user-level leftovers
  if (context.leftovers.length === 0) {
    const { data: leftovers } = await supabase
      .from('leftovers')
      .select('name, main_ingredients')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(10)
    context.leftovers = (leftovers ?? []).flatMap((item) => [
      item.name,
      ...(Array.isArray(item.main_ingredients) ? item.main_ingredients : []),
    ]).filter(Boolean)
  }

  // Load saved meals for context
  const { data: saved } = await supabase
    .from('saved_meals')
    .select('title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  context.savedMeals = (saved ?? []).map((item) => item.title).filter(Boolean)

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
