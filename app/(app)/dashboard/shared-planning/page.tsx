'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ClipboardList,
  Users,
  Share2,
  Copy,
  CheckCircle2,
  Crown,
  Sparkles,
  Calendar,
  ShoppingCart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { getFeatures } from '@/lib/pillars/config'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Shared planning flow steps ────────────────────────────────────────────────

type FlowStep = 'overview' | 'invite' | 'plan'

export default function SharedPlanningPage() {
  const router = useRouter()
  const { status, loading: paywallLoading } = usePaywallStatus()
  const features = useMemo(() => getFeatures(status.tier), [status.tier])
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [step, setStep] = useState<FlowStep>('overview')
  const [copied, setCopied] = useState(false)

  // Gate check
  useEffect(() => {
    if (!paywallLoading && !features.sharedPlanning) {
      setPaywallOpen(true)
    }
  }, [paywallLoading, features.sharedPlanning])

  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/share/plan?invite=demo`
    : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MealEase Shared Plan',
          text: 'Join our family meal plan on MealEase!',
          url: shareLink,
        })
      } else {
        handleCopyLink()
      }
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        toast.error('Could not share')
      }
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 15%, #ffffff 40%, #ffffff 100%)',
      }}
    >
      <div className="mx-auto max-w-lg px-5 pb-16 pt-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/household')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Household
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Shared Planning
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Plan meals together with your household
              </p>
            </div>
          </div>
        </div>

        {features.sharedPlanning && (
          <>
            {/* Overview step */}
            {step === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Feature cards */}
                {[
                  {
                    icon: Calendar,
                    title: 'Shared Meal Calendar',
                    description: 'Everyone sees the weekly plan and can suggest changes',
                    color: 'bg-blue-50 text-blue-600 border-blue-200/60',
                  },
                  {
                    icon: ShoppingCart,
                    title: 'Shared Grocery List',
                    description: 'One list, synced across all household members',
                    color: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
                  },
                  {
                    icon: Users,
                    title: 'Meal Voting',
                    description: 'Family members vote on meal options for the week',
                    color: 'bg-violet-50 text-violet-600 border-violet-200/60',
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={cn(
                      'rounded-2xl border p-5 transition-all',
                      feature.color,
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <feature.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-[15px] font-bold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2"
                >
                  <Button
                    size="lg"
                    className="w-full shadow-md gap-2"
                    onClick={() => setStep('invite')}
                  >
                    <Users className="h-4 w-4" />
                    Start Shared Planning
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Invite step */}
            {step === 'invite' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/80 p-5">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Invite Your Household
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this link with your partner or family members so they can view and contribute to your meal plan.
                  </p>

                  {/* Share link */}
                  <div className="rounded-lg bg-white border border-border/60 p-3 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Share link</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-foreground bg-gray-50 rounded px-2 py-1.5 truncate">
                        {shareLink}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 flex-shrink-0"
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 gap-1.5"
                      onClick={handleNativeShare}
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('plan')}
                    >
                      Skip for now
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Plan step */}
            {step === 'plan' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-border/60 bg-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-foreground">This Week&apos;s Plan</h2>
                  </div>

                  {/* Placeholder week view */}
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                    (day, i) => (
                      <div
                        key={day}
                        className={cn(
                          'flex items-center justify-between py-3',
                          i < 6 && 'border-b border-border/40',
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{day}</p>
                          <p className="text-xs text-muted-foreground">
                            {i === 0 ? 'Tap to add a meal' : 'No meal planned'}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs">
                          + Add
                        </Button>
                      </div>
                    ),
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="flex-1 shadow-md gap-2"
                    asChild
                  >
                    <Link href="/planner">
                      <Sparkles className="h-4 w-4" /> Open Full Planner
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-1.5"
                    onClick={() => setStep('invite')}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title="Unlock Shared Planning"
        description="Family Plus lets you share meal plans and grocery lists with your household — everyone stays on the same page."
        isAuthenticated={status.isAuthenticated}
        redirectPath="/dashboard/shared-planning"
      />
    </div>
  )
}
