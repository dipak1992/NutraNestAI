import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const promises: PromiseLike<unknown>[] = []

    // Persist household name to user metadata
    if (typeof body.householdName === 'string') {
      promises.push(
        supabase.auth.updateUser({ data: { household_name: body.householdName } })
      )
    }

    // Persist preferences to onboarding_preferences table
    const prefPayload: Record<string, unknown> = { user_id: user.id, updated_at: new Date().toISOString() }
    if (Array.isArray(body.cuisines)) prefPayload.cuisines = body.cuisines
    if (typeof body.cookingTimeMinutes === 'number') prefPayload.cooking_time_minutes = body.cookingTimeMinutes

    if (Object.keys(prefPayload).length > 2) {
      promises.push(
        supabase
          .from('onboarding_preferences')
          .upsert(prefPayload, { onConflict: 'user_id' })
          .then()
      )
    }

    await Promise.all(promises)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createSupabaseServiceClient()

  // Remove all user-owned data rows first
  await Promise.all([
    admin.from('pantry_items').delete().eq('user_id', user.id),
    admin.from('saved_meals').delete().eq('user_id', user.id),
    admin.from('onboarding_preferences').delete().eq('user_id', user.id),
  ])

  // Remove profile row (FK reference)
  await admin.from('profiles').delete().eq('id', user.id)

  // Delete the auth user last
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
