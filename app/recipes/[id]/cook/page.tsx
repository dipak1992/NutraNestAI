import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadRecipe } from '../loader'
import { CookMode } from '@/components/recipes/CookMode'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Cook Mode — NutriNest AI',
}

export default async function CookPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const recipe = await loadRecipe(id)

  // Create or resume a cook session
  const { data: existing } = await supabase
    .from('cook_sessions')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (!existing) {
    await supabase.from('cook_sessions').insert({
      user_id: user.id,
      recipe_id: id,
      status: 'active',
      started_at: new Date().toISOString(),
    })
  }

  return <CookMode recipe={recipe} recipeId={id} />
}
