import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateSlug } from '@/lib/content/types'
import type { SmartMealResult } from '@/lib/engine/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('saved_meals')
    .select('id, slug, title, description, cuisine_type, is_public, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ meals: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { meal?: SmartMealResult }
  const meal = body?.meal

  if (!meal?.id || !meal?.title) {
    return NextResponse.json({ error: 'Invalid meal data' }, { status: 400 })
  }

  const slug = generateSlug(meal.title)

  const { data, error } = await supabase
    .from('saved_meals')
    .insert({
      user_id: user.id,
      slug,
      title: meal.title,
      description: (meal as { description?: string }).description ?? null,
      cuisine_type: meal.cuisineType ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meal_data: meal as any,
      is_public: false,
    })
    .select('id, slug')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 })
}
