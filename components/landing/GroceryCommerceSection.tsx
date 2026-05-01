import Link from 'next/link'
import { ArrowRight, CheckCircle2, ClipboardList, ShoppingCart, Store } from 'lucide-react'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'

const steps = [
  {
    icon: ClipboardList,
    title: 'Generate weekly plan',
    body: 'MealEase builds dinners around your household, week, budget, and preferences.',
  },
  {
    icon: CheckCircle2,
    title: 'Grocery list auto-built',
    body: 'Ingredients roll into one organized list you can edit before shopping.',
  },
  {
    icon: ShoppingCart,
    title: 'Shop or export',
    body: 'Use supported store handoff tools, copy your list, download PDF, or shop locally.',
  },
]

export function GroceryCommerceSection() {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950 md:py-20" aria-labelledby="grocery-commerce-heading">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
              Grocery Commerce
            </p>
            <h2
              id="grocery-commerce-heading"
              className="mt-3 font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl"
            >
              From meal plan to groceries in minutes.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-400 md:text-lg">
              MealEase turns your weekly plan into a ready-to-shop grocery list with supported store handoff tools and global exports.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <FadeIn key={step.title} delay={index * 0.08}>
                <article className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97757]/10 text-[#D97757]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#D97757]/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {step.body}
                  </p>
                </article>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.24}>
          <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-[#D97757]/20 bg-[#FDF6F1] p-5 dark:border-[#D97757]/20 dark:bg-neutral-900 md:flex md:items-center md:justify-between md:gap-6">
            <div className="flex gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#D97757] shadow-sm dark:bg-neutral-950">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                  Supported store handoff in North America. Flexible export everywhere.
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Shop at supported stores such as Walmart or Instacart where available. Elsewhere, copy your list, download PDF, or use it at your local store.
                </p>
              </div>
            </div>
            <Link
              href="/signup"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D97757] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c4664a] md:mt-0"
            >
              Plan groceries free
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
