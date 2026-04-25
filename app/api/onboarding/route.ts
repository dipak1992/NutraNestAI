import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── POST /api/onboarding ─────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as {
      householdSize: number
      dietary: string[]
      dislikes: string[]
      skillLevel: 'beginner' | 'intermediate' | 'advanced'
      weeklyBudget: number | null
    }

    // Map skill level → budget_level for the household table
    const budgetLevel = body.weeklyBudget
      ? body.weeklyBudget <= 75
        ? 'low'
        : body.weeklyBudget <= 150
        ? 'medium'
        : 'high'
      : 'medium'

    // Upsert household
    const { error: householdError } = await supabase
      .from('households')
      .upsert(
        {
          owner_user_id: user.id,
          name: 'My Household',
          adults_count: body.householdSize,
          babies_count: 0,
          toddlers_count: 0,
          kids_count: 0,
          budget_level: budgetLevel,
          cooking_time_preference: body.skillLevel === 'beginner' ? 'quick' : 'any',
          cuisine_preferences: [],
          low_energy_mode: body.skillLevel === 'beginner',
          one_pot_preference: body.skillLevel === 'beginner',
          leftovers_preference: true,
          pantry_staples: [],
          preferred_proteins: [],
          meals_per_day: 3,
        },
        { onConflict: 'owner_user_id' }
      )

    if (householdError) throw householdError

    // Mark onboarding complete on profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
