import Image from 'next/image'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  DollarSign,
  Home,
  Lock,
  Recycle,
  ShoppingCart,
  Utensils,
  Users,
} from 'lucide-react'
import { Container } from './shared/Container'

const proofSteps = [
  {
    icon: Camera,
    label: 'Scan or sample',
    body: 'Start with fridge items like eggs, spinach, rice, and chicken.',
  },
  {
    icon: CheckCircle2,
    label: 'Dinner result',
    body: 'Get one realistic household dinner with time, servings, and cost.',
  },
  {
    icon: ShoppingCart,
    label: 'Grocery list',
    body: 'See the missing items organized into a shopping-ready list.',
  },
] as const

export function ProductProofStrip() {
  return (
    <section className="border-y border-orange-100 bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950 md:py-14">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
              First useful output
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              From fridge photo to dinner and groceries.
            </h2>
            <p className="mt-2 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
              The core MealEase loop is now available before account creation:
              scan or choose a sample, answer three preferences, then save the plan.
            </p>
            <blockquote className="mt-5 rounded-2xl border border-orange-100 bg-[#FBFAF3] p-4 text-sm leading-6 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              &ldquo;The week plan plus grocery list is the part I would come back for.&rdquo;
              <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#D97757]">
                Priya S. · beta household
              </footer>
            </blockquote>
            <div className="mt-5 grid gap-3">
              {proofSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.label}
                    className="relative rounded-2xl border border-orange-100 bg-[#FBFAF3] p-4 shadow-sm shadow-orange-100/35 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
                  >
                    <div className="flex gap-3">
                      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#D97757] shadow-sm dark:bg-neutral-950">
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {step.label}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                          {step.body}
                        </p>
                      </div>
                    </div>
                    {index < proofSteps.length - 1 && (
                      <ArrowRight
                        className="absolute -bottom-3 left-6 h-5 w-5 rotate-90 text-[#D97757]"
                        aria-hidden
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-100/45 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
              <ProductFirstResultPreview />
              <div className="bg-neutral-950 p-5 text-white">
                <div className="grid gap-4 md:grid-cols-2 md:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F3B18E]">
                      Captured from the product
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-bold leading-tight">
                      Dinner output and grocery preview in one flow.
                    </h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <p className="text-sm leading-6 text-white/72">
                      A first-use result: sample fridge, three preferences, generated dinner, and a grocery list preview before account creation.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-white/8 p-3">
                        <p className="font-bold text-white/50">Before</p>
                        <p className="mt-1 text-white/80">Ingredients, no plan.</p>
                      </div>
                      <div className="rounded-xl bg-[#D97757] p-3">
                        <p className="font-bold text-white/70">After</p>
                        <p className="mt-1 font-semibold text-white">Dinner plus list.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ProductFirstResultPreview() {
  const groceryItems = [
    { name: 'Avocado', amount: '1 medium', emoji: '🥑' },
    { name: 'Ground beef', amount: '1 lb', emoji: '🥩' },
    { name: 'Sour cream', amount: '1/4 cup', emoji: '🥣' },
    { name: 'Black beans', amount: '1 can', emoji: '🫘' },
    { name: 'Shredded cheese', amount: '1 cup', emoji: '🧀' },
    { name: 'Lettuce', amount: '1 head', emoji: '🥬' },
  ]

  const navItems = [
    { label: 'Tonight', icon: Utensils, active: true },
    { label: 'Cook', icon: Camera },
    { label: 'Plan', icon: CalendarDays },
    { label: 'Leftovers', icon: Recycle },
    { label: 'Budget', icon: DollarSign },
  ]

  return (
    <div
      className="relative overflow-hidden bg-[#FFF4E7] px-4 py-6 dark:bg-neutral-950 sm:px-6 sm:py-8"
      aria-label="MealEase first-use flow showing a generated dinner and grocery list preview"
      role="img"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.94),transparent_42%),radial-gradient(circle_at_100%_35%,rgba(217,119,87,0.32),transparent_38%),linear-gradient(120deg,rgba(255,255,255,0.82),rgba(255,244,231,0.72))]"
      />
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-35 blur-[1px]" aria-hidden>
        <Image
          src="/landing/optimized/hero-section.webp"
          alt=""
          fill
          sizes="320px"
          className="object-cover object-right"
        />
      </div>

      <div className="relative mx-auto max-w-[430px]">
        <div className="rounded-[2.9rem] bg-neutral-950 p-2.5 shadow-2xl shadow-orange-950/24 ring-1 ring-black/10">
          <div className="relative h-[760px] overflow-hidden rounded-[2.45rem] bg-[#FFFDF8] sm:h-[790px]">
            <div className="absolute left-1/2 top-0 z-30 h-8 w-36 -translate-x-1/2 rounded-b-3xl bg-neutral-950" />

            <div className="flex items-center justify-between px-8 pt-5 text-neutral-950">
              <span className="text-[14px] font-bold tracking-tight">12:47</span>
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-1 rounded-full bg-neutral-300" />
                <span className="h-3.5 w-1 rounded-full bg-neutral-400" />
                <span className="h-4.5 w-1 rounded-full bg-neutral-700" />
                <span className="rounded bg-emerald-500 px-1 text-[10px] font-bold text-white">
                  30%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-8 pb-4 pt-7">
              <p className="font-serif text-[24px] font-bold uppercase tracking-[0.04em] text-[#D97757]">
                MealEase
              </p>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#D97757] shadow-lg shadow-orange-100 ring-1 ring-orange-100">
                <Home className="h-5 w-5" aria-hidden />
              </span>
            </div>

            <div className="mx-5 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-orange-950/10 ring-1 ring-orange-100 sm:mx-7">
              <div className="relative min-h-[288px] p-5 sm:min-h-[245px]">
                <div
                  className="absolute right-3 top-11 hidden overflow-hidden rounded-full border-4 border-white shadow-xl shadow-orange-950/15 sm:block sm:-right-2 sm:top-6"
                  style={{ width: 'clamp(112px, 16vw, 150px)', height: 'clamp(112px, 16vw, 150px)' }}
                >
                  <Image
                    src="/landing/optimized/dinner-picked-beef-bowl.jpg"
                    alt="Beef taco bowl with avocado, lettuce, cheese, and salsa"
                    fill
                    sizes="170px"
                    className="object-cover"
                  />
                </div>
                <div className="relative mb-4 h-28 overflow-hidden rounded-2xl shadow-lg shadow-orange-950/10 ring-1 ring-orange-100 sm:hidden">
                  <Image
                    src="/landing/optimized/dinner-picked-beef-bowl.jpg"
                    alt="Beef taco bowl with avocado, lettuce, cheese, and salsa"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10" style={{ maxWidth: 190 }}>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-100 sm:gap-2 sm:text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    Dinner picked
                  </div>
                  <h3 className="mt-5 font-serif text-[28px] font-bold leading-[1.05] tracking-tight text-neutral-950 sm:mt-7 sm:text-[32px] sm:leading-tight">
                    Beef Taco Bowl
                  </h3>
                  <p className="mt-3 text-[13px] leading-5 text-neutral-600 sm:text-[14px] sm:leading-6">
                    Seasoned ground beef over rice with cheese, salsa, avocado, and sour cream.
                  </p>
                </div>
                <div className="relative z-10 mt-5 grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold text-neutral-700 sm:mt-7 sm:gap-2 sm:text-[12px]">
                  {[
                    { icon: Clock3, label: '25 min' },
                    { icon: Users, label: '4 servings' },
                    { icon: DollarSign, label: '$12 est.' },
                  ].map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div
                        key={stat.label}
                        className="inline-flex items-center justify-center gap-1 rounded-2xl bg-white px-1.5 py-3 shadow-md shadow-neutral-900/5 ring-1 ring-neutral-100 sm:gap-1.5 sm:px-2"
                      >
                        <Icon className="h-4 w-4 text-neutral-500" aria-hidden />
                        {stat.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mx-7 mt-5 rounded-[2rem] bg-white/96 p-5 shadow-sm ring-1 ring-emerald-100">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <ShoppingCart className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h4 className="font-serif text-[25px] font-bold leading-tight text-neutral-950">
                    Grocery list preview
                  </h4>
                  <p className="mt-1 text-sm font-medium text-neutral-500">
                    You likely have 6 of 12 items
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full w-1/2 rounded-full bg-emerald-700" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-neutral-100 pt-4">
                {groceryItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-2xl leading-none" aria-hidden>
                      {item.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-tight text-neutral-950">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-neutral-500">
                        {item.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm font-bold text-emerald-700">
                +6 more items
              </p>
            </div>

            <div className="mx-7 mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-full bg-[#D97757] px-5 py-4 text-center text-base font-bold text-white shadow-lg shadow-orange-200">
                Start free
              </div>
              <div className="rounded-full bg-white px-5 py-4 text-center text-base font-bold text-neutral-950 shadow-sm ring-1 ring-neutral-200">
                See pricing
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-500">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              No credit card required
            </div>

            <div className="absolute inset-x-0 bottom-0 border-t border-neutral-200 bg-white/94 px-5 pb-4 pt-3 backdrop-blur">
              <div className="grid grid-cols-5 gap-1 text-center">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className={item.active ? 'text-[#D97757]' : 'text-neutral-500'}
                    >
                      <Icon className="mx-auto h-5 w-5" aria-hidden />
                      <p className="mt-1 text-[10px] font-semibold">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
