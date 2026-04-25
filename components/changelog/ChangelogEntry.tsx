import type { ChangelogEntry, ChangeType } from '@/lib/changelog/entries'
import { Sparkles, TrendingUp, Wrench } from 'lucide-react'

const TYPE_CONFIG: Record<ChangeType, { label: string; icon: React.ElementType; color: string }> = {
  new: {
    label: 'New',
    icon: Sparkles,
    color: 'bg-[#D97757]/10 text-[#D97757]',
  },
  improved: {
    label: 'Improved',
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  fixed: {
    label: 'Fixed',
    icon: Wrench,
    color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
}

export function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#D97757] ring-4 ring-background" />

      <div className="mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="rounded-full bg-[#D97757]/10 px-3 py-0.5 text-xs font-semibold text-[#D97757]">
            v{entry.version}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
        </div>
        <h2 className="mt-2 text-xl font-bold text-foreground">{entry.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>
      </div>

      <ul className="space-y-2">
        {entry.changes.map((c, i) => {
          const cfg = TYPE_CONFIG[c.type]
          const Icon = cfg.icon
          return (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${cfg.color}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              <span className="text-sm text-muted-foreground">{c.text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
