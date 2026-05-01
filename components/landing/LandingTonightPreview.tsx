import Image from 'next/image'
import { getLandingTonightMeal } from '@/lib/tonight/engine'
import { Clock, Sparkles } from 'lucide-react'

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
      <div className="px-5 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#D97757]">
          MealEase
        </p>
      </div>

      {/* Meal image — full bleed, takes ~45% of card height */}
      <div className="relative mx-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: '44%' }}>
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="260px"
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Tonight badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D97757] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
            Tonight&rsquo;s Pick
          </span>
        </div>

        {/* Meal name over image */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-sm font-bold text-white leading-snug drop-shadow-sm">
            {meal.name}
          </p>
          <p className="text-[10px] text-white/80 mt-0.5 leading-tight">
            {meal.tagline}
          </p>
        </div>
      </div>

      {/* Meta row: cook time + day label */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#D97757]" aria-hidden />
          <span className="text-xs font-semibold text-neutral-700">
            {meal.cookTimeMin} min
          </span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {meal.weekdayLabel}
        </span>
      </div>

      {/* Benefit tags */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-3">
        {meal.benefits.slice(0, 3).map((benefit) => (
          <span
            key={benefit}
            className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-800 ring-1 ring-orange-100"
          >
            {benefit}
          </span>
        ))}
      </div>

      {/* Action buttons mock */}
      <div className="mt-auto px-4 pb-5 space-y-2">
        <div className="flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#D97757] to-[#E8895A] shadow-md shadow-orange-200/50">
          <span className="text-xs font-bold text-white">Cook this tonight →</span>
        </div>
        <div className="flex h-9 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200">
          <span className="text-xs font-semibold text-neutral-600">Show another meal</span>
        </div>
      </div>
    </div>
  )
}
