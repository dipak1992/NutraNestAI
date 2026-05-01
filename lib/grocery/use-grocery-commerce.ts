// ============================================================
// Grocery Commerce — React Hook
// Provides region detection, provider list, and actions
// ============================================================

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { detectRegion, setRegionOverride } from '@/lib/grocery/region'
import { getProvidersForRegion, hasProviderSupport } from '@/lib/grocery/providers/registry'
import { compareProviders, buildProviderCartItems, buildProviderSearchUrl } from '@/lib/grocery/comparison'
import { trackGroceryPageView, trackRegionDetected, trackProviderSelected, trackExportAction, trackComparisonViewed } from '@/lib/grocery/analytics'
import { copyGroceryList, downloadGroceryListPDF, shareGroceryList, getEmailGroceryListUrl } from '@/lib/grocery/exports'
import type { DetectedRegion, GroceryProvider, ProviderEstimate, ProviderId } from '@/lib/grocery/types'
import type { GroceryList } from '@/lib/planner/types'

export interface UseGroceryCommerceReturn {
  region: DetectedRegion
  providers: GroceryProvider[]
  hasProviders: boolean
  estimates: ProviderEstimate[]
  isLoading: boolean

  // Actions
  setRegion: (region: DetectedRegion) => void
  openProvider: (providerId: ProviderId) => void
  copyList: () => Promise<boolean>
  downloadPDF: () => void
  emailList: () => void
  shareList: () => Promise<boolean>
  refreshEstimates: () => void
}

export function useGroceryCommerce(groceryList: GroceryList | null): UseGroceryCommerceReturn {
  const [region, setRegionState] = useState<DetectedRegion>('OTHER')
  const [isLoading, setIsLoading] = useState(true)

  // Detect region on mount
  useEffect(() => {
    const detected = detectRegion()
    setRegionState(detected)
    setIsLoading(false)
    trackRegionDetected(detected)
  }, [])

  // Get providers for region
  const providers = useMemo(() => getProvidersForRegion(region), [region])
  const hasProviders = useMemo(() => hasProviderSupport(region), [region])

  // Generate estimates
  const estimates = useMemo(() => {
    if (!groceryList || !hasProviders) return []
    return compareProviders(groceryList, region)
  }, [groceryList, region, hasProviders])

  // Track page view once loaded
  useEffect(() => {
    if (!isLoading) {
      trackGroceryPageView(region, hasProviders)
    }
  }, [isLoading, region, hasProviders])

  // Track comparison view when estimates are available
  useEffect(() => {
    if (estimates.length > 0) {
      trackComparisonViewed(estimates.length, region)
    }
  }, [estimates.length, region])

  // Actions
  const setRegion = useCallback((newRegion: DetectedRegion) => {
    setRegionOverride(newRegion)
    setRegionState(newRegion)
    trackRegionDetected(newRegion)
  }, [])

  const openProvider = useCallback((providerId: ProviderId) => {
    if (!groceryList) return
    const provider = providers.find((p) => p.id === providerId)
    if (!provider) return

    trackProviderSelected(providerId, region)

    const cartItems = buildProviderCartItems(groceryList)
    const url = buildProviderSearchUrl(provider, cartItems)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [groceryList, providers, region])

  const copyList = useCallback(async () => {
    if (!groceryList) return false
    const result = await copyGroceryList(groceryList)
    if (result) trackExportAction('copy', groceryList.items.length)
    return result
  }, [groceryList])

  const downloadPDF = useCallback(() => {
    if (!groceryList) return
    downloadGroceryListPDF(groceryList)
    trackExportAction('pdf', groceryList.items.length)
  }, [groceryList])

  const emailList = useCallback(() => {
    if (!groceryList) return
    const url = getEmailGroceryListUrl(groceryList)
    window.open(url, '_blank')
    trackExportAction('email', groceryList.items.length)
  }, [groceryList])

  const shareList = useCallback(async () => {
    if (!groceryList) return false
    const result = await shareGroceryList(groceryList)
    if (result) trackExportAction('share', groceryList.items.length)
    return result
  }, [groceryList])

  const refreshEstimates = useCallback(() => {
    // Force re-detection
    const detected = detectRegion()
    setRegionState(detected)
  }, [])

  return {
    region,
    providers,
    hasProviders,
    estimates,
    isLoading,
    setRegion,
    openProvider,
    copyList,
    downloadPDF,
    emailList,
    shareList,
    refreshEstimates,
  }
}
