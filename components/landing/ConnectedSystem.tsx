import Image from 'next/image'
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  DollarSign,
  Refrigerator,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'

const systemSteps = [
  {
    icon: ChefHat,
    label: 'Tonight',
    title: 'Pick dinner',
    body: 'MealEase starts with the meal you need now, not a blank prompt.',
  },
  {
    icon: CalendarDays,
    label: 'Planner',
    title: 'Shape the week',
    body: 'The same context becomes a 3-day preview or full 7-day Autopilot plan.',
  },
  {
    icon: ShoppingCart,
    label: 'Grocery',
    title: 'Build the list',
    body: 'Ingredients consolidate into a store-ready list with pantry deductions.',
  },
  {
    icon: DollarSign,
    label: 'Budget',
    title: 'Track the cost',
    body: 'Meal costs and grocery estimates update the weekly budget picture.',
  },
  {
    icon: Refrigerator,
    label: 'Leftovers',
    title: 'Use what remains',
    body: 'Cooked meals create leftover options instead of becoming fridge clutter.',
  },
]

const memoryItems = [
  'Liked dinners become stronger future picks',
  'Avoided foods stay out of the plan',
  'Repeated favorites resurface at the right time',
  'Household preferences follow every swap',
]

const postCookItems = [
  'Mark cooked',
  'Leftovers tracked',
  'Budget updated',
  'Tomorrow lunch suggested',
]

export function ConnectedSystem() {
  return (
    <section className="bg-neutral-950 py-20 text-white md:py-28" aria-labelledby="system-heading">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F3B18E]">
              Calm food operating system
            </p>
            <h2
              id="system-heading"
              className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl"
            >
              Dinner, groceries, leftovers, and budget update each other.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-300">
              MealEase is strongest when every action moves the next one forward:
              tonight feeds the planner, the planner feeds the grocery list, cooking
              feeds leftovers, and budget stays visible the whole time.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {systemSteps.map((step, index) => {
            const Icon = step.icon

            return (
              <FadeIn key={step.label} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F3B18E]">
                      {step.label}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97757] text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{step.body}</p>
                </article>
              </FadeIn>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.18}>
            <article className="relative h-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              {/* Background image */}
              <Image
                src="/landing/memory.jpg"
                alt=""
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
              {/* Dark gradient overlay — top lighter, bottom denser for text safety */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,10,20,0.42)_0%,rgba(5,10,20,0.65)_100%)]" />
              {/* Subtle warm tint at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d0a08]/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 text-[#F3B18E]">
                    <Brain className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3B18E] drop-shadow-sm">
                      MealEase remembers
                    </p>
                    <h3 className="mt-2 font-serif text-3xl font-bold text-white drop-shadow-sm">
                      The plan gets less generic every time you cook.
                    </h3>
                  </div>
                </div>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {memoryItems.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 drop-shadow-sm" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>

          <FadeIn delay={0.24}>
            <article className="h-full rounded-3xl border border-[#D97757]/30 bg-[#D97757]/10 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D97757] text-white">
                  <Sparkles className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3B18E]">
                    After dinner
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-bold">
                    Mark cooked starts the next useful loop.
                  </h3>
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-4">
                {postCookItems.map((item, index) => (
                  <div key={item} className="rounded-2xl bg-neutral-950/55 p-4">
                    <p className="text-xs font-bold text-[#F3B18E]">0{index + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
