import Link from 'next/link'

type Props = {
  title: string
  subtitle: string
  footerText: string
  footerLink: { label: string; href: string }
  children: React.ReactNode
}

export function AuthShell({ title, subtitle, footerText, footerLink, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Form side */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 lg:max-w-lg lg:px-12">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-8 inline-block text-xl font-bold text-foreground">
              MealEase
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footerText}{' '}
              <Link href={footerLink.href} className="font-medium text-[#D97757] hover:underline">
                {footerLink.label}
              </Link>
            </p>
          </div>
        </div>

        {/* Visual side */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[#D97757]/5 border-l border-border/60 px-12 py-16">
          <div className="max-w-sm text-center">
            <blockquote className="text-lg font-medium text-foreground leading-relaxed">
              &ldquo;We had a fridge full of food and still ordered takeout three nights a week.&rdquo;
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-foreground">— Dipak &amp; Suprabha</p>
              <p className="text-sm text-muted-foreground">
                Co-founders. Parents of two. Former takeout enthusiasts.
              </p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8">
              <Stat label="Households" value="2,400+" />
              <Stat label="Dinners planned" value="180k+" />
              <Stat label="Avg. weekly savings" value="$47" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/60 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} MealEase</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
