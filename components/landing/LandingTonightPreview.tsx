import { getLandingTonightMeal } from '@/lib/tonight/engine'
import { CheckCircle2, ChevronRight, Clock, Home, ShoppingCart, Sparkles } from 'lucide-react'

/**
 * Landing page Tonight preview — shows inside the Hero phone mockup.
 * Server component: renders once per request, stable per day.
 * No hydration mismatch since it's purely server-rendered.
 *
 * Layout: real meal photo → meal name → prep time → benefit tags
 * Goal: appetite + trust + conversion
 */
export function LandingTonightPreview() {
  const meal = getLandingTonightMeal()

  return (
    <div className="absolute inset-0 z-20 flex flex-col overflow-hidden">
      {/* Status bar mock */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[10px] font-semibold text-neutral-500">9:41</span>
        <div className="flex items-center gap-1" aria-hidden>
          <span className="text-[10px] text-neutral-400">●●●</span>
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center justify-between px-5 pb-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#D97757]">
            MealEase
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-neutral-500">
            Tonight for your household
          </p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-orange-100">
          <Home className="h-3.5 w-3.5 text-[#D97757]" aria-hidden />
        </span>
      </div>

      <div className="mx-4 overflow-hidden rounded-[1.55rem] bg-white shadow-lg ring-1 ring-orange-100">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#FFF7ED_0%,#F0FDF4_100%)] p-3">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#D97757]/10" />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D97757] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
            Best for tonight
          </span>
          <div className="mt-3 rounded-2xl bg-white/82 p-3 shadow-sm ring-1 ring-white/70 backdrop-blur">
            <p className="text-sm font-bold leading-snug text-neutral-900">
              {meal.name}
            </p>
            <p className="mt-1 text-[10px] leading-tight text-neutral-600">
              {meal.tagline}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              {['Comfort', 'Saturday', 'Pantry'].map((tag) => (
                <span key={tag} className="rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#B85F43] ring-1 ring-orange-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#FBFAF3] p-2.5 ring-1 ring-orange-100">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#D97757]" aria-hidden />
                <span className="text-xs font-bold text-neutral-800">{meal.cookTimeMin} min</span>
              </div>
              <p className="mt-1 text-[10px] font-medium text-neutral-500">{meal.weekdayLabel} dinner</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-2.5 ring-1 ring-emerald-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                <span className="text-xs font-bold text-neutral-800">Pantry first</span>
              </div>
              <p className="mt-1 text-[10px] font-medium text-emerald-700">Uses what you have</p>
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-100">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                Grocery handoff
              </p>
              <ShoppingCart className="h-3.5 w-3.5 text-[#D97757]" aria-hidden />
            </div>
            {['Greek yogurt', 'Scallions', 'Salad greens'].map((item) => (
              <div key={item} className="flex items-center justify-between border-t border-neutral-200/70 py-1.5 first:border-t-0 first:pt-0">
                <span className="text-[11px] font-semibold text-neutral-700">{item}</span>
                <span className="text-[10px] font-bold text-emerald-700">ready</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons mock */}
      <div className="mt-auto px-4 pb-4 pt-3">
        <div className="flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#D97757] to-[#E8895A] shadow-md shadow-orange-200/50">
          <span className="text-xs font-bold text-white">Review dinner plan</span>
          <ChevronRight className="ml-1 h-3.5 w-3.5 text-white" aria-hidden />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {meal.benefits.slice(0, 3).map((benefit) => (
            <span
              key={benefit}
              className="truncate rounded-full bg-orange-50 px-2 py-1 text-center text-[9px] font-semibold text-orange-800 ring-1 ring-orange-100"
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
