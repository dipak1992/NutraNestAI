'use client'

import { motion } from 'framer-motion'
import {
  Sparkles, Calendar, Camera, Truck, Users, Sun, Heart,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'I Don\'t Want to Think',
    description: 'Tap one button. MealEase picks a meal your whole household will love — based on taste history, what\'s in season, and what you haven\'t had lately.',
    tag: 'Most popular',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    icon: Calendar,
    title: 'Plan My Week',
    description: 'A complete 7-day dinner plan with zero repeats. Every meal balanced, every member accounted for. Regenerate any night with one tap.',
    tag: 'Time saver',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Camera,
    title: 'Snap & Cook',
    description: 'Take a photo of your fridge or pantry. MealEase identifies ingredients and builds meals from what you already own. Less waste, less spending.',
    tag: 'Save money',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: Truck,
    title: 'Zero-Cook Mode',
    description: 'Too tired to cook? Get curated delivery and takeout picks that match your taste profile. Restaurant quality, no cooking required.',
    tag: 'New',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    icon: Users,
    title: 'Family Mode',
    description: 'One meal, every version. Cook once — each family member gets their own adapted plate. Baby-safe, allergy-aware, diet-compatible.',
    tag: 'For families',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Sun,
    title: 'Weekend Mode',
    description: 'Saturday brunch ideas, Sunday slow-cooks, and weekend entertaining picks. Because weekends deserve different energy.',
    tag: 'Weekend vibes',
    gradient: 'from-yellow-500 to-amber-600',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Heart,
    title: 'Cuisine Love',
    description: 'Craving Thai? Italian comfort? Mexican street food? Tell MealEase your cuisine mood and it finds the perfect match for tonight.',
    tag: 'Explore',
    gradient: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function LandingFeatures() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-white">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-white/88" />
      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Every way you eat, covered.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re cooking from scratch, ordering in, or using what&apos;s left in the fridge — MealEase has a mode for that.
          </p>
        </motion.div>

        {/* Feature cards — bento-like grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                className="group relative rounded-2xl border border-border/60 bg-white p-6 hover:shadow-lg hover:border-border transition-all overflow-hidden"
              >
                {/* Subtle gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                <div className="relative">
                  {/* Tag */}
                  <span className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gradient-to-r ${f.gradient} text-white mb-4`}>
                    {f.tag}
                  </span>

                  {/* Icon */}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg} mb-4`}>
                    <Icon className={`h-6 w-6 ${f.iconColor}`} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
