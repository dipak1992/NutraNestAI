import { ArrowRight, Camera, CheckCircle2, ShoppingCart } from 'lucide-react'
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
    <section className="border-y border-orange-100 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-950">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
              First useful output
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              From fridge photo to dinner and groceries.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              The core MealEase loop is now available before account creation:
              scan or choose a sample, answer three preferences, then save the plan.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {proofSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.label}
                  className="relative rounded-2xl border border-orange-100 bg-[#FBFAF3] p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#D97757] shadow-sm dark:bg-neutral-950">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                    {step.body}
                  </p>
                  {index < proofSteps.length - 1 && (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[#D97757] sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
