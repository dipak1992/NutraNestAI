'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function MotionFloat({
  children,
  className,
  intensity = 1,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  intensity?: number
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: [0, -7 * intensity, 0],
        rotate: [0, 0.45 * intensity, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
        y: {
          duration: 5.2 + intensity,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: 6.4 + intensity,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  )
}
