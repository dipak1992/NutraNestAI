import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, Sparkles, ShieldCheck, Users, Calendar, ShoppingCart, ChevronRight, Check, Star } from 'lucide-react'

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI-Powered Family Meal Planning
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Plan one meal.{' '}
          <span className="text-gradient-sage">Feed the whole family</span>{' '}
          — safely.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          NutriNest AI creates personalized meal variations for every family member simultaneously —
          respecting allergies, life stages, and health conditions automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="text-base px-8 shadow-lg">
            <Link href="/signup">Get started free <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Free plan · No credit card required</p>
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
    { quote: "My baby has 3 allergies and my husband is diabetic. NutriNest is honestly the only reason we eat proper meals anymore.", author: "Sarah K.", role: "Mom of 2, Chicago" },
    { quote: "I spent 2 hours every Sunday meal planning. Now it takes 5 minutes and the AI handles all the dietary stuff automatically.", author: "James T.", role: "Dad of 3, Austin" },
    { quote: "The baby-safe variations feature alone is worth every penny. No more second-guessing whether something is safe for my 9-month-old.", author: "Priya M.", role: "Mom of 1, Seattle" },
  ]
  return (
    <section className="py-20 sm:py-24 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Loved by families everywhere</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.author} className="glass-card rounded-xl p-6 border border-border/60">
              <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-sm">{t.author}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingPreview() {
  const tiers = [
    { name: 'Free', price: '$0', description: 'Perfect for small families.', features: ['Up to 4 family members', '2 AI plan generations/month', 'Basic grocery lists', 'Meal history (last 2 weeks)'], cta: 'Get started free', href: '/signup', highlighted: false },
    { name: 'Family', price: '$9', period: '/month', description: 'Everything for stress-free planning.', features: ['Up to 8 family members', 'Unlimited AI generations', 'Smart pantry tracking', 'Medical condition awareness', 'Advanced grocery optimization', 'Priority support'], cta: 'Start free trial', href: '/signup?plan=family', highlighted: true },
    { name: 'Premium', price: '$19', period: '/month', description: 'For nutrition-conscious households.', features: ['Unlimited family members', 'Everything in Family', 'Nutrition insights', 'Pantry barcode scanning', 'Custom AI preferences', 'Export to PDF / CSV'], cta: 'Start free trial', href: '/signup?plan=premium', highlighted: false },
  ]
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Simple, family-friendly pricing</h2>
          <p className="mt-3 text-muted-foreground">All plans include a 14-day free trial.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
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
        <PricingPreview />
        <section className="py-20 gradient-sage">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start feeding your family safely today</h2>
            <p className="text-white/80 mb-8 text-lg">Join 12,000+ families who have simplified meal planning with NutriNest AI.</p>
            <Button asChild size="lg" variant="secondary" className="px-8 text-base shadow-lg">
              <Link href="/signup">Create your free account <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 bg-muted/20 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white"><Leaf className="h-3.5 w-3.5" /></span>
            NutriNest AI
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} NutriNest AI. Built with care for families.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
