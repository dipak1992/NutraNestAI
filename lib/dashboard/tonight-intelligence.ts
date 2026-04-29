import type { SupabaseClient } from '@supabase/supabase-js'
import type { Plan, TonightState } from '@/lib/dashboard/types'

type Context = {
  dietary: string[]
  goals: string[]
  pantry: string[]
  leftovers: string[]
  savedMeals: string[]
}

const WEEKDAY_THEME: Record<number, { tag: string; reason: string }> = {
  0: { tag: 'reset', reason: 'Sunday reset meal: simple, prep-friendly, and easy to stretch.' },
  1: { tag: 'quick', reason: 'Monday reset meal: quick, low-friction, and built for getting back into rhythm.' },
  2: { tag: 'budget', reason: 'Tuesday budget meal: filling, affordable, and pantry-friendly.' },
  3: { tag: 'family-friendly', reason: 'Wednesday family favorite: familiar flavors with flexible serving options.' },
  4: { tag: 'pantry', reason: 'Thursday pantry rescue: uses what you likely already have.' },
  5: { tag: 'fun', reason: 'Friday fun meal: a little more playful without becoming takeout.' },
  6: { tag: 'comfort', reason: 'Saturday comfort meal: cozy, social, and still manageable.' },
}

const FREE_POOL: TonightState[] = [
  meal('free_pasta_night', 'Pasta night with quick tomato sauce', 'quick', 24, 10, ['quick', 'budget']),
  meal('free_taco_bowls', 'Taco bowls with rice and beans', 'budget', 28, 11, ['budget', 'family-friendly']),
  meal('free_chicken_rice', 'Chicken rice bowl with vegetables', 'family-friendly', 30, 13, ['family-friendly', 'high-protein']),
  meal('free_veggie_stir_fry', 'Veggie stir fry with noodles', 'pantry', 22, 9, ['quick', 'vegetarian']),
  meal('free_flatbread_pizza', 'Friday flatbread pizza', 'fun', 20, 12, ['family-friendly']),
  meal('free_skillet_chili', 'Cozy skillet chili', 'comfort', 35, 14, ['high-protein']),
  meal('free_sunday_soup', 'Sunday reset vegetable soup', 'reset', 32, 8, ['healthy', 'budget']),
]

const PLUS_POOL: TonightState[] = [
  meal('plus_veggie_fried_rice', 'Veggie fried rice', 'pantry', 18, 8, ['quick', 'vegetarian']),
  meal('plus_chicken_fajita_wraps', 'Chicken fajita wraps', 'family-friendly', 25, 14, ['family-friendly', 'high-protein']),
  meal('plus_leftover_broccoli_rice', 'Broccoli rice skillet', 'reset', 20, 7, ['vegetarian', 'budget']),
  meal('plus_tortilla_chicken_skillet', 'Chicken tortilla skillet', 'pantry', 26, 13, ['quick', 'high-protein']),
  meal('plus_lentil_taco_bowls', 'Lentil taco bowls', 'budget', 28, 9, ['budget', 'vegetarian']),
  meal('plus_family_pasta_bake', 'Family pasta bake', 'family-friendly', 35, 15, ['family-friendly']),
  meal('plus_date_night_salmon', 'Lemon salmon rice bowls', 'fun', 24, 18, ['healthy', 'high-protein']),
  meal('plus_comfort_chicken_soup', 'Comfort chicken noodle soup', 'comfort', 34, 12, ['comfort', 'family-friendly']),
]

function meal(
  id: string,
  name: string,
  theme: string,
  cookTimeMin: number,
  costTotal: number,
  tags: string[],
): TonightState {
  return {
    recipe: {
      id,
      name,
      image: '/landing/family-dinner.jpg',
      cookTimeMin,
      difficulty: 'easy',
      servings: 4,
      costTotal,
      costPerServing: Math.round((costTotal / 4) * 100) / 100,
      tags,
    },
    reason: WEEKDAY_THEME[new Date().getDay()]?.reason ?? `A ${theme} meal for tonight.`,
    alternativesAvailable: 3,
    isFromPantry: theme === 'pantry',
    usesLeftover: null,
  }
}

function hash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

function pickDaily<T>(items: T[], userId: string, salt = '') {
  const day = new Date().toISOString().slice(0, 10)
  return items[hash(`${userId}:${day}:${salt}`) % items.length]
}

