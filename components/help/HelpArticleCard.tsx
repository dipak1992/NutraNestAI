import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HelpArticle } from '@/lib/help/types'

export function HelpArticleCard({ article }: { article: HelpArticle }) {
  return (
    <Link
      href={`/help/${article.category}/${article.slug}`}
      className="group flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card px-5 py-4 transition-all hover:border-[#D97757]/40 hover:shadow-sm"
    >
      <div className="min-w-0">
        <p className="font-medium text-foreground group-hover:text-[#D97757] transition-colors">
          {article.title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{article.description}</p>
      </div>
      <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-[#D97757] transition-colors" />
    </Link>
  )
}
