export function LeftoversSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading leftovers"
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse min-h-[260px] lg:min-h-[420px] flex flex-col"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="h-5 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {/* Items */}
      <ul className="px-6 space-y-3 flex-1">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="px-6 pb-6 pt-4">
        <div className="h-9 w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  )
}
