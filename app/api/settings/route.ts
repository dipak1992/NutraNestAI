import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── PATCH /api/settings ──────────────────────────────────────────────────────

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as {
      full_name?: string
      dietary?: string[]
      dislikes?: string[]
      notifications?: Record<string, boolean>
      household?: {
        adults_count?: number
        kids_count?: number
        toddlers_count?: number
        babies_count?: number
        budget_level?: string
      }
    }

    // Update profile fields
    const profileUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.full_name !== undefined) profileUpdate.full_name = body.full_name
    if (body.dietary !== undefined)   profileUpdate.dietary_preferences = body.dietary
    if (body.dislikes !== undefined)  profileUpdate.disliked_foods = body.dislikes
    if (body.notifications !== undefined) profileUpdate.notification_prefs = body.notifications

    if (Object.keys(profileUpdate).length > 1) {
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id)
      if (error) throw error
    }

    // Update household fields
    if (body.household) {
      const { error } = await supabase
        .from('households')
        .update({ ...body.household, updated_at: new Date().toISOString() })
        .eq('owner_id', user.id)
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── DELETE /api/settings ─────────────────────────────────────────────────────

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete user data (cascades via RLS/FK in Supabase)
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
