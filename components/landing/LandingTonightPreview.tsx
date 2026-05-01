import { getLandingTonightMeal } from '@/lib/tonight/engine'
import { Clock, Sparkles, ChefHat } from 'lucide-react'

/**
 * Landing page Tonight preview — shows inside the Hero phone mockup.
 * Server component: renders once per request, stable per day.
 * No hydration mismatch since it's purely server-rendered.
 */
export function LandingTonightPreview() {
  const meal = getLandingTonightMeal()

  return (
    <div className="absolute inset-0 z-20 flex flex-col p-5">
      {/* Header */}
      <div className="mt-7 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D97757]">
            Tonight&rsquo;s Pick
          </p>
          <p className="mt-1 text-lg font-bold text-neutral-950 leading-tight">
            {meal.name}
          </p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D97757] text-white shadow-lg shadow-[#D97757]/25">
          <ChefHat className="h-5 w-5" aria-hidden />
        </span>
      </div>

      {/* Meal card */}
      <div className="mt-5 rounded-2xl bg-white/95 p-4 shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D97757]" aria-hidden />
            <span className="text-sm font-semibold text-neutral-900">
              Ready in {meal.cookTimeMin} min
            </span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
            ${(meal.cookTimeMin < 20 ? 10 : 12)} for 4
          </span>
        </div>

        {/* Benefits chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meal.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-800"
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ['Time', `${meal.cookTimeMin}m`],
            ['Servings', '4'],
            ['Score', '96'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-neutral-50 px-2 py-2">
              <p className="text-[10px] text-neutral-500">{label}</p>
              <p className="text-sm font-bold text-neutral-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action hints */}
      <div className="mt-auto space-y-2">
        {[
          { icon: Clock, label: 'Swap for something different' },
          { icon: Sparkles, label: 'Save to weekly plan' },
          { icon: ChefHat, label: 'Start cooking now' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm ring-1 ring-neutral-900/5"
            >
              <Icon className="h-4 w-4 text-[#D97757]" aria-hidden />
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