function includesAny(items: string[], terms: string[]) {
  const lower = items.join(' ').toLowerCase()
  return terms.some((term) => lower.includes(term))
}

function findMeal(pool: TonightState[], id: string) {
  return pool.find((item) => item.recipe?.id === id)
    ?? PLUS_POOL.find((item) => item.recipe?.id === id)
    ?? pool.find((item) => item.recipe)
    ?? PLUS_POOL[0]
}

async function getPlusContext(supabase: SupabaseClient, userId: string): Promise<Context> {
  const context: Context = { dietary: [], goals: [], pantry: [], leftovers: [], savedMeals: [] }

  const { data: prefs } = await supabase
    .from('user_dietary_preferences')
    .select('eating_style, goals, favorite_proteins, cuisine_love')
    .eq('user_id', userId)
    .maybeSingle()

  context.dietary = [prefs?.eating_style].filter(Boolean) as string[]
  context.goals = Array.isArray(prefs?.goals) ? prefs.goals : []

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

  if (context.leftovers.length === 0) {
    const { data: leftovers } = await supabase
      .from('leftovers')
      .select('name, source_recipe_name, main_ingredients')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(10)

    context.leftovers = (leftovers ?? []).flatMap((item) => [
      item.name,
      item.source_recipe_name,
      ...(Array.isArray(item.main_ingredients) ? item.main_ingredients : []),
    ]).filter(Boolean)
  }

  const { data: saved } = await supabase
    .from('saved_meals')
    .select('title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  context.savedMeals = (saved ?? []).map((item) => item.title).filter(Boolean)

  return context
}

function personalize(pool: TonightState[], context: Context) {
  if (context.leftovers.length > 0 && includesAny(context.leftovers, ['broccoli', 'rice'])) {
    return withContext(findMeal(pool, 'plus_veggie_fried_rice'), context, 'Uses your leftover broccoli and rice first.')
  }
  if (includesAny(context.pantry, ['chicken']) && includesAny(context.pantry, ['tortilla', 'wrap'])) {
    return withContext(findMeal(pool, 'plus_chicken_fajita_wraps'), context, 'Matches the chicken and tortillas you already have.')
  }
  if (context.dietary.includes('vegetarian')) {
    return withContext(pool.find((item) => item.recipe?.tags?.includes('vegetarian')) ?? findMeal(pool, 'plus_lentil_taco_bowls'), context, 'Vegetarian-friendly and aligned with your saved preferences.')
  }
  if (context.goals.includes('save_money')) {
    return withContext(pool.find((item) => item.recipe?.tags?.includes('budget')) ?? findMeal(pool, 'plus_lentil_taco_bowls'), context, 'Chosen to keep tonight affordable.')
  }
  return withContext(pool[0], context, 'Personalized from your preferences, pantry, leftovers, and meal history.')
}

function withContext(base: TonightState, context: Context, reason: string): TonightState {
  const leftoverName = context.leftovers[0]
  return {
    ...base,
    reason,
    isFromPantry: context.pantry.length > 0 || base.isFromPantry,
    usesLeftover: leftoverName
      ? { leftoverId: 'context-leftover', leftoverName }
      : null,
  }
}

export async function getTonightSuggestion(
  supabase: SupabaseClient,
  userId: string,
  plan: Plan,
): Promise<TonightState> {
  const weekday = new Date().getDay()
  const theme = WEEKDAY_THEME[weekday]

  if (plan !== 'plus' && plan !== 'family') {
    const themed = FREE_POOL.filter((item) => item.recipe?.tags?.includes(theme.tag))
    return pickDaily(themed.length ? themed : FREE_POOL, userId, theme.tag)
  }

  try {
    const context = await getPlusContext(supabase, userId)
    const themed = PLUS_POOL.filter((item) => item.recipe?.tags?.includes(theme.tag))
    const base = personalize(themed.length ? themed : PLUS_POOL, context)
    return {
      ...base,
      alternativesAvailable: 99,
    }
  } catch {
    return pickDaily(PLUS_POOL, userId, 'plus-fallback')
  }
}

export function getRotatingTonightSuggestion(userId: string, plan: Plan, offset = 0): TonightState {
  const pool = plan === 'plus' || plan === 'family' ? PLUS_POOL : FREE_POOL
  return pool[(hash(`${userId}:${new Date().toISOString()}:${offset}`) + offset) % pool.length]
}
