import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

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
  const { data, error } = await supabase
    .from('weekly_plans')
    .select('week_of, planner_payload, grocery_list, updated_at')
    .eq('user_id', user.id)
    .eq('week_of', weekStart)
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
  const { error } = await supabase
    .from('weekly_plans')
    .upsert(
      {
        user_id: user.id,
        week_of: weekStart,
        grocery_list: groceryList,
        status: 'active',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,week_of' },
    )

  if (error) {
    console.error('[grocery-list/patch]', error.message)
    return NextResponse.json({ error: 'Could not save grocery list' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
