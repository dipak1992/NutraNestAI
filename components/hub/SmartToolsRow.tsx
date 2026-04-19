'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { useHouseholdConfig } from '@/lib/hooks/use-household-config'

interface Props {
  onSnapCook?: () => void
  householdConfig: ReturnType<typeof useHouseholdConfig>
  canSeeKidsTools?: boolean
}

export function SmartToolsRow({ onSnapCook, householdConfig, canSeeKidsTools = false }: Props) {
  const { hasKids, kidsPriorityTools, smartToolLabel, householdType } = householdConfig

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
        Smart Tools
      </h2>

      {/* Standard 3-tool grid — always visible */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Snap & Cook — opens PantryCapture inline */}
        <motion.div whileTap={{ scale: 0.96 }}>
          <button
            type="button"
            onClick={onSnapCook}
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center w-full"
          >
            <span className="text-2xl">📸</span>
            <span className="text-[11px] font-semibold text-foreground leading-tight">
              Snap &amp; Cook
            </span>
          </button>
        </motion.div>

        {/* Household-aware tool */}
        <motion.div whileTap={{ scale: 0.96 }}>
          <Link
            href="/settings"
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl">
              {householdType === 'family' ? '👨‍👩‍👧' : householdType === 'couple' ? '💑' : '🍽️'}
            </span>
            <span className="text-[11px] font-semibold text-foreground leading-tight">
              {smartToolLabel}
            </span>
          </Link>
        </motion.div>

        {/* Preferences */}
        <motion.div whileTap={{ scale: 0.96 }}>
          <Link
            href="/settings"
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-[11px] font-semibold text-foreground leading-tight">
              Preferences
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Kids tools — shown only when hasKids=true, horizontal scroll row */}
      {hasKids && canSeeKidsTools && kidsPriorityTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
          className="mt-3"
        >
          <p className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide mb-2 px-1">
            For the kids
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {kidsPriorityTools.map((tool) => (
              <motion.div key={tool.label} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                <Link
                  href={tool.href}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-orange-50/80 border border-orange-100 px-3.5 py-3 hover:border-orange-300/60 hover:shadow-sm transition-all text-center min-w-[80px]"
                >
                  <span className="text-xl">{tool.emoji}</span>
                  <span className="text-[10px] font-semibold text-orange-900/80 leading-tight whitespace-nowrap">
                    {tool.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  )
}
