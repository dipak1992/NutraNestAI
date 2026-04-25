import { createClient } from '@/lib/supabase/server'
import type { Leftover, LeftoverInsights, MainIngredient } from '@/lib/leftovers/types'
import { getUrgency, getDaysUntilExpiry } from '@/lib/leftovers/expiration-calculator'

function enrichLeftover(row: Record<string, unknown>): Leftover {
  const expiresAt = row.expires_at as string
  return {
    id: row.id as string,
    userId: row.user_id as string,
    householdId: (row.household_id as string | null) ?? null,
    sourceRecipeId: (row.source_recipe_id as string | null) ?? null,
    name: row.name as string,
    image: (row.image as string | null) ?? null,
    mainIngredients: (row.main_ingredients as MainIngredient[]) ?? [],
    servingsRemaining: row.servings_remaining as number,
    originalCostPerServing: (row.original_cost_per_serving as number | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    cookedAt: row.cooked_at as string,
    expiresAt,
    status: row.status as Leftover['status'],
    usedAt: (row.used_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    urgency: getUrgency(expiresAt),
    daysUntilExpiry: getDaysUntilExpiry(expiresAt),
  }
}

export async function getLeftoversPayload(userId: string): Promise<{
  leftovers: Leftover[]
  insights: LeftoverInsights
}> {
  const supabase = await createClient()

  // Auto-expire stale leftovers
  await supabase
    .from('leftovers')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active')
    .lt('expires_at', new Date().toISOString())

  // Fetch all leftovers for this user
  const { data: rows, error } = await supabase
    .from('leftovers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[leftovers loader]', error)
    return { leftovers: [], insights: emptyInsights() }
  }

  const leftovers = (rows ?? []).map(enrichLeftover)

  // Compute insights
  const active = leftovers.filter((l) => l.status === 'active')
  const used = leftovers.filter((l) => l.status === 'used')
  const discardedOrExpired = leftovers.filter(
    (l) => l.status === 'discarded' || l.status === 'expired',
  )

  const totalSaved = used.reduce(
    (sum, l) => sum + (l.originalCostPerServing ?? 0) * l.servingsRemaining,
    0,
  )
  const totalWasted = discardedOrExpired.reduce(
    (sum, l) => sum + (l.originalCostPerServing ?? 0) * l.servingsRemaining,
    0,
  )

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const usedThisWeek = used.filter(
    (l) => l.usedAt && new Date(l.usedAt) >= oneWeekAgo,
  ).length

  const expiringSoonCount = active.filter(
    (l) => l.urgency === 'today' || l.urgency === 'soon',
  ).length

  const total = used.length + discardedOrExpired.length
  const wasteReductionPercent =
    total > 0 ? Math.round((used.length / total) * 100) : 0

  return {
    leftovers,
    insights: {
      totalSaved,
      totalWasted,
      activeCount: active.length,
      expiringSoonCount,
      usedThisWeek,
      wasteReductionPercent,
    },
  }
}

function emptyInsights(): LeftoverInsights {
  return {
    totalSaved: 0,
    totalWasted: 0,
    activeCount: 0,
    expiringSoonCount: 0,
    usedThisWeek: 0,
    wasteReductionPercent: 0,
  }
}
