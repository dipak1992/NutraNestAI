export function WeekPlanSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading weekly meal plan"
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 md:p-6 animate-pulse"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="h-5 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* Day label */}
            <div className="h-3 w-6 rounded bg-neutral-200 dark:bg-neutral-700" />
            {/* Meal image placeholder */}
            <div className="w-full aspect-square rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <div className="h-full w-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
      </div>
    </div>
  )
}
