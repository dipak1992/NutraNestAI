// ============================================================
// Smart Meal Engine — Core Logic
// Deterministic, rule-based meal selection + transform pipeline
// ============================================================

import type {
  SmartMealRequest,
  SmartMealResult,
  SmartVariation,
  SmartIngredient,
  SmartShoppingItem,
  MealCandidate,
  EngineMeta,
  Stage,
} from './types'
import { MEAL_DATABASE } from './meals'
import type { LearnedBoosts } from '@/lib/learning/types'
import { applyLearnedBoosts } from '@/lib/learning/engine'

// ── Scoring Weights ─────────────────────────────────────────

const W = {
  PANTRY_PER_ITEM: 8,
  PANTRY_BONUS: 25,
  PANTRY_THRESHOLD: 0.4,
  INSPIRATION: 50,
  ENERGY_MATCH: 35,
  ENERGY_MISMATCH: -20,
  CUISINE: 15,
  BUDGET_MATCH: 20,
  BUDGET_OVER: -15,
  TIME_OVER: -40,
  PROTEIN: 15,
  KID_FRIENDLY: 2,
  PICKY_DISLIKED: -25,
  HOUSEHOLD_FIT: 10,
  ALLERGEN: -10000,
  DIETARY: -10000,
}

// ── Allergen → Ingredient Terms ─────────────────────────────

const ALLERGEN_MAP: Record<string, string[]> = {
  peanuts: ['peanut', 'peanut butter', 'peanut oil'],
  tree_nuts: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'pine nut', 'hazelnut', 'macadamia', 'nut'],
  milk: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'mozzarella', 'parmesan', 'cheddar', 'sour cream', 'whey', 'cream cheese'],
  eggs: ['egg', 'eggs', 'mayo', 'mayonnaise'],
  wheat: ['flour', 'bread', 'pasta', 'penne', 'spaghetti', 'noodle', 'tortilla', 'breadcrumb', 'panko', 'couscous', 'macaroni'],
  soy: ['soy sauce', 'tofu', 'edamame', 'soybean', 'tempeh', 'miso'],
  fish: ['salmon', 'tuna', 'cod', 'tilapia', 'fish sauce', 'anchovy', 'fish'],
  shellfish: ['shrimp', 'crab', 'lobster', 'mussel', 'clam', 'oyster'],
  sesame: ['sesame', 'sesame oil', 'sesame seeds', 'tahini'],
  honey: ['honey'],
}

// ── Dietary → Protein Exclusion ─────────────────────────────

const DIETARY_EXCLUDED_PROTEINS: Record<string, string[]> = {
  vegetarian: ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'turkey', 'sausage'],
  vegan: ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'turkey', 'sausage', 'eggs'],
  pescatarian: ['chicken', 'beef', 'pork', 'turkey', 'sausage'],
}

// ── Locality Ingredient Swaps ───────────────────────────────

const LOCALITY_SWAPS: Record<string, Record<string, string>> = {
  uk: {
    cilantro: 'fresh coriander', eggplant: 'aubergine', 'bell pepper': 'pepper',
    zucchini: 'courgette', arugula: 'rocket', scallion: 'spring onion',
    'heavy cream': 'double cream', 'all-purpose flour': 'plain flour',
  },
  india: {
    butter: 'ghee', mozzarella: 'paneer', 'sour cream': 'thick yogurt',
    tortillas: 'roti', 'heavy cream': 'fresh cream',
  },
  mexico: {
    'sour cream': 'crema mexicana', cheddar: 'queso fresco',
    'chili flakes': 'chile de árbol',
  },
  japan: {
    'soy sauce': 'shoyu', 'chicken broth': 'dashi', scallion: 'negi',
  },
}

