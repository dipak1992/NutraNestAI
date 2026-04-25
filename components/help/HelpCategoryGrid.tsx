import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HELP_CATEGORIES, HELP_ARTICLES } from '@/lib/help/articles'

export function HelpCategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {HELP_CATEGORIES.map((cat) => {
        const count = HELP_ARTICLES.filter((a) => a.category === cat.id).length
        return (
          <Link
            key={cat.id}
            href={`/help/${cat.id}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-[#D97757]/40 hover:shadow-md"
          >
            <span className="text-3xl">{cat.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{cat.title}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {count} article{count === 1 ? '' : 's'}
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#D97757]" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
