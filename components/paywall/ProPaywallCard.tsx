import Link from 'next/link'
import { Crown, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PRO_UNLOCKS } from '@/lib/paywall/config'

interface ProPaywallCardProps {
  title: string
  description: string
  isAuthenticated: boolean
  redirectPath?: string
  compact?: boolean
}

export function ProPaywallCard({
  title,
  description,
  isAuthenticated,
  redirectPath = '/planner',
  compact = false,
}: ProPaywallCardProps) {
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`
  const primaryHref = isAuthenticated ? '/pricing?intent=pro' : loginHref
  const primaryLabel = isAuthenticated ? 'Upgrade to Pro' : 'Log in to unlock Pro'

  return (
    <div className="rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-background to-rose-50 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
          <Crown className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <Badge variant="outline" className="mb-2 border-amber-300 bg-white/70 text-amber-800">
            <Lock className="mr-1.5 h-3 w-3" /> Pro required
          </Badge>
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRO_UNLOCKS.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/pricing">See what Pro includes</Link>
        </Button>
      </div>
    </div>
  )
}
