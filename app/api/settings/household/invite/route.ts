import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── POST /api/settings/household/invite ──────────────────────────────────────

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { email } = await req.json() as { email: string }
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    // Get household
    const { data: household } = await supabase
      .from('households')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!household) return NextResponse.json({ error: 'No household found' }, { status: 404 })

    // Insert invite record (table: household_invites)
    const { error } = await supabase
      .from('household_invites')
      .insert({
        household_id: household.id,
        invited_by: user.id,
        email,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
