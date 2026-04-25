import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { HelpArticleBody } from '@/components/help/HelpArticleBody'
import { HelpArticleCard } from '@/components/help/HelpArticleCard'
import {
  HELP_ARTICLES,
  getCategory,
  getArticle,
  getRelatedArticles,
} from '@/lib/help/articles'

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({
    category: a.category,
    slug: a.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const article = getArticle(category, slug)
  return {
    title: article ? `${article.title} | MealEase Help` : 'Not found',
    description: article?.description,
  }
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const article = getArticle(category, slug)
  if (!article) notFound()

  const cat = getCategory(category)
  const related = getRelatedArticles(article)

  return (
    <>
      <PublicSiteHeader />
      <main>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
            <span>/</span>
            <Link href={`/help/${category}`} className="hover:text-foreground transition-colors">
              {cat?.title ?? category}
            </Link>
          </nav>

          {/* Back link */}
          <Link
            href={`/help/${category}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {cat?.title ?? 'Help'}
          </Link>

          {/* Article header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-[#D97757] mb-2">
              {cat?.icon} {cat?.title}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{article.title}</h1>
            <p className="mt-2 text-muted-foreground">{article.description}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formatDate(article.updatedAt)}
            </div>
          </div>

          {/* Body */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
            <HelpArticleBody article={article} />
          </div>

          {/* Feedback */}
          <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-5 text-center">
            <p className="text-sm font-medium text-foreground mb-3">
              Did this answer your question?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="rounded-full border border-border/60 px-4 py-1.5 text-sm hover:bg-muted transition-colors">
                Yes, thanks
              </button>
              <Link
                href="/contact"
                className="rounded-full border border-[#D97757]/40 px-4 py-1.5 text-sm text-[#D97757] hover:bg-[#D97757]/10 transition-colors"
              >
                No, I need more help
              </Link>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-foreground mb-4">Related articles</h2>
              <div className="flex flex-col gap-3">
                {related.map((a) => (
                  <HelpArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicSiteFooter />
    </>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
