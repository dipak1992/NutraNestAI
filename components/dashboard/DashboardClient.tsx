'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { MealSwipeStack } from '@/components/dashboard/MealSwipeStack'
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_ABBR  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type SituationMode = 'ingredients' | 'inspiration' | 'tired' | null

const SITUATIONS: {
  id: Exclude<SituationMode, null>
  emoji: string
  label: string
  hint: string
  color: string
  bgHover: string
  inputPlaceholder?: string
}[] = [
  {
    id: 'ingredients',
    emoji: '🥫',
    label: 'I have ingredients',
    hint: 'Tell me what you have',
    color: 'border-emerald-300 text-emerald-800',
    bgHover: 'hover:bg-emerald-50',
    inputPlaceholder: 'e.g. chicken, broccoli, garlic, pasta…',
  },
  {
    id: 'inspiration',
    emoji: '📸',
    label: 'I saw a meal I like',
    hint: "Describe it, I'll match it",
    color: 'border-sky-300 text-sky-800',
    bgHover: 'hover:bg-sky-50',
    inputPlaceholder: 'e.g. creamy pasta with mushrooms…',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: "I'm tired, decide for me",
    hint: 'Instant picks, no fuss',
    color: 'border-violet-300 text-violet-800',
    bgHover: 'hover:bg-violet-50',
  },
]

// ─── Greeting ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Week strip ───────────────────────────────────────────────────────────────

function WeekStrip() {
  const todayIdx = (new Date().getDay() + 6) % 7 // Mon=0 … Sun=6
  const days = DEMO_WEEKLY_PLAN.days

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">This Week</h3>
        <Link href="/planner" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
          Full plan <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {DAY_ABBR.map((abbr, i) => {
          const day = days[i]
          const isToday = i === todayIdx
          const mealName = day?.meals?.[0]?.title ?? '—'
          return (
            <Link
              key={i}
              href="/planner"
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-center min-w-[72px] transition-colors ${
                isToday
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-background border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">{abbr}</span>
              <span
                className={`text-[11px] leading-tight w-full truncate ${isToday ? 'text-primary/90 font-medium' : ''}`}
                title={DAY_NAMES[i]}
              >
                {mealName.length > 12 ? mealName.slice(0, 11) + '…' : mealName}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  userName: string
}

export function DashboardClient({ userName }: Props) {
  const [mode, setMode] = useState<SituationMode>(null)
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const firstName = userName.includes('@') ? userName.split('@')[0] : userName
  const activeMode = SITUATIONS.find(s => s.id === mode)

  function selectMode(id: Exclude<SituationMode, null>) {
    setMode(id)
    setInput('')
    setSubmitted(false)
    // tired mode — skip input step
    if (id === 'tired') setSubmitted(true)
  }

  function handleBack() {
    setMode(null)
    setInput('')
    setSubmitted(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {mode ? (
              <motion.button
                key="back"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            ) : (
              <motion.span
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-gradient-sage font-bold text-base"
              >
                NutriNest AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── Situation selector ── */}
          {!mode && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-7">
                <p className="text-muted-foreground text-sm mb-0.5">
                  {getGreeting()}, {firstName}
                </p>
                <h1 className="text-2xl font-bold text-foreground leading-tight">
                  What&apos;s your situation?
                </h1>
              </div>

              <div className="flex flex-col gap-3">
                {SITUATIONS.map(s => (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectMode(s.id)}
                    className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl border bg-background text-left transition-colors ${s.color} ${s.bgHover}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{s.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{s.hint}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40 flex-shrink-0" />
                  </motion.button>
                ))}

                {/* Plan my week */}
                <Link
                  href="/planner"
                  className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl border border-dashed border-border bg-background text-left hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">📅</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">Plan my week</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Build a full 7-day meal plan</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              </div>

              <WeekStrip />
            </motion.div>
          )}

          {/* ── Input step ── */}
          {mode && !submitted && activeMode?.inputPlaceholder && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <span className="text-3xl mb-3 block">{activeMode.emoji}</span>
                <h2 className="text-xl font-bold text-foreground">{activeMode.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{activeMode.hint}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={activeMode.inputPlaceholder}
                  rows={3}
                  className="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  autoFocus
                />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!input.trim()}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
                >
                  Find my meals →
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ── Swipe stack ── */}
          {mode && submitted && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground leading-snug">
                  {activeMode?.emoji} {mode === 'tired' ? 'Here you go' : 'Your matches'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Swipe up or down to replace · Save what you love
                </p>
              </div>

              <MealSwipeStack
                mode={mode as 'ingredients' | 'inspiration' | 'tired'}
                input={input}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
