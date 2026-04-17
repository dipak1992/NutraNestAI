'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const tools = [
  { emoji: '🥫', label: 'Use What I Have', href: '/pantry' },
  { emoji: '👨‍👩‍👧', label: 'Family Mode', href: '/settings' },
  { emoji: '⚙', label: 'Preferences', href: '/settings' },
]

export function SmartToolsRow() {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
        Smart Tools
      </h2>
      <div className="grid grid-cols-3 gap-2.5">
        {tools.map((tool) => (
          <motion.div key={tool.label} whileTap={{ scale: 0.96 }}>
            <Link
              href={tool.href}
              className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-border/60 px-3 py-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="text-[11px] font-semibold text-foreground leading-tight">
                {tool.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
