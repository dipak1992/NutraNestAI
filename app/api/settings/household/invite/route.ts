import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailSchema, validationError } from '@/lib/validation/input'
import { z } from 'zod'

const inviteSchema = z.object({ email: emailSchema }).strict()

// ─── POST /api/settings/household/invite ──────────────────────────────────────

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const parsed = inviteSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: validationError(parsed.error) }, { status: 400 })
    const { email } = parsed.data

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
    console.error('[settings/household/invite]', err)
    return NextResponse.json({ error: 'Failed to invite household member' }, { status: 500 })
  }
}
