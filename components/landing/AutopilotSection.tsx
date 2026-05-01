import Image from 'next/image'
import Link from 'next/link'
import {
  Recycle,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Leaf,
  Lock,
  RefreshCcw,
  Sparkles,
  Utensils,
} from 'lucide-react'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'

const autopilotFeatures = [
  {
    icon: Brain,
    title: 'Learns your household',
    body: 'Dietary needs, dislikes, skill level, and household size shape every suggestion.',
  },
  {
    icon: Recycle,
    title: 'Uses your leftovers first',
    body: 'Expiring food gets repurposed into creative dinners — less waste, more flavor.',
  },
  {
    icon: DollarSign,
    title: 'Respects your budget',
    body: 'Stays within your weekly limit. Strict mode never exceeds the per-day cap.',
  },
  {
    icon: Leaf,
    title: 'Seasonal intelligence',
    body: 'Hearty stews in winter, fresh grilling in summer — meals match the season.',
  },
  {
    icon: Clock,
    title: 'Weekday-smart prep times',
    body: 'Quick meals Mon–Thu, more involved recipes on weekends when you have time.',
  },
  {
    icon: Utensils,
    title: 'Cuisine rotation',
    body: 'Never the same cuisine twice in a row. Italian → Mexican → Asian → variety.',
  },
]

const demoWeek = [
  { day: 'Mon', meal: 'Lemon Herb Chicken', time: '25m', tag: 'Pantry basil', locked: true },
  { day: 'Tue', meal: 'Black Bean Tacos', time: '20m', tag: 'Uses tortillas' },
  { day: 'Wed', meal: 'Teriyaki Salmon Bowl', time: '30m', tag: 'Kid-friendly' },
  { day: 'Thu', meal: 'Pasta Primavera', time: '22m', tag: 'Under $9' },
  { day: 'Fri', meal: 'Thai Basil Chicken', time: '35m', tag: 'Cuisine shift' },
  { day: 'Sat', meal: 'Braised Short Ribs', time: '55m', tag: 'Weekend prep' },
  { day: 'Sun', meal: 'Mushroom Risotto', time: '45m', tag: 'No waste' },
]

const smartSignals = [
  '5 unique proteins across the week',
  '3 pantry items already owned',
  '1 leftover repurposed',
  '$62 estimated, $18 under budget',
]

