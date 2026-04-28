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

    // Check subscription tier to decide whether to persist preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const isPaid = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'plus'

    // Only save preferences for paid users
    if (isPaid) {
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

      if (prefError) {
        console.error('[onboarding] preference save error:', prefError.message)
        // Non-fatal for onboarding completion
      }
    }

    // Always mark onboarding complete regardless of tier
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        has_completed_onboarding: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('[onboarding] profile update error:', profileError.message)
      // If profile update fails, still return ok so user isn't stuck
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[onboarding] unexpected error:', message)
    // Return ok anyway to prevent user from being stuck in onboarding loop
    return NextResponse.json({ ok: true })
  }
}
