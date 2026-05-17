'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Button } from './shared/Button'

export function MobileStickyCTA() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 360)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="fixed inset-x-3 bottom-3 z-[90] flex gap-2 rounded-full bg-white/92 p-2 shadow-2xl shadow-neutral-900/18 ring-1 ring-neutral-200/80 backdrop-blur md:hidden dark:bg-neutral-950/92 dark:ring-neutral-800"
        >
          <Button href="/signup" className="min-h-11 flex-1 px-4 text-sm">
            Start free
          </Button>
          <Button href="#pricing" variant="ghost" className="min-h-11 flex-1 border border-neutral-200 px-4 text-sm dark:border-neutral-800">
            See pricing
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
