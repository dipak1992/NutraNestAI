import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ShieldCheck, Users, Calendar, ShoppingCart, ChevronRight, Check, Star, BookOpen, Soup, Lock, BadgeCheck, Heart, UserCheck, UtensilsCrossed, Clock } from 'lucide-react'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'

function Hero() {
  const secondaryModes = [
    { label: 'Get inspired', emoji: '✨', href: '/tonight?mode=inspiration', description: 'AI picks for you' },
    { label: 'Use what I have', emoji: '🥫', href: '/tonight?mode=pantry', description: 'Snap your fridge' },
    { label: 'Smart for you', emoji: '🧠', href: '/tonight?mode=smart', description: 'Learns your taste' },
    { label: 'Plan my week', emoji: '📅', href: '/onboarding', description: 'Full meal planning' },
  ]

  return (
    <section className="relative overflow-hidden gradient-hero py-16 sm:py-24">
      {/* Decorative food emoji backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {['🍋', '🫑', '🧄', '🍅', '🥦', '🧅', '🫒', '🥕'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-[0.06]"
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

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: headline + CTAs */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Smart meal planning for real families
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              Make family meals{' '}
              <span className="text-gradient-sage">easy.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-3 leading-relaxed">
              Too tired to decide? We&apos;ll handle dinner — in seconds.
            </p>
            <p className="text-sm text-muted-foreground mb-8">No credit card required. No decisions needed.</p>

            {/* Primary CTA */}
            <div className="max-w-md mx-auto lg:mx-0 mb-4">
              <Link
                href="/tonight?mode=tired"
                className="glass-card flex items-center gap-4 w-full px-6 py-5 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 hover:shadow-lg transition-all group text-left"
              >
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
                <Link
                  key={m.label}
                  href={m.href}
                  className="glass-card rounded-xl p-3 border border-border/60 hover:border-primary/40 hover:shadow-md transition-all group text-center"
                >
                  <span className="text-2xl block mb-1">{m.emoji}</span>
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors block">{m.label}</span>
                  <span className="text-[11px] text-muted-foreground">{m.description}</span>
                </Link>
              ))}
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

          {/* Right: meal preview mockup */}
          <div className="hidden lg:block" aria-hidden>
            <div className="relative">
              {/* Soft glow behind the card */}
              <div className="absolute -inset-4 bg-primary/8 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
                {/* Mock header */}
                <div className="bg-primary/5 border-b border-border/40 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary text-white flex items-center justify-center text-xs font-bold">M</div>
                    <span className="text-sm font-bold text-gradient-sage">MealEase</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Tonight&apos;s dinner →</span>
                </div>
                {/* Mock meal card */}
                <div className="p-5">
                  <div className="mb-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-medium">😴 No-Think Dinner</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">One-Pan Lemon Herb Chicken</h3>
                  <p className="text-sm text-muted-foreground mb-4">Golden, juicy, and on the table in 30 minutes</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> 30 min</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" /> Serves 4</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Family-safe</span>
                  </div>
                  {/* Mini ingredient list */}
                  <div className="rounded-xl border border-border/50 divide-y divide-border/30 text-xs mb-4">
                    {[['Chicken thighs', '4 pieces'], ['Baby potatoes', '1 lb'], ['Lemon', '2 whole'], ['Fresh thyme', '4 sprigs']].map(([name, qty]) => (
                      <div key={name} className="flex justify-between px-3 py-2">
                        <span>{name}</span>
                        <span className="text-muted-foreground font-mono">{qty}</span>
                      </div>
                    ))}
                  </div>
                  {/* Family variations */}
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Family variations</p>
                  <div className="flex gap-2">
                    {[['🧑', 'Adult'], ['👦', 'Kid'], ['👶', 'Toddler'], ['🍼', 'Baby']].map(([emoji, label]) => (
                      <div key={label} className="flex-1 text-center rounded-lg bg-muted/40 py-2 px-1">
                        <div className="text-base">{emoji}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                      </div>
                    ))}
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

