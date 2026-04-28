import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'
import { loadRecipe } from '../loader'
import { CookMode } from '@/components/recipes/CookMode'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Cook Mode — MealEase AI',
}

export default async function CookPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [recipe, paywall] = await Promise.all([
    loadRecipe(id),
    getPaywallStatus(),
  ])

  const isPlusMember = paywall.isPro || paywall.isFamily

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

  return <CookMode recipe={recipe} recipeId={id} isPlusMember={isPlusMember} />
}
