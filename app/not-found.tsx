import Link from 'next/link'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { Search, Home, Mail } from 'lucide-react'

export const metadata = {
  title: 'Not found | MealEase',
}

export default function NotFoundPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6 text-center">
          {/* Big 404 */}
          <div className="relative inline-block">
            <span className="text-[120px] md:text-[160px] font-black text-muted/30 leading-none select-none">
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">
              🍽️
            </span>
          </div>

          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
            This page is{' '}
            <span className="text-[#D97757]">not on the menu.</span>
          </h1>

          <p className="mt-3 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist — or it moved to a tastier URL.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#D97757] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#c4674a] transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Search className="h-4 w-4" />
              Search help
            </Link>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>Still can&apos;t find what you need?</p>
            <a
              href="mailto:hello@mealeaseai.com"
              className="mt-1 inline-flex items-center gap-1.5 text-[#D97757] hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@mealeaseai.com
            </a>
          </div>
        </div>
      </main>
      <PublicSiteFooter />
    </>
  )
}
