import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ memberId: string }> }

// ─── DELETE /api/settings/household/[memberId] ────────────────────────────────

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { memberId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete only if this user is the household owner
    const { error } = await supabase
      .from('household_members')
      .delete()
      .eq('id', memberId)
      .eq('household_owner_id', user.id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── PATCH /api/settings/household/[memberId] ─────────────────────────────────

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { memberId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as Record<string, unknown>

    const allowed = [
      'first_name',
      'member_name',
      'role',
      'age_years',
      'age_range',
      'dietary_type',
      'allergies_json',
      'notes',
    ]
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const key of allowed) {
      if (key in body) patch[key] = body[key]
    }
    if ('first_name' in patch && typeof patch.first_name === 'string') {
      patch.member_name = patch.first_name
    }

    // Update only if this user is the household owner
    const { error } = await supabase
      .from('household_members')
      .update(patch)
      .eq('id', memberId)
      .eq('household_owner_id', user.id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
