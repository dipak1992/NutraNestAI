import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/family/service'

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string').map((v) => v.trim()).filter(Boolean)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tier = await getUserTier(supabase as any, user.id)
  if (tier !== 'pro') {
    return NextResponse.json(
      { error: 'Upgrade to Pro to personalize meals for every family member.' },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}
  const allowed = [
    'first_name',
    'role',
    'age_years',
    'age_range',
    'dietary_type',
    'spice_tolerance',
    'picky_eater_level',
    'portion_size',
    'school_lunch_needed',
    'snack_frequency',
    'texture_sensitivity',
    'allergy_notes',
    'notes',
    'is_primary_shopper',
    'is_primary_cook',
    'display_order',
  ]

  for (const key of allowed) {
    if (key in body) patch[key] = (body as any)[key]
  }

  if ('first_name' in patch && typeof patch.first_name === 'string') {
    patch.member_name = patch.first_name
  }

  if ('allergies_json' in body) patch.allergies_json = toStringArray((body as any).allergies_json)
  if ('foods_loved_json' in body) patch.foods_loved_json = toStringArray((body as any).foods_loved_json)
  if ('foods_disliked_json' in body) patch.foods_disliked_json = toStringArray((body as any).foods_disliked_json)
  if ('protein_preferences_json' in body) patch.protein_preferences_json = toStringArray((body as any).protein_preferences_json)
  if ('cuisine_likes_json' in body) patch.cuisine_likes_json = toStringArray((body as any).cuisine_likes_json)
  if ('foods_accepted_json' in body) patch.foods_accepted_json = toStringArray((body as any).foods_accepted_json)
  if ('foods_rejected_json' in body) patch.foods_rejected_json = toStringArray((body as any).foods_rejected_json)

  const { data, error } = await supabase
    .from('household_members')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to update family member' }, { status: 500 })
  return NextResponse.json({ ok: true, member: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tier = await getUserTier(supabase as any, user.id)
  if (tier !== 'pro') {
    return NextResponse.json(
      { error: 'Upgrade to Pro to personalize meals for every family member.' },
      { status: 403 },
    )
  }

  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to remove family member' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
