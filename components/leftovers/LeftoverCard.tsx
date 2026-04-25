'use client'

import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'
import type { Leftover, Urgency } from '@/lib/leftovers/types'
import { useLeftoversStore } from '@/stores/leftoversStore'

// ─── Urgency helpers ─────────────────────────────────────────────────────────

const URGENCY_RING: Record<Urgency, string> = {
  fresh: 'ring-emerald-400/60',
  soon: 'ring-amber-400/70',
  today: 'ring-red-500/80',
  expired: 'ring-zinc-500/50',
}

const URGENCY_BADGE: Record<Urgency, { label: string; bg: string; text: string }> = {
  fresh: { label: 'Fresh', bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  soon: { label: 'Use soon', bg: 'bg-amber-500/20', text: 'text-amber-300' },
  today: { label: 'Use today!', bg: 'bg-red-500/20', text: 'text-red-300' },
  expired: { label: 'Expired', bg: 'bg-zinc-700/60', text: 'text-zinc-400' },
}

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const { label, bg, text } = URGENCY_BADGE[urgency]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${bg} ${text}`}>
      {urgency === 'today' && <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
      {label}
    </span>
  )
}

// ─── Compact card (list view) ─────────────────────────────────────────────────

function CompactCard({ leftover }: { leftover: Leftover }) {
  const openModal = useLeftoversStore((s) => s.openModal)
  const urgency = leftover.urgency ?? 'fresh'
  const days = leftover.daysUntilExpiry ?? 0

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => openModal(leftover.id)}
      className={`w-full flex items-center gap-3 rounded-2xl bg-white/5 ring-1 ${URGENCY_RING[urgency]} p-3 text-left transition-colors hover:bg-white/10`}
    >
      {/* Image / placeholder */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
        {leftover.image ? (
          <img src={leftover.image} alt={leftover.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl">🍱</div>
        )}
        {urgency === 'expired' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-xs text-zinc-300">✕</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-white">{leftover.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <UrgencyBadge urgency={urgency} />
          <span className="flex items-center gap-0.5 text-[10px] text-zinc-400">
            <Clock className="h-3 w-3" />
            {days < 0
              ? 'Expired'
              : days === 0
              ? 'Today'
              : `${days}d left`}
          </span>
        </div>
      </div>

      {/* Servings + chevron */}
      <div className="flex items-center gap-1 text-zinc-400">
        <span className="text-xs">{leftover.servingsRemaining}×</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </motion.button>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ leftover }: { leftover: Leftover }) {
  const openModal = useLeftoversStore((s) => s.openModal)
  const urgency = leftover.urgency ?? 'fresh'
  const days = leftover.daysUntilExpiry ?? 0

  // Aging visual: desaturate image as it gets older
  const imageFilter =
    urgency === 'expired'
      ? 'grayscale(100%) brightness(60%)'
      : urgency === 'today'
      ? 'saturate(60%) brightness(80%)'
      : urgency === 'soon'
      ? 'saturate(80%)'
      : 'none'

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => openModal(leftover.id)}
      className={`relative flex flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ${URGENCY_RING[urgency]} text-left transition-colors hover:bg-white/10`}
    >
      {/* Image */}
      <div className="relative h-28 w-full overflow-hidden bg-white/10">
        {leftover.image ? (
          <img
            src={leftover.image}
            alt={leftover.name}
            className="h-full w-full object-cover transition-all duration-500"
            style={{ filter: imageFilter }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl" style={{ filter: imageFilter }}>
            🍱
          </div>
        )}

        {/* Urgency ribbon */}
        {(urgency === 'today' || urgency === 'expired') && (
          <div className={`absolute inset-x-0 bottom-0 py-1 text-center text-[10px] font-bold ${urgency === 'today' ? 'bg-red-500/80 text-white' : 'bg-zinc-800/80 text-zinc-300'}`}>
            {urgency === 'today' ? '⚠ USE TODAY' : 'EXPIRED'}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5">
        <p className="truncate text-xs font-semibold text-white">{leftover.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <UrgencyBadge urgency={urgency} />
          <span className="text-[10px] text-zinc-400">{leftover.servingsRemaining} srv</span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

type LeftoverCardProps = {
  leftover: Leftover
  variant?: 'compact' | 'grid'
}

export function LeftoverCard({ leftover, variant = 'compact' }: LeftoverCardProps) {
  if (variant === 'grid') return <GridCard leftover={leftover} />
  return <CompactCard leftover={leftover} />
}
