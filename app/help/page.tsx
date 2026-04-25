import Link from 'next/link'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { HelpSearch } from '@/components/help/HelpSearch'
import { HelpCategoryGrid } from '@/components/help/HelpCategoryGrid'
import { HelpArticleCard } from '@/components/help/HelpArticleCard'
import { HELP_ARTICLES } from '@/lib/help/articles'

export const metadata = {
  title: 'Help Center | MealEase',
  description:
    'Searchable guides and answers for MealEase — from setting up your household to managing your plan.',
}

export default function HelpPage() {
  const popular = [...HELP_ARTICLES]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  return (
    <>
      <PublicSiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-border/60 bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-[#D97757] uppercase tracking-wider mb-3">
              Help Center
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              How can we{' '}
              <span className="text-[#D97757]">help?</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Search below, browse by category, or{' '}
              <Link href="/contact" className="text-[#D97757] hover:underline">
                ask us directly
              </Link>
              .
            </p>
            <HelpSearch />
          </div>
        </section>

        {/* Categories */}
        <section className="py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Browse by topic</h2>
            <HelpCategoryGrid />
          </div>
        </section>

        {/* Popular articles */}
        <section className="py-10 border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Popular articles</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {popular.map((a) => (
                <HelpArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>

        {/* Still stuck CTA */}
        <section className="py-14 border-t border-border/60">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-2xl border border-border/60 bg-card p-8">
              <span className="text-4xl">✉️</span>
              <h2 className="mt-4 text-xl font-semibold text-foreground">Still stuck?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The founders read every message. Average response time: under 24 hours.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-[#D97757] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#c4674a] transition-colors"
              >
                Contact support
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Or email{' '}
                <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">
                  hello@mealeaseai.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicSiteFooter />
    </>
  )
}
