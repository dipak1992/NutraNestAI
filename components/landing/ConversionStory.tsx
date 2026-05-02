import Image from 'next/image'
import { CheckCircle2, RefreshCcw, ShoppingCart, Sparkles } from 'lucide-react'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'

const workflow = [
  { icon: Sparkles, label: 'Tonight Pick' },
  { icon: RefreshCcw, label: 'Swap' },
  { icon: CheckCircle2, label: 'Save' },
  { icon: ShoppingCart, label: 'Grocery List' },
]

export function ConversionStory() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-neutral-950 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <FadeIn className="lg:col-span-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
              Built for the dinner moment
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">
              From blank fridge stare to grocery-ready plan.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              MealEase keeps the household context generic AI forgets: what you like, what you have, what you spent, and what needs to happen next.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl shadow-neutral-950/10">
              <div className="absolute inset-0">
                <Image
                  src="/landing/conversion-story.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/92 via-neutral-950/70 to-neutral-950/30" />
              </div>
              <div className="relative grid gap-4 sm:grid-cols-4">
                {workflow.map((step, index) => {
                  const Icon = step.icon

                  return (
                    <div key={step.label} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D97757] text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 font-semibold">{step.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
