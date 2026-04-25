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
  const meal = await loadRecipe(id)

  return <CookMode meal={meal} recipeId={id} />
}
