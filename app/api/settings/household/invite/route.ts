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

    // Insert into household_members
    const { data: member, error } = await supabase
      .from('household_members')
      .insert({
        household_owner_id: user.id,
        invited_email: email,
        role: 'member',
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select('id, invited_email, role, status, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, member })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
