'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FadeIn({
  children,
  delay = 0,
  className,
  direction = 'up',
  once = true,
}: {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'fade'
  once?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = {
    up: { y: 22, x: 0 },
    left: { x: -26, y: 0 },
    right: { x: 26, y: 0 },
    fade: { x: 0, y: 0 },
  }[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-72px 0px -72px 0px' }}
      transition={{
        delay,
        duration: 0.62,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
