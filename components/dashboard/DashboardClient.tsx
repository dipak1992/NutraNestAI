'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Zap, Camera, Sparkles, CalendarDays } from 'lucide-react'
import { MealSwipeStack } from '@/components/dashboard/MealSwipeStack'
import { SmartInput } from '@/components/dashboard/SmartInput'
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data'
import { TodayCard } from '@/components/habit/TodayCard'
import { InsightCards } from '@/components/habit/InsightCards'
import { StreakBadge } from '@/components/habit/StreakBadge'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_ABBR  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type SituationMode = 'ingredients' | 'inspiration' | 'tired' | 'smart' | null

const SITUATIONS: {
  id: Exclude<SituationMode, null>
  emoji: string
  label: string
  hint: string
  color: string
  bgHover: string
  featured?: boolean
  inputPlaceholder?: string
}[] = [
  {
    id: 'tired',
    emoji: '😴',
    label: "I don't want to think",
    hint: 'Instant low-effort picks, zero decisions',
    color: 'border-violet-300 text-violet-800',
    bgHover: 'hover:bg-violet-50',
    featured: true,
  },
  {
    id: 'ingredients',
    emoji: '🥫',
    label: 'Use what I have',
    hint: 'Snap a photo or list your ingredients',
    color: 'border-emerald-300 text-emerald-800',
    bgHover: 'hover:bg-emerald-50',
    inputPlaceholder: 'e.g. chicken, broccoli, garlic, pasta…',
  },
  {
    id: 'inspiration',
    emoji: '✨',
    label: 'Get inspired',
    hint: 'Inspired by your taste & what you love',
    color: 'border-sky-300 text-sky-800',
    bgHover: 'hover:bg-sky-50',
    inputPlaceholder: 'e.g. creamy pasta with mushrooms… or upload a photo',
  },
  {
    id: 'smart',
    emoji: '🧠',
    label: 'Smart for you',
    hint: 'Personalized picks based on your patterns',
    color: 'border-amber-300 text-amber-800',
    bgHover: 'hover:bg-amber-50',
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
    // tired & smart modes — skip input step
    if (id === 'tired' || id === 'smart') setSubmitted(true)
  }

  function handleBack() {
    setMode(null)
    setInput('')
    setSubmitted(false)
  }

  function handleSmartSubmit(value: string, detectedMode?: 'ingredients' | 'inspiration') {
    // If image analysis detected a different mode, switch to it
    if (detectedMode && detectedMode !== mode) {
      setMode(detectedMode)
    }
    setInput(value)
    setSubmitted(true)
  }

  const initial = firstName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 28%, #ffffff 100%)' }}>
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center justify-between h-14 px-5 max-w-lg mx-auto">
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
                className="text-gradient-sage font-bold text-lg"
              >
                MealEase
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!mode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <StreakBadge />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm select-none">
                  {initial}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-5 py-6">
        <AnimatePresence mode="wait">

          {/* ── Home screen ── */}
          {!mode && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              {/* Greeting + Title */}
              <div className="mb-7">
                <p className="text-sm text-muted-foreground mb-1">
                  {getGreeting()}, {firstName}
                </p>
                <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
                  What do you want right now?
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  We&apos;ll make it simple.
                </p>
              </div>

              {/* ── HERO BUTTON ── */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                onClick={() => selectMode('tired')}
                className="w-full flex items-center gap-4 px-5 rounded-2xl text-white text-left mb-3"
                style={{
                  minHeight: '72px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
                  boxShadow: '0 8px 28px rgba(16, 185, 129, 0.38), 0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[17px] leading-tight">I don&apos;t want to think</p>
                  <p className="text-white/75 text-sm mt-0.5">We&apos;ll handle dinner for you</p>
                </div>
                <ChevronRight className="h-5 w-5 text-white/60 flex-shrink-0" />
              </motion.button>

              {/* ── Secondary cards ── */}
              <div className="flex flex-col gap-3">
                {/* Use what I have */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  onClick={() => selectMode('ingredients')}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 flex-shrink-0">
                    <Camera className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">Use what I have</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Snap your fridge or pantry</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                </motion.button>

                {/* Surprise me */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  onClick={() => selectMode('smart')}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">Surprise me</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Something you&apos;ll love</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                </motion.button>

                {/* Plan my week */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                >
                  <Link
                    href="/planner"
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 flex-shrink-0">
                      <CalendarDays className="h-5 w-5 text-sky-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">Plan my week</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Meals for the whole week</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                  </Link>
                </motion.div>
              </div>

              {/* TodayCard + InsightCards */}
              <div className="mt-8">
                <TodayCard />
                <InsightCards />
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

              <SmartInput
                mode={mode as 'ingredients' | 'inspiration'}
                placeholder={activeMode.inputPlaceholder}
                onSubmit={handleSmartSubmit}
              />
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
                  {activeMode?.emoji} {mode === 'tired' ? 'Here\u2019s something easy' : mode === 'smart' ? 'Picked for you' : 'Your matches'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mode === 'smart' ? 'Based on your taste · Swipe to explore' : 'Swipe to replace · Save what you love'}
                </p>
              </div>

              <MealSwipeStack
                mode={mode as 'ingredients' | 'inspiration' | 'tired' | 'smart'}
                input={input}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
