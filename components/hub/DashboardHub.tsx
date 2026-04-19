'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import posthog from 'posthog-js'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { useHouseholdConfig } from '@/lib/hooks/use-household-config'
import { useDashboardMessage } from '@/lib/hooks/use-dashboard-message'
import { showRewardToast } from '@/lib/reward-toast'
import { OnboardingPromptPopup } from '@/components/onboarding/OnboardingPromptPopup'
import { ZeroCookSheet } from '@/components/zero-cook/ZeroCookSheet'
import { ZeroCookTeaser } from '@/components/zero-cook/ZeroCookTeaser'
import { householdFromMembers, fallbackHousehold } from '@/lib/decide/client'
import { StreakBadge } from '@/components/habit/StreakBadge'
import { SupportLine } from './SupportLine'
import { PantryCapture } from './PantryCapture'
import { HeroSection } from './HeroSection'
import { TonightRecommendation } from './TonightRecommendation'
import { SmartToolsRow } from './SmartToolsRow'
import { WeekendModeCard } from './WeekendModeCard'
import { ProgressCard } from './ProgressCard'
import { ShareFooter } from './ShareFooter'

interface Props {
  displayName: string
}

export function DashboardHub({ displayName }: Props) {
  const firstName = displayName
  const router = useRouter()

  const [refreshKey, setRefreshKey] = useState(0)
  const tonightRef = useRef<HTMLDivElement>(null)

  const [zeroCookOpen, setZeroCookOpen] = useState(false)
  const [zeroCookTeaserOpen, setZeroCookTeaserOpen] = useState(false)
  const [snapCookOpen, setSnapCookOpen] = useState(false)

  const {
    state: { members },
  } = useOnboardingStore()
  const light = useLightOnboardingStore()
  const { status: paywallStatus } = usePaywallStatus()
  const householdConfig = useHouseholdConfig()
  const { supportLine, timeBlock } = useDashboardMessage()

  const getHousehold = useCallback(
    () =>
      members?.length
        ? householdFromMembers(members)
        : fallbackHousehold(
            light.householdType,
            light.hasKids,
            light.kidsAgeGroup,
          ),
    [members, light.householdType, light.hasKids, light.kidsAgeGroup],
  )

  const handleQuickDecide = useCallback(() => {
    posthog.capture('hub_tile_tapped', { tile: 'quick' })
    showRewardToast('mealGenerated')
    setRefreshKey((k) => k + 1)
    setTimeout(() => {
      tonightRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
  }, [])

  const handleZeroCook = useCallback(() => {
    posthog.capture('hub_tile_tapped', { tile: 'zero-cook' })
    if (paywallStatus.isPro) {
      showRewardToast('zeroCook')
      setZeroCookOpen(true)
    } else {
      setZeroCookTeaserOpen(true)
    }
  }, [paywallStatus.isPro])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return

      try {
        const raw = sessionStorage.getItem('mealease_delivery_redirected')
        if (!raw) return
        const parsed = JSON.parse(raw) as { provider?: string; at?: number }

        if (parsed.at && Date.now() - parsed.at < 1000 * 60 * 120) {
          posthog.capture('returned_user', {
            provider: parsed.provider,
            source: 'delivery_redirect',
          })
        }

        sessionStorage.removeItem('mealease_delivery_redirected')
      } catch {
        // non-fatal
      }
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    onVisible()

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [])

  return (
    <>
      <OnboardingPromptPopup />

      <div
        className="min-h-screen"
        style={{
          background:
            'linear-gradient(180deg, #fef7f0 0%, #f0fdf4 12%, #ffffff 40%, #ffffff 100%)',
        }}
      >
        <div className="mx-auto max-w-lg px-5 pb-16 pt-6">
          {/* Streak badge — top-right */}
          <div className="mb-4 flex justify-end">
            <StreakBadge />
          </div>

          <HeroSection
            firstName={firstName}
            onQuickDecide={handleQuickDecide}
            onZeroCook={handleZeroCook}
            householdConfig={householdConfig}
          />

          <WeekendModeCard
            weekendTitle={householdConfig.weekendTitle}
            weekendSubtitle={householdConfig.weekendSubtitle}
          />

          <div ref={tonightRef}>
            <TonightRecommendation refreshKey={refreshKey} />
          </div>

          <SmartToolsRow
            onSnapCook={() => {
              showRewardToast('snapCook')
              setSnapCookOpen(true)
            }}
            householdConfig={householdConfig}
            canSeeKidsTools={paywallStatus.isFamily}
          />

          {/* Lower support line: keep header minimal while preserving subtle guidance */}
          {supportLine && timeBlock ? (
            <div className="mt-4 rounded-2xl border border-border/50 bg-white/70 px-4 py-3">
              <SupportLine line={supportLine} timeBlock={timeBlock} />
            </div>
          ) : null}

          {/* Snap & Cook — PantryCapture overlay */}
          <AnimatePresence>
            {snapCookOpen && (
              <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                <PantryCapture
                  onConfirm={(items) => {
                    setSnapCookOpen(false)
                    if (items.length > 0) {
                      const q = encodeURIComponent(items.join(','))
                      router.push(`/tonight?ingredients=${q}`)
                    }
                  }}
                  onCancel={() => setSnapCookOpen(false)}
                />
              </div>
            )}
          </AnimatePresence>

          <ProgressCard />

          <ShareFooter />
        </div>
      </div>

      <ZeroCookSheet
        open={zeroCookOpen}
        onOpenChange={setZeroCookOpen}
        householdType={
          light.householdType === 'couple'
            ? 'couple'
            : light.householdType === 'family'
              ? 'family'
              : 'single'
        }
        household={getHousehold()}
        cuisinePreferences={light.cuisines}
        budget={
          light.cookingTimeMinutes && light.cookingTimeMinutes <= 15
            ? 'low'
            : undefined
        }
        dislikedFoods={light.dislikedFoods}
        pickyEater={light.pickyEater}
        lowEnergy={light.lowEnergy}
        healthyGoal={false}
        countryCode={light.country || undefined}
      />

      <ZeroCookTeaser
        open={zeroCookTeaserOpen}
        onOpenChange={setZeroCookTeaserOpen}
      />
    </>
  )
}
