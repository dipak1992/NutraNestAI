'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Bookmark, Pencil, Trash2, Globe, Lock, Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ShareButton } from '@/components/content/ShareButton'
import { EditMealModal } from '@/components/content/EditMealModal'
import type { SavedMealSummary } from '@/lib/content/types'

const CUISINE_EMOJI: Record<string, string> = {
  italian: '🍝',
  mexican: '🌮',
  asian: '🥢',
  american: '🍔',
  indian: '🍛',
  mediterranean: '🥗',
  comfort: '🫕',
  global: '🌏',
}

function cuisineEmoji(type?: string | null) {
  const key = (type ?? '').toLowerCase().split(' ')[0]
  return CUISINE_EMOJI[key] ?? '🍽️'
}

export default function SavedMealsPage() {
  const [meals, setMeals] = useState<SavedMealSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<SavedMealSummary | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SavedMealSummary | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/content/meals')
      .then((r) => r.json())
      .then((data: { meals?: SavedMealSummary[] }) => setMeals(data.meals ?? []))
      .catch(() => toast.error('Could not load saved meals.'))
      .finally(() => setLoading(false))
  }, [])

  async function confirmDelete() {
    if (!deleteTarget) return
    const meal = deleteTarget
    setDeleteTarget(null)
    const res = await fetch(`/api/content/meals/${meal.id}`, { method: 'DELETE' })
    if (res.ok) {
      setMeals((prev) => prev.filter((m) => m.id !== meal.id))
      toast.success('Meal deleted.')
    } else {
      toast.error('Could not delete meal.')
    }
  }

  async function togglePrivacy(meal: SavedMealSummary) {
    const newPublic = !meal.is_public
    setMeals((prev) => prev.map((m) => m.id === meal.id ? { ...m, is_public: newPublic } : m))
    const res = await fetch(`/api/content/meals/${meal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: newPublic }),
    })
    if (!res.ok) {
      setMeals((prev) => prev.map((m) => m.id === meal.id ? { ...m, is_public: meal.is_public } : m))
      toast.error('Could not update privacy.')
    }
  }

  function handleEditSaved(id: string, updates: Partial<SavedMealSummary>) {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            Saved Meals
          </h1>
          {!loading && (
            <p className="text-muted-foreground text-sm mt-1">
              {meals.length} {meals.length === 1 ? 'meal' : 'meals'} saved
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/planner">Go to Planner</Link>
        </Button>
      </div>

      {/* Search */}
      {!loading && meals.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved meals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {/* Meals grid */}
      {!loading && meals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {meals.filter((m) => m.title.toLowerCase().includes(search.toLowerCase())).map((meal) => (
            <div
              key={meal.id}
              className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Card body */}
              <div className="flex items-start gap-3 p-4">
                <span className="text-3xl flex-shrink-0 mt-0.5">
                  {cuisineEmoji(meal.cuisine_type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {meal.cuisine_type && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {meal.cuisine_type}
                      </Badge>
                    )}
                    <button
                      onClick={() => togglePrivacy(meal)}
                      className="focus:outline-none"
                      title={meal.is_public ? 'Click to make private' : 'Click to make public'}
                    >
                      {meal.is_public ? (
                        <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300 bg-emerald-50 gap-1 cursor-pointer hover:bg-emerald-100 transition-colors">
                          <Globe className="h-3 w-3" /> Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground gap-1 cursor-pointer hover:bg-muted transition-colors">
                          <Lock className="h-3 w-3" /> Private
                        </Badge>
                      )}
                    </button>
                  </div>
                  <p className="font-semibold text-sm leading-snug line-clamp-2">{meal.title}</p>
                  {meal.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {meal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(meal.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-3 pb-3 border-t border-border/40 pt-2">
                {meal.is_public && (
                  <ShareButton slug={meal.slug} type="meal" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setEditTarget(meal)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive ml-auto"
                  onClick={() => setDeleteTarget(meal)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && meals.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-25" />
          <p className="font-medium mb-1">No saved meals yet</p>
          <p className="text-sm mb-6">
            Tap the bookmark icon on any meal in your planner to save it here.
          </p>
          <Button asChild variant="outline">
            <Link href="/planner">Open Planner</Link>
          </Button>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditMealModal
          meal={editTarget}
          open
          onClose={() => setEditTarget(null)}
          onSaved={(updates) => handleEditSaved(editTarget.id, updates)}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this meal?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
