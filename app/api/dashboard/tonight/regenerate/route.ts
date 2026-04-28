import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TonightState } from '@/lib/dashboard/types'

/**
 * POST /api/dashboard/tonight/regenerate
 * Returns a new tonight suggestion different from the current one.
 * TODO: Replace mock with real AI/DB-backed suggestion engine.
 */

const MOCK_SUGGESTIONS: TonightState[] = [
  {
    recipe: {
      id: 'rec_garlic_shrimp',
      name: 'Garlic butter shrimp pasta',
      image: '',
      cookTimeMin: 25,
      difficulty: 'easy',
      servings: 4,
      costTotal: 16,
      costPerServing: 4.0,
      tags: ['quick', 'high-protein'],
    },
    reason: 'Quick weeknight meal that uses pantry staples — ready in 25 minutes.',
    alternativesAvailable: 2,
    isFromPantry: true,
    usesLeftover: null,
  },
  {
    recipe: {
      id: 'rec_veggie_stir_fry',
      name: 'Crispy tofu vegetable stir-fry',
      image: '',
      cookTimeMin: 20,
      difficulty: 'easy',
      servings: 3,
      costTotal: 10,
      costPerServing: 3.33,
      tags: ['quick', 'budget', 'vegetarian'],
    },
    reason: 'Budget-friendly and packed with vegetables — great for a lighter evening.',
    alternativesAvailable: 1,
    isFromPantry: false,
    usesLeftover: null,
  },
  {
    recipe: {
      id: 'rec_chicken_tacos',
      name: 'Smoky chicken tacos with avocado',
      image: '',
      cookTimeMin: 35,
      difficulty: 'easy',
      servings: 4,
      costTotal: 13,
      costPerServing: 3.25,
      tags: ['family-friendly', 'high-protein'],
    },
    reason: 'Family favourite that everyone loves — customisable toppings for each person.',
    alternativesAvailable: 0,
    isFromPantry: false,
    usesLeftover: null,
  },
]

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pick a random suggestion (in production this would be AI-driven and context-aware)
  const suggestion =
    MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)]

  return NextResponse.json(suggestion)
}
