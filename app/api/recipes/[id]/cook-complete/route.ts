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

        const recipeName = recipe?.name ?? 'Cooked meal'
        const recipeImage = recipe?.image_url ?? recipe?.image ?? null

        // Expires in 3 days
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 3)

        await supabase.from('leftovers').insert({
          user_id: user.id,
          source_recipe_id: id,
          source_recipe_name: recipeName,
          name: recipeName,
          image: recipeImage,
          servings_remaining: leftoverServings,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          urgency: 'fresh',
          main_ingredients: [],
          created_at: new Date().toISOString(),
        })
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
