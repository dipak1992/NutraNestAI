import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadWeekPlan, getCurrentWeekStart } from '@/app/plan/loader'

// ─── GET /api/plan?weekStart=YYYY-MM-DD ───────────────────────────────────────

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get('weekStart') ?? getCurrentWeekStart()

  try {
    const plan = await loadWeekPlan(user.id, weekStart)
    return NextResponse.json(plan)
  } catch (e) {
    console.error('[GET /api/plan]', e)
    return NextResponse.json({ error: 'Failed to load plan' }, { status: 500 })
  }
}

// ─── PATCH /api/plan ──────────────────────────────────────────────────────────
// Actions: reorder | toggle_lock | mark_cooked | clear

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { action } = body as { action: string }

  try {
    switch (action) {
      // ── reorder ─────────────────────────────────────────────────────────────
      case 'reorder': {
        const { weekStart, orderedDayIds } = body as {
          weekStart: string
          orderedDayIds: string[]
        }

        // Get the plan row
        const { data: planRow } = await supabase
          .from('week_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('week_start', weekStart)
          .maybeSingle()

        if (!planRow) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

        // Load current day rows in order
        const { data: dayRows } = await supabase
          .from('week_plan_days')
          .select('id, day_index, recipe_id, status, locked, estimated_cost, notes')
          .eq('plan_id', planRow.id)
          .order('day_index', { ascending: true })

        if (!dayRows) return NextResponse.json({ ok: true })

        // Build a map of id → row
        const byId = new Map(dayRows.map((r) => [r.id as string, r]))
        const sortedByIndex = [...dayRows].sort(
          (a, b) => (a.day_index as number) - (b.day_index as number),
        )

        // For each target slot (by dayIndex), assign the recipe from the source id
        const updates = sortedByIndex.map((target, i) => {
          const sourceId = orderedDayIds[i]
          const source = byId.get(sourceId)
          if (!source) return null
          return supabase
            .from('week_plan_days')
            .update({
              recipe_id: source.recipe_id,
              status: source.status,
              locked: source.locked,
              estimated_cost: source.estimated_cost,
              notes: source.notes,
            })
            .eq('id', target.id as string)
        })

        await Promise.all(updates.filter(Boolean))
        return NextResponse.json({ ok: true })
      }

      // ── toggle_lock ─────────────────────────────────────────────────────────
      case 'toggle_lock': {
        const { dayId } = body as { dayId: string }

        const { data: row } = await supabase
          .from('week_plan_days')
          .select('locked')
          .eq('id', dayId)
          .maybeSingle()

        if (!row) return NextResponse.json({ error: 'Day not found' }, { status: 404 })

        await supabase
          .from('week_plan_days')
          .update({ locked: !(row.locked as boolean) })
          .eq('id', dayId)

        return NextResponse.json({ ok: true })
      }

      // ── mark_cooked ─────────────────────────────────────────────────────────
      case 'mark_cooked': {
        const { dayId } = body as { dayId: string }

        await supabase
          .from('week_plan_days')
          .update({ status: 'cooked' })
          .eq('id', dayId)

        return NextResponse.json({ ok: true })
      }

      // ── clear ────────────────────────────────────────────────────────────────
      case 'clear': {
        const { dayId } = body as { dayId: string }

        await supabase
          .from('week_plan_days')
          .update({
            recipe_id: null,
            status: 'empty',
            locked: false,
            estimated_cost: null,
            notes: null,
          })
          .eq('id', dayId)

        return NextResponse.json({ ok: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (e) {
    console.error('[PATCH /api/plan]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
