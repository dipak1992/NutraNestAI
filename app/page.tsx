import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, Sparkles, ShieldCheck, Users, Calendar, ShoppingCart, ChevronRight, Check, Star, Zap, BookOpen, Soup, Lock, BadgeCheck, Heart, UserCheck } from 'lucide-react'

function Hero() {
  const modes = [
    { label: 'Just show me', emoji: '✨', href: '/tonight?mode=quick', description: 'No input needed' },
    { label: "I'm tired", emoji: '😴', href: '/tonight?mode=tired', description: 'Minimal effort meals' },
    { label: 'Use what I have', emoji: '🥫', href: '/tonight?mode=pantry', description: 'Pantry staples' },
    { label: 'Plan my week', emoji: '📅', href: '/onboarding', description: 'Full meal planning' },
  ]

  return (
    <section className="relative overflow-hidden gradient-hero py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI-Powered Family Meal Planning
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
          Generate dinner in{' '}
          <span className="text-gradient-sage">5 seconds</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 leading-relaxed">
          One meal. Safe variations for your baby, toddler, kid, and you —
          instantly.
        </p>
        <p className="text-sm text-muted-foreground mb-8">No signup required. Try it now.</p>

        {/* Primary CTA */}
        <Button asChild size="lg" className="text-base px-8 shadow-lg mb-8">
          <Link href="/tonight?mode=quick">
            <Zap className="mr-2 h-4 w-4" /> Generate tonight&apos;s dinner
          </Link>
        </Button>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto mb-6">
          {modes.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="glass-card rounded-xl p-3 sm:p-4 border border-border/60 hover:border-primary/40 hover:shadow-md transition-all group text-center"
            >
              <span className="text-2xl sm:text-3xl block mb-1.5">{m.emoji}</span>
              <span className="text-sm font-semibold group-hover:text-primary transition-colors block">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.description}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-muted-foreground">
          <span>Already have an account?</span>
          <div className="flex gap-3">
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            <span>·</span>
            <Link href="/signup" className="text-primary hover:underline font-medium">Create account</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialProof() {
  const stats = [
    { value: '12,000+', label: 'Families using NutriNest' },
    { value: '340K+', label: 'Meals planned safely' },
    { value: '4.9★', label: 'Average app rating' },
    { value: '98%', label: 'Allergy accuracy rate' },
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
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">The NutriNest Solution</Badge>
            <h3 className="text-2xl font-bold mb-4 text-primary">One base meal → Safe variations for everyone</h3>
            <p className="text-muted-foreground mb-6">Tell us about your family once. Our AI generates personalized meal variations for each member — every week — with built-in safety checks.</p>
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
    { icon: Sparkles, title: 'AI Meal Generation', description: 'Claude AI creates complete weekly meal plans in seconds, with full ingredient lists and per-member instructions.', color: 'bg-primary/10 text-primary' },
    { icon: ShieldCheck, title: 'Safety First', description: 'Automatic safety checks for every household member — no honey for babies, egg-free for allergies, low-sodium for conditions.', color: 'bg-amber-100 text-amber-700' },
    { icon: Users, title: 'Per-Member Variations', description: 'Each family member gets their own tailored variation of every meal, built from the same base recipe.', color: 'bg-blue-100 text-blue-700' },
    { icon: Calendar, title: 'Weekly Planner', description: 'Visual 7-day planner with meal regeneration and nutrition overview at a glance.', color: 'bg-purple-100 text-purple-700' },
    { icon: ShoppingCart, title: 'Smart Grocery Lists', description: 'Auto-consolidated grocery lists with quantity estimates, pantry deduction, and per-aisle organization.', color: 'bg-emerald-100 text-emerald-700' },
    { icon: Leaf, title: 'Pantry Tracking', description: 'Track what you have on hand. NutriNest prioritizes using existing pantry items before suggesting new purchases.', color: 'bg-orange-100 text-orange-700' },
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
      quote: "My baby has 3 allergies and my husband is diabetic. NutriNest is honestly the only reason we eat proper meals anymore.",
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
      quote: "We have a picky toddler and my wife is on a pregnancy-safe diet. NutriNest generates meals that actually work for everyone — every night.",
      author: "David R.",
      role: "Dad of 1",
      location: "Denver, CO",
      initials: "DR",
      tags: ["Picky eater", "Pregnancy diet"],
    },
    {
      quote: "As a pediatric nurse I was skeptical, but NutriNest explains every safety decision. I trust it and recommend it to parents at work now.",
      author: "Lisa N.",
      role: "Mom & Pediatric Nurse",
      location: "Nashville, TN",
      initials: "LN",
      tags: ["Medical background", "Nurse-approved"],
    },
    {
      quote: "My son has FPIES and finding any tool that handles his triggers was impossible — until NutriNest. Absolute game changer for our family.",
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
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Families navigating allergies, medical conditions, babies, and picky eaters — NutriNest handles it all.</p>
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
      description: 'NutriNest was built by a family facing these exact challenges — we understand what is actually at stake.',
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
          NutriNest AI is a meal planning assistant — not a substitute for a medical professional or registered dietitian.
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
      title: 'Read the NutriNest blog',
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
          <Badge variant="outline" className="mb-4">Learn & Explore</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Discover meals and practical family nutrition advice</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            NutriNest now publishes public meal pages and educational articles to help families find safer dinner ideas organically.
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
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white"><Leaf className="h-4 w-4" /></span>
            <span className="text-gradient-sage">NutriNest AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link href="/login">Log in</Link></Button>
            <Button asChild size="sm"><Link href="/signup">Get started</Link></Button>
          </div>
        </div>
      </header>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start feeding your family safely today</h2>
            <p className="text-white/80 mb-8 text-lg">Join 12,000+ families who have simplified meal planning with NutriNest AI.</p>
            <Button asChild size="lg" variant="secondary" className="px-8 text-base shadow-lg">
              <Link href="/signup">Create your free account <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
        <FriendlyDisclaimer />
      </main>
      <footer className="border-t border-border/60 bg-muted/20 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white"><Leaf className="h-3.5 w-3.5" /></span>
            NutriNest AI
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} NutriNest AI. Built with care for families.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/meals" className="hover:text-foreground transition-colors">Meals</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
