'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { searchArticles } from '@/lib/help/search'
import type { HelpArticle } from '@/lib/help/types'
import { HELP_CATEGORIES } from '@/lib/help/articles'
import { cn } from '@/lib/utils'

export function HelpSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<HelpArticle[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setResults(searchArticles(query))
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search help articles…"
          className="w-full bg-white dark:bg-neutral-900 rounded-full pl-11 pr-10 py-3 md:py-4 text-sm md:text-base outline-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-[#D97757] shadow-sm transition-shadow"
          aria-label="Search help"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-sm font-medium text-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center gap-1 text-sm text-[#D97757] hover:underline"
              >
                Ask us directly <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul>
              {results.map((a) => {
                const category = HELP_CATEGORIES.find((c) => c.id === a.category)
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/help/${a.category}/${a.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
                      )}
                    >
                      <span className="mt-0.5 text-lg leading-none">{category?.icon ?? '📄'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                        <p className="text-xs text-[#D97757] mt-0.5">{category?.title}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
