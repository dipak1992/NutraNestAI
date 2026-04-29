import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

// ─── POST /api/recipes/[id]/cook-complete ─────────────────────────────────────
// Body: { servingsCooked: number, leftoverServings: number, rating?: number }

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const servingsCooked: number = body.servingsCooked ?? 1
    const leftoverServings: number = body.leftoverServings ?? 0
    const rating: number | undefined = body.rating ?? undefined
    const bodyRecipeName = typeof body.recipeName === 'string' ? body.recipeName : null
    const bodyRecipeImage = typeof body.recipeImage === 'string' ? body.recipeImage : null
    const bodyCostPerServing = Number.isFinite(Number(body.costPerServing)) ? Number(body.costPerServing) : null
    const bodyMainIngredients = Array.isArray(body.mainIngredients)
      ? body.mainIngredients.filter((item: unknown): item is string => typeof item === 'string').slice(0, 8)
      : []

    // 1. Log cook completion (best-effort)
    try {
      await supabase.from('cook_completions').insert({
        user_id: user.id,
        meal_id: id,
        servings_cooked: servingsCooked,
        rating: rating ?? null,
        completed_at: new Date().toISOString(),
      })
    } catch {
      // non-critical — table may not exist yet
    }

    // 2. Mark cook session as completed (best-effort)
    try {
      await supabase
        .from('cook_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('recipe_id', id)
        .eq('status', 'active')
    } catch {
      // non-critical
    }

    // 3. Save leftover if requested
    if (leftoverServings > 0) {
      try {
        // Fetch recipe name + image for the leftover record
        const { data: recipe } = await supabase
          .from('recipes')
          .select('name, image_url, image')
          .eq('id', id)
          .maybeSingle()

        const recipeName = bodyRecipeName ?? recipe?.name ?? 'Cooked meal'
        const recipeImage = bodyRecipeImage ?? recipe?.image_url ?? recipe?.image ?? null

        // Expires in 3 days
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 3)

        const baseInsert = {
          user_id: user.id,
          source_recipe_id: id,
          source_recipe_name: recipeName,
          name: recipeName,
          image: recipeImage,
          servings_remaining: leftoverServings,
          original_cost_per_serving: bodyCostPerServing,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          urgency: 'fresh',
          main_ingredients: bodyMainIngredients,
          cooked_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }

        const { error: userInsertError } = await supabase.from('leftovers').insert(baseInsert)

        if (userInsertError) {
          const { data: household } = await supabase
            .from('households')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle()

          if (household?.id) {
            await supabase.from('leftovers').insert({
              household_id: household.id,
              source_recipe_id: id,
              display_name: recipeName,
              cooked_at: new Date().toISOString(),
              estimated_servings_remaining: leftoverServings,
              main_ingredients: bodyMainIngredients,
              expires_at: expiresAt.toISOString(),
              status: 'active',
            })
          }
        }
      } catch {
        // non-critical — leftovers table may have different schema
      }
    }

    return NextResponse.json({ ok: true, leftoverSaved: leftoverServings > 0 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
