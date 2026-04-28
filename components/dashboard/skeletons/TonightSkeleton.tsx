export function TonightSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tonight's dinner suggestion"
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse min-h-[420px] flex flex-col"
    >
      {/* Image placeholder */}
      <div className="aspect-[16/10] md:aspect-[16/9] bg-neutral-200 dark:bg-neutral-800" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Tags row */}
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-2/3 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Meta row */}
        <div className="flex gap-4 mt-auto">
          <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-10 w-28 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  )
}
