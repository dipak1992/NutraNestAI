'use client'

import { usePostHog } from 'posthog-js/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface ZeroCookTeaserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ZeroCookTeaser({ open, onOpenChange }: ZeroCookTeaserProps) {
  const posthog = usePostHog()
  const router = useRouter()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="items-center text-center">
          <div className="text-4xl">🛵</div>
          <SheetTitle>Zero-Cook Mode</SheetTitle>
          <SheetDescription>
            Too tired to cook? We&apos;ll pick the perfect delivery meal for your
            household — just tap &amp; order.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4 py-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              'AI-powered picks',
              'Uber Eats, DoorDash, Grubhub',
              'Family-optimized',
              'One-tap ordering',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 rounded-lg border p-2">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
              PRO
            </Badge>
            <span className="text-sm font-medium">Unlock with NutriNest Pro</span>
          </div>
        </div>

        <SheetFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              posthog?.capture('zero_cook_teaser_upgrade_clicked')
              onOpenChange(false)
              router.push('/pricing')
            }}
          >
            Upgrade to Pro
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
