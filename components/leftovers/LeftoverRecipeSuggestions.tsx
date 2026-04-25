'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChefHat, Lock, RefreshCw, AlertCircle } from 'lucide-react'
import type { LeftoverSuggestion } from '@/lib/leftovers/types'

type State = 'idle' | 'loading' | 'ready' | 'gated' | 'error'

type Props = {
  leftoverId: string
  leftoverName: string
  isPlusMember: boolean
}

export function LeftoverRecipeSuggestions({ leftoverId, leftoverName, isPlusMember }: Props) {
  const [state, setState] = useState<State>('idle')
  const [suggestions, setSuggestions] = useState<LeftoverSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)

  async function fetchSuggestions() {
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/leftovers/suggest-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leftoverId }),
      })

      if (res.status === 402) {
        setState('gated')
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to get suggestions')
      }

      const data: LeftoverSuggestion[] = await res.json()
      setSuggestions(data)
      setState('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setState('error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">AI Recipe Ideas</h3>
        {state === 'ready' && (
          <button
            onClick={fetchSuggestions}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fetchSuggestions}
            className="w-full rounded-xl border border-dashed border-white/20 py-4 text-sm text-zinc-400 hover:border-[#D97757]/50 hover:text-[#D97757] transition-colors"
          >
            <ChefHat className="mx-auto mb-1.5 h-5 w-5" />
            Get AI recipe ideas for {leftoverName}
          </motion.button>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 py-6 text-zinc-400"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <ChefHat className="h-6 w-6 text-[#D97757]" />
            </motion.div>
            <p className="text-xs">Finding recipes…</p>
          </motion.div>
        )}

        {state === 'gated' && (
          <motion.div
            key="gated"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-[#B8935A]/10 border border-[#B8935A]/30 p-4 text-center space-y-2"
          >
            <Lock className="mx-auto h-5 w-5 text-[#B8935A]" />
            <p className="text-sm font-semibold text-white">Weekly limit reached</p>
            <p className="text-xs text-zinc-400">
              Free members get 2 AI recipe suggestions per week.
            </p>
            <a
              href="/settings/billing"
              className="inline-block mt-1 rounded-lg bg-[#B8935A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#a07848]"
            >
              Upgrade to Plus
            </a>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 py-4 text-center"
          >
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-xs text-zinc-400">{error}</p>
            <button
              onClick={fetchSuggestions}
              className="text-xs text-[#D97757] hover:underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {state === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {suggestions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-white/5 p-3 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white leading-tight">{s.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    s.difficulty === 'easy'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : s.difficulty === 'medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {s.difficulty}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {s.cookTimeMin} min
                  </span>
                  <span>Uses: {s.usesIngredients.slice(0, 3).join(', ')}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
