'use client'

import Link from 'next/link'

export function ShareFooter() {
  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-muted/40 border border-border/60 p-5 text-center">
        <p className="text-sm font-semibold text-foreground">Loving MealEase?</p>
        <p className="text-xs text-muted-foreground mt-1">
          Share your weekly plan with family &amp; friends
        </p>
        <Link
          href="/referral"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Share &amp; earn rewards →
        </Link>
      </div>
    </section>
  )
}
