'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function RotatingHeroWord() {
  const [titleNumber, setTitleNumber] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const titles = useMemo(
    () => ['tonight', 'busy weeks', 'what’s in the fridge', 'your budget', 'real life'],
    [],
  )

  useEffect(() => {
    if (shouldReduceMotion) return

    const timeoutId = window.setTimeout(() => {
      setTitleNumber((current) => (current === titles.length - 1 ? 0 : current + 1))
    }, 2100)

    return () => window.clearTimeout(timeoutId)
  }, [shouldReduceMotion, titleNumber, titles])

  if (shouldReduceMotion) {
    return (
      <span className="italic text-[#D97757]">
        {titles[0]}.
      </span>
    )
  }

  return (
    <span className="relative inline-flex min-h-[1.08em] w-full overflow-hidden align-bottom text-[#D97757]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={titles[titleNumber]}
          className="absolute left-0 top-0 italic"
          initial={{ opacity: 0, y: '110%' }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: '-110%' }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 0.7 }}
        >
          {titles[titleNumber]}.
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