function SocialProof() {
  const stats = [
    { value: '12,000+', label: 'Families using MealEase' },
    { value: '340K+', label: 'Meals planned' },
    { value: '4.9★', label: 'Average app rating' },
    { value: '< 2 min', label: 'Average setup time' },
  ]
  return (
    <section className="border-y border-border/60 bg-muted/30 py-10">
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

function ProblemSolution() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4 text-destructive border-destructive/30">The Problem</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">Family meal planning is exhausting and risky</h2>
            <ul className="space-y-4">
              {["Your toddler can't eat what the baby eats. Your partner is low-sodium. Your kid has a nut allergy.", "You spend hours adapting one recipe into 4 different meals every night.", "You're terrified of accidentally giving your baby something unsafe."].map((p, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-primary/20">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">The MealEase Solution</Badge>
            <h3 className="text-2xl font-bold mb-4 text-primary">One idea → A full plan your whole family will eat</h3>
            <p className="text-muted-foreground mb-6">Tell us about your family once. MealEase builds complete meal plans with safe variations for every member — automatically.</p>
            <div className="space-y-2">
              {['Baby-safe variations (no honey, appropriate textures)', 'Allergy-aware ingredient substitutions', 'Medical condition support (PCOS, low sodium, etc.)', 'Consolidated grocery lists that save money'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary flex-shrink-0" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-20 sm:py-24 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Everything your family needs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="glass-card rounded-xl p-6 border border-border/60 hover:border-primary/30 transition-colors">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}><Icon className="h-5 w-5" /></div>
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

function Testimonials() {
  const items = [
    {
      quote: "My baby has 3 allergies and my husband is diabetic. MealEase is honestly the only reason we eat proper meals anymore.",
      author: "Sarah K.",
      role: "Mom of 2",
      location: "Chicago, IL",
      initials: "SK",
      tags: ["Allergy-aware", "Multi-condition"],
    },
    {
      quote: "I spent 2 hours every Sunday meal planning. Now it takes 5 minutes and the AI handles all the dietary stuff automatically.",
      author: "James T.",
      role: "Dad of 3",
      location: "Austin, TX",
      initials: "JT",
      tags: ["Time-saving", "3 kids"],
    },
    {
      quote: "The baby-safe variations feature alone is worth every penny. No more second-guessing whether something is safe for my 9-month-old.",
      author: "Priya M.",
      role: "Mom of 1",
      location: "Seattle, WA",
      initials: "PM",
      tags: ["Baby-safe", "Peace of mind"],
    },
    {
      quote: "We have a picky toddler and my wife is on a pregnancy-safe diet. MealEase generates meals that actually work for everyone — every night.",
      author: "David R.",
      role: "Dad of 1",
      location: "Denver, CO",
      initials: "DR",
      tags: ["Picky eater", "Pregnancy diet"],
    },
    {
      quote: "As a pediatric nurse I was skeptical, but MealEase explains every safety decision. I trust it and recommend it to parents at work now.",
      author: "Lisa N.",
      role: "Mom & Pediatric Nurse",
      location: "Nashville, TN",
      initials: "LN",
      tags: ["Medical background", "Nurse-approved"],
    },
    {
      quote: "My son has FPIES and finding any tool that handles his triggers was impossible — until MealEase. Absolute game changer for our family.",
      author: "Monica H.",
      role: "Mom of 2",
      location: "Portland, OR",
      initials: "MH",
      tags: ["FPIES", "Rare conditions"],
    },
  ]

  return (
    <section className="py-20 sm:py-24">
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
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">
                      {tag}
                    </span>
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

function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: 'Built-in safety checks',
      description: 'Every meal variation is screened against age, allergy, and condition rules before it ever reaches your screen.',
      iconBg: 'bg-emerald-100 text-emerald-700',
      cardBg: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-900',
    },
    {
      icon: Lock,
      title: 'Your data stays private',
      description: 'We never sell your family health data. Dietary profiles exist only to personalize your meals.',
      iconBg: 'bg-blue-100 text-blue-700',
      cardBg: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      icon: Heart,
      title: 'Made by parents, for parents',
      description: 'MealEase was built by a family facing these exact challenges — we understand what is actually at stake.',
      iconBg: 'bg-rose-100 text-rose-700',
      cardBg: 'bg-rose-50 border-rose-200',
      textColor: 'text-rose-900',
    },
    {
      icon: UserCheck,
      title: 'No sneaky commitments',
      description: 'Try core features completely free — no credit card required. Cancel any paid plan instantly, anytime.',
      iconBg: 'bg-amber-100 text-amber-700',
      cardBg: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-900',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
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
          When you are unsure, please ask your doctor first. We want your family to be safe above everything else.
        </p>
      </div>
    </section>
  )
}

function PricingPreview() {
  const tiers = [
    { name: 'Free', price: '$0', description: 'Preview the value with no friction.', features: ['Instant tonight meal preview', '2 extra swipes per day', '3-day weekly plan preview', 'No card required'], cta: 'Get started free', href: '/signup', highlighted: false },
    { name: 'Pro', price: '$19', period: '/month', description: 'Unlock the full planning workflow.', features: ['Full 7-day planner', 'Smart grocery list', 'Pantry tracking', 'Insights dashboard', 'Unlimited swipes', 'Advanced planning tools'], cta: 'Upgrade to Pro', href: '/signup?plan=pro', highlighted: true },
  ]
  return (
    <section className="py-20 sm:py-24">
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

function GrowthContent() {
  const items = [
    {
      href: '/meals',
      title: 'Browse public meal ideas',
      description:
        'Indexable recipe pages designed for search, sharing, and fast inspiration when families need dinner ideas.',
      icon: Soup,
      cta: 'Explore meals',
    },
    {
      href: '/blog',
      title: 'Read the MealEase blog',
      description:
        'Articles on family meal planning, toddler dinners, baby-safe meals, and condition-aware cooking.',
      icon: BookOpen,
      cta: 'Read articles',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Learn &amp; Explore</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Discover meals and practical family nutrition advice</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            MealEase publishes public meal pages and educational articles to help families find better dinner ideas.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card rounded-2xl border border-border/60 p-6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {item.cta} <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
        <section className="py-20 gradient-sage">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start making meals easy today</h2>
            <p className="text-white/80 mb-8 text-lg">Join 12,000+ families who have simplified dinner with MealEase.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              <Button asChild size="lg" variant="secondary" className="px-8 text-base shadow-lg">
                <Link href="/signup">Try MealEase free <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <p className="text-white/60 text-xs">No credit card required &middot; Built for real family routines</p>
          </div>
        </section>
        <FriendlyDisclaimer />
      </main>
      <PublicSiteFooter />
    </>
  )
}
