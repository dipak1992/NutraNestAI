'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, ChevronRight } from 'lucide-react'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { useHouseholdConfig } from '@/lib/hooks/use-household-config'
import { getFeatures } from '@/lib/pillars/config'
import { cn } from '@/lib/utils'

// ── Kids tool card ────────────────────────────────────────────────────────────

interface KidsToolCardProps {
  emoji: string
  label: string
  href: string
  locked: boolean
  index: number
}

function KidsToolCard({ emoji, label, href, locked, index }: KidsToolCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.25 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl border p-4 min-w-[120px] snap-start transition-all',
        locked
          ? 'border-gray-200/60 bg-gray-50/80 opacity-60'
          : 'border-pink-200/60 bg-gradient-to-br from-pink-50 to-rose-50/80 hover:shadow-md hover:border-pink-300/60 cursor-pointer',
      )}
    >
      <span className="text-2xl">{emoji}</span>
      <span
        className={cn(
          'text-xs font-semibold text-center leading-tight',
          locked ? 'text-gray-400' : 'text-pink-900',
        )}
      >
        {label}
      </span>
      {locked && (
        <Crown className="absolute top-2 right-2 h-3 w-3 text-amber-400" />
      )}
    </motion.div>
  )

  if (locked) return content

  return <Link href={href}>{content}</Link>
}

// ── Main Kids Section ─────────────────────────────────────────────────────────

export function KidsSection() {
  const { status } = usePaywallStatus()
  const { hasKids, kidsPriorityTools } = useHouseholdConfig()
  const features = getFeatures(status.tier)

  // Only show for family households or users with kids
  if (!hasKids) return null

  const locked = !features.kidsTools

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="mt-6"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">👶</span>
          <h2 className="text-[15px] font-bold text-foreground tracking-tight">
            For the Kids
          </h2>
        </div>
        {!locked && (
          <Link
            href="/dashboard/household"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
          >
            All tools <ChevronRight className="h-3 w-3" />
          </Link>
        )}
        {locked && (
          <Link
            href="/pricing?intent=family&trigger=kids-section"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Crown className="h-3 w-3" /> Unlock
          </Link>
        )}
      </div>

      {/* Horizontal scroll rail */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
        {kidsPriorityTools.map((tool, i) => (
          <KidsToolCard
            key={tool.label}
            emoji={tool.emoji}
            label={tool.label}
            href={tool.href}
            locked={locked}
            index={i}
          />
        ))}
      </div>

      {/* Subtle upgrade nudge for locked state */}
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3"
        >
          <Link
            href="/pricing?intent=family&trigger=kids-section-cta"
            className="block rounded-xl border border-pink-200/40 bg-gradient-to-r from-pink-50/60 to-rose-50/40 p-3 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-pink-800 font-medium">
              🍱 Lunchbox help, picky eater tools, and more — unlock with Family Plus
            </p>
          </Link>
        </motion.div>
      )}
    </motion.section>
  )
}
