import Link from 'next/link'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { ChangelogEntryCard } from '@/components/changelog/ChangelogEntry'
import { CHANGELOG } from '@/lib/changelog/entries'

export const metadata = {
  title: 'Changelog | MealEase',
  description:
    "What's new, what's improved, and what's fixed. Every update to MealEase, in reverse order.",
}

export default function ChangelogPage() {
  return (
    <>
      <PublicSiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-border/60 bg-muted/20 py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-[#D97757] uppercase tracking-wider mb-3">
              Changelog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              What&apos;s{' '}
              <span className="text-[#D97757]">new.</span>
            </h1>
            <p className="text-muted-foreground">
              Every update to MealEase, most recent first. Got feedback?{' '}
              <Link href="/contact" className="text-[#D97757] hover:underline">
                Tell us what you&apos;d like to see next
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-14">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {/* Vertical timeline line */}
            <div className="relative">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border/60" />
              <div className="space-y-12">
                {CHANGELOG.map((entry) => (
                  <ChangelogEntryCard key={entry.version} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-12 border-t border-border/60">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-2xl border border-border/60 bg-card p-8">
              <h2 className="text-lg font-semibold text-foreground">Want updates in your inbox?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Subscribe to our monthly newsletter — one email, what shipped, what&apos;s coming next.
              </p>
              <Link
                href="/blog"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-[#D97757] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#c4674a] transition-colors"
              >
                Subscribe on the blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicSiteFooter />
    </>
  )
}
