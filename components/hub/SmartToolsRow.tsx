'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  onSnapCook?: () => void
}

export function SmartToolsRow({ onSnapCook }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
        Smart Tools
      </h2>
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

        {/* Family Mode */}
        <motion.div whileTap={{ scale: 0.96 }}>
          <Link
            href="/settings"
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-[11px] font-semibold text-foreground leading-tight">
              Family Mode
            </span>
          </Link>
        </motion.div>

        {/* Preferences */}
        <motion.div whileTap={{ scale: 0.96 }}>
          <Link
            href="/settings"
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl">⚙</span>
            <span className="text-[11px] font-semibold text-foreground leading-tight">
              Preferences
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
