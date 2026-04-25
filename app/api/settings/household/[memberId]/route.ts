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

    // Verify ownership
    const { data: household } = await supabase
      .from('households')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!household) return NextResponse.json({ error: 'No household found' }, { status: 404 })

    const { error } = await supabase
      .from('household_members')
      .delete()
      .eq('id', memberId)
      .eq('household_id', household.id)

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

    const { data: household } = await supabase
      .from('households')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!household) return NextResponse.json({ error: 'No household found' }, { status: 404 })

    const { error } = await supabase
      .from('household_members')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .eq('household_id', household.id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
