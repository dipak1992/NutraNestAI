'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Clock, Users, DollarSign, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticTap, hapticSuccess } from '@/lib/scan/haptics'
import { trackScan } from '@/lib/scan/analytics'
import type { FridgeResult, Ingredient, FridgeRecipe } from '@/lib/scan/types'

interface FridgeResultsProps {
  result: FridgeResult
  isDemo?: boolean
  onClose: () => void
  onRetake: () => void
}

export function FridgeResults({ result, isDemo = false, onClose, onRetake }: FridgeResultsProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(result.ingredients)
  const [savedToPantry, setSavedToPantry] = useState(result.savedToPantry)
  const [saving, setSaving] = useState(false)

  const removeIngredient = (id: string) => {
    hapticTap()
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }

  const handleSavePantry = async () => {
    if (isDemo) {
      window.location.href = '/signup?intent=save-pantry'
      return
    }
    if (savedToPantry || saving) return
    hapticSuccess()
    setSaving(true)
    try {
      await fetch('/api/pantry/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      })
      setSavedToPantry(true)
      trackScan('scan_save_pantry', { ingredient_count: ingredients.length })
    } catch {
      // Silently fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50">
              🧊 Fridge Scan
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={() => { hapticTap(); onRetake() }}
            className="text-sm text-[#D97757] font-semibold"
          >
            Retake
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-6">
        {/* Ingredient chips */}
        <section>
          <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
            Detected Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <motion.div
                key={ing.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                {ing.emoji && <span>{ing.emoji}</span>}
                <span>{ing.name}</span>
                {ing.quantity && (
                  <span className="text-neutral-400 text-xs">{ing.quantity}{ing.unit}</span>
                )}
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="ml-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  aria-label={`Remove ${ing.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Save to pantry */}
          <button
            onClick={handleSavePantry}
            disabled={savedToPantry || saving}
            className={cn(
              'mt-3 flex items-center gap-2 text-sm font-semibold transition-colors',
              savedToPantry
                ? 'text-green-600 dark:text-green-400'
                : 'text-[#D97757] hover:text-[#C86646]'
            )}
          >
            {savedToPantry ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved to pantry
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save all to pantry'}
              </>
            )}
          </button>
        </section>

        {/* Recipe suggestions */}
        {result.recipes.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
              Recipe Ideas
            </h3>
            <div className="space-y-3">
              {result.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} isDemo={isDemo} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 px-5 py-4">
        <button
          onClick={() => { hapticTap(); onClose() }}
          className="w-full py-3 rounded-2xl bg-[#D97757] text-white font-semibold hover:bg-[#C86646] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

function RecipeCard({ recipe, isDemo }: { recipe: FridgeRecipe; isDemo: boolean }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
      {recipe.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{recipe.title}</h4>
        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {recipe.servings}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            ~${recipe.estimatedCost.toFixed(2)}
          </span>
        </div>
        {recipe.missingIngredients.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Missing: {recipe.missingIngredients.join(', ')}
          </p>
        )}
        <button
          onClick={() => {
            window.location.href = isDemo ? `/signup?intent=scan-recipe&recipe=${recipe.id}` : `/recipes/${recipe.id}`
          }}
          className="mt-3 w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          {isDemo ? 'Unlock this recipe' : 'View Recipe'}
        </button>
      </div>
    </div>
  )
}
