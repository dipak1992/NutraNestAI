'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  sections: Array<{ id: string; title: string }>
}

export function TOC({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [sections])

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                'block rounded-md px-3 py-1.5 text-sm transition-colors',
                active === s.id
                  ? 'bg-[#D97757]/10 font-medium text-[#D97757]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