const LOCALITY_NORMALIZE: Record<string, string> = {
  us: 'us', usa: 'us', 'united states': 'us', america: 'us',
  uk: 'uk', england: 'uk', britain: 'uk', 'united kingdom': 'uk',
  india: 'india', in: 'india',
  mexico: 'mexico', mx: 'mexico',
  japan: 'japan', jp: 'japan',
  mediterranean: 'mediterranean', med: 'mediterranean',
  italy: 'mediterranean', spain: 'mediterranean', greece: 'mediterranean',
}

// ── Stage Metadata ──────────────────────────────────────────

const STAGE_META: Record<Stage, { label: string; emoji: string }> = {
  adult: { label: 'Adult', emoji: '🧑' },
  kid: { label: 'Kid (5-12)', emoji: '🧒' },
  toddler: { label: 'Toddler (1-4)', emoji: '👶' },
  baby: { label: 'Baby (6-12mo)', emoji: '🍼' },
}

// ── Substitute Options for Shopping List ────────────────────

const SUBSTITUTE_MAP: Record<string, string[]> = {
  chicken: ['turkey', 'tofu', 'tempeh'],
  beef: ['ground turkey', 'lentils', 'mushrooms'],
  salmon: ['trout', 'cod', 'canned tuna'],
  fish: ['chicken', 'tofu', 'shrimp'],
  turkey: ['chicken', 'pork', 'tofu'],
  tofu: ['chicken', 'beans', 'tempeh'],
  'heavy cream': ['coconut cream', 'cashew cream', 'evaporated milk'],
  'sour cream': ['greek yogurt', 'coconut cream'],
  butter: ['olive oil', 'coconut oil', 'ghee'],
  parmesan: ['nutritional yeast', 'pecorino'],
  rice: ['quinoa', 'couscous', 'cauliflower rice'],
  pasta: ['rice noodles', 'zucchini noodles', 'gluten-free pasta'],
  tortillas: ['lettuce wraps', 'rice paper', 'naan'],
  'soy sauce': ['coconut aminos', 'tamari'],
  'coconut milk': ['heavy cream', 'cashew cream'],
}

// ════════════════════════════════════════════════════════════
// Main Entry Point
// ════════════════════════════════════════════════════════════

