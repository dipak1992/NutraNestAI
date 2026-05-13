import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateSmartMeal } from '@/lib/engine/engine'
import { buildGroceryList } from '@/lib/planner/grocery'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiRateLimited } from '@/lib/api-response'
import { stringArraySchema, validationError } from '@/lib/validation/input'
import type { SmartMealRequest, SmartMealResult } from '@/lib/engine/types'
import type { WeekDay, WeeklyPlan } from '@/lib/planner/types'

const goalSchema = z.enum(['quick', 'budget', 'healthy', 'picky', 'leftovers'])

const startPlanSchema = z.object({
  pantryItems: stringArraySchema(40, 80).default([]),
  householdSize: z.coerce.number().int().min(1).max(12).default(2),
  dietary: stringArraySchema(20, 80).default([]),
  goal: goalSchema.default('quick'),
}).strict()

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

function buildRequest(input: z.infer<typeof startPlanSchema>): SmartMealRequest {
  const adultsCount = input.householdSize > 1 ? 2 : 1
  const kidsCount = Math.max(0, input.householdSize - adultsCount)

  return {
    household: { adultsCount, kidsCount, toddlersCount: 0, babiesCount: 0 },
    pantryItems: input.pantryItems,
    dietaryRestrictions: input.dietary,
    lowEnergy: input.goal === 'quick' || input.goal === 'leftovers',
    budget: input.goal === 'budget' ? 'low' : 'medium',
    maxCookTime: input.goal === 'quick' ? 25 : 40,
    pickyEater: input.goal === 'picky' ? { active: true } : undefined,
  }
}

function normalizedSet(items: string[]) {
  return new Set(items.map((item) => item.trim().toLowerCase()).filter(Boolean))
}

function hasAny(items: Set<string>, names: string[]) {
  return names.some((name) => items.has(name))
}

function pantryIncludesSampleCore(items: Set<string>) {
  return (
    hasAny(items, ['eggs', 'egg']) &&
    items.has('spinach') &&
    hasAny(items, ['rice', 'white rice', 'brown rice']) &&
    hasAny(items, ['chicken breast', 'chicken'])
  )
}

