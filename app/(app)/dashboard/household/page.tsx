'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Crown,
  Users,
  User,
  Settings,
  Heart,
  Brain,
  ShieldCheck,
  ChevronRight,
  Plus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Baby,
  UtensilsCrossed,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { useLearningStore } from '@/lib/learning/store'
import { hasAccess, TIER_FEATURES, getFeatures } from '@/lib/pillars/config'
import { cn } from '@/lib/utils'
import type { FamilyMemberRecord } from '@/lib/family/types'

// ── Section card component ────────────────────────────────────────────────────

interface SectionCardProps {
  emoji: string
  title: string
  subtitle: string
  href?: string
  onClick?: () => void
  locked?: boolean
  badge?: string
  badgeColor?: string
  children?: React.ReactNode
  index: number
}

function SectionCard({
  emoji,
  title,
  subtitle,
  href,
  onClick,
  locked,
  badge,
  badgeColor = 'bg-primary/10 text-primary',
  children,
  index,
}: SectionCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.3 }}
      className={cn(
        'rounded-2xl border border-border/60 bg-white p-5 transition-all',
        (href || onClick) && !locked && 'hover:shadow-md hover:border-violet-300/60 cursor-pointer',
        locked && 'opacity-60',
      )}
      onClick={locked ? undefined : onClick}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-foreground leading-tight">
              {title}
            </h3>
            {badge && (
              <Badge className={cn('text-[10px] border-0', badgeColor)}>
                {badge}
              </Badge>
            )}
            {locked && (
              <Crown className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>
        {(href || onClick) && !locked && (
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-1" />
        )}
      </div>
    </motion.div>
  )

  if (href && !locked) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

// ── Member preview chip ───────────────────────────────────────────────────────

function MemberChip({ member }: { member: FamilyMemberRecord }) {
  const roleEmoji: Record<string, string> = {
    adult: '🧑',
    teen: '🧑‍🎓',
    child: '👦',
    toddler: '🧒',
    baby: '👶',
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200/60 px-2.5 py-1 text-xs text-violet-900">
      {roleEmoji[member.role] ?? '👤'} {member.first_name}
      {member.allergies_json?.length > 0 && (
        <AlertTriangle className="h-2.5 w-2.5 text-amber-500" />
      )}
      {member.picky_eater_level >= 3 && (
        <span className="text-[10px]">🥄</span>
      )}
    </span>
  )
}

// ── Intelligence summary ──────────────────────────────────────────────────────

function IntelligenceSummary() {
  const { feedbackHistory } = useLearningStore()
  const totalFeedback = feedbackHistory?.length ?? 0
  const likes = feedbackHistory?.filter(f => f.action === 'like' || f.action === 'save').length ?? 0
  const dislikes = feedbackHistory?.filter(f => f.action === 'reject').length ?? 0

  if (totalFeedback === 0) {
    return (
      <div className="mt-3 rounded-lg bg-violet-50/50 border border-violet-200/40 p-3">
        <p className="text-xs text-muted-foreground">
          <Brain className="h-3 w-3 inline mr-1" />
          No preferences learned yet. Use Tonight or Cook to start teaching MealEase what you like.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Badge variant="secondary" className="text-[11px]">
        {totalFeedback} signals
      </Badge>
      {likes > 0 && (
        <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[11px]">
          ❤️ {likes} liked
        </Badge>
      )}
      {dislikes > 0 && (
        <Badge className="bg-red-50 text-red-700 border-0 text-[11px]">
          👎 {dislikes} skipped
        </Badge>
      )}
    </div>
  )
}

// ── Main Household Pillar ─────────────────────────────────────────────────────

export default function HouseholdPillarPage() {
  const router = useRouter()
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [paywallMessage, setPaywallMessage] = useState({ title: '', description: '' })
  const [members, setMembers] = useState<FamilyMemberRecord[]>([])
  const [membersLoading, setMembersLoading] = useState(false)

  const { status } = usePaywallStatus()
  const { state: { householdName } } = useOnboardingStore()
  const light = useLightOnboardingStore()
  const features = useMemo(() => getFeatures(status.tier), [status.tier])

  // Load family members if user has family tier
  useEffect(() => {
    if (!status.isFamily) return
    setMembersLoading(true)
    fetch('/api/family/members', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setMembers(data.members ?? [])
      })
      .catch(() => {})
      .finally(() => setMembersLoading(false))
  }, [status.isFamily])

  const handleLockedClick = useCallback((title: string, description: string) => {
    setPaywallMessage({ title, description })
    setPaywallOpen(true)
  }, [])

  const householdTypeLabel = light.householdType === 'solo'
    ? 'Just me'
    : light.householdType === 'couple'
      ? 'Couple'
      : light.householdType === 'family'
        ? 'Family'
        : 'Not set'

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
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            🏠 Household
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preferences, family profiles, memory
          </p>
        </div>

        {/* Household summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50/80 p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {householdName || 'My Household'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {householdTypeLabel}
                {light.hasKids && ' · Has kids'}
                {light.lowEnergy && ' · Low energy mode'}
              </p>
            </div>
            <Badge
              className={cn(
                'text-xs border-0',
                status.isFamily
                  ? 'bg-emerald-100 text-emerald-700'
                  : status.isPro
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-violet-100 text-violet-700',
              )}
            >
              {status.isFamily && <Crown className="h-3 w-3 mr-1" />}
              {status.isPro && <Crown className="h-3 w-3 mr-1" />}
              {status.tier.charAt(0).toUpperCase() + status.tier.slice(1)}
            </Badge>
          </div>

          {/* Trait badges */}
          <div className="flex flex-wrap gap-1.5">
            {light.cuisines.length > 0 && (
              <Badge className="bg-white/80 text-foreground border border-border/40 text-[11px]">
                🍽️ {light.cuisines.slice(0, 3).join(', ')}
                {light.cuisines.length > 3 && ` +${light.cuisines.length - 3}`}
              </Badge>
            )}
            {light.pickyEater && (
              <Badge className="bg-orange-50 text-orange-700 border-0 text-[11px]">
                🥄 Picky-eater friendly
              </Badge>
            )}
            {light.lowEnergy && (
              <Badge className="bg-blue-50 text-blue-700 border-0 text-[11px]">
                ⚡ Low energy
              </Badge>
            )}
            {light.hasKids && light.kidsAgeGroup && (
              <Badge className="bg-pink-50 text-pink-700 border-0 text-[11px]">
                👶 {light.kidsAgeGroup.replace('_', ' ')}
              </Badge>
            )}
          </div>

          {/* Family members preview */}
          {status.isFamily && members.length > 0 && (
            <div className="mt-3 pt-3 border-t border-violet-200/40">
              <p className="text-[11px] font-medium text-muted-foreground mb-2">
                Family Members ({members.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {members.map(m => (
                  <MemberChip key={m.id} member={m} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Section cards */}
        <div className="flex flex-col gap-3">
          {/* 1. Profile & Preferences */}
          <SectionCard
            index={0}
            emoji="👤"
            title="Profile & Preferences"
            subtitle="Household type, cuisines, dietary needs, cooking time"
            href="/settings"
            badge={light.householdType ? 'Set up' : 'Needs setup'}
            badgeColor={light.householdType ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
          >
            {!light.householdType && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push('/onboarding')
                  }}
                >
                  <Sparkles className="h-3 w-3" /> Set up now
                </Button>
              </div>
            )}
          </SectionCard>

          {/* 2. Family Members */}
          <SectionCard
            index={1}
            emoji="👨‍👩‍👧‍👦"
            title="Family Members"
            subtitle={
              features.multiMember
                ? `Add up to 6 members with individual preferences and allergy tracking`
                : 'Personalize meals for every family member with individual profiles'
            }
            href={features.multiMember ? '/family' : undefined}
            onClick={
              !features.multiMember
                ? () => handleLockedClick(
                    'Unlock Family Profiles',
                    'Family Plus lets you add up to 6 members with individual preferences, allergy tracking, and conflict balancing.'
                  )
                : undefined
            }
            locked={!features.multiMember}
            badge={features.multiMember ? `${members.length} members` : 'Family Plus'}
            badgeColor={features.multiMember ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'}
          >
            {features.multiMember && members.length === 0 && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push('/family')
                  }}
                >
                  <Plus className="h-3 w-3" /> Add first member
                </Button>
              </div>
            )}
          </SectionCard>

          {/* 3. Household Memory */}
          <SectionCard
            index={2}
            emoji="🧠"
            title="Household Memory"
            subtitle={
              features.householdMemory
                ? 'MealEase learns from your feedback to suggest better meals over time'
                : 'Unlock intelligent learning that remembers what your household likes'
            }
            locked={!features.householdMemory}
            onClick={
              !features.householdMemory
                ? () => handleLockedClick(
                    'Unlock Household Memory',
                    'Pro unlocks intelligent learning — MealEase remembers preferences, feedback, and patterns to suggest better meals every week.'
                  )
                : undefined
            }
            badge={features.householdMemory ? 'Active' : 'Pro'}
            badgeColor={features.householdMemory ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
          >
            {features.householdMemory && <IntelligenceSummary />}
          </SectionCard>

          {/* 4. Kids Tools */}
          {(light.hasKids || light.householdType === 'family') && (
            <SectionCard
              index={3}
              emoji="👶"
              title="Kids Tools"
              subtitle={
                features.kidsTools
                  ? 'Lunchbox help, picky eater mode, age-safe meals, and baking activities'
                  : 'Unlock kid-safe meals, lunchbox planning, and picky eater tools'
              }
              locked={!features.kidsTools}
              onClick={
                !features.kidsTools
                  ? () => handleLockedClick(
                      'Unlock Kids Tools',
                      'Family Plus includes kid-safe meal variations, lunchbox planning, picky eater mode, and fun baking activities.'
                    )
                  : undefined
              }
              badge={features.kidsTools ? 'Unlocked' : 'Family Plus'}
              badgeColor={features.kidsTools ? 'bg-pink-50 text-pink-700' : 'bg-amber-50 text-amber-700'}
            >
              {features.kidsTools && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    { emoji: '🍎', label: 'Snack for Kids', href: '/kids-tool?mode=snack' },
                    { emoji: '🍽', label: 'Picky Eater', href: '/kids-tool?mode=picky' },
                    { emoji: '🍱', label: 'Lunchbox', href: '/kids-tool?mode=lunchbox' },
                    { emoji: '🧁', label: 'Bake', href: '/kids-tool?mode=bake' },
                    { emoji: '⚡', label: 'Food in 5 Min', href: '/kids-tool?mode=fast' },
                  ].map(tool => (
                    <Link
                      key={tool.label}
                      href={tool.href}
                      className="inline-flex items-center gap-1 rounded-full bg-pink-50 border border-pink-200/60 px-2.5 py-1 text-[11px] font-medium text-pink-800 hover:bg-pink-100 transition-colors"
                    >
                      {tool.emoji} {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* 5. Conflict Balancing */}
          <SectionCard
            index={4}
            emoji="⚖️"
            title="Conflict Balancing"
            subtitle={
              features.conflictBalancing
                ? 'Automatically balances competing preferences across family members'
                : 'Smart balancing ensures everyone gets meals they enjoy each week'
            }
            href={features.conflictBalancing ? '/dashboard/conflict-balancing' : undefined}
            locked={!features.conflictBalancing}
            onClick={
              !features.conflictBalancing
                ? () => handleLockedClick(
                    'Unlock Conflict Balancing',
                    'Family Plus automatically balances competing preferences — if one person loves spicy and another doesn\'t, MealEase finds the sweet spot.'
                  )
                : undefined
            }
            badge={features.conflictBalancing ? 'Active' : 'Family Plus'}
            badgeColor={features.conflictBalancing ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
          />

          {/* 6. Shared Planning */}
          <SectionCard
            index={5}
            emoji="📋"
            title="Shared Planning"
            subtitle={
              features.sharedPlanning
                ? 'Share meal plans and grocery lists with your household'
                : 'Collaborate on meal planning with your partner or family'
            }
            href={features.sharedPlanning ? '/dashboard/shared-planning' : undefined}
            locked={!features.sharedPlanning}
            onClick={
              !features.sharedPlanning
                ? () => handleLockedClick(
                    'Unlock Shared Planning',
                    'Family Plus lets you share meal plans and grocery lists with your household — everyone stays on the same page.'
                  )
                : undefined
            }
            badge={features.sharedPlanning ? 'Active' : 'Family Plus'}
            badgeColor={features.sharedPlanning ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
          />

          {/* 7. Guest Hosting */}
          <SectionCard
            index={6}
            emoji="🍽️"
            title="Guest Hosting Planner"
            subtitle={
              features.guestHostingPlanner
                ? 'Plan meals for dinner parties and hosting guests'
                : 'Unlock smart hosting tools for dinner parties and gatherings'
            }
            href={features.guestHostingPlanner ? '/dashboard/guest-hosting' : undefined}
            locked={!features.guestHostingPlanner}
            onClick={
              !features.guestHostingPlanner
                ? () => handleLockedClick(
                    'Unlock Guest Hosting',
                    'Family Plus includes a guest hosting planner — set guest count, dietary needs, and get a complete menu with shopping list.'
                  )
                : undefined
            }
            badge={features.guestHostingPlanner ? 'Unlocked' : 'Family Plus'}
            badgeColor={features.guestHostingPlanner ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
          />
        </div>

        {/* Upgrade prompt for free users */}
        {status.tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-6"
          >
            <Link
              href="/pricing?intent=pro&trigger=household-pillar"
              className="block rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50/80 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900">
                    Unlock Household Memory & more
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Pro remembers your preferences. Family Plus adds profiles for everyone.
                  </p>
                  <p className="text-xs font-medium text-amber-700 mt-1.5 flex items-center gap-1">
                    See plans <ChevronRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Intelligence indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
        >
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            features.householdMemory
              ? 'bg-emerald-400 animate-pulse'
              : 'bg-gray-300',
          )} />
          <span>
            {features.householdMemory
              ? 'Intelligence layer active — learning your preferences'
              : 'Upgrade to Pro to activate the intelligence layer'}
          </span>
        </motion.div>
      </div>

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title={paywallMessage.title}
        description={paywallMessage.description}
        isAuthenticated={status.isAuthenticated}
        redirectPath="/dashboard/household"
      />
    </div>
  )
}
