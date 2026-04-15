import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, ShieldCheck, Users, Calendar, ShoppingCart,
  ChevronRight, Check, Star, BookOpen, Soup, Lock,
  BadgeCheck, Heart, UserCheck, UtensilsCrossed, Clock,
  ArrowRight,
} from 'lucide-react'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'

// All Unsplash IDs curl-verified 200 before use
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`

const HERO_IMG   = U('1547592180-85f173990554') // warm family dinner table
const PROBLEM_IMG = U('1504674900247-0877df9cc836') // tired / messy kitchen
const SOLUTION_IMG = U('1498837167922-ddd27525d352') // happy food table
const CTA_IMG    = U('1556909114-f6e7ad7d3136')  // warm kitchen close-up
const TRUST_IMG  = U('1565299624946-b28f40a0ae38') // plated family meal
const SAUSAGE_IMG = U('1555939594-58d7cb561ad1')  // roasted sheet-pan

/* ─────────────────────────────── HERO ─────────────────────────────── */
function Hero() {
  const secondaryModes = [
    { label: 'Get inspired',   emoji: '✨', href: '/tonight?mode=inspiration', description: 'AI picks for you' },
    { label: 'Use what I have',emoji: '🥫', href: '/tonight?mode=pantry',      description: 'Snap your fridge' },
    { label: 'Baby & Kids',    emoji: '👶', href: '/kids',                      description: 'Age-safe meals' },
    { label: 'Plan my week',   emoji: '📅', href: '/onboarding',               description: 'Full meal planning' },
  ]

  return (
    <section className="relative overflow-hidden gradient-hero py-16 sm:py-24">
      {/* Real food photo backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-30" />
        {/* Directional veil — heavier on left (text readable), opens up right so food shows */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-background/25" />
        {/* Warm amber glow from bottom-left — makes it feel like a candlelit table */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/40 via-transparent to-transparent" />
        {/* Sage accent from top-right for brand color echo */}
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50/30 via-transparent to-transparent" />
      </div>

      {/* Decorative emoji layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {['🍋','🫑','🧄','🍅','🥦','🧅','🫒','🥕'].map((emoji, i) => (
          <span key={i} className="absolute opacity-[0.12]" style={{
            top:  `${[12,70,30,85,15,60,42,78][i]}%`,
            left: `${[5,90,82,8,55,3,72,48][i]}%`,
            transform: `rotate(${[-15,20,-8,25,12,-20,5,-12][i]}deg)`,
            fontSize: `${[3,2.5,3.5,2,3,2.5,3.5,2][i]}rem`,
          }}>{emoji}</span>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Smart meal planning for real families
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
              Make family meals{' '}
              <span className="text-gradient-sage">easy.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-3 leading-relaxed">
              Too tired to decide? We&apos;ll handle dinner — in seconds.
            </p>
            <p className="text-sm text-muted-foreground mb-8">No credit card required. No decisions needed.</p>

            {/* Primary CTA */}
            <div className="max-w-md mx-auto lg:mx-0 mb-4">
              <Link href="/tonight?mode=tired"
                className="glass-card flex items-center gap-4 w-full px-6 py-5 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 hover:shadow-lg transition-all group text-left">
                <span className="text-4xl flex-shrink-0">😴</span>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold group-hover:text-primary transition-colors">I don&apos;t want to think</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Just pick something simple for tonight →</p>
                </div>
              </Link>
            </div>

            {/* Secondary modes */}
            <p className="text-xs text-muted-foreground mb-3 text-center lg:text-left">Or choose a different approach:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md mx-auto lg:mx-0 mb-6">
              {secondaryModes.map((m) => (
                <Link key={m.label} href={m.href}
                  className="glass-card rounded-xl p-3 border border-border/60 hover:border-primary/40 hover:shadow-md transition-all group text-center">
                  <span className="text-2xl block mb-1">{m.emoji}</span>
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors block">{m.label}</span>
                  <span className="text-[11px] text-muted-foreground">{m.description}</span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start items-center text-sm text-muted-foreground">
              <span>Already have an account?</span>
              <div className="flex gap-3">
                <Link href="/login"  className="text-primary hover:underline font-medium">Sign in</Link>
                <span>·</span>
                <Link href="/signup" className="text-primary hover:underline font-medium">Create account</Link>
              </div>
            </div>
          </div>

          {/* Right: photo card with app chip */}
          <div className="hidden lg:block" aria-hidden>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_IMG} alt="Family dinner" className="w-full aspect-[4/5] object-cover" />
                {/* Floating app card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-white shadow-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary text-white flex items-center justify-center text-xs font-bold">M</div>
                      <span className="text-xs font-bold text-gradient-sage">MealEase</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">😴 No-think dinner</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">One-Pan Lemon Herb Chicken</h3>
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

/* ──────────────────────── SOCIAL PROOF BAR ──────────────────────── */
function SocialProof() {
  const stats = [
    { value: '12,000+', label: 'Families using MealEase' },
    { value: '340K+',   label: 'Meals planned' },
    { value: '4.9★',    label: 'Average app rating' },
    { value: '< 2 min', label: 'Average setup time' },
  ]

  const avatars = [
    { initials: 'SK', color: 'bg-rose-400' },
    { initials: 'JT', color: 'bg-blue-400' },
    { initials: 'PM', color: 'bg-violet-400' },
    { initials: 'DR', color: 'bg-emerald-400' },
    { initials: 'LN', color: 'bg-amber-400' },
  ]

  return (
    <section className="border-y border-amber-200/60 bg-amber-50/60 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Avatar stack + label */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <div className="flex -space-x-2">
            {avatars.map((a) => (
              <div key={a.initials}
                className={`h-8 w-8 rounded-full ${a.color} text-white text-xs font-bold flex items-center justify-center ring-2 ring-white`}>
                {a.initials}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-amber-900">
            Joined by <span className="font-bold">12,000+ families</span> — rated 4.9 ★
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── PROBLEM / SOLUTION ─────────────────────── */
function ProblemSolution() {
  return (
    <section className="py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl border border-border/40">

          {/* Problem side */}
          <div className="relative bg-rose-50 p-8 sm:p-10">
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PROBLEM_IMG} alt="" className="w-full h-full object-cover opacity-10" />
            </div>
            <div className="relative">
              <Badge variant="outline" className="mb-4 text-destructive border-destructive/30 bg-white/80">
                The Problem
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight text-rose-950">
                Family meal planning is exhausting and risky
              </h2>
              <ul className="space-y-4">
                {[
                  "Your toddler can't eat what the baby eats. Your partner is low-sodium. Your kid has a nut allergy.",
                  "You spend hours adapting one recipe into 4 different meals every night.",
                  "You're terrified of accidentally giving your baby something unsafe.",
                ].map((p, i) => (
                  <li key={i} className="flex gap-3 text-rose-800">
                    <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-bold">✕</span>
                    <span className="text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
              {/* Photo inset */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-md border border-rose-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROBLEM_IMG} alt="Overwhelmed parent at dinner time" className="w-full aspect-[16/7] object-cover" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Solution side */}
          <div className="relative bg-emerald-50 p-8 sm:p-10">
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SOLUTION_IMG} alt="" className="w-full h-full object-cover opacity-10" />
            </div>
            <div className="relative">
              <Badge variant="outline" className="mb-4 text-emerald-700 border-emerald-300 bg-white/80">
                The MealEase Solution
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-emerald-950">
                One idea → A full plan your whole family will eat
              </h2>
              <p className="text-sm text-emerald-800 mb-5 leading-relaxed">
                Tell us about your family once. MealEase builds complete meal plans with safe variations for every member — automatically.
              </p>
              <div className="space-y-2 mb-8">
                {[
                  'Baby-safe variations (no honey, appropriate textures)',
                  'Allergy-aware ingredient substitutions',
                  'Medical condition support (PCOS, low sodium, etc.)',
                  'Consolidated grocery lists that save money',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-emerald-900">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              {/* Photo inset */}
              <div className="rounded-2xl overflow-hidden shadow-md border border-emerald-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SOLUTION_IMG} alt="Happy family enjoying dinner together" className="w-full aspect-[16/7] object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── FEATURES (dark) ─────────────────────── */
function Features() {
  const features = [
    { icon: Sparkles,      title: 'Smart Meal Generation',  description: 'Complete weekly meal plans in seconds — full ingredient lists and per-member instructions.', accent: 'text-violet-400', ring: 'ring-violet-500/30', bg: 'bg-violet-500/10' },
    { icon: ShieldCheck,   title: 'Safety First',           description: 'Automatic safety checks for every household member — no honey for babies, egg-free for allergies.', accent: 'text-amber-400', ring: 'ring-amber-500/30', bg: 'bg-amber-500/10' },
    { icon: Users,         title: 'Per-Member Variations',  description: 'Each family member gets their own tailored variation of every meal, from one base recipe.', accent: 'text-blue-400', ring: 'ring-blue-500/30', bg: 'bg-blue-500/10' },
    { icon: Calendar,      title: 'Weekly Planner',         description: 'Visual 7-day planner with meal regeneration and nutrition overview at a glance.', accent: 'text-pink-400', ring: 'ring-pink-500/30', bg: 'bg-pink-500/10' },
    { icon: ShoppingCart,  title: 'Smart Grocery Lists',    description: 'Auto-consolidated grocery lists with quantity estimates, pantry deduction, and per-aisle organisation.', accent: 'text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
    { icon: UtensilsCrossed, title: 'Pantry Tracking',      description: 'Track what you have on hand. MealEase prioritises existing pantry items before suggesting new purchases.', accent: 'text-orange-400', ring: 'ring-orange-500/30', bg: 'bg-orange-500/10' },
  ]

  return (
    <section className="py-20 sm:py-24 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-white/10 text-white/80 border-white/20 hover:bg-white/10">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything your family needs</h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto">One app. Every person at your table. Every night of the week.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title}
                className={`rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 hover:border-white/20 transition-all ring-1 ${f.ring}`}>
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}>
                  <Icon className={`h-5 w-5 ${f.accent}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── TESTIMONIALS ─────────────────────── */
