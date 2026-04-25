'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Share2, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import type { Meal } from '@/types'

type Props = {
  meal: Meal
  recipeId: string
}

export function RecipeActions({ meal, recipeId }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    setSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: meal.title,
          text: meal.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // Could show a toast here
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
        <ChefHat className="h-4 w-4" />
        Start cooking
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
