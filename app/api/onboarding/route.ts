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

    // Upsert household_preferences
    const { error: prefError } = await supabase
      .from('household_preferences')
      .upsert(
        {
          user_id: user.id,
          household_size: body.householdSize,
          dietary_restrictions: body.dietary,
          disliked_ingredients: body.dislikes,
          skill_level: body.skillLevel,
          weekly_budget: body.weeklyBudget,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (prefError) throw prefError

    // Mark onboarding complete on profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        has_completed_onboarding: true,
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
