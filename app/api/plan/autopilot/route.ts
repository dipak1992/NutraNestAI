import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { loadWeekPlan, getCurrentWeekStart } from '@/app/plan/loader'
import { getActiveLeftoverIngredients } from '@/app/api/leftovers/route'
import { AUTOPILOT_SYSTEM_PROMPT, buildAutopilotPrompt } from '@/lib/plan/autopilot-prompt'
import type { AutopilotOptions, AutopilotResult } from '@/lib/plan/types'
import type { Recipe } from '@/lib/dashboard/types'

// ─── POST /api/plan/autopilot ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Lazy-init so the key is read at request time, not build time
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    weekStart: rawWeekStart,
    options = {},
  } = body as { weekStart?: string; options?: Partial<AutopilotOptions> }

  const weekStart = rawWeekStart ?? getCurrentWeekStart()

  const autopilotOptions: AutopilotOptions = {
    respectLocked: options.respectLocked ?? true,
    overwriteEmptyOnly: options.overwriteEmptyOnly ?? true,
    budgetCap: options.budgetCap,
    mealType: options.mealType,
  }

  try {
    // ── 1. Load current plan ─────────────────────────────────────────────────
    const currentPlan = await loadWeekPlan(user.id, weekStart)

    // ── 2. Load household preferences ───────────────────────────────────────
    const { data: householdRow } = await supabase
      .from('household_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    const household = {
      size: (householdRow?.household_size as number) ?? 2,
      dietary: (householdRow?.dietary_restrictions as string[]) ?? [],
      dislikes: (householdRow?.dislikes as string[]) ?? [],
      skillLevel: (householdRow?.skill_level as string) ?? 'intermediate',
    }

    // ── 3. Load budget ───────────────────────────────────────────────────────
    const { data: budgetRow } = await supabase
      .from('budgets')
      .select('weekly_limit, strict_mode')
      .eq('user_id', user.id)
      .maybeSingle()

    const { data: weekSpendRow } = await supabase
      .from('budget_weekly_spend')
      .select('spent')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .maybeSingle()

    const budget = {
      weeklyLimit: (budgetRow?.weekly_limit as number | null) ?? null,
      strictMode: (budgetRow?.strict_mode as boolean) ?? false,
      spentThisWeek: (weekSpendRow?.spent as number) ?? 0,
    }

    // ── 4. Load active leftovers ─────────────────────────────────────────────
    const leftoverIngredients = await getActiveLeftoverIngredients(user.id)

    const { data: leftoverRows } = await supabase
      .from('leftovers')
      .select('name, main_ingredients, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(10)

    const activeLeftovers = (leftoverRows ?? []).map((row) => {
      const expiresAt = new Date(row.expires_at as string)
      const now = new Date()
      const expiresInDays = Math.max(
        0,
        Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      )
      return {
        name: row.name as string,
        ingredients: leftoverIngredients,
        expiresInDays,
      }
    })

    // ── 5. Load pantry items ─────────────────────────────────────────────────
    const { data: pantryRows } = await supabase
      .from('pantry_items')
      .select('name')
      .eq('user_id', user.id)
      .limit(30)

    const pantryItems = (pantryRows ?? []).map((r) => r.name as string)

    // ── 6. Determine locked vs days to fill ──────────────────────────────────
    const lockedDays = currentPlan.days
      .filter((d) => d.locked && d.recipe)
      .map((d) => ({ dayAbbrev: d.dayAbbrev, recipeName: d.recipe!.name }))

    const daysToFill = currentPlan.days
      .filter((d) => {
        if (d.locked) return false
        if (autopilotOptions.overwriteEmptyOnly && d.recipe) return false
        return true
      })
      .map((d) => ({ dayIndex: d.dayIndex, dayAbbrev: d.dayAbbrev, date: d.date }))

    if (daysToFill.length === 0) {
      return NextResponse.json(
        { error: 'All days are locked or filled. Unlock some days first.' },
        { status: 400 },
      )
    }

    // ── 7. Build prompt & call AI ────────────────────────────────────────────
    const userPrompt = buildAutopilotPrompt({
      household,
      budget,
      activeLeftovers,
      pantryItems,
      lockedDays,
      daysToFill,
      options: autopilotOptions,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AUTOPILOT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw) as {
      days: Array<{
        dayIndex: number
        dayAbbrev: string
        recipe: Recipe & { ingredients?: string[] }
        reason: string
        usesLeftoverId: string | null
      }>
    }

    // ── 8. Upsert day rows into DB ───────────────────────────────────────────
    const planRow = await ensurePlanRow(supabase, user.id, weekStart)

    for (const aiDay of parsed.days ?? []) {
      const recipe = aiDay.recipe
      if (!recipe) continue

      // Upsert recipe into recipes table
      const { data: recipeRow } = await supabase
        .from('recipes')
        .upsert(
          {
            id: recipe.id,
            name: recipe.name,
            image: recipe.image ?? '',
            cook_time_min: recipe.cookTimeMin ?? 30,
            difficulty: recipe.difficulty ?? 'easy',
            servings: recipe.servings ?? household.size,
            cost_total: recipe.costTotal ?? 0,
            cost_per_serving: recipe.costPerServing ?? 0,
            tags: recipe.tags ?? [],
            ingredients: recipe.ingredients ?? [],
            user_id: user.id,
          },
          { onConflict: 'id' },
        )
        .select('id')
        .single()

      const recipeId = recipeRow?.id ?? recipe.id

      // Upsert day row
      await supabase.from('week_plan_days').upsert(
        {
          plan_id: planRow.id,
          day_index: aiDay.dayIndex,
          recipe_id: recipeId,
          status: 'planned',
          locked: false,
          estimated_cost: recipe.costTotal ?? null,
          notes: aiDay.reason ?? null,
        },
        { onConflict: 'plan_id,day_index' },
      )
    }

    // ── 9. Mark plan as autopilot ────────────────────────────────────────────
    await supabase
      .from('week_plans')
      .update({ is_autopilot: true })
      .eq('id', planRow.id)

    // ── 10. Reload and return full plan ──────────────────────────────────────
    const updatedPlan = await loadWeekPlan(user.id, weekStart)

    const daysGenerated = parsed.days?.length ?? 0
    const estimatedTotalCost = updatedPlan.stats.totalEstimatedCost
    const leftoversUsed = (parsed.days ?? []).filter((d) => d.usesLeftoverId).length
    const uniqueProteins = new Set(
      (parsed.days ?? [])
        .map((d) => {
          const text = (d.recipe?.name ?? '').toLowerCase()
          const proteins = ['chicken', 'beef', 'pork', 'turkey', 'salmon', 'tuna', 'shrimp', 'tofu', 'lentil']
          return proteins.find((p) => text.includes(p)) ?? null
        })
        .filter(Boolean),
    ).size

    const result: AutopilotResult = {
      weekPlan: updatedPlan,
      summary: {
        daysGenerated,
        estimatedTotalCost,
        leftoversUsed,
        uniqueProteins,
      },
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error('[POST /api/plan/autopilot]', e)
    return NextResponse.json({ error: 'Autopilot failed' }, { status: 500 })
  }
}

// ─── Helper: ensure week_plans row exists ─────────────────────────────────────

async function ensurePlanRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  weekStart: string,
) {
  const weekEnd = (() => {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() + 6)
    return d.toISOString().slice(0, 10)
  })()

  const { data: existing } = await supabase
    .from('week_plans')
    .select('id')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .maybeSingle()

  if (existing) return existing

  const { data: inserted } = await supabase
    .from('week_plans')
    .insert({ user_id: userId, week_start: weekStart, week_end: weekEnd, is_autopilot: false })
    .select('id')
    .single()

  return inserted!
}
