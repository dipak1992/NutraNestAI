import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileDown,
  MapPin,
  MinusCircle,
  ShoppingCart,
  Store,
} from 'lucide-react'
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

const groceryItems = [
  { name: 'Chicken thighs', detail: '2 lb', status: 'Add to cart' },
  { name: 'Black beans', detail: '2 cans', status: 'Pantry check' },
  { name: 'Fresh basil', detail: '1 bunch', status: 'Add to cart' },
  { name: 'Rice', detail: 'Already owned', status: 'Removed' },
]

const exportOptions = [
  { icon: ShoppingCart, label: 'Store handoff', detail: 'Walmart or Instacart where supported' },
  { icon: FileDown, label: 'PDF export', detail: 'Clean list for any store' },
  { icon: ClipboardList, label: 'Copy list', detail: 'Paste into notes or delivery apps' },
]

export function GroceryCommerceSection() {
  return (
    <section
      className="relative overflow-hidden bg-white py-20 dark:bg-neutral-950 md:py-28"
      aria-labelledby="grocery-commerce-heading"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-[#FDF6F1]/70 to-transparent dark:from-neutral-950 dark:via-neutral-900/70"
      />
      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <FadeIn>
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
                Grocery Commerce
              </p>
              <h2
                id="grocery-commerce-heading"
                className="mt-3 font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl"
              >
                The plan becomes a grocery run you can actually finish.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Autopilot consolidates ingredients, deducts what you already have,
                groups the list by aisle, and hands it off to supported stores or exports
                cleanly for any local market.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Aisle grouped', value: '6' },
                  { label: 'Pantry saves', value: '$11' },
                  { label: 'Ready in', value: '1 tap' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-[#FDF6F1] p-4 ring-1 ring-[#D97757]/15 dark:bg-neutral-900 dark:ring-neutral-800"
                  >
                    <p className="font-serif text-3xl font-bold text-[#D97757]">{item.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#D97757] px-6 text-base font-medium text-white shadow-md shadow-[#D97757]/20 transition-all duration-200 hover:bg-[#C86646] hover:shadow-lg hover:shadow-[#D97757]/28 active:scale-[0.98]"
                >
                  Plan groceries free
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Copy, PDF, or supported store handoff.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 shadow-2xl shadow-neutral-900/15 ring-1 ring-black/10 dark:ring-white/10">
                <div className="relative aspect-[16/10] min-h-[220px] md:aspect-[4/3] md:min-h-[360px]">
                  <Image
                    src="/landing/grocery.jpg"
                    alt="Fresh groceries ready for a MealEase weekly plan"
                    fill
                    sizes="(min-width: 1024px) 620px, 100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.46)_0%,rgba(8,8,8,0.08)_52%,rgba(8,8,8,0)_100%)] md:bg-[linear-gradient(to_right,rgba(8,8,8,0.78)_0%,rgba(8,8,8,0.42)_45%,rgba(8,8,8,0.08)_100%)]" />
                </div>

                <GroceryListCard className="m-3 md:absolute md:inset-y-5 md:left-5 md:m-0 md:w-[min(360px,calc(100%-40px))]" />
              </div>

              <div className="absolute -right-3 bottom-8 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 md:block">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <MinusCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Pantry deducted</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Rice, oil, spices</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <FadeIn key={step.title} delay={index * 0.08}>
                <article className="group h-full rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:ring-[#D97757]/30 dark:bg-neutral-900 dark:ring-neutral-800 dark:hover:bg-neutral-900">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#D97757] shadow-sm ring-1 ring-neutral-200/70 transition-colors group-hover:bg-[#D97757] group-hover:text-white dark:bg-neutral-950 dark:ring-neutral-800">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#D97757]/25">0{index + 1}</span>
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
          <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-[1.75rem] bg-neutral-950 text-white shadow-2xl shadow-neutral-900/15 ring-1 ring-neutral-900/10 dark:ring-white/10">
            <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
              <div className="p-6 md:p-8">
                <div className="flex gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F3B18E] ring-1 ring-white/10">
                    <Store className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Supported store handoff in North America. Flexible export everywhere.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">
                      Shop at supported stores such as Walmart or Instacart where available.
                      Elsewhere, copy your list, download a PDF, or use it at your local store.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 border-t border-white/10 lg:grid-cols-3 lg:border-l lg:border-t-0">
                {exportOptions.map((option) => {
                  const Icon = option.icon

                  return (
                    <div key={option.label} className="border-b border-white/10 p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                      <Icon className="h-5 w-5 text-[#F3B18E]" aria-hidden />
                      <p className="mt-3 text-sm font-semibold text-white">{option.label}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-400">{option.detail}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <MapPin className="h-4 w-4 text-[#F3B18E]" aria-hidden />
                Availability depends on region and store coverage.
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-[#FDF6F1]"
              >
                Start with tonight&apos;s plan
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}

function GroceryListCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md ring-1 ring-white/80 dark:bg-neutral-950/90 dark:ring-white/10 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D97757]">
            Grocery list
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
            22 items for 7 dinners
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800">
          $76 est.
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {groceryItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.detail}</p>
            </div>
            <span className="text-xs font-bold text-[#B85F43] dark:text-[#F3B18E]">
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D97757] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#C86646]"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden />
          Review grocery handoff
        </button>
      </div>
    </div>
  )
}