export function generateSmartMeal(
  request: SmartMealRequest,
  learnedBoosts?: LearnedBoosts | null,
): SmartMealResult {
  const pantry = normalizePantry(request.pantryItems)
  const allergies = request.allergies?.map(a => a.toLowerCase()) ?? []
  const dietary = request.dietaryRestrictions?.map(d => d.toLowerCase()) ?? []
  const cuisines = request.cuisinePreferences?.map(c => c.toLowerCase()) ?? []
  const proteins = request.preferredProteins?.map(p => p.toLowerCase()) ?? []
  const locality = normalizeLocality(request.locality)
  const targetServings =
    request.household.adultsCount +
    request.household.kidsCount +
    request.household.toddlersCount +
    Math.ceil(request.household.babiesCount * 0.5)

  // ── 1. Score all candidates ──────────────────────────────

  const candidates = request.excludeIds?.length
    ? MEAL_DATABASE.filter(m => !request.excludeIds!.includes(m.id))
    : MEAL_DATABASE

  // Fall back to full database if all meals are excluded
  const pool = candidates.length > 0 ? candidates : MEAL_DATABASE

  const scored = pool.map(meal => {
    let score = 0
    const reasons: string[] = []

    // Allergen elimination
    if (hasAllergen(meal, allergies)) {
      return { meal, score: W.ALLERGEN, reasons: ['Contains allergen'] }
    }

    // Dietary elimination
    if (!meetsDietary(meal, dietary)) {
      return { meal, score: W.DIETARY, reasons: ['Dietary restriction conflict'] }
    }

    // Pantry matching
    const pm = countPantryMatches(meal, pantry)
    score += pm.count * W.PANTRY_PER_ITEM
    if (pm.ratio >= W.PANTRY_THRESHOLD) {
      score += W.PANTRY_BONUS
      reasons.push(`Uses ${pm.count} pantry items (${Math.round(pm.ratio * 100)}%)`)
    }

    // Inspiration matching
    if (request.inspirationMeal && matchesInspiration(meal, request.inspirationMeal)) {
      score += W.INSPIRATION
      reasons.push('Matches meal inspiration')
    }

    // Energy level
    if (request.lowEnergy) {
      if (meal.energyDemand === 'low') {
        score += W.ENERGY_MATCH
        reasons.push('Low-effort meal')
      } else if (meal.energyDemand === 'high') {
        score += W.ENERGY_MISMATCH
      }
    }

    // Cuisine preferences
    for (const pref of cuisines) {
      if (meal.cuisineTags.some(t => t.includes(pref) || pref.includes(t))) {
        score += W.CUISINE
        reasons.push(`Matches ${pref} cuisine`)
        break
      }
    }

    // Budget
    if (request.budget) {
      const levels = { low: 1, medium: 2, high: 3 }
      if (levels[meal.costLevel] <= levels[request.budget]) {
        score += W.BUDGET_MATCH
      } else {
        score += W.BUDGET_OVER
      }
    }

    // Cook time constraint
    if (request.maxCookTime && meal.prepTime + meal.cookTime > request.maxCookTime) {
      score += W.TIME_OVER
    }

    // Protein preference
    for (const pref of proteins) {
      if (meal.proteinType.includes(pref) || pref.includes(meal.proteinType)) {
        score += W.PROTEIN
        reasons.push(`Uses preferred protein: ${meal.proteinType}`)
        break
      }
    }

    // Kid-friendliness (when kids/toddlers present)
    if (request.household.kidsCount + request.household.toddlersCount > 0) {
      score += meal.kidFriendlyScore * W.KID_FRIENDLY
    }

    // Picky eater penalty
    if (request.pickyEater?.active && request.pickyEater.dislikedFoods) {
      for (const disliked of request.pickyEater.dislikedFoods) {
        const dl = disliked.toLowerCase()
        if (meal.ingredients.some(i => i.name.toLowerCase().includes(dl))) {
          score += W.PICKY_DISLIKED
        }
      }
    }

    // Adaptive learning boosts
    if (learnedBoosts) {
      const lb = applyLearnedBoosts(
        learnedBoosts,
        meal.id,
        meal.cuisineTags[0] ?? '',
        meal.proteinType,
        meal.tags,
        meal.difficulty,
        meal.prepTime + meal.cookTime,
        null,
        null,
      )
      score += lb.score
      reasons.push(...lb.reasons)

      // Amplify kid-friendly scoring for picky patterns
      if (learnedBoosts.pickyMultiplier > 1 &&
          (request.household.kidsCount + request.household.toddlersCount > 0)) {
        score += Math.round(meal.kidFriendlyScore * (learnedBoosts.pickyMultiplier - 1) * W.KID_FRIENDLY)
      }
    }

    // Household size fit
    const servingDiff = Math.abs(meal.servings - targetServings)
    if (servingDiff <= 1) score += W.HOUSEHOLD_FIT

    if (reasons.length === 0) reasons.push('Good general fit')

    return { meal, score, reasons }
  })

  // ── 2. Sort by score, random tiebreaker ──────────────────

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  // ── 3. Select best viable candidate ──────────────────────

  const best = scored.find(s => s.score > -1000) ?? scored[0]

  return assembleMeal(best.meal, request, pantry, locality, best.score, best.reasons)
}

// ════════════════════════════════════════════════════════════
// Assembly Pipeline
// ════════════════════════════════════════════════════════════