function Testimonials() {
  const items = [
    { quote: "My baby has 3 allergies and my husband is diabetic. MealEase is honestly the only reason we eat proper meals anymore.", author: "Sarah K.", role: "Mom of 2", location: "Chicago, IL", initials: "SK", color: "bg-rose-400", tags: ["Allergy-aware", "Multi-condition"] },
    { quote: "I spent 2 hours every Sunday meal planning. Now it takes 5 minutes and the AI handles all the dietary stuff automatically.", author: "James T.", role: "Dad of 3", location: "Austin, TX", initials: "JT", color: "bg-blue-400", tags: ["Time-saving", "3 kids"] },
    { quote: "The baby-safe variations feature alone is worth every penny. No more second-guessing whether something is safe for my 9-month-old.", author: "Priya M.", role: "Mom of 1", location: "Seattle, WA", initials: "PM", color: "bg-violet-400", tags: ["Baby-safe", "Peace of mind"] },
    { quote: "We have a picky toddler and my wife is on a pregnancy-safe diet. MealEase generates meals that actually work for everyone — every night.", author: "David R.", role: "Dad of 1", location: "Denver, CO", initials: "DR", color: "bg-emerald-400", tags: ["Picky eater", "Pregnancy diet"] },
    { quote: "As a pediatric nurse I was skeptical, but MealEase explains every safety decision. I trust it and recommend it to parents at work now.", author: "Lisa N.", role: "Mom & Pediatric Nurse", location: "Nashville, TN", initials: "LN", color: "bg-amber-400", tags: ["Medical background", "Nurse-approved"] },
    { quote: "My son has FPIES and finding any tool that handles his triggers was impossible — until MealEase. Absolute game changer for our family.", author: "Monica H.", role: "Mom of 2", location: "Portland, OR", initials: "MH", color: "bg-pink-400", tags: ["FPIES", "Rare conditions"] },
  ]

  return (
    <section className="py-20 sm:py-24 bg-orange-50/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Pull quote header */}
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-orange-200 text-orange-700 bg-white/80">Real families, real results</Badge>
          <blockquote className="text-2xl sm:text-3xl font-bold text-foreground leading-snug max-w-2xl mx-auto mb-4">
            &ldquo;I don&apos;t second-guess dinner anymore.&rdquo;
          </blockquote>
          <p className="text-muted-foreground">— Loved by 12,000+ families navigating allergies, conditions, babies and picky eaters</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.author} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-8 w-8 rounded-full ${t.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
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
    { icon: ShieldCheck, title: 'Built-in safety checks',   description: 'Every meal variation is screened against age, allergy, and condition rules before it reaches your screen.', iconBg: 'bg-emerald-100 text-emerald-700', cardBg: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-900' },
    { icon: Lock,        title: 'Your data stays private',   description: 'We never sell your family health data. Dietary profiles exist only to personalise your meals.',             iconBg: 'bg-blue-100 text-blue-700',    cardBg: 'bg-blue-50 border-blue-200',    textColor: 'text-blue-900' },
    { icon: Heart,       title: 'Made by parents, for parents', description: 'MealEase was built by a family facing these exact challenges — we understand what is actually at stake.', iconBg: 'bg-rose-100 text-rose-700',    cardBg: 'bg-rose-50 border-rose-200',    textColor: 'text-rose-900' },
    { icon: UserCheck,   title: 'No sneaky commitments',     description: 'Try core features completely free — no credit card required. Cancel any paid plan instantly, anytime.',       iconBg: 'bg-amber-100 text-amber-700',  cardBg: 'bg-amber-50 border-amber-200',  textColor: 'text-amber-900' },
  ]

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Lifestyle photo banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TRUST_IMG} alt="Family meal" className="w-full aspect-[21/6] object-cover object-center" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div>
              <Badge variant="outline" className="mb-2">Why families trust us</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">Safe, transparent, and family-first</h2>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className={`rounded-xl border p-5 ${b.cardBg}`}>
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${b.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
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
    {
      name: 'Free', price: '$0', description: 'Preview the value with no friction.',
      features: ['Instant tonight meal preview', '2 extra swipes per day', '3 baby & kids recipes per day', '3-day weekly plan preview', 'No card required'],
      cta: 'Get started free', href: '/signup', highlighted: false,
    },
    {
      name: 'Pro', price: '$19', period: '/month', description: 'Unlock the full planning workflow.',
      features: ['Full 7-day planner', 'Smart grocery list', 'Pantry tracking', 'Insights dashboard', 'Unlimited swipes', 'Unlimited kids recipes', 'Weekly kids meal plan', 'Photo-to-recipe', 'Advanced planning tools'],
      cta: 'Upgrade to Pro', href: '/signup?plan=pro', highlighted: true,
    },
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
            <div key={tier.name} className={`rounded-2xl border p-6 flex flex-col ${tier.highlighted ? 'border-primary bg-primary/5 shadow-xl ring-1 ring-primary/20' : 'border-border/60 bg-card'}`}>
              {tier.highlighted && <Badge className="w-fit mb-3 bg-primary text-white">Most popular</Badge>}
              <h3 className="font-bold text-xl">{tier.name}</h3>
              <div className="mt-1 flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={tier.highlighted ? 'default' : 'outline'} className="w-full">
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
              {tier.highlighted && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Trusted by 12,000+ families · Cancel anytime
                </p>
              )}
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
    { href: '/blog',  title: 'Read the MealEase blog',  description: 'Articles on family meal planning, toddler dinners, baby-safe meals, and condition-aware cooking.',          icon: BookOpen, cta: 'Read articles' },
  ]

  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Learn &amp; Explore</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Practical family nutrition advice</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">MealEase publishes meal ideas and educational articles to help families find better dinners.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}
                className="glass-card rounded-2xl border border-border/60 p-6 hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </span>
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
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Full-bleed food photo + dark overlay */}
      <div aria-hidden className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CTA_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-primary/75 to-slate-900/85" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <Badge className="mb-6 bg-white/15 text-white border-white/25 hover:bg-white/15">
          Join 12,000+ families
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
          Your next dinner is<br />already decided.
        </h2>
        <p className="text-white/80 mb-8 text-lg leading-relaxed">
          Stop opening three recipe tabs and closing them again.<br className="hidden sm:block" />
          MealEase handles dinner so you can focus on the people eating it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-5">
          <Button asChild size="lg" variant="secondary" className="px-8 text-base shadow-xl font-semibold">
            <Link href="/signup">Try MealEase free <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" className="px-8 text-base bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:text-white shadow-lg">
            <Link href="/tonight?mode=tired">See tonight&apos;s meal →</Link>
          </Button>
        </div>
        <p className="text-white/50 text-xs">No credit card required &middot; No decisions needed &middot; Built for real families</p>
      </div>
    </section>
  )
}

/* ─────────────────────── DISCLAIMER ─────────────────────── */
function FriendlyDisclaimer() {
  return (
    <section className="py-10 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground mb-3">
          <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
          <span className="text-sm font-medium">A note from our team</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          MealEase is a meal planning assistant — not a substitute for a medical professional or registered dietitian.
          Our built-in safety rules are designed to help reduce risk, but they are not a guarantee.
          Always consult your pediatrician or healthcare provider for specific dietary guidance, especially for infants,
          children with health conditions, or during pregnancy. When you are unsure, please ask your doctor first.
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
        <ProblemSolution />
        <Features />
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
