'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Star, CheckCircle2, Minus, Plus } from 'lucide-react'
import type { LoadedRecipe } from '@/app/recipes/[id]/loader'

type Props = {
  recipe: LoadedRecipe
  recipeId: string
  onClose: () => void
}

export function CookCompleteDialog({ recipe, recipeId, onClose }: Props) {
  const router = useRouter()
  const [servingsCooked, setServingsCooked] = useState(recipe.servings)
  const [leftoverServings, setLeftoverServings] = useState(0)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/recipes/${recipeId}/cook-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servingsCooked,
          leftoverServings,
          rating: rating > 0 ? rating : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push('/dashboard?cooked=1')
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-[#0f0f0f] border-t border-white/10 shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        <div className="px-6 pb-10 pt-3 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl mb-1">🎉</div>
              <h2 className="text-xl font-bold text-white">Nice cooking!</h2>
              <p className="text-sm text-white/50 mt-0.5">{recipe.name}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Star rating */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
              Rate this recipe
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n === rating ? 0 : n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      n <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Servings cooked */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
              Servings cooked
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setServingsCooked((s) => Math.max(1, s - 1))}
                disabled={servingsCooked <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
                aria-label="Decrease servings"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-2xl font-bold text-white tabular-nums">
                {servingsCooked}
              </span>
              <button
                type="button"
                onClick={() => setServingsCooked((s) => Math.min(20, s + 1))}
                disabled={servingsCooked >= 20}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
                aria-label="Increase servings"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Leftover servings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                Leftover servings to track
              </p>
              <span className="text-sm font-bold text-white tabular-nums">
                {leftoverServings}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={servingsCooked}
              value={leftoverServings}
              onChange={(e) => setLeftoverServings(parseInt(e.target.value))}
              className="w-full accent-[#D97757]"
              aria-label="Leftover servings"
            />
            {leftoverServings > 0 && (
              <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1.5">
                <span>♻️</span>
                We&rsquo;ll remind you to use these within 3 days.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              'Saving…'
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save &amp; go to dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
