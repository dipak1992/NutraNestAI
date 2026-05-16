'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { easing } from '@/lib/motion/variants'
import { CheckIcon } from 'lucide-react'

// Properly typed easing for Framer Motion
const smoothEase = easing.smooth as [number, number, number, number]

// ─── Floating food icons for the visual element ────────────────────────────────
function FloatingFoodVisual() {
  const shouldReduceMotion = useReducedMotion()

  const foods = [
    { emoji: '🥑', x: '20%', y: '18%', delay: 0, size: 'text-4xl' },
    { emoji: '🍋', x: '70%', y: '12%', delay: 0.8, size: 'text-3xl' },
    { emoji: '🥕', x: '75%', y: '55%', delay: 1.2, size: 'text-4xl' },
    { emoji: '🍅', x: '15%', y: '65%', delay: 0.4, size: 'text-3xl' },
    { emoji: '🫐', x: '55%', y: '75%', delay: 1.6, size: 'text-2xl' },
    { emoji: '🥦', x: '40%', y: '30%', delay: 0.6, size: 'text-2xl' },
  ]

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto">
      {/* Soft radial glow behind the visual */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D97757]/8 via-transparent to-[#D97757]/4 blur-3xl scale-90"
      />

      {/* Central card — "Tonight's Suggestion" */}
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: smoothEase }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] bg-white rounded-3xl p-6 ring-1 ring-black/[0.04]"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
          Tonight
        </div>
        <div className="text-lg font-semibold text-neutral-900 mb-1">
          Lemon Herb Chicken
        </div>
        <div className="text-sm text-neutral-500 mb-3">
          with roasted vegetables &amp; quinoa
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span aria-hidden>⏱</span> 25 min
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#D97757] bg-[#D97757]/8 px-2 py-0.5 rounded-full">
            <span aria-hidden>👨‍👩‍👧</span> Family
          </span>
        </div>
      </motion.div>

      {/* Floating food icons */}
      {foods.map((food, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`absolute ${food.size} select-none`}
          style={{ left: food.x, top: food.y }}
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.6 + food.delay * 0.3,
            duration: 0.5,
            ease: smoothEase,
          }}
        >
          <motion.span
            className="inline-block"
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -6, 0] }
            }
            transition={{
              duration: 3 + food.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {food.emoji}
          </motion.span>
        </motion.span>
      ))}
    </div>
  )
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const fadeUpProps = (delay: number) => {
    if (shouldReduceMotion) return {}
    return {
      initial: { opacity: 0, y: 24, filter: 'blur(4px)' } as const,
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' } as const,
      transition: { delay, duration: 0.6, ease: smoothEase } as const,
    }
  }

  const trustSignals = [
    'Free forever',
    'No credit card',
    '2-minute setup',
  ]

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-0 lg:pb-0"
      aria-labelledby="hero-heading"
    >
      {/* Background: warm gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#FDF6F1] via-white to-white"
      />

      {/* Subtle radial coral accent at top-left */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[600px] h-[600px] -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,119,87,0.06)_0%,transparent_70%)]"
      />

      {/* Noise texture overlay */}
      <div aria-hidden className="noise-overlay absolute inset-0 -z-10 pointer-events-none" />

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: Text content */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div {...fadeUpProps(0)}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#D97757]/8 text-[#D97757] ring-1 ring-[#D97757]/15">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-pulse-soft"
                />
                AI-Powered Meal Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUpProps(0.1)}
              id="hero-heading"
              className="mt-6 text-neutral-900 font-bold"
              style={{
                fontSize: 'var(--font-size-display-xl)',
                lineHeight: 'var(--font-size-display-xl--line-height)',
                letterSpacing: 'var(--font-size-display-xl--letter-spacing)',
              }}
            >
              Dinner decided in{' '}
              <span className="text-gradient-coral">seconds</span>,{' '}
              not stress
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUpProps(0.2)}
              className="mt-5 text-neutral-500 max-w-md"
              style={{
                fontSize: 'var(--font-size-body-lg)',
                lineHeight: 'var(--font-size-body-lg--line-height)',
              }}
            >
              MealEase uses AI to understand your pantry, preferences, and
              family — then suggests exactly what to cook tonight.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...fadeUpProps(0.3)}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
            >
              <Link
                href="/start"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#D97757] text-white font-medium text-sm shadow-md transition-all duration-200 hover:shadow-[var(--shadow-glow-coral)] hover:brightness-105 active:scale-[0.97] focus-ring"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-neutral-600 ring-1 ring-neutral-200 transition-all duration-200 hover:ring-neutral-300 hover:text-neutral-900 active:scale-[0.97] focus-ring"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              {...fadeUpProps(0.35)}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400"
                >
                  <CheckIcon className="w-3.5 h-3.5 text-[#D97757]/60" aria-hidden />
                  {signal}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right column: Visual element */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: smoothEase }}
          >
            <FloatingFoodVisual />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
