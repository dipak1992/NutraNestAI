'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface TocItem {
  id: string
  title: string
}

interface LegalShellProps {
  title: string
  intro: string
  lastUpdated: string
  toc: TocItem[]
  children: ReactNode
}

export function LegalShell({
  title,
  intro,
  lastUpdated,
  toc,
  children,
}: LegalShellProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = toc.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [toc])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <h1 className="font-serif text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
          {title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
          {intro}
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 xl:gap-16">
        {/* Sticky TOC — desktop only */}
        <aside className="hidden lg:block">
          <nav
            className="sticky top-24 space-y-1"
            aria-label="Table of contents"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              On this page
            </p>
            {toc.map(({ id, title: sectionTitle }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-sm py-1 px-2 rounded-md transition-colors ${
                  activeId === id
                    ? 'text-[#D97757] bg-[#D97757]/8 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                {sectionTitle}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-10">{children}</div>
      </div>
    </div>
  )
}

/** Individual section — renders an anchor heading + content */
export function LegalSection({
  id,
  title: sectionTitle,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
        {sectionTitle}
      </h2>
      <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        {children}
      </div>
    </section>
  )
}
