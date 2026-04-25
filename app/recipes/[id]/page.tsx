import { loadRecipe } from './loader'
import { RecipeHero } from '@/components/recipes/RecipeHero'
import { IngredientList } from '@/components/recipes/IngredientList'
import { NutritionCard } from '@/components/recipes/NutritionCard'
import { RecipeActions } from '@/components/recipes/RecipeActions'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const meal = await loadRecipe(id)
  return {
    title: `${meal.title} — NutriNest AI`,
    description: meal.description,
  }
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params
  const meal = await loadRecipe(id)

  return (
    <main className="min-h-screen bg-[#0f0f0f] pb-16">
      <div className="mx-auto max-w-2xl px-4 pt-4">
        {/* Hero */}
        <RecipeHero meal={meal} />

        <div className="mt-6 space-y-5">
          {/* Actions */}
          <RecipeActions meal={meal} recipeId={id} />

          {/* Instructions */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-base font-semibold text-white">Instructions</h2>
            <ol className="space-y-4">
              {meal.base_instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D97757]/20 text-xs font-bold text-[#D97757]">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/80">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Ingredients */}
          <IngredientList ingredients={meal.base_ingredients} />

          {/* Nutrition (if available via tags/notes) */}
          {meal.tags.length > 0 && (
            <NutritionCard
              nutrition={{
                calories: meal.tags.includes('high_protein') ? 450 : undefined,
                protein: meal.tags.includes('high_protein') ? 35 : undefined,
              }}
            />
          )}

          {/* Safety notes */}
          {meal.safety_notes.length > 0 && (
            <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h2 className="mb-3 text-sm font-semibold text-amber-400">⚠️ Safety notes</h2>
              <ul className="space-y-1.5">
                {meal.safety_notes.map((note, i) => (
                  <li key={i} className="text-sm text-white/70">{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
