import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { LeftoverSuggestion, MainIngredient } from '@/lib/leftovers/types'

const FREE_WEEKLY_LIMIT = 2

async function checkAndIncrementSuggestionUsage(
  userId: string,
  leftoverId: string,
): Promise<{ allowed: boolean }> {
  const supabase = await createClient()

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count } = await supabase
    .from('leftover_suggestion_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo.toISOString())

  if ((count ?? 0) >= FREE_WEEKLY_LIMIT) {
    return { allowed: false }
  }

  await supabase.from('leftover_suggestion_logs').insert({
    user_id: userId,
    leftover_id: leftoverId,
    recipe_count: 3,
  })

  return { allowed: true }
}

// POST /api/leftovers/suggest-recipe
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { leftoverId } = body

  if (!leftoverId) {
    return NextResponse.json({ error: 'leftoverId required' }, { status: 400 })
  }

  // Fetch the leftover
  const { data: leftover, error: leftoverError } = await supabase
    .from('leftovers')
    .select('*')
    .eq('id', leftoverId)
    .eq('user_id', user.id)
    .single()

  if (leftoverError || !leftover) {
    return NextResponse.json({ error: 'Leftover not found' }, { status: 404 })
  }

  // Check paywall — plus members get unlimited
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single()

  const isPlusMember =
    profile?.subscription_tier === 'pro' ||
    profile?.subscription_tier === 'family' ||
    profile?.subscription_tier === 'plus'

  if (!isPlusMember) {
    const { allowed } = await checkAndIncrementSuggestionUsage(user.id, leftoverId)
    if (!allowed) {
      return NextResponse.json({ error: 'Weekly limit reached' }, { status: 402 })
    }
  }

  // Generate suggestions (mock — replace with real AI call)
  const ingredients = (leftover.main_ingredients as MainIngredient[]) ?? []
  const ingNames = ingredients.map((i) => i.name)
  const name = leftover.name as string

  const suggestions: LeftoverSuggestion[] = [
    {
      id: `${leftoverId}-1`,
      name: `${name} Fried Rice`,
      description: `Transform your ${name} into a quick fried rice with eggs and soy sauce. Ready in under 15 minutes.`,
      cookTimeMin: 15,
      usesIngredients: ingNames.slice(0, 3),
      difficulty: 'easy',
      image: null,
    },
    {
      id: `${leftoverId}-2`,
      name: `${name} Wrap`,
      description: `Wrap your ${name} in a tortilla with fresh veggies and a drizzle of hot sauce for a satisfying lunch.`,
      cookTimeMin: 5,
      usesIngredients: ingNames.slice(0, 2),
      difficulty: 'easy',
      image: null,
    },
    {
      id: `${leftoverId}-3`,
      name: `${name} Soup`,
      description: `Simmer your ${name} with broth, onion, and garlic for a warming soup that stretches your leftovers further.`,
      cookTimeMin: 25,
      usesIngredients: ingNames,
      difficulty: 'medium',
      image: null,
    },
  ]

  return NextResponse.json(suggestions)
}