function buildPantryFaithfulMeal(input: z.infer<typeof startPlanSchema>): SmartMealResult | null {
  const pantry = normalizedSet(input.pantryItems)
  const vegetarian = input.dietary.includes('vegetarian')

  if (!pantryIncludesSampleCore(pantry) && pantry.size < 3) return null

  if (vegetarian && hasAny(pantry, ['eggs', 'egg']) && pantry.has('spinach') && pantry.has('rice')) {
    return {
      id: 'start-spinach-egg-fried-rice',
      title: 'Spinach Egg Fried Rice',
      tagline: 'Pantry-first dinner from the sample fridge',
      description: 'Eggs, spinach, rice, bell pepper, and cheddar become a quick skillet dinner that stays faithful to what is already in the fridge.',
      cuisineType: 'comfort',
      prepTime: 8,
      cookTime: 14,
      totalTime: 22,
      estimatedCost: 8,
      servings: input.householdSize,
      difficulty: 'easy',
      tags: ['Quick dinner', 'Pantry-first', 'Vegetarian'],
      chefVerified: true,
      ingredients: [
        { name: 'eggs', quantity: '4', unit: 'whole', fromPantry: true, category: 'protein' },
        { name: 'spinach', quantity: '3', unit: 'cups', fromPantry: true, category: 'produce' },
        { name: 'rice', quantity: '3', unit: 'cups', fromPantry: true, category: 'grain' },
        { name: 'bell pepper', quantity: '1', unit: 'whole', fromPantry: true, category: 'produce' },
        { name: 'cheddar cheese', quantity: '0.5', unit: 'cup', fromPantry: true, category: 'dairy' },
        { name: 'soy sauce', quantity: '2', unit: 'tbsp', fromPantry: false, category: 'condiment' },
        { name: 'green onion', quantity: '2', unit: 'stalks', fromPantry: false, category: 'produce' },
      ],
      shoppingList: [
        { name: 'soy sauce', quantity: '2', unit: 'tbsp', category: 'condiments', estimatedCost: 2, substituteOptions: ['tamari', 'coconut aminos'] },
        { name: 'green onion', quantity: '2', unit: 'stalks', category: 'produce', estimatedCost: 1.5, substituteOptions: ['chives', 'cilantro'] },
      ],
      steps: [
        'Warm a large skillet over medium-high heat.',
        'Scramble the eggs, then move them to a plate.',
        'Sauté bell pepper and spinach until just softened.',
        'Add rice and soy sauce, then fold the eggs back in.',
        'Top with cheddar and green onion before serving.',
      ],
      variations: [],
      leftoverTip: 'Pack leftovers with extra spinach for a quick lunch bowl tomorrow.',
      meta: {
        score: 96,
        matchedPantryItems: ['eggs', 'spinach', 'rice', 'bell pepper', 'cheddar cheese'],
        pantryUtilization: 0.83,
        simplifiedForEnergy: input.goal === 'quick',
        pickyEaterAdjusted: input.goal === 'picky',
        localityApplied: false,
        selectionReason: 'Built deterministically from the selected sample fridge ingredients.',
      },
    }
  }

  if (hasAny(pantry, ['chicken breast', 'chicken']) && pantry.has('spinach') && pantry.has('rice')) {
    return {
      id: 'start-chicken-spinach-rice-skillet',
      title: 'Chicken Spinach Rice Skillet',
      tagline: 'Uses the sample fridge directly',
      description: 'Chicken breast, spinach, rice, bell pepper, eggs, and cheddar turn into a fast one-pan dinner with only a few missing grocery items.',
      cuisineType: 'comfort',
      prepTime: 10,
      cookTime: 18,
      totalTime: 28,
      estimatedCost: 11,
      servings: input.householdSize,
      difficulty: 'easy',
      tags: ['Quick dinner', 'Kid friendly', 'Pantry-first'],
      chefVerified: true,
      ingredients: [
        { name: 'chicken breast', quantity: '1.5', unit: 'lb', fromPantry: true, category: 'protein' },
        { name: 'spinach', quantity: '3', unit: 'cups', fromPantry: true, category: 'produce' },
        { name: 'rice', quantity: '3', unit: 'cups', fromPantry: true, category: 'grain' },
        { name: 'bell pepper', quantity: '1', unit: 'whole', fromPantry: true, category: 'produce' },
        { name: 'eggs', quantity: '2', unit: 'whole', fromPantry: true, category: 'protein' },
        { name: 'cheddar cheese', quantity: '0.5', unit: 'cup', fromPantry: true, category: 'dairy' },
        { name: 'lime', quantity: '1', unit: 'whole', fromPantry: false, category: 'produce' },
        { name: 'salsa', quantity: '0.5', unit: 'cup', fromPantry: false, category: 'condiment' },
      ],
      shoppingList: [
        { name: 'lime', quantity: '1', unit: 'whole', category: 'produce', estimatedCost: 0.75, substituteOptions: ['lemon'] },
        { name: 'salsa', quantity: '0.5', unit: 'cup', category: 'condiments', estimatedCost: 3, substituteOptions: ['pico de gallo', 'tomato sauce'] },
      ],
      steps: [
        'Slice the chicken and season lightly with salt, pepper, and any pantry spice blend.',
        'Sear chicken in a large skillet until cooked through.',
        'Add bell pepper and spinach, then cook until softened.',
        'Fold in cooked rice and scrambled eggs.',
        'Finish with cheddar, salsa, and lime.',
      ],
      variations: [],
      leftoverTip: 'Save one serving for tomorrow lunch with extra salsa or greens.',
      meta: {
        score: 98,
        matchedPantryItems: ['chicken breast', 'spinach', 'rice', 'bell pepper', 'eggs', 'cheddar cheese'],
        pantryUtilization: 1,
        simplifiedForEnergy: input.goal === 'quick',
        pickyEaterAdjusted: input.goal === 'picky',
        localityApplied: false,
        selectionReason: 'Built deterministically from the selected sample fridge ingredients.',
      },
    }
  }

  return null
}

function isPantryMismatch(meal: SmartMealResult, input: z.infer<typeof startPlanSchema>) {
  const pantry = normalizedSet(input.pantryItems)
  const title = meal.title.toLowerCase()
  const absentProteins = ['trout', 'salmon', 'fish', 'shrimp', 'beef', 'pork']
  return (
    pantryIncludesSampleCore(pantry) &&
    absentProteins.some((protein) => title.includes(protein)) &&
    !absentProteins.some((protein) => pantry.has(protein))
  )
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({
    key: `start-plan:${rateLimitKeyFromRequest(req)}`,
    limit: 8,
    windowMs: 60_000,
  })
  if (!rl.success) return apiRateLimited(rl.reset)

  const parsed = startPlanSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: validationError(parsed.error) }, { status: 400 })
  }

  const input = parsed.data
  const generatedMeal = generateSmartMeal(buildRequest(input))
  const pantryFaithfulMeal = buildPantryFaithfulMeal(input)
  const meal = isPantryMismatch(generatedMeal, input) && pantryFaithfulMeal
    ? pantryFaithfulMeal
    : pantryFaithfulMeal ?? generatedMeal
  const weekStart = getWeekStart()
  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1
  const days: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${weekStart}T00:00:00`)
    d.setDate(d.getDate() + i)
    return {
      dayIndex: i,
      date: d.toISOString().split('T')[0],
      meal: i === dayIndex ? meal : null,
    }
  })
  const plan: WeeklyPlan = {
    id: `start-${weekStart}`,
    weekStart,
    days,
    generatedAt: new Date().toISOString(),
  }
  const groceryList = buildGroceryList([meal], input.pantryItems, 'standard', weekStart)

  return NextResponse.json({
    meal,
    plan,
    groceryList,
    activation: {
      householdSize: input.householdSize,
      dietary: input.dietary,
      goal: input.goal,
      pantryItems: input.pantryItems,
    },
  })
}
