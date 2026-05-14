import Image from 'next/image'
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
    <section className="border-y border-orange-100 bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
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
            <blockquote className="mt-5 rounded-2xl border border-orange-100 bg-[#FBFAF3] p-4 text-sm leading-6 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              &ldquo;The week plan plus grocery list is the part I would come back for.&rdquo;
              <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#D97757]">
                Priya S. · early household
              </footer>
            </blockquote>
            <div className="mt-5 grid gap-3">
              {proofSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.label}
                    className="relative rounded-2xl border border-orange-100 bg-[#FBFAF3] p-4 dark:border-neutral-800 dark:bg-neutral-900"
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
              <div className="relative aspect-[556/520] bg-[#FBFAF3]">
                <Image
                  src="/landing/product-first-result.jpg"
                  alt="MealEase first-use flow showing a generated dinner and grocery list preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 620px"
                  loading="lazy"
                  className="object-cover object-top"
                />
              </div>
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
                      A real first-use result: sample fridge, three preferences, generated dinner, and a grocery list preview before account creation.
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
