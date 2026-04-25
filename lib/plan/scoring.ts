import type { Recipe } from '@/lib/dashboard/types'

// ─── Scoring Context ──────────────────────────────────────────────────────────

export type ScoringContext = {
  activeLeftoverIngredients: string[]  // ingredient names from active leftovers
  budgetPerMeal: number | null
  household: {
    dislikes: string[]
    dietary: string[]
    size: number
  }
  recentlyPlannedProteins: string[]    // last 3-4 days
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEFTOVER_BOOST = 0.25
const OVER_BUDGET_PENALTY = 0.35
const REPETITION_PENALTY = 0.25
const DISLIKE_PENALTY = 0.6

// ─── Score a recipe ───────────────────────────────────────────────────────────

export function scoreRecipe(
  recipe: Recipe & { ingredients?: string[] },
  ctx: ScoringContext,
): { score: number; reasons: string[]; usesLeftover: boolean; withinBudget: boolean } {
  const reasons: string[] = []
  let score = 0.5

  const lowerText = [
    recipe.name.toLowerCase(),
    ...(recipe.tags ?? []).map((t) => t.toLowerCase()),
    ...(recipe.ingredients ?? []).map((i) => i.toLowerCase()),
  ].join(' ')

  // ── Leftover boost ────────────────────────────────────────────────────────
  const matchedLeftover = ctx.activeLeftoverIngredients.find((ing) =>
    lowerText.includes(ing.toLowerCase()),
  )
  const usesLeftover = !!matchedLeftover
  if (usesLeftover) {
    score += LEFTOVER_BOOST
    reasons.push(`Uses your ${matchedLeftover}`)
  }

  // ── Budget fit ────────────────────────────────────────────────────────────
  const withinBudget =
    ctx.budgetPerMeal == null || recipe.costTotal <= ctx.budgetPerMeal * 1.05
  if (ctx.budgetPerMeal != null) {
    if (recipe.costTotal <= ctx.budgetPerMeal * 0.85) {
      score += 0.1
      reasons.push('Under budget')
    } else if (!withinBudget) {
      score -= OVER_BUDGET_PENALTY
      reasons.push('Over weekly per-meal budget')
    }
  }

  // ── Variety (repetition penalty) ──────────────────────────────────────────
  const recipeProtein = detectProtein(lowerText)
  if (recipeProtein && ctx.recentlyPlannedProteins.includes(recipeProtein)) {
    score -= REPETITION_PENALTY
    reasons.push(`Already had ${recipeProtein} recently`)
  }

  // ── Dietary + dislikes ────────────────────────────────────────────────────
  for (const dislike of ctx.household.dislikes) {
    if (lowerText.includes(dislike.toLowerCase())) {
      score -= DISLIKE_PENALTY
      reasons.push(`Contains ${dislike}`)
      break
    }
  }

  // ── Household size fit ────────────────────────────────────────────────────
  if (recipe.servings >= ctx.household.size) {
    score += 0.05
  }

  return {
    score: Math.max(0, Math.min(1.5, score)),
    reasons,
    usesLeftover,
    withinBudget,
  }
}

// ─── Protein detection ────────────────────────────────────────────────────────

const PROTEINS = [
  'chicken', 'beef', 'pork', 'turkey', 'lamb',
  'salmon', 'tuna', 'shrimp', 'fish',
  'tofu', 'tempeh', 'lentil', 'chickpea', 'bean',
]

export function detectProtein(text: string): string | null {
  for (const p of PROTEINS) {
    if (text.includes(p)) return p
  }
  return null
}

// ─── Get recent proteins from plan days ──────────────────────────────────────

export function getRecentProteins(
  days: Array<{
    recipe: { name: string; ingredients?: string[] } | null
    status: string
    dayIndex: number
  }>,
  currentDayIndex: number,
  lookback = 3,
): string[] {
  const proteins: string[] = []
  for (const d of days) {
    if (!d.recipe) continue
    if (d.dayIndex >= currentDayIndex) continue
    if (currentDayIndex - d.dayIndex > lookback) continue
    const text = [d.recipe.name, ...(d.recipe.ingredients ?? [])].join(' ').toLowerCase()
    const p = detectProtein(text)
    if (p) proteins.push(p)
  }
  return proteins
}