export function AutopilotSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#FDF6F1] py-20 dark:bg-neutral-950 md:py-28"
      aria-labelledby="autopilot-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,246,241,1)_0%,rgba(255,255,255,0.76)_56%,rgba(255,255,255,1)_100%)] dark:bg-[linear-gradient(to_bottom,rgba(10,10,10,1)_0%,rgba(23,23,23,0.88)_56%,rgba(10,10,10,1)_100%)]"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <FadeIn>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#D97757] shadow-sm ring-1 ring-[#D97757]/20 dark:bg-neutral-900">
                <Sparkles className="h-4 w-4" aria-hidden />
                AI Autopilot
              </div>

              <h2
                id="autopilot-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl"
              >
                Your whole dinner week, planned before the coffee cools.
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                MealEase reads pantry, leftovers, budget, dietary needs, and the season,
                then builds a week that feels planned by someone who actually lives with you.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { value: '7', label: 'dinners generated' },
                  { value: '$18', label: 'under demo budget' },
                  { value: '30m', label: 'average cook time' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-900/80 dark:ring-neutral-800"
                  >
                    <p className="font-serif text-3xl font-bold text-[#D97757]">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#D97757] px-6 text-base font-medium text-white shadow-md shadow-[#D97757]/20 transition-all duration-200 hover:bg-[#C86646] hover:shadow-lg hover:shadow-[#D97757]/28 active:scale-[0.98]"
                >
                  Try Autopilot free
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/features/weekly-autopilot"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full px-4 text-sm font-semibold text-neutral-700 underline-offset-4 transition-colors hover:text-[#D97757] hover:underline dark:text-neutral-300"
                >
                  See Weekly Autopilot
                </Link>
              </div>

              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                No credit card required. Preview 3 days free, unlock the full week with Plus.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 shadow-2xl shadow-neutral-900/20 ring-1 ring-black/10 dark:ring-white/10">
                <div className="relative aspect-[4/3] min-h-[360px]">
                  <Image
                    src="/landing/smartautopilot.png"
                    alt="MealEase Autopilot weekly planning interface"
                    fill
                    sizes="(min-width: 1024px) 620px, 100vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,10,8,0.88)_0%,rgba(15,10,8,0.22)_42%,rgba(15,10,8,0)_72%)]" />
                </div>

                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/94 p-4 shadow-xl backdrop-blur-md ring-1 ring-white/80 dark:bg-neutral-950/90 dark:ring-white/10 sm:inset-x-6 sm:bottom-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D97757]">
                        Autopilot result
                      </p>
                      <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                        Budget-aware week ready to review
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Under budget
                      </span>
                      <span className="hidden items-center gap-1 rounded-full bg-[#FDF6F1] px-3 py-1 text-xs font-bold text-[#B85F43] ring-1 ring-[#D97757]/15 sm:inline-flex dark:bg-[#D97757]/10 dark:text-[#F3B18E]">
                        <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
                        Swappable
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 top-6 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 md:block">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97757]/10 text-[#D97757]">
                    <Lock className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Family favorite</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Locked for Monday</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-1/2 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 lg:block">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Recycle className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Leftover save</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Roast chicken used</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.16}>
          <div className="mt-14 overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-neutral-200/40 ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:shadow-black/30 dark:ring-neutral-800">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#D97757]" aria-hidden />
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">This week&apos;s dinner map</span>
              </div>
              <span className="rounded-full bg-[#FDF6F1] px-3 py-1 text-xs font-bold text-[#B85F43] ring-1 ring-[#D97757]/15 dark:bg-[#D97757]/10 dark:text-[#F3B18E]">
                Generated in seconds
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-7 lg:divide-x lg:divide-neutral-100 lg:dark:divide-neutral-800">
              {demoWeek.map((day) => (
                <div
                  key={day.day}
                  className="flex min-h-[144px] flex-col gap-3 border-b border-neutral-100 p-4 last:border-b-0 dark:border-neutral-800 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                      {day.day}
                    </span>
                    {day.locked && <Lock className="h-3.5 w-3.5 text-[#D97757]" aria-label="Locked meal" />}
                  </div>
                  <p className="text-sm font-semibold leading-snug text-neutral-900 dark:text-white">
                    {day.meal}
                  </p>
                  <div className="mt-auto space-y-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden /> {day.time}
                    </span>
                    <span className="block rounded-full bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-[#B85F43] ring-1 ring-neutral-200/70 dark:bg-neutral-950 dark:text-[#F3B18E] dark:ring-neutral-800">
                      {day.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {smartSignals.map((signal) => (
                  <span key={signal} className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {autopilotFeatures.map((feature, i) => {
            const Icon = feature.icon
            return (
              <FadeIn key={feature.title} delay={0.04 * i}>
                <article className="group h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#D97757]/30 dark:bg-neutral-900 dark:ring-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97757]/10 text-[#D97757] transition-colors group-hover:bg-[#D97757] group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {feature.body}
                  </p>
                </article>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[1.75rem] bg-neutral-950 shadow-2xl shadow-neutral-900/20 ring-1 ring-neutral-900/10 dark:ring-white/10">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[280px]">
                <Image
                  src="/landing/family-dinner.jpg"
                  alt="Family enjoying a meal planned by MealEase Autopilot"
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/30 md:bg-gradient-to-l" />
              </div>

              <div className="p-7 text-white md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3B18E]">
                  How Autopilot works
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold md:text-3xl">
                  It plans like a system, then leaves you in control.
                </h3>

                <div className="mt-6 grid gap-3">
                  {[
                    { step: '01', title: 'Reads the week', desc: 'Pantry, leftovers, budget, dietary needs, season, and time.' },
                    { step: '02', title: 'Balances the plan', desc: 'Cuisine variety, protein rotation, prep time, and grocery impact.' },
                    { step: '03', title: 'Lets you steer', desc: 'Lock favorites, swap any day, rerun, or move straight to groceries.' },
                  ].map((item) => (
                    <div key={item.step} className="grid grid-cols-[44px_1fr] gap-3 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
                      <p className="text-xs font-bold text-[#F3B18E]">{item.step}</p>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
