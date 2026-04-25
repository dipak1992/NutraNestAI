'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, X, Timer, Play, Pause, RotateCcw, CheckCircle2,
} from 'lucide-react'
import type { Meal } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  meal: Meal
  recipeId: string
}

// ─── Timer hook ───────────────────────────────────────────────────────────────

function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (seconds <= 0) { setRunning(false); return }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [running, seconds])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset  = useCallback(() => { setSeconds(initialSeconds); setRunning(false) }, [initialSeconds])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return { display: `${mm}:${ss}`, running, toggle, reset, done: seconds === 0 }
}

// ─── Step timer ───────────────────────────────────────────────────────────────

function StepTimer({ minutes }: { minutes: number }) {
  const timer = useTimer(minutes * 60)
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <Timer className={['h-4 w-4', timer.done ? 'text-emerald-400' : 'text-[#D97757]'].join(' ')} />
      <span className={['text-lg font-mono font-bold tabular-nums', timer.done ? 'text-emerald-400' : 'text-white'].join(' ')}>
        {timer.display}
      </span>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={timer.toggle}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label={timer.running ? 'Pause' : 'Start'}
        >
          {timer.running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={timer.reset}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Extract timer minutes from instruction text ──────────────────────────────

function extractMinutes(text: string): number | null {
  const match = text.match(/(\d+)\s*(?:min(?:ute)?s?|minutes?)/i)
  return match ? parseInt(match[1], 10) : null
}

// ─── CookMode ─────────────────────────────────────────────────────────────────

export function CookMode({ meal, recipeId }: Props) {
  const router = useRouter()
  const steps = meal.base_instructions
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const isFirst = current === 0
  const isLast  = current === steps.length - 1
  const step    = steps[current] ?? ''
  const timerMins = extractMinutes(step)

  function markDone(idx: number) {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
  }

  async function finish() {
    try {
      await fetch(`/api/recipes/${recipeId}/cook-complete`, { method: 'POST' })
    } catch {
      // non-critical
    }
    router.push(`/recipes/${recipeId}?cooked=1`)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Exit cook mode"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center">
          <p className="text-xs text-white/40">Cook Mode</p>
          <p className="text-sm font-semibold text-white">{meal.title}</p>
        </div>
        <span className="text-sm text-white/40">
          {current + 1} / {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-[#D97757] transition-all"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
        <div className="mx-auto w-full max-w-lg">
          {/* Step number */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97757] text-sm font-bold text-white">
              {current + 1}
            </div>
            {completed.has(current) && (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            )}
          </div>

          {/* Instruction */}
          <p className="text-xl font-medium leading-relaxed text-white">{step}</p>

          {/* Timer if step mentions time */}
          {timerMins && timerMins > 0 && timerMins <= 120 && (
            <StepTimer minutes={timerMins} />
          )}

          {/* Mark done */}
          {!completed.has(current) && (
            <button
              type="button"
              onClick={() => markDone(current)}
              className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10"
            >
              ✓ Mark as done
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={isFirst}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={finish}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <CheckCircle2 className="h-4 w-4" />
              Finish cooking!
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#D97757] py-3 text-sm font-semibold text-white transition hover:bg-[#c4694a]"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
