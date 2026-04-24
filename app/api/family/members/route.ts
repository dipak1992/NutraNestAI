import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  buildFamilyEngineOverrides,
  ensureHousehold,
  getFamilyMembers,
  getMaxMembersForTier,
  getTierUpgradeMessage,
  getUserTier,
  summarizeHousehold,
} from '@/lib/family/service'

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string').map((v) => v.trim()).filter(Boolean)
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tier = await getUserTier(supabase as any, user.id)
  const maxMembers = getMaxMembersForTier(tier)
  const household = await ensureHousehold(supabase as any, user.id)
  const members = await getFamilyMembers(supabase as any, user.id)
  const summary = summarizeHousehold(members)

  return NextResponse.json({
    tier,
    maxMembers,
    household,
    members,
    summary,
    upgradeMessage: getTierUpgradeMessage(tier),
    engineOverrides: buildFamilyEngineOverrides(members),
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tier = await getUserTier(supabase as any, user.id)
  const maxMembers = getMaxMembersForTier(tier)

  const household = await ensureHousehold(supabase as any, user.id)
  const existing = await getFamilyMembers(supabase as any, user.id)

  if (existing.length >= maxMembers) {
    const upgradeMsg = getTierUpgradeMessage(tier)
    const limitMsg = `You've reached your ${maxMembers}-profile limit.`
    return NextResponse.json(
      { error: upgradeMsg ? `${limitMsg} ${upgradeMsg}` : limitMsg },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const firstName = String((body as any).first_name ?? '').trim()
  const role = String((body as any).role ?? '').trim()

  if (!firstName) return NextResponse.json({ error: 'first_name is required' }, { status: 400 })
  if (!['adult', 'teen', 'child', 'toddler', 'baby'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Pro tier gets simplified profiles (name + role + allergies + dietary only)
  // Family Plus gets full rich profiles
  const isFullProfile = tier === 'family'

  const payload: Record<string, unknown> = {
    household_id: household.id,
    user_id: user.id,
    member_name: firstName,
    first_name: firstName,
    role,
    age_years: Number.isFinite((body as any).age_years) ? Number((body as any).age_years) : null,
    age_range: typeof (body as any).age_range === 'string' ? (body as any).age_range : null,
    dietary_type: typeof (body as any).dietary_type === 'string' ? (body as any).dietary_type : null,
    allergies_json: toStringArray((body as any).allergies_json),
    display_order: Number.isFinite((body as any).display_order) ? Number((body as any).display_order) : existing.length,
  }

  // Full profile fields — only for Family Plus
  if (isFullProfile) {
    Object.assign(payload, {
      foods_loved_json: toStringArray((body as any).foods_loved_json),
      foods_disliked_json: toStringArray((body as any).foods_disliked_json),
      protein_preferences_json: toStringArray((body as any).protein_preferences_json),
      cuisine_likes_json: toStringArray((body as any).cuisine_likes_json),
      spice_tolerance: typeof (body as any).spice_tolerance === 'string' ? (body as any).spice_tolerance : null,
      picky_eater_level: Number.isFinite((body as any).picky_eater_level) ? Number((body as any).picky_eater_level) : 0,
      portion_size: typeof (body as any).portion_size === 'string' ? (body as any).portion_size : null,
      school_lunch_needed: Boolean((body as any).school_lunch_needed),
      snack_frequency: typeof (body as any).snack_frequency === 'string' ? (body as any).snack_frequency : null,
      texture_sensitivity: typeof (body as any).texture_sensitivity === 'string' ? (body as any).texture_sensitivity : null,
      foods_accepted_json: toStringArray((body as any).foods_accepted_json),
      foods_rejected_json: toStringArray((body as any).foods_rejected_json),
      allergy_notes: typeof (body as any).allergy_notes === 'string' ? (body as any).allergy_notes : null,
      notes: typeof (body as any).notes === 'string' ? (body as any).notes : null,
      is_primary_shopper: Boolean((body as any).is_primary_shopper),
      is_primary_cook: Boolean((body as any).is_primary_cook),
      weight_goal: typeof (body as any).weight_goal === 'string' ? (body as any).weight_goal : null,
    })
  }

  const { data, error } = await supabase
    .from('household_members')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to add family member' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, member: data })
}