function assembleMeal(
  meal: MealCandidate,
  request: SmartMealRequest,
  pantry: string[],
  locality: string,
  score: number,
  reasons: string[],
): SmartMealResult {
  const localitySwaps = LOCALITY_SWAPS[locality] ?? {}
  const localityApplied = locality !== 'global' && locality !== 'us' && Object.keys(localitySwaps).length > 0

  // ── Build ingredients with pantry flags & locality swaps ──

  const ingredients: SmartIngredient[] = meal.ingredients.map(i => {
    let name = i.name
    if (localityApplied) {
      for (const [from, to] of Object.entries(localitySwaps)) {
        if (name.toLowerCase().includes(from.toLowerCase())) {
          name = to
          break
        }
      }
    }
    return {
      name,
      quantity: i.quantity,
      unit: i.unit,
      ...(i.note ? { note: i.note } : {}),
      fromPantry: isPantryMatch(i.name, pantry),
      category: i.category,
    }
  })

  // ── Steps (simplify for low energy) ───────────────────────

  let steps = meal.steps
  if (request.lowEnergy && meal.simplifiedSteps) {
    steps = meal.simplifiedSteps
  }

  // ── Variations ────────────────────────────────────────────

  const variations = buildVariations(meal, request)

  // ── Shopping list ─────────────────────────────────────────

  const shoppingList = buildShoppingList(ingredients)

  // ── Metadata ──────────────────────────────────────────────

  const pantryMatches = ingredients.filter(i => i.fromPantry)
  const pantryUtil = ingredients.length > 0 ? pantryMatches.length / ingredients.length : 0

  const meta: EngineMeta = {
    score,
    matchedPantryItems: pantryMatches.map(i => i.name),
    pantryUtilization: Math.round(pantryUtil * 100) / 100,
    simplifiedForEnergy: !!(request.lowEnergy && meal.simplifiedSteps),
    pickyEaterAdjusted: !!(request.pickyEater?.active),
    localityApplied,
    selectionReason: reasons.join('. '),
  }

  return {
    id: meal.id,
    title: meal.title,
    tagline: meal.tagline,
    description: meal.description,
    cuisineType: meal.cuisineTags[0],
    prepTime: meal.prepTime,
    cookTime: meal.cookTime,
    totalTime: meal.prepTime + meal.cookTime,
    estimatedCost: meal.estimatedCost,
    servings: meal.servings,
    difficulty: request.lowEnergy && meal.simplifiedSteps ? 'easy' : meal.difficulty,
    tags: meal.tags,
    ingredients,
    steps,
    variations,
    leftoverTip: meal.leftoverTip,
    shoppingList,
    meta,
  }
}

// ════════════════════════════════════════════════════════════
// Variation Builder
// ════════════════════════════════════════════════════════════

function buildVariations(meal: MealCandidate, request: SmartMealRequest): SmartVariation[] {
  const stages = getRequiredStages(request.household)

  return stages.map(stage => {
    const data = meal.variations[stage]
    const meta = STAGE_META[stage]

    const modifications = [...data.modifications]
    const safetyNotes = [...data.safetyNotes]

    // Picky eater texture-first adjustments for kid/toddler
    if (request.pickyEater?.active && (stage === 'kid' || stage === 'toddler')) {
      const tex = request.pickyEater.texturePreference
      if (tex === 'soft') {
        modifications.unshift('Cook all vegetables until very soft')
        modifications.push('Avoid crunchy or raw textures')
      } else if (tex === 'pureed') {
        modifications.unshift('Blend or mash all components smooth')
      } else if (tex === 'finger_foods') {
        modifications.unshift('Cut everything into graspable finger-sized pieces')
      }

      const disliked = request.pickyEater.dislikedFoods ?? []
      if (disliked.length > 0) {
        modifications.push(`Omit or substitute: ${disliked.join(', ')}`)
      }

      const safe = request.pickyEater.safeFoods ?? []
      if (safe.length > 0) {
        modifications.push(`Serve alongside familiar foods: ${safe.join(', ')}`)
      }
    }

    return {
      stage,
      label: meta.label,
      emoji: meta.emoji,
      title: data.title,
      description: data.description,
      modifications,
      safetyNotes,
      textureNotes: data.textureNotes,
      servingTip: data.servingTip,
      allergyWarnings: [],
    }
  })
}

