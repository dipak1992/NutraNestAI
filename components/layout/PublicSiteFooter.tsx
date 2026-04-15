import Link from 'next/link'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

const footerLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
]

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <MealEaseLogo size="sm" />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              MealEase helps busy families decide what to cook with simple, adaptive meal planning built for real life.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-10">
            <div>
              <p className="text-sm font-semibold text-foreground">Explore</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Contact</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:hello@mealeaseai.com" className="transition-colors hover:text-foreground">
                  hello@mealeaseai.com
                </a>
                <p>No credit card required to start.</p>
                <p>Cancel anytime.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MealEase. Powered by AI.</p>
          <p>Built by real parents for real family routines.</p>
        </div>
      </div>
    </footer>
  )
}