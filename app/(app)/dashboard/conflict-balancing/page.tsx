'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Scale,
  Users,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { getFeatures } from '@/lib/pillars/config'
import { cn } from '@/lib/utils'
import type { FamilyMemberRecord } from '@/lib/family/types'

// ── Conflict resolution result type ───────────────────────────────────────────

interface ConflictResolution {
  mealName: string
  reasoning: string
  compromises: { memberName: string; note: string }[]
  satisfactionScore: number
  tip: string
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ConflictBalancingPage() {
  const router = useRouter()
  const { status, loading: paywallLoading } = usePaywallStatus()
  const features = useMemo(() => getFeatures(status.tier), [status.tier])
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [members, setMembers] = useState<FamilyMemberRecord[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<ConflictResolution | null>(null)

  // Gate check
  useEffect(() => {
    if (!paywallLoading && !status.isFamily) {
      setPaywallOpen(true)
    }
  }, [paywallLoading, status.isFamily])

  // Load family members
  useEffect(() => {
    if (!status.isFamily) return
    fetch('/api/family/members', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setMembers(data.members ?? []))
      .catch(() => {})
      .finally(() => setMembersLoading(false))
  }, [status.isFamily])

  const handleGenerate = useCallback(async () => {
    if (members.length < 2) return
    setGenerating(true)
    setResult(null)

    try {
      const res = await fetch('/api/conflict-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: members.map((m) => ({
            name: m.first_name,
            role: m.role,
            allergies: m.allergies_json ?? [],
            foods_loved: m.foods_loved_json ?? [],
            foods_disliked: m.foods_disliked_json ?? [],
            spice_tolerance: m.spice_tolerance ?? 'medium',
            picky_level: m.picky_eater_level ?? 0,
          })),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      }
    } catch {
      // silent
    } finally {
      setGenerating(false)
    }
  }, [members])

  const hasConflicts = useMemo(() => {
    if (members.length < 2) return false
    const allLoved = members.flatMap((m) => m.foods_loved_json ?? [])
    const allDisliked = members.flatMap((m) => m.foods_disliked_json ?? [])
    return allLoved.some((food) => allDisliked.includes(food))
  }, [members])

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 15%, #ffffff 40%, #ffffff 100%)',
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <Scale className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Conflict Balancing
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Find meals everyone can enjoy
              </p>
            </div>
          </div>
        </div>

        {/* Family members overview */}
        {status.isFamily && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50/80 p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-violet-600" />
              <h2 className="text-sm font-bold text-foreground">
                Family Preferences
              </h2>
            </div>

            {membersLoading ? (
              <p className="text-xs text-muted-foreground">Loading members...</p>
            ) : members.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Add family members first to use conflict balancing.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/family">Add Members</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg bg-white/80 border border-violet-200/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {m.role === 'child' || m.role === 'toddler' || m.role === 'baby' ? '👶' : '🧑'}
                      </span>
                      <span className="text-sm font-medium">{m.first_name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {m.role}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {(m.allergies_json?.length ?? 0) > 0 && (
                        <Badge className="bg-red-50 text-red-700 border-0 text-[10px]">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                          {m.allergies_json?.length} allergies
                        </Badge>
                      )}
                      {(m.picky_eater_level ?? 0) >= 3 && (
                        <Badge className="bg-orange-50 text-orange-700 border-0 text-[10px]">
                          🥄 Picky
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {hasConflicts && (
                  <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200/60 p-3">
                    <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Preference conflicts detected — let MealEase find the sweet spot
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Generate button */}
        {status.isFamily && members.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              className="w-full shadow-md gap-2"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Finding balanced meals...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Balance Preferences
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-green-50/80 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {result.mealName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.reasoning}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-bold">{result.satisfactionScore}%</span>
                  </div>
                </div>

                {result.compromises.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      How it works for everyone:
                    </p>
                    {result.compromises.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-white/80 border border-emerald-200/40 px-3 py-2"
                      >
                        <span className="text-xs font-semibold text-emerald-700 mt-0.5">
                          {c.memberName}:
                        </span>
                        <span className="text-xs text-foreground">{c.note}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.tip && (
                  <div className="mt-4 rounded-lg bg-violet-50 border border-violet-200/40 px-3 py-2">
                    <p className="text-xs text-violet-800">💡 {result.tip}</p>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={handleGenerate}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try Another
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        {status.isFamily && !result && !generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-3"
          >
            <h3 className="text-sm font-semibold text-foreground">How it works</h3>
            {[
              { emoji: '📊', text: 'Analyzes each member\'s preferences, allergies, and dislikes' },
              { emoji: '⚖️', text: 'Finds meals that satisfy the most people without triggering allergies' },
              { emoji: '🎯', text: 'Suggests compromises and serving variations per person' },
              { emoji: '📈', text: 'Gets smarter over time as you provide feedback' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-base flex-shrink-0">{step.emoji}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title="Unlock Conflict Balancing"
        description="Family Plus automatically balances competing preferences — if one person loves spicy and another doesn't, MealEase finds the sweet spot."
        isAuthenticated={status.isAuthenticated}
        redirectPath="/dashboard/conflict-balancing"
      />
    </div>
  )
}
