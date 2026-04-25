import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { HelpSearch } from '@/components/help/HelpSearch'
import { HelpArticleCard } from '@/components/help/HelpArticleCard'
import {
  HELP_CATEGORIES,
  getCategory,
  getArticlesInCategory,
} from '@/lib/help/articles'

export function generateStaticParams() {
  return HELP_CATEGORIES.map((c) => ({ category: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategory(category)
  return {
    title: cat ? `${cat.title} | MealEase Help` : 'Not found',
    description: cat?.description,
  }
}

export default async function HelpCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const articles = getArticlesInCategory(category)

  return (
    <>
      <PublicSiteHeader />
      <main>
        {/* Header */}
        <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/help"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All topics
            </Link>

            <div className="flex items-start gap-4 mb-8">
              <span className="text-4xl">{cat.icon}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{cat.title}</h1>
                <p className="mt-1 text-muted-foreground">{cat.description}</p>
              </div>
            </div>

            <HelpSearch />
          </div>
        </section>

        {/* Articles */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              {articles.map((a) => (
                <HelpArticleCard key={a.slug} article={a} />
              ))}
            </div>

            {articles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">
                No articles yet in this category.
              </p>
            )}
          </div>
        </section>
      </main>
      <PublicSiteFooter />
    </>
  )
}
