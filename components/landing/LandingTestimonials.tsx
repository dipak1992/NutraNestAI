'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Priya R.',
    role: 'Registered Dietitian',
    text: '"I recommend MealEase to clients who struggle with meal planning. The allergy support and family adaptation is better than anything else I\'ve seen."',
    avatar: 'PR',
    color: 'bg-emerald-100 text-emerald-700',
    stars: 5,
  },
  {
    name: 'Sarah M.',
    role: 'Mom of 3, Austin TX',
    text: '"I used to spend 40 minutes deciding what to cook. Now I open MealEase, tap once, and dinner is handled. My husband thinks I became a chef."',
    avatar: 'SM',
    color: 'bg-violet-100 text-violet-700',
    stars: 5,
  },
  {
    name: 'James K.',
    role: 'Software engineer, remote',
    text: '"Zero-Cook Mode is genius. After a 10-hour day, it finds me the perfect takeout that still fits my macros. I\'ve saved so much on random delivery orders."',
    avatar: 'JK',
    color: 'bg-blue-100 text-blue-700',
    stars: 4,
  },
  {
    name: 'David L.',
    role: 'Dad of 2, Seattle WA',
    text: '"Snap & Cook literally saved us $300 last month. We photograph the fridge on Sunday and get a whole week of meals from what we already have."',
    avatar: 'DL',
    color: 'bg-amber-100 text-amber-700',
    stars: 5,
  },
  {
    name: 'Michelle T.',
    role: 'Busy nurse, Chicago IL',
    text: '"I work 12-hour shifts. MealEase plans my week while I sleep. I come home to a plan, a grocery list, and zero stress. Absolute game changer."',
    avatar: 'MT',
    color: 'bg-rose-100 text-rose-700',
    stars: 4,
  },
  {
    name: 'Carlos G.',
    role: 'Single dad, Miami FL',
    text: '"My daughter is allergic to dairy and nuts. MealEase factors that in automatically. I don\'t have to triple-check every recipe anymore."',
    avatar: 'CG',
    color: 'bg-teal-100 text-teal-700',
    stars: 5,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function LandingTestimonials() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Loved by families</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Real families, real relief.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of households who stopped stressing about dinner.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="rounded-2xl border border-border/60 bg-white p-6 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.stars ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-6">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
