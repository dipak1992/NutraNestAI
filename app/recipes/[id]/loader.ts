import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Meal } from '@/types'

// ─── loadRecipe ───────────────────────────────────────────────────────────────

export async function loadRecipe(id: string): Promise<Meal> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      variations:meal_variations(*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return data as Meal
}
