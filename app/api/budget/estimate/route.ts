import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'
import { estimateRecipeCost, estimateWeekCost } from '@/lib/budget/cost-estimator'
import type { RecipeIngredient } from '@/lib/budget/types'

// ─── POST /api/budget/estimate ────────────────────────────────────────────────
// Body: { type: 'recipe' | 'week', ... }

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paywall = await getPaywallStatus()
  if (!paywall.isPro) {
    return NextResponse.json({ error: 'Plus plan required' }, { status: 403 })
  }

  const body = await req.json()
  const { type } = body

  // ── Load user's zip code ──────────────────────────────────────────────────
  const { data: budgetRow } = await supabase
    .from('budgets')
    .select('zip_code')
    .eq('user_id', user.id)
    .maybeSingle()

  const zipCode = budgetRow?.zip_code ?? null

  // ── Recipe estimate ───────────────────────────────────────────────────────
  if (type === 'recipe') {
    const { recipeId, recipeName, ingredients, servings } = body as {
      recipeId: string
      recipeName: string
      ingredients: RecipeIngredient[]
      servings: number
    }

    if (!recipeId || !ingredients || !servings) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const estimate = await estimateRecipeCost(
      recipeId,
      recipeName ?? 'Unknown Recipe',
      ingredients,
      servings,
      zipCode,
    )

    return NextResponse.json(estimate)
  }

  // ── Week estimate ─────────────────────────────────────────────────────────
  if (type === 'week') {
    const { recipes } = body as {
      recipes: Array<{
        recipeId: string
        recipeName: string
        ingredients: RecipeIngredient[]
        servings: number
      }>
    }

    if (!recipes || !Array.isArray(recipes)) {
      return NextResponse.json({ error: 'Missing recipes array' }, { status: 400 })
    }

    const result = await estimateWeekCost(recipes, zipCode)
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