function getRequiredStages(household: SmartMealRequest['household']): Stage[] {
  const stages: Stage[] = []
  if (household.adultsCount > 0) stages.push('adult')
  if (household.kidsCount > 0) stages.push('kid')
  if (household.toddlersCount > 0) stages.push('toddler')
  if (household.babiesCount > 0) stages.push('baby')
  if (stages.length === 0) stages.push('adult')
  return stages
}

// ════════════════════════════════════════════════════════════
// Shopping List Builder
// ════════════════════════════════════════════════════════════

function buildShoppingList(ingredients: SmartIngredient[]): SmartShoppingItem[] {
  return ingredients
    .filter(i => !i.fromPantry && !['spice', 'condiment'].includes(i.category))
    .map(i => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      category: i.category,
      estimatedCost: estimateItemCost(i.category),
      substituteOptions: getSubstitutes(i.name),
    }))
}

function estimateItemCost(category: string): number {
  const costs: Record<string, number> = {
    produce: 1.5,
    protein: 4,
    dairy: 2.5,
    grain: 2,
    pantry_staple: 1.5,
    spice: 0.5,
    condiment: 1,
    other: 2,
  }
  return costs[category] ?? 2
}

function getSubstitutes(name: string): string[] {
  const n = name.toLowerCase()
  for (const [key, subs] of Object.entries(SUBSTITUTE_MAP)) {
    if (n.includes(key)) return subs
  }
  return []
}

// ════════════════════════════════════════════════════════════
// Scoring Helpers
// ════════════════════════════════════════════════════════════

function normalizePantry(items?: string[]): string[] {
  return (items ?? []).map(i => i.toLowerCase().trim()).filter(Boolean)
}

function normalizeLocality(locality?: string): string {
  if (!locality) return 'global'
  return LOCALITY_NORMALIZE[locality.toLowerCase().trim()] ?? 'global'
}

function isPantryMatch(ingredientName: string, pantry: string[]): boolean {
  const n = ingredientName.toLowerCase()
  return pantry.some(p => n.includes(p) || p.includes(n))
}

function countPantryMatches(meal: MealCandidate, pantry: string[]): { count: number; ratio: number } {
  if (pantry.length === 0) return { count: 0, ratio: 0 }
  const matches = meal.keyIngredients.filter(ki =>
    pantry.some(p => ki.includes(p) || p.includes(ki)),
  )
  return {
    count: matches.length,
    ratio: meal.keyIngredients.length > 0 ? matches.length / meal.keyIngredients.length : 0,
  }
}

function hasAllergen(meal: MealCandidate, allergies: string[]): boolean {
  if (allergies.length === 0) return false
  for (const allergy of allergies) {
    const triggers = ALLERGEN_MAP[allergy] ?? [allergy]
    for (const ingredient of meal.ingredients) {
      const n = ingredient.name.toLowerCase()
      if (triggers.some(t => n.includes(t))) return true
    }
  }
  return false
}

function meetsDietary(meal: MealCandidate, dietary: string[]): boolean {
  for (const restriction of dietary) {
    // If diet is explicitly listed as compatible, it's fine
    if (meal.dietaryCompat.includes(restriction)) continue
    // Otherwise check protein exclusions
    const excluded = DIETARY_EXCLUDED_PROTEINS[restriction]
    if (excluded && excluded.includes(meal.proteinType)) return false
  }
  return true
}

function matchesInspiration(meal: MealCandidate, inspiration: string): boolean {
  const norm = inspiration.toLowerCase()
  // Direct match against related terms
  if (meal.relatedTerms.some(t => norm.includes(t) || t.includes(norm))) return true
  // Word-level matching for significant words (>3 chars)
  const words = norm.split(/\s+/).filter(w => w.length > 3)
  return words.some(word => meal.relatedTerms.some(t => t.includes(word)))
}
