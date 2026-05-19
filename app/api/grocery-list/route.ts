import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { persistNormalizedPlanAndGrocery } from '@/lib/planner/persistence'
import { ensureHousehold, getHouseholdForUser } from '@/lib/family/service'

const grocerySaveSchema = z.object({
  weekStart: z.string().min(8).max(16),
  groceryList: z.unknown(),
}).strict()

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const weekStart = url.searchParams.get('weekStart') ?? getWeekStart()
  const household = await getHouseholdForUser(supabase as any, user.id)
    ?? await ensureHousehold(supabase as any, user.id)
  const { data, error } = await supabase
    .from('weekly_plans')
    .select('week_of, planner_payload, grocery_list, updated_at, household_id, last_edited_by, approval_status, approved_at')
    .eq('week_of', weekStart)
    .or(`user_id.eq.${user.id},household_id.eq.${household.id}`)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[grocery-list/get]', error.message)
    return NextResponse.json({ error: 'Could not load grocery list' }, { status: 500 })
  }

  return NextResponse.json({
    weekStart,
    plan: data?.planner_payload ?? null,
    groceryList: data?.grocery_list ?? null,
    updatedAt: data?.updated_at ?? null,
    household,
    approvalStatus: data?.approval_status ?? 'draft',
    approvedAt: data?.approved_at ?? null,
  })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = grocerySaveSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid grocery list payload' }, { status: 400 })
  }

  const { weekStart, groceryList } = parsed.data
  const household = await getHouseholdForUser(supabase as any, user.id)
    ?? await ensureHousehold(supabase as any, user.id)
  const { data: existingPlan } = await supabase
    .from('weekly_plans')
    .select('id')
    .eq('household_id', household.id)
    .eq('week_of', weekStart)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const payload = {
    user_id: household.owner_user_id ?? user.id,
    household_id: household.id,
    last_edited_by: user.id,
    week_of: weekStart,
    grocery_list: groceryList,
    status: 'active',
    approval_status: 'needs_review',
    updated_at: new Date().toISOString(),
  }

  const { error } = existingPlan?.id
    ? await supabase.from('weekly_plans').update(payload).eq('id', existingPlan.id)
    : await supabase.from('weekly_plans').insert(payload)

  if (error) {
    console.error('[grocery-list/patch]', error.message)
    return NextResponse.json({ error: 'Could not save grocery list' }, { status: 500 })
  }

  try {
    await persistNormalizedPlanAndGrocery(supabase, {
      userId: user.id,
      householdId: household.id,
      weekStart,
      groceryList,
      source: 'grocery_edit',
    })
  } catch (normalizedError) {
    const message = normalizedError instanceof Error ? normalizedError.message : 'Unknown normalized persistence error'
    console.error('[grocery-list/patch/normalized]', message)
  }

  await supabase.from('household_workspace_events').insert({
    household_id: household.id,
    actor_user_id: user.id,
    event_type: 'grocery_item_added',
    subject_type: 'grocery_list',
    subject_id: weekStart,
    payload: {
      weekStart,
      itemCount: Array.isArray((groceryList as any)?.items) ? (groceryList as any).items.length : null,
    },
  })

  return NextResponse.json({ ok: true })
}
