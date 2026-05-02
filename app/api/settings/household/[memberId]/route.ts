import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cleanString, stringArraySchema, uuidSchema, validationError } from '@/lib/validation/input'
import { z } from 'zod'

type Params = { params: Promise<{ memberId: string }> }

const legacyHouseholdPatchSchema = z.object({
  first_name: cleanString(80).optional(),
  member_name: cleanString(80).optional(),
  role: z.enum(['adult', 'teen', 'child', 'toddler', 'baby', 'member']).optional(),
  age_years: z.coerce.number().int().min(0).max(120).nullable().optional(),
  age_range: z.string().max(40).nullable().optional(),
  dietary_type: z.string().max(80).nullable().optional(),
  allergies_json: stringArraySchema(30, 80).optional(),
  notes: z.string().transform((v) => v.trim().slice(0, 1000)).nullable().optional(),
}).strict()

// ─── DELETE /api/settings/household/[memberId] ────────────────────────────────

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const rawParams = await params
    const parsedId = uuidSchema.safeParse(rawParams.memberId)
    if (!parsedId.success) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const memberId = parsedId.data
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
    console.error('[settings/household DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete household member' }, { status: 500 })
  }
}

// ─── PATCH /api/settings/household/[memberId] ─────────────────────────────────

export async function PATCH(req: Request, { params }: Params) {
  try {
    const rawParams = await params
    const parsedId = uuidSchema.safeParse(rawParams.memberId)
    if (!parsedId.success) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const memberId = parsedId.data
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const parsed = legacyHouseholdPatchSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: validationError(parsed.error) }, { status: 400 })
    const body = parsed.data
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const [key, value] of Object.entries(body)) patch[key] = value
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
    console.error('[settings/household PATCH]', err)
    return NextResponse.json({ error: 'Failed to update household member' }, { status: 500 })
  }
}
