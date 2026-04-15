import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ShieldCheck,
  Users,
  Calendar,
  ShoppingCart,
  ChevronRight,
  Check,
  Star,
  BookOpen,
  Soup,
  Lock,
  BadgeCheck,
  Heart,
  UserCheck,
  UtensilsCrossed,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { LANDING_IMAGES } from '@/lib/landing/images'

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 sm:py-24">
      {/* Soft food photo backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_IMAGES.hero.url}
          alt=""
          className="w-full h-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      {/* Decorative food emoji */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {['🍋', '🫑', '🧄', '🍅', '🥦', '🧅', '🫒', '🥕'].map((emoji, i) => (
          <span
            key={i}
            className="absolute opacity-[0.05]"
            style={{
              top: `${[12, 70, 30, 85, 15, 60, 42, 78][i]}%`,
              left: `${[5, 90, 82, 8, 55, 3, 72, 48][i]}%`,
              transform: `rotate(${[-15, 20, -8, 25, 12, -20, 5, -12][i]}deg)`,
              fontSize: `${[3, 2.5, 3.5, 2, 3, 2.5, 3.5, 2][i]}rem`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Smart meal planning for real families
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Stop thinking{' '}
              <span className="text-gradient-sage">about dinner.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-3 leading-relaxed">
              Make family meals easy. Tell us who you&apos;re feeding — we&apos;ll handle tonight in seconds.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              No credit card required. No decisions needed.
            </p>

            <div className="max-w-md mx-auto lg:mx-0 mb-5">
              <Link
                href="/tonight?mode=tired"
                className="glass-card flex items-center gap-4 w-full px-6 py-5 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 hover:shadow-xl transition-all group text-left"
              >
                <span className="text-4xl flex-shrink-0">😴</span>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold group-hover:text-primary transition-colors">
                    I don&apos;t want to think
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Just pick something simple for tonight →
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start items-center text-sm text-muted-foreground">
              <span>Already have an account?</span>
              <div className="flex gap-3">
                <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                <span>·</span>
                <Link href="/signup" className="text-primary hover:underline font-medium">Create account</Link>
              </div>
            </div>
          </div>

          {/* Right: real food photo with app mock chip overlay */}
          <div className="hidden lg:block" aria-hidden>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LANDING_IMAGES.hero.url}
                  alt={LANDING_IMAGES.hero.alt}
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Floating "tonight's dinner" card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-white shadow-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary text-white flex items-center justify-center text-xs font-bold">M</div>
                      <span className="text-xs font-bold text-gradient-sage">MealEase</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      😴 No-think
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    One-Pan Lemon Herb Chicken
                  </h3>
                  <div className="flex gap-3 mt-1.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> 30 min</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" /> Serves 4</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Family-safe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── WHAT DO YOU WANT ─────────────────────── */
function ModeCards() {
  const modes = [
    {
      href: '/tonight?mode=tired',
      img: LANDING_IMAGES.modeTired,
      emoji: '😴',
      title: "I don't want to think",
      description: 'One simple dinner. No choices.',
    },
    {
      href: '/tonight?mode=pantry',
      img: LANDING_IMAGES.modePantry,
      emoji: '🥫',
      title: 'Use what I have',
      description: 'Snap your fridge, get a meal.',
    },
    {
      href: '/tonight?mode=inspiration',
      img: LANDING_IMAGES.modeSurprise,
      emoji: '✨',
      title: 'Surprise me',
      description: 'AI picks something new tonight.',
    },
    {
      href: '/onboarding',
      img: LANDING_IMAGES.modePlan,
      emoji: '📅',
      title: 'Plan my week',
      description: 'Full meal planning in 2 minutes.',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-muted/25">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Pick your vibe</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            What do you want right now?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four ways in. Pick the one that matches your energy tonight.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modes.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group relative rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img.url}
                  alt={m.img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-3xl drop-shadow">{m.emoji}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Start <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── SOCIAL PROOF BAR ─────────────────────── */
function SocialProof() {
  const stats = [
    { value: '12,000+', label: 'Families using MealEase' },
    { value: '340K+', label: 'Meals planned' },
    { value: '4.9★', label: 'Average app rating' },
    { value: '< 2 min', label: 'Average setup time' },
  ]
  return (
    <section className="border-y border-border/60 bg-background py-10">
      <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────── HOW IT WORKS ─────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: 1,
      img: LANDING_IMAGES.step1,
      title: 'Tell us about your family',
      description:
        'Ages, allergies, conditions, dislikes. One minute, once. We remember so you never re-explain.',
    },
    {
      n: 2,
      img: LANDING_IMAGES.step2,
      title: 'Pick your vibe',
      description:
        'Too tired? Just got groceries? Want to plan the week? MealEase adapts to the moment.',
    },
    {
      n: 3,
      img: LANDING_IMAGES.step3,
      title: 'Eat. Together.',
      description:
        'Safe variations for every family member from one base meal. No second dinner, no stress.',
    },
  ]

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">How it works</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Three steps between you and dinner
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No spreadsheets. No recipe tabs. No mental load.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img.url}
                    alt={s.img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white text-primary font-bold text-lg flex items-center justify-center shadow-lg border border-primary/20">
                    {s.n}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div aria-hidden className="hidden md:flex absolute top-1/2 -right-4 lg:-right-5 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-primary text-white items-center justify-center shadow-lg">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── REAL MEAL PREVIEW ─────────────────────── */
function MealPreview() {
  const meals = [
    {
      img: LANDING_IMAGES.meal1,
      title: 'Lemon Herb Chicken',
      time: '30 min',
      safe: ['Adult', 'Kid', 'Toddler'],
      tag: 'Family favorite',
    },
    {
      img: LANDING_IMAGES.meal2,
      title: 'One-Pot Pesto Pasta',
      time: '20 min',
      safe: ['Adult', 'Kid', 'Toddler', 'Baby'],
      tag: 'Kid-approved',
    },
    {
      img: LANDING_IMAGES.meal3,
      title: 'Coconut Chickpea Curry',
      time: '25 min',
      safe: ['Adult', 'Kid'],
      tag: 'Weeknight',
    },
    {
      img: LANDING_IMAGES.meal4,
      title: 'Sheet-Pan Salmon',
      time: '25 min',
      safe: ['Adult', 'Kid', 'Toddler'],
      tag: 'One-pan',
    },
    {
      img: LANDING_IMAGES.meal5,
      title: 'Family Taco Night',
      time: '20 min',
      safe: ['Adult', 'Kid', 'Toddler', 'Baby'],
      tag: 'Build-your-own',
    },
    {
      img: LANDING_IMAGES.meal6,
      title: 'Teriyaki Veggie Bowls',
      time: '18 min',
      safe: ['Adult', 'Kid', 'Toddler'],
      tag: 'Pantry-friendly',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-muted/25">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Real meals</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Dinners your family will actually eat
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            One base recipe. Safe variations for every age around your table.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((m) => (
            <div
              key={m.title}
              className="group rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img.url}
                  alt={m.img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-white/95 text-foreground font-medium shadow">
                  {m.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-lg leading-tight">{m.title}</h3>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3 text-primary" /> {m.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.safe.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15 font-medium">
                      {s}-safe
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/meals">Browse all meals <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── PROBLEM / SOLUTION ─────────────────────── */
function ProblemSolution() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4 text-destructive border-destructive/30">The Problem</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Family meal planning is exhausting and risky
            </h2>
            <ul className="space-y-4">
              {[
                "Your toddler can't eat what the baby eats. Your partner is low-sodium. Your kid has a nut allergy.",
                "You spend hours adapting one recipe into 4 different meals every night.",
                "You're terrified of accidentally giving your baby something unsafe.",
              ].map((p, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold">
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-primary/20">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">The MealEase Solution</Badge>
            <h3 className="text-2xl font-bold mb-4 text-primary">
              One idea → A full plan your whole family will eat
            </h3>
            <p className="text-muted-foreground mb-6">
              Tell us about your family once. MealEase builds complete meal plans with safe variations for every member — automatically.
            </p>
            <div className="space-y-2">
              {[
                'Baby-safe variations (no honey, appropriate textures)',
                'Allergy-aware ingredient substitutions',
                'Medical condition support (PCOS, low sodium, etc.)',
                'Consolidated grocery lists that save money',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── FEATURES ─────────────────────── */
function Features() {
  const features = [
    { icon: Sparkles, title: 'Smart Meal Generation', description: 'MealEase creates complete weekly meal plans in seconds, with full ingredient lists and per-member instructions.', color: 'bg-primary/10 text-primary' },
    { icon: ShieldCheck, title: 'Safety First', description: 'Automatic safety checks for every household member — no honey for babies, egg-free for allergies, low-sodium for conditions.', color: 'bg-amber-100 text-amber-700' },
    { icon: Users, title: 'Per-Member Variations', description: 'Each family member gets their own tailored variation of every meal, built from the same base recipe.', color: 'bg-blue-100 text-blue-700' },
    { icon: Calendar, title: 'Weekly Planner', description: 'Visual 7-day planner with meal regeneration and nutrition overview at a glance.', color: 'bg-purple-100 text-purple-700' },
    { icon: ShoppingCart, title: 'Smart Grocery Lists', description: 'Auto-consolidated grocery lists with quantity estimates, pantry deduction, and per-aisle organization.', color: 'bg-emerald-100 text-emerald-700' },
    { icon: UtensilsCrossed, title: 'Pantry Tracking', description: 'Track what you have on hand. MealEase prioritizes using existing pantry items before suggesting new purchases.', color: 'bg-orange-100 text-orange-700' },
  ]
  return (
    <section className="py-20 sm:py-24 bg-muted/25">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Everything your family needs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="glass-card rounded-xl p-6 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── BUILT BY PARENTS ─────────────────────── */
function BuiltByParents() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <Badge variant="outline" className="mb-4">
              <Heart className="mr-1.5 h-3.5 w-3.5 text-rose-500" /> Built by parents
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              We built MealEase because we lived the problem.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Three kids. Two allergies. One low-sodium grandparent. Every dinner felt like a negotiation with a spreadsheet.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              So we built the tool we needed: a meal planner that remembers every mouth at the table, respects every restriction, and never makes you think twice about what&apos;s safe.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Try it free <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Our story</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-3 bg-rose-200/40 rounded-3xl blur-2xl" aria-hidden />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LANDING_IMAGES.founders.url}
                  alt={LANDING_IMAGES.founders.alt}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── TESTIMONIALS ─────────────────────── */
function Testimonials() {
  const items = [
    { quote: "My baby has 3 allergies and my husband is diabetic. MealEase is honestly the only reason we eat proper meals anymore.", author: "Sarah K.", role: "Mom of 2", location: "Chicago, IL", initials: "SK", tags: ["Allergy-aware", "Multi-condition"] },
    { quote: "I spent 2 hours every Sunday meal planning. Now it takes 5 minutes and the AI handles all the dietary stuff automatically.", author: "James T.", role: "Dad of 3", location: "Austin, TX", initials: "JT", tags: ["Time-saving", "3 kids"] },
    { quote: "The baby-safe variations feature alone is worth every penny. No more second-guessing whether something is safe for my 9-month-old.", author: "Priya M.", role: "Mom of 1", location: "Seattle, WA", initials: "PM", tags: ["Baby-safe", "Peace of mind"] },
    { quote: "We have a picky toddler and my wife is on a pregnancy-safe diet. MealEase generates meals that actually work for everyone — every night.", author: "David R.", role: "Dad of 1", location: "Denver, CO", initials: "DR", tags: ["Picky eater", "Pregnancy diet"] },
    { quote: "As a pediatric nurse I was skeptical, but MealEase explains every safety decision. I trust it and recommend it to parents at work now.", author: "Lisa N.", role: "Mom & Pediatric Nurse", location: "Nashville, TN", initials: "LN", tags: ["Medical background", "Nurse-approved"] },
    { quote: "My son has FPIES and finding any tool that handles his triggers was impossible — until MealEase. Absolute game changer for our family.", author: "Monica H.", role: "Mom of 2", location: "Portland, OR", initials: "MH", tags: ["FPIES", "Rare conditions"] },
  ]

  return (
    <section className="py-20 sm:py-24 bg-muted/25">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Real families, real results</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Loved by 12,000+ families</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Families navigating allergies, medical conditions, babies, and picky eaters — MealEase handles it all.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.author} className="glass-card rounded-xl p-6 border border-border/60 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{t.initials}</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">{t.author}</p>
                      <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified user" />
                    </div>
                    <p className="text-xs text-muted-foreground">{t.role} &middot; {t.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── TRUST BADGES ─────────────────────── */
function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, title: 'Built-in safety checks', description: 'Every meal variation is screened against age, allergy, and condition rules before it ever reaches your screen.', iconBg: 'bg-emerald-100 text-emerald-700', cardBg: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-900' },
    { icon: Lock, title: 'Your data stays private', description: 'We never sell your family health data. Dietary profiles exist only to personalize your meals.', iconBg: 'bg-blue-100 text-blue-700', cardBg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-900' },
    { icon: Heart, title: 'Made by parents, for parents', description: 'MealEase was built by a family facing these exact challenges — we understand what is actually at stake.', iconBg: 'bg-rose-100 text-rose-700', cardBg: 'bg-rose-50 border-rose-200', textColor: 'text-rose-900' },
    { icon: UserCheck, title: 'No sneaky commitments', description: 'Try core features completely free — no credit card required. Cancel any paid plan instantly, anytime.', iconBg: 'bg-amber-100 text-amber-700', cardBg: 'bg-amber-50 border-amber-200', textColor: 'text-amber-900' },
  ]
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Why families trust us</Badge>
          <h2 className="text-3xl font-bold">Safe, transparent, and family-first</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className={`rounded-xl border p-5 ${b.cardBg}`}>
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${b.iconBg}`}><Icon className="h-5 w-5" /></div>
                <h3 className={`font-semibold text-sm mb-1.5 ${b.textColor}`}>{b.title}</h3>
                <p className={`text-xs leading-relaxed opacity-80 ${b.textColor}`}>{b.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── PRICING ─────────────────────── */
function PricingPreview() {
  const tiers = [
    { name: 'Free', price: '$0', description: 'Preview the value with no friction.', features: ['Instant tonight meal preview', '2 extra swipes per day', '3 baby & kids recipes per day', '3-day weekly plan preview', 'No card required'], cta: 'Get started free', href: '/signup', highlighted: false },
    { name: 'Pro', price: '$19', period: '/month', description: 'Unlock the full planning workflow.', features: ['Full 7-day planner', 'Smart grocery list', 'Pantry tracking', 'Insights dashboard', 'Unlimited swipes', 'Unlimited kids recipes', 'Weekly kids meal plan', 'Photo-to-recipe', 'Advanced planning tools'], cta: 'Upgrade to Pro', href: '/signup?plan=pro', highlighted: true },
  ]
  return (
    <section className="py-20 sm:py-24 bg-muted/25">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Simple, family-friendly pricing</h2>
          <p className="mt-3 text-muted-foreground">All plans include a 14-day free trial.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-2xl border p-6 flex flex-col ${tier.highlighted ? 'border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20' : 'border-border/60 bg-card'}`}>
              {tier.highlighted && <Badge className="w-fit mb-3 bg-primary text-white">Most popular</Badge>}
              <h3 className="font-bold text-xl">{tier.name}</h3>
              <div className="mt-1 flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6 flex-1">{tier.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>)}</ul>
              <Button asChild variant={tier.highlighted ? 'default' : 'outline'} className="w-full"><Link href={tier.href}>{tier.cta}</Link></Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── GROWTH ─────────────────────── */
function GrowthContent() {
  const items = [
    { href: '/meals', title: 'Browse public meal ideas', description: 'Indexable recipe pages designed for search, sharing, and fast inspiration when families need dinner ideas.', icon: Soup, cta: 'Explore meals' },
    { href: '/blog', title: 'Read the MealEase blog', description: 'Articles on family meal planning, toddler dinners, baby-safe meals, and condition-aware cooking.', icon: BookOpen, cta: 'Read articles' },
  ]
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Learn &amp; Explore</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Discover meals and practical family nutrition advice</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="glass-card rounded-2xl border border-border/60 p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">{item.cta} <ChevronRight className="h-4 w-4" /></span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── FINAL CTA ─────────────────────── */
function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_IMAGES.ctaBackdrop.url}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      </div>
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
          Your next dinner is already decided.
        </h2>
        <p className="text-white/90 mb-8 text-lg">
          Join 12,000+ families who stopped thinking about dinner and started eating it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
          <Button asChild size="lg" variant="secondary" className="px-8 text-base shadow-xl">
            <Link href="/signup">Try MealEase free <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 text-base bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white">
            <Link href="/tonight?mode=tired">Try it without signing up</Link>
          </Button>
        </div>
        <p className="text-white/70 text-xs">No credit card required &middot; Built for real family routines</p>
      </div>
    </section>
  )
}

/* ─────────────────────── DISCLAIMER ─────────────────────── */
function FriendlyDisclaimer() {
  return (
    <section className="py-10 border-t border-border/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground mb-3">
          <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
          <span className="text-sm font-medium">A note from our team</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          MealEase is a meal planning assistant — not a substitute for a medical professional or registered dietitian.
          Our built-in safety rules are designed to help reduce risk, but they are not a guarantee.
          Always consult your pediatrician or healthcare provider for specific dietary guidance, especially for infants, children with health conditions, or during pregnancy.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────── PAGE ─────────────────────── */
export default function LandingPage() {
  return (
    <>
      <PublicSiteHeader />
      <main>
        <Hero />
        <SocialProof />
        <ModeCards />
        <HowItWorks />
        <MealPreview />
        <ProblemSolution />
        <Features />
        <BuiltByParents />
        <Testimonials />
        <TrustBadges />
        <PricingPreview />
        <GrowthContent />
        <FinalCta />
        <FriendlyDisclaimer />
      </main>
      <PublicSiteFooter />
    </>
  )
}
