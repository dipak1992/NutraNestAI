import Link from 'next/link'
import { TOC } from './TOC'

type Section = {
  id: string
  title: string
  content: React.ReactNode
}

type Props = {
  title: string
  intro: string
  updatedAt: string
  sections: Section[]
}

export function LegalShell({ title, intro, updatedAt, sections }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{intro}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Last updated: {formatDate(updatedAt)}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* TOC sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <TOC sections={sections.map((s) => ({ id: s.id, title: s.title }))} />
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-10 scroll-mt-24">
                  <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    {section.content}
                  </div>
                </div>
              ))}

              <div className="mt-10 rounded-xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground">
                Questions?{' '}
                <Link href="/contact" className="text-[#D97757] hover:underline">
                  Get in touch
                </Link>{' '}
                or email{' '}
                <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">
                  hello@mealeaseai.com
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </section>
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
