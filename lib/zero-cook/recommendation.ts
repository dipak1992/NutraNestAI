import type { HouseholdMode, ZeroCookMeal, ZeroCookRequest } from './types'

interface MealTemplate {
  id: string
  name: string
  cuisineType: string
  tags: string[]
  baseSearch: string
  priceRange: string
  etaRange: string
  popularityLabel: string
  providers: Array<'ubereats' | 'doordash' | 'instacart' | 'grubhub'>
}

const DELIVERY_TEMPLATES: Record<HouseholdMode, MealTemplate[]> = {
  single: [
    {
      id: 'single-healthy-bowl',
      name: 'Healthy Bowl Under $15',
      cuisineType: 'healthy',
      tags: ['healthy', 'value', 'quick', 'vegetarian-friendly'],
      baseSearch: 'healthy bowl under $15',
      priceRange: '$11-15',
      etaRange: '20-30 min',
      popularityLabel: 'Best value',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
    {
      id: 'single-burger-combo',
      name: 'Burger Combo',
      cuisineType: 'american',
      tags: ['comfort', 'quick'],
      baseSearch: 'burger combo quick meal',
      priceRange: '$12-18',
      etaRange: '20-30 min',
      popularityLabel: 'Comfort pick',
      providers: ['ubereats', 'doordash', 'grubhub', 'instacart'],
    },
    {
      id: 'single-sushi-quick',
      name: 'Sushi Quick Meal',
      cuisineType: 'japanese',
      tags: ['light', 'fresh', 'healthy'],
      baseSearch: 'sushi quick meal',
      priceRange: '$14-22',
      etaRange: '25-35 min',
      popularityLabel: 'Fresh pick',
      providers: ['ubereats', 'grubhub', 'doordash', 'instacart'],
    },
    {
      id: 'single-protein-wrap',
      name: 'Protein Wrap',
      cuisineType: 'healthy',
      tags: ['protein', 'healthy', 'quick'],
      baseSearch: 'protein wrap dinner',
      priceRange: '$10-16',
      etaRange: '15-25 min',
      popularityLabel: 'Fastest',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
    {
      id: 'single-comfort-pasta',
      name: 'Comfort Pasta',
      cuisineType: 'italian',
      tags: ['comfort', 'vegetarian-possible'],
      baseSearch: 'comfort pasta dinner',
      priceRange: '$12-18',
      etaRange: '20-30 min',
      popularityLabel: 'Classic',
      providers: ['ubereats', 'doordash', 'grubhub', 'instacart'],
    },
  ],
  couple: [
    {
      id: 'couple-pasta-two',
      name: 'Pasta for Two',
      cuisineType: 'italian',
      tags: ['shareable', 'date-night'],
      baseSearch: 'pasta for two dinner',
      priceRange: '$22-34',
      etaRange: '25-35 min',
      popularityLabel: 'Date night',
      providers: ['ubereats', 'doordash', 'grubhub', 'instacart'],
    },
    {
      id: 'couple-sushi-date',
      name: 'Sushi Date Night',
      cuisineType: 'japanese',
      tags: ['date-night', 'light', 'healthy'],
      baseSearch: 'sushi for two date night',
      priceRange: '$28-45',
      etaRange: '30-40 min',
      popularityLabel: 'Most loved',
      providers: ['ubereats', 'grubhub', 'doordash', 'instacart'],
    },
    {
      id: 'couple-taco-combo',
      name: 'Taco Combo for Two',
      cuisineType: 'mexican',
      tags: ['shareable', 'quick'],
      baseSearch: 'taco combo for two',
      priceRange: '$20-30',
      etaRange: '20-30 min',
      popularityLabel: 'Quick pick',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
    {
      id: 'couple-pizza-sides',
      name: 'Pizza + Sides',
      cuisineType: 'italian',
      tags: ['shareable', 'comfort'],
      baseSearch: 'pizza and sides for two',
      priceRange: '$20-32',
      etaRange: '20-30 min',
      popularityLabel: 'Comfort win',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
    {
      id: 'couple-healthy-bowls',
      name: 'Healthy Bowls for Two',
      cuisineType: 'healthy',
      tags: ['healthy', 'shareable'],
      baseSearch: 'healthy bowls for two',
      priceRange: '$24-36',
      etaRange: '20-30 min',
      popularityLabel: 'Clean option',
      providers: ['ubereats', 'doordash', 'grubhub', 'instacart'],
    },
  ],
  family: [
    {
      id: 'family-pizza-bundle',
      name: 'Family Pizza Bundle',
      cuisineType: 'italian',
      tags: ['kid-friendly', 'family', 'shareable'],
      baseSearch: 'pizza family bundle',
      priceRange: '$28-45',
      etaRange: '25-35 min',
      popularityLabel: 'Family favorite',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
    {
      id: 'family-rotisserie-sides',
      name: 'Rotisserie Chicken + Sides',
      cuisineType: 'american',
      tags: ['family', 'value', 'protein'],
      baseSearch: 'rotisserie chicken dinner ingredients',
      priceRange: '$24-38',
      etaRange: '20-30 min',
      popularityLabel: 'Best value',
      providers: ['instacart', 'doordash', 'ubereats', 'grubhub'],
    },
    {
      id: 'family-taco-kit',
      name: 'Taco Night Kit',
      cuisineType: 'mexican',
      tags: ['family', 'shareable', 'kid-friendly'],
      baseSearch: 'taco night family kit',
      priceRange: '$26-40',
      etaRange: '20-30 min',
      popularityLabel: 'Build-your-own',
      providers: ['doordash', 'instacart', 'ubereats', 'grubhub'],
    },
    {
      id: 'family-pasta-tray',
      name: 'Pasta Family Tray',
      cuisineType: 'italian',
      tags: ['family', 'kid-friendly', 'comfort'],
      baseSearch: 'pasta family tray',
      priceRange: '$28-42',
      etaRange: '25-35 min',
      popularityLabel: 'No debate',
      providers: ['ubereats', 'doordash', 'grubhub', 'instacart'],
    },
    {
      id: 'family-nuggets-sides',
      name: 'Kid-Friendly Nuggets + Sides',
      cuisineType: 'american',
      tags: ['kid-friendly', 'family', 'quick'],
      baseSearch: 'kid friendly nuggets sides',
      priceRange: '$22-35',
      etaRange: '15-25 min',
      popularityLabel: 'Fastest',
      providers: ['doordash', 'ubereats', 'grubhub', 'instacart'],
    },
  ],
}

function detectMode(req: ZeroCookRequest): HouseholdMode {
  if (req.householdType) return req.householdType
  const kidCount = (req.household.kidsCount ?? 0) + (req.household.toddlersCount ?? 0) + (req.household.babiesCount ?? 0)
  if (kidCount > 0) return 'family'
  return req.household.adultsCount >= 2 ? 'couple' : 'single'
}

function timeBlockNow(): NonNullable<ZeroCookRequest['timeOfDay']> {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  if (h < 22) return 'evening'
  return 'late'
}

function includesAny(text: string, tokens: string[]): boolean {
  const lower = text.toLowerCase()
  return tokens.some((t) => lower.includes(t.toLowerCase()))
}

function actionLabels(mode: HouseholdMode): { primary: string; secondary: string } {
  if (mode === 'couple') return { primary: 'Order Dinner', secondary: 'Cook Instead' }
  return { primary: mode === 'family' ? 'Order Fast' : 'Order Now', secondary: 'Get Ingredients' }
}

function buildQuery(template: MealTemplate, req: ZeroCookRequest, mode: HouseholdMode): string {
  const cuisines = req.cuisinePreferences?.slice(0, 2).join(' ')
  const healthy = req.healthyGoal ? 'healthy' : ''
  const budget = req.budget === 'low' ? 'best value' : ''
  const time = req.timeOfDay ?? timeBlockNow()
  const intent = mode === 'family' ? 'family dinner' : mode === 'couple' ? 'dinner for two' : 'quick dinner'
  return [template.baseSearch, cuisines, healthy, budget, intent, time].filter(Boolean).join(' ').trim()
}

function scoreTemplate(template: MealTemplate, req: ZeroCookRequest, mode: HouseholdMode): number {
  let score = 0

  const prefs = req.cuisinePreferences?.map((c) => c.toLowerCase()) ?? []
  if (prefs.includes(template.cuisineType.toLowerCase())) score += 4

  const allergies = (req.allergies ?? []).map((a) => a.toLowerCase())
  const restrictions = (req.dietaryRestrictions ?? []).map((d) => d.toLowerCase())
  const disliked = (req.dislikedFoods ?? []).map((d) => d.toLowerCase())

  const text = `${template.name} ${template.baseSearch} ${template.tags.join(' ')}`.toLowerCase()

  if (restrictions.some((r) => ['vegetarian', 'vegan'].includes(r))) {
    if (includesAny(text, ['chicken', 'beef', 'pork', 'nuggets', 'rotisserie'])) score -= 8
    if (includesAny(text, ['healthy', 'vegetarian'])) score += 3
  }

  if (allergies.length > 0 && includesAny(text, allergies)) score -= 6
  if (disliked.length > 0 && includesAny(text, disliked)) score -= 5

  if (req.pickyEater && includesAny(text, ['kid-friendly', 'pizza', 'nuggets', 'pasta'])) score += 4
  if (req.healthyGoal && includesAny(text, ['healthy', 'bowl', 'light', 'protein'])) score += 4
  if (req.budget === 'low' && includesAny(template.priceRange, ['45', '42', '40'])) score -= 3
  if (req.budget === 'low' && includesAny(text, ['value', 'bundle', 'kit'])) score += 3
  if (req.lowEnergy && includesAny(text, ['quick', 'fastest'])) score += 2

  const accepted = (req.pastAcceptedMeals ?? []).map((m) => m.toLowerCase())
  if (accepted.length > 0 && includesAny(text, accepted)) score += 3

  if (mode === 'family' && includesAny(text, ['family', 'kid-friendly'])) score += 4
  if (mode === 'couple' && includesAny(text, ['for two', 'date night'])) score += 4

  return score
}

export function recommendZeroCookOptions(req: ZeroCookRequest): ZeroCookMeal[] {
  const mode = detectMode(req)
  const templates = DELIVERY_TEMPLATES[mode]

  const ranked = templates
    .map((template) => ({ template, score: scoreTemplate(template, req, mode) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const labels = actionLabels(mode)

  return ranked.map(({ template }) => ({
    id: template.id,
    name: template.name,
    reason:
      mode === 'single'
        ? 'Too busy to cook? We picked tonight\'s best options.'
        : mode === 'couple'
          ? 'Dinner for two without the debate.'
          : 'Feed everyone fast tonight.',
    cuisineType: template.cuisineType,
    priceRange: template.priceRange,
    etaRange: template.etaRange,
    popularityLabel: template.popularityLabel,
    bestProvider: template.providers[0],
    searchQuery: buildQuery(template, req, mode),
    primaryActionLabel: labels.primary,
    secondaryActionLabel: labels.secondary,
  }))
}

export function getHouseholdMode(req: ZeroCookRequest): HouseholdMode {
  return detectMode(req)
}
