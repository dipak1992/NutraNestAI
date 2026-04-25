import Image from 'next/image'
import { Clock, Users, DollarSign } from 'lucide-react'
import type { Meal } from '@/types'

type Props = {
  meal: Meal
}

export function RecipeHero({ meal }: Props) {
  const totalTime = meal.prep_time + meal.cook_time

  return (
    <div className="relative">
      {/* Hero image */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl sm:h-80">
        {meal.image_url ? (
          <Image
            src={meal.image_url}
            alt={meal.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-6xl">
            🍽️
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Tags */}
        {meal.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {meal.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold text-white sm:text-3xl">{meal.title}</h1>
        <p className="mt-1 text-sm text-white/70">{meal.description}</p>

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5 text-sm text-white/60">
            <Clock className="h-4 w-4 text-[#D97757]" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/60">
            <Users className="h-4 w-4 text-[#D97757]" />
            <span>Serves family</span>
          </div>
          {meal.estimated_cost > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <DollarSign className="h-4 w-4 text-[#B8935A]" />
              <span>${meal.estimated_cost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
