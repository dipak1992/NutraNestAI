import type { LoadedRecipe } from '@/app/recipes/[id]/loader'
import type { SmartMealResult } from '@/lib/engine/types'

export type MealPillar =
  | 'tonight'
  | 'snap'
  | 'weekly'
  | 'leftovers'
  | 'budget'
  | 'saved'

export const PILLAR_LABELS: Record<MealPillar, string> = {
  tonight: 'Tonight Suggestions',
  snap: 'Snap & Cook',
  weekly: 'Weekly Autopilot',
  leftovers: 'Leftovers AI',
  budget: 'Budget Intelligence',
  saved: 'Saved Meals',
}

export function pillarLabel(pillar?: string | null) {
  if (!pillar) return PILLAR_LABELS.tonight
  return PILLAR_LABELS[pillar as MealPillar] ?? pillar
}

function difficultyForRecipe(value: SmartMealResult['difficulty']): LoadedRecipe['difficulty'] {
  if (value === 'hard') return 'hard'
  if (value === 'moderate') return 'medium'
  return 'easy'
}

export function mealToRecipe(meal: SmartMealResult, source: MealPillar = 'tonight'): LoadedRecipe {
  return {
    id: meal.id,
    name: meal.title,
    image: meal.imageUrl ?? null,
    description: meal.description ?? meal.tagline ?? null,
    servings: meal.servings || 4,
    cookTimeMin: meal.cookTime || Math.max(0, (meal.totalTime || 0) - (meal.prepTime || 0)),
    prepTimeMin: meal.prepTime || 0,
    difficulty: difficultyForRecipe(meal.difficulty),
    costTotal: meal.estimatedCost || 0,
    costPerServing: meal.servings ? (meal.estimatedCost || 0) / meal.servings : 0,
    tags: [PILLAR_LABELS[source], ...(meal.tags ?? [])],
    ingredients: (meal.ingredients ?? []).map((ingredient) => ({
      name: ingredient.name,
      quantity: Number.parseFloat(String(ingredient.quantity)) || 1,
      unit: ingredient.unit || 'unit',
    })),
    steps: (meal.steps ?? []).map((instruction, index) => ({
      order: index + 1,
      instruction,
    })),
    nutrition: undefined,
  }
}

export function recipeSignature(recipe: Pick<LoadedRecipe, 'id' | 'name' | 'ingredients' | 'steps'>) {
  return JSON.stringify({
    id: recipe.id,
    name: recipe.name,
    ingredients: recipe.ingredients.map((item) => [item.name, item.quantity, item.unit]),
    steps: recipe.steps.map((step) => step.instruction),
  })
}

export function buildRecipeScript(recipe: LoadedRecipe) {
  const parts: string[] = [`Let's cook ${recipe.name}.`]
  if (recipe.description) parts.push(recipe.description)
  if (recipe.ingredients.length > 0) {
    parts.push('You will need:')
    recipe.ingredients.forEach((ingredient) => {
      parts.push(`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}.`)
    })
  }
  parts.push("Let's begin.")
  recipe.steps.forEach((step, index) => {
    parts.push(`Step ${step.order || index + 1}. ${step.instruction}`)
  })
  parts.push('Great job. Enjoy your meal.')
  return parts.join(' ')
}

export function recipeSegments(recipe: LoadedRecipe) {
  return recipe.steps.map((step, index) => ({
    stepIndex: index,
    stepOrder: step.order || index + 1,
    text: `Step ${step.order || index + 1}. ${step.instruction}`,
  }))
}

export function persistMealForRecipe(meal: SmartMealResult, backPath: string, source: MealPillar) {
  sessionStorage.setItem('tonight-meal', JSON.stringify(meal))
  sessionStorage.setItem('recipe-back', backPath)
  sessionStorage.setItem('recipe-source', source)
}
