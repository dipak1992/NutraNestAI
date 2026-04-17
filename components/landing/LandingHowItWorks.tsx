'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Brain, Utensils } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Tell us what you like',
    description: 'Take 2 minutes to share your household\'s tastes, allergies, and dietary needs. That\'s it — you\'re set.',
    detail: 'Supports all diets, allergies, ages, and medical conditions.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    glow: 'from-violet-200/40',
  },
  {
    number: '02',
    icon: Brain,
    title: 'MealEase learns your habits',
    description: 'Every swipe, save, and skip teaches the AI what your household actually eats. It gets smarter daily.',
    detail: 'Adapts to mood, season, and budget automatically.',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    glow: 'from-emerald-200/40',
  },
  {
    number: '03',
    icon: Utensils,
    title: 'Get your best meal, daily',
    description: 'Wake up to a personalized dinner pick — or tap for a full weekly plan. Grocery list included.',
    detail: 'One meal, adapted for every person at the table.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    glow: 'from-amber-200/40',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32 bg-[#FAFBFA]">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.10,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-[#FAFBFA]/82" />
      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Three steps to never stress
            <br className="hidden sm:block" />
            about dinner again.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-violet-200 via-primary/30 to-amber-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Glow */}
                  <div className={`absolute -inset-4 bg-gradient-to-b ${step.glow} to-transparent rounded-3xl blur-2xl opacity-60`} />

                  <div className="relative">
                    {/* Number + Icon */}
                    <div className="mx-auto mb-6 relative">
                      <div className={`mx-auto h-16 w-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center shadow-sm`}>
                        <Icon className={`h-7 w-7 ${step.color}`} />
                      </div>
                      <span className={`absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white border-2 ${step.border} flex items-center justify-center text-xs font-bold ${step.color}`}>
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                    <p className={`text-sm font-medium ${step.color}`}>{step.detail}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
