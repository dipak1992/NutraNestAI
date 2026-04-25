import { ShoppingCart } from 'lucide-react'
import type { Ingredient } from '@/types'

type Props = {
  ingredients: Ingredient[]
  servings?: number
}

export function IngredientList({ ingredients, servings = 4 }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <ShoppingCart className="h-4 w-4 text-[#D97757]" />
          Ingredients
        </h2>
        <span className="text-xs text-white/40">Serves {servings}</span>
      </div>

      <ul className="space-y-2.5">
        {ingredients.map((ing, i) => (
          <li key={i} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97757]" />
              <span className="text-sm text-white/80">{ing.name}</span>
            </div>
            <span className="shrink-0 text-sm text-white/50">
              {ing.quantity} {ing.unit}
            </span>
          </li>
        ))}
      </ul>

      {/* Category groups if available */}
      {ingredients.some((i) => i.category) && (
        <p className="mt-3 text-xs text-white/30">
          Grouped by category in your grocery list.
        </p>
      )}
    </div>
  )
}
