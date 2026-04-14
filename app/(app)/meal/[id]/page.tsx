import { notFound } from 'next/navigation'
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ChefHat, ShieldCheck } from 'lucide-react'
import type { Meal, MealVariation } from '@/types'

export const metadata = { title: 'Meal Detail' }

function findMealById(id: string): Meal | null {
  for (const day of DEMO_WEEKLY_PLAN.days) {
    const meal = day.meals?.find((m) => m.id === id)
    if (meal) return meal
  }
  return null
}

function MemberVariation({ variation }: { variation: MealVariation }) {
  const stageColors: Record<string, string> = {
    baby: 'bg-purple-100 text-purple-700',
    toddler: 'bg-amber-100 text-amber-700',
    kid: 'bg-emerald-100 text-emerald-700',
    teen: 'bg-cyan-100 text-cyan-700',
    adult: 'bg-blue-100 text-blue-700',
    senior: 'bg-slate-100 text-slate-700',
    pregnant: 'bg-pink-100 text-pink-700',
    breastfeeding: 'bg-rose-100 text-rose-700',
  }
  const colorClass = stageColors[variation.life_stage] ?? 'bg-gray-100 text-gray-700'
  return (
    <div className="glass-card rounded-xl border border-border/60 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{variation.member_name}</span>
        <Badge className={`${colorClass} border-0 text-xs capitalize`}>{variation.life_stage}</Badge>
        {variation.is_safe !== false && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs"><ShieldCheck className="h-3 w-3 mr-1" />Safe</Badge>}
      </div>
      {variation.notes && <p className="text-sm text-muted-foreground">{variation.notes}</p>}
      {variation.modifications && variation.modifications.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Modifications:</p>
          <ul className="space-y-1">
            {variation.modifications.map((mod, i) => <li key={i} className="text-sm">• {mod}</li>)}
          </ul>
        </div>
      )}
      {variation.ingredients && variation.ingredients.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Ingredients ({variation.serving_size}):</p>
          <div className="flex flex-wrap gap-1.5">
            {variation.ingredients.map((ing, i) => (
              <span key={i} className="text-xs bg-muted/60 rounded-full px-2.5 py-1">{ing.amount} {ing.unit} {ing.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const meal = findMealById(id)
  if (!meal) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="capitalize">{meal.meal_type}</Badge>
          {meal.cuisine_type && <Badge variant="outline">{meal.cuisine_type}</Badge>}
        </div>
        <h1 className="text-3xl font-bold mb-3">{meal.name}</h1>
        {meal.description && <p className="text-muted-foreground text-lg leading-relaxed">{meal.description}</p>}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          {meal.prep_time_minutes && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Prep: {meal.prep_time_minutes} min</span>}
          {meal.cook_time_minutes && <span className="flex items-center gap-1.5"><ChefHat className="h-4 w-4" />Cook: {meal.cook_time_minutes} min</span>}
          {meal.variations && <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{meal.variations.length} variations</span>}
        </div>
      </div>

      {meal.base_ingredients && meal.base_ingredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Base Ingredients</h2>
          <div className="glass-card rounded-xl border border-border/60 p-5">
            <ul className="space-y-2">
              {meal.base_ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="font-medium">{ing.amount} {ing.unit}</span>
                  <span>{ing.name}</span>
                  {ing.notes && <span className="text-muted-foreground">({ing.notes})</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {meal.instructions && meal.instructions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="glass-card rounded-xl border border-border/60 p-5">
            <ol className="space-y-3">
              {meal.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {meal.variations && meal.variations.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Family Variations</h2>
          <p className="text-sm text-muted-foreground mb-4">Each family member gets their own safe, tailored version of this meal.</p>
          <div className="space-y-4">
            {meal.variations.map((v) => <MemberVariation key={v.id} variation={v} />)}
          </div>
        </section>
      )}
    </div>
  )
}
