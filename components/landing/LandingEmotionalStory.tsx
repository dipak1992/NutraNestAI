'use client'

import { motion } from 'framer-motion'

export function LandingEmotionalStory() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-950 text-white">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_20%,rgba(139,92,246,0.18),transparent_58%),radial-gradient(860px_480px_at_80%_80%,rgba(245,158,11,0.15),transparent_55%),linear-gradient(180deg,#020617_0%,#0b1320_55%,#020617_100%)]" />
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute z-[1] top-1/4 left-[10%] h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
      <div className="absolute z-[1] bottom-1/4 right-[10%] h-56 w-56 rounded-full bg-amber-500/10 blur-[80px]" />

      <div className="relative z-[2] mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Kicker */}
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-8">
            Why we built this
          </p>

          {/* Big emotional headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold tracking-tight leading-[1.15] mb-8">
            The hardest part of dinner{' '}
            <br className="hidden sm:block" />
            was never{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">cooking.</span>
          </h2>

          {/* Story */}
          <div className="max-w-2xl mx-auto space-y-6 text-base sm:text-lg text-white/70 leading-relaxed">
            <p>
              It was standing in the kitchen at 5:47 PM, staring at the fridge, knowing everyone was hungry
              and nothing sounded right. It was the 30-minute scroll through recipes that ended with
              ordering pizza — again. It was the guilt of wasted groceries and the exhaustion of making
              the same five meals on repeat.
            </p>

            <p>
              We built MealEase because we lived this. Every single night. Two working parents, a toddler
              with allergies, a picky five-year-old, and zero mental energy left for &ldquo;what&apos;s for dinner.&rdquo;
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/90 font-medium"
            >
              The problem was never cooking. It was{' '}
              <span className="text-white font-bold underline decoration-emerald-400/50 underline-offset-4">deciding.</span>
            </motion.p>

            <p>
              So we built an app that decides for you — instantly, intelligently, and personally.
              One that knows your household, learns your taste, and gets better every week.
            </p>
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">The MealEase Team</p>
              <p className="text-xs text-white/50">Parents, engineers, and dinner-decision survivors</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
