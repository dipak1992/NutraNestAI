'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Share2, Bookmark, BookmarkCheck, Loader2, PlayCircle } from 'lucide-react'
import type { LoadedRecipe } from '@/app/recipes/[id]/loader'

type Props = {
  recipe: LoadedRecipe
  recipeId: string
  hasActiveSession?: boolean
}

export function RecipeActions({ recipe, recipeId, hasActiveSession = false }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    setSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.name,
          text: recipe.description ?? undefined,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Cook Mode CTA */}
      <button
        type="button"
        onClick={() => router.push(`/recipes/${recipeId}/cook`)}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#D97757] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c4694a] sm:flex-none"
      >
        {hasActiveSession ? (
          <>
            <PlayCircle className="h-4 w-4" />
            Resume cooking
          </>
        ) : (
          <>
            <ChefHat className="h-4 w-4" />
            Start cooking
          </>
        )}
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={() => setSaved((s) => !s)}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
        aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4 text-[#D97757]" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {saved ? 'Saved' : 'Save'}
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        aria-label="Share recipe"
      >
        {sharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        Share
      </button>
    </div>
  )
}
