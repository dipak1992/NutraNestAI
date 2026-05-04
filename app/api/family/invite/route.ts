import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cleanString, validationError } from '@/lib/validation/input'
import { ensureHousehold } from '@/lib/family/service'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email().max(254),
  role: z.enum(['viewer', 'editor']).default('editor'),
  firstName: cleanString(80).optional(),
}).strict()

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = inviteSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: validationError(parsed.error) }, { status: 400 })

  const household = await ensureHousehold(supabase as any, user.id)
  const token = randomBytes(24).toString('base64url')
  const email = parsed.data.email.toLowerCase()

  const { data, error } = await supabase
    .from('household_invites')
    .insert({
      household_id: household.id,
      invited_by: user.id,
      email,
      role: parsed.data.role,
      token,
    })
    .select('id, email, role, token, expires_at')
    .single()

  if (error) {
    console.error('[family/invite] insert failed', error.message)
    return NextResponse.json({ error: 'Unable to create invite' }, { status: 500 })
  }

  await supabase
    .from('household_members')
    .insert({
      household_id: household.id,
      user_id: user.id,
      first_name: parsed.data.firstName || email.split('@')[0],
      member_name: parsed.data.firstName || email.split('@')[0],
      role: 'adult',
      invited_email: email,
      invite_status: 'pending',
      invite_role: parsed.data.role,
      display_order: 99,
    })

  return NextResponse.json({
    ok: true,
    invite: data,
    inviteUrl: `/signup?household_invite=${token}`,
    reward: 'When your co-chef joins, both accounts are eligible for one free Plus month.',
  })
}
