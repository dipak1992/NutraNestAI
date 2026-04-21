/**
 * Shared utilities for the Kids Tool — used in both the main page and the result detail page.
 */

import type {
  KidsToolResult,
} from '@/app/api/kids-tool/route'

export function getKidsResultTitle(result: KidsToolResult): string {
  switch (result.intent) {
    case 'lunchbox':
      return result.main_item
    case 'snack':
      return result.name
    case 'bake':
      return result.activity_name
    case 'picky':
      return result.meal_name
    case 'fast':
      return result.meal_name
  }
}

export function buildSavableKidsMeal(result: KidsToolResult) {
  let prep = '10 min'
  switch (result.intent) {
    case 'lunchbox':
      prep = result.prep_time
      break
    case 'snack':
      prep = result.prep_time
      break
    case 'bake':
      prep = result.prep_time
      break
    case 'fast':
      prep = `${result.ready_in_minutes} min`
      break
    case 'picky':
      prep = '15 min'
      break
  }
  const prepTimeParsed = Number.parseInt(prep, 10)
  const prepTime = Number.isFinite(prepTimeParsed) ? Math.max(prepTimeParsed, 5) : 10

  let ingredientNames: string[] = []
  switch (result.intent) {
    case 'lunchbox':
      ingredientNames = [result.main_item, result.fruit, result.side_snack, result.optional_treat].filter(Boolean) as string[]
      break
    case 'snack':
      ingredientNames = result.ingredients
      break
    case 'bake':
      ingredientNames = result.ingredients
      break
    case 'fast':
      ingredientNames = result.ingredients_needed
      break
    case 'picky':
      ingredientNames = [result.meal_name]
      break
  }

  const description =
    result.intent === 'lunchbox'
      ? result.tip
      : result.intent === 'snack'
        ? result.why_kids_love_it
        : result.intent === 'bake'
          ? result.fun_tip
          : result.intent === 'picky'
            ? result.why_it_may_work
            : result.shortcut_tip

  const steps =
    result.intent === 'bake'
      ? result.steps
      : [
          result.intent === 'lunchbox'
            ? `Prepare and pack in ${result.prep_time}.`
            : result.intent === 'snack'
              ? `Prepare in ${result.prep_time}.`
              : result.intent === 'picky'
                ? result.serving_tip
                : result.shortcut_tip,
        ].filter(Boolean) as string[]

  return {
    id: `kids-${result.intent}-${Date.now()}`,
    title: getKidsResultTitle(result),
    tagline: result.section_title,
    description,
    cuisineType: 'kids',
    prepTime,
    cookTime: 0,
    totalTime: prepTime,
    estimatedCost: 0,
    servings: 2,
    difficulty: 'easy' as const,
    tags: ['kids-tool', result.intent],
    ingredients: ingredientNames.map((name) => ({
      name,
      quantity: '',
      unit: '',
      fromPantry: false,
      category: 'other' as const,
    })),
    steps,
    variations: [],
    leftoverTip: null,
    shoppingList: [],
    meta: {
      score: result.intent === 'picky' ? result.acceptance_score : result.intent === 'fast' ? result.urgency_score : 8,
      matchedPantryItems: [],
      pantryUtilization: 0,
      simplifiedForEnergy: true,
      pickyEaterAdjusted: result.intent === 'picky',
      localityApplied: false,
      selectionReason: `Saved from kids tool (${result.intent})`,
    },
  }
}
