'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import posthog from 'posthog-js'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { OnboardingPromptPopup } from '@/components/onboarding/OnboardingPromptPopup'
import { ZeroCookSheet } from '@/components/zero-cook/ZeroCookSheet'
import { ZeroCookTeaser } from '@/components/zero-cook/ZeroCookTeaser'
import { householdFromMembers, fallbackHousehold } from '@/lib/decide/client'
import { StreakBadge } from '@/components/habit/StreakBadge'
import { PantryCapture } from './PantryCapture'
import { HeroSection } from './HeroSection'
import { TonightRecommendation } from './TonightRecommendation'
import { SmartToolsRow } from './SmartToolsRow'
import { WeekendModeCard } from './WeekendModeCard'
import { ProgressCard } from './ProgressCard'
import { ShareFooter } from './ShareFooter'

interface Props {
  userName: string
}

export function DashboardHub({ userName }: Props) {
  const firstName = userName.includes('@') ? userName.split('@')[0] : userName
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
      setZeroCookOpen(true)
    } else {
      setZeroCookTeaserOpen(true)
    }
  }, [paywallStatus.isPro])

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
          />

          <WeekendModeCard />

          <div ref={tonightRef}>
            <TonightRecommendation refreshKey={refreshKey} />
          </div>

          <SmartToolsRow onSnapCook={() => setSnapCookOpen(true)} />

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
        household={getHousehold()}
        cuisinePreferences={light.cuisines}
        budget={
          light.cookingTimeMinutes && light.cookingTimeMinutes <= 15
            ? 'low'
            : undefined
        }
      />

      <ZeroCookTeaser
        open={zeroCookTeaserOpen}
        onOpenChange={setZeroCookTeaserOpen}
      />
    </>
  )
}
