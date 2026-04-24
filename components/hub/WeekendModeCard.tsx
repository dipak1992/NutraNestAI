'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import type { HouseholdType } from '@/lib/hooks/use-household-config'

// ── Precise weekend window: Friday 11 AM → Sunday 11:59 PM (user local time) ─

function isWeekendWindow(): boolean {
  const now = new Date()
  const day = now.getDay()   // 0=Sun, 5=Fri, 6=Sat
  const hour = now.getHours()

  if (day === 5 && hour >= 11) return true   // Friday 11:00 AM+
  if (day === 6) return true                  // All Saturday
  if (day === 0 && hour <= 23) return true    // All Sunday (through 11:59 PM)
  return false
}

// ── Household-aware button config ─────────────────────────────────────────────

interface ModeButton {
  label: string
  emoji: string
  query: string // appended as ?mode= to /weekend
}

const HOUSEHOLD_BUTTONS: Record<HouseholdType, ModeButton> = {
  solo:   { label: 'Solo Chill',    emoji: '🍿', query: 'solo' },
  couple: { label: 'Date Night',    emoji: '✨', query: 'date' },
  family: { label: 'Family Night',  emoji: '🎬', query: 'family' },
}

const SURPRISE_BUTTON: ModeButton = {
  label: 'Surprise Me',
  emoji: '🎲',
  query: 'surprise',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  householdType: HouseholdType
}

export function WeekendModeCard({ householdType }: Props) {
  const show = useMemo(() => isWeekendWindow(), [])

  if (!show) return null

  const primaryButton = HOUSEHOLD_BUTTONS[householdType]

  const handleButtonClick = (mode: string) => {
    trackEvent('weekend_mode_button_clicked', { mode, householdType })
  }

  const handleCardView = () => {
    trackEvent('weekend_mode_card_viewed', { householdType })
  }

  return (
    <section className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        onAnimationComplete={handleCardView}
      >
        <div className="relative rounded-2xl overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/60 shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Subtle glow effect */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(300px_150px_at_80%_20%,rgba(251,191,36,0.12),transparent_60%)] pointer-events-none" />

          <div className="relative p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">🎬</span>
                <div>
                  <h3 className="text-[16px] font-bold text-amber-900 tracking-tight">
                    Weekend Mode
                  </h3>
                  <p className="text-xs text-amber-700/80 mt-0.5 leading-relaxed">
                    Dinner + movie ideas for your weekend.
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100/80 rounded-full px-2.5 py-1 whitespace-nowrap border border-amber-200/40">
                <Sparkles className="h-3 w-3" />
                It&apos;s the weekend!
              </span>
            </div>

            {/* Personalized mode buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Link
                href={`/weekend?mode=${primaryButton.query}`}
                onClick={() => handleButtonClick(primaryButton.query)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-amber-200/60 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <span>{primaryButton.emoji}</span>
                {primaryButton.label}
              </Link>
              <Link
                href={`/weekend?mode=${SURPRISE_BUTTON.query}`}
                onClick={() => handleButtonClick(SURPRISE_BUTTON.query)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-amber-200/60 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <span>{SURPRISE_BUTTON.emoji}</span>
                {SURPRISE_BUTTON.label}
              </Link>
            </div>

            {/* CTA */}
            <Link
              href="/weekend"
              onClick={() => handleButtonClick('open')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] transition-all"
            >
              Open Weekend Mode
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
