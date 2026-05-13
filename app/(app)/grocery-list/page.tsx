'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ShoppingCart, Lock, Globe, ChevronDown } from 'lucide-react'
import { GroceryListPanel } from '@/components/grocery/GroceryListPanel'
import { ProviderComparisonCard } from '@/components/grocery/ProviderComparisonCard'
import { GroceryExportActions } from '@/components/grocery/GroceryExportActions'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { useGroceryCommerce } from '@/lib/grocery/use-grocery-commerce'
import type { DetectedRegion, ProviderId } from '@/lib/grocery/types'
import type { GroceryList, WeeklyPlan } from '@/lib/planner/types'
import { cn } from '@/lib/utils'

const REGION_OPTIONS: { value: DetectedRegion; label: string; flag: string }[] = [
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'OTHER', label: 'Other region', flag: '🌍' },
]

export default function GroceryListPage() {
  const { status, loading } = usePaywallStatus()
  const groceryList = useWeeklyPlanStore((s) => s.groceryList)
  const plan = useWeeklyPlanStore((s) => s.plan)
  const setPlan = useWeeklyPlanStore((s) => s.setPlan)
  const setGroceryList = useWeeklyPlanStore((s) => s.setGroceryList)
  const [preferredStore, setPreferredStore] = useState<string | null>(null)
  const {
    region,
    hasProviders,
    estimates,
    isLoading: regionLoading,
    setRegion,
    openProvider,
    copyList,
    downloadPDF,
    emailList,
    shareList,
  } = useGroceryCommerce(groceryList, preferredStore)

  const [copySuccess, setCopySuccess] = useState(false)
  const [showRegionPicker, setShowRegionPicker] = useState(false)
  const loadedServerState = useRef(false)
  const lastSavedPayload = useRef<string | null>(null)

  const handleCopy = useCallback(async () => {
    const success = await copyList()
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }, [copyList])

  const handleProviderSelect = useCallback((providerId: string) => {
    openProvider(providerId as ProviderId)
  }, [openProvider])

  useEffect(() => {
    void fetch('/api/budget', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const nextPreferredStore =
          typeof data?.settings?.preferredStore === 'string'
            ? data.settings.preferredStore
            : null
        setPreferredStore(nextPreferredStore)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!status.isAuthenticated || loading) return

    let cancelled = false
    async function loadSavedList() {
      try {
        const res = await fetch(`/api/grocery-list?weekStart=${encodeURIComponent(plan.weekStart)}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = (await res.json()) as {
          plan: WeeklyPlan | null
          groceryList: GroceryList | null
        }
        if (cancelled) return
        if (data.plan) setPlan(data.plan)
        if (data.groceryList) {
          setGroceryList(data.groceryList)
          lastSavedPayload.current = JSON.stringify(data.groceryList)
        }
        loadedServerState.current = true
      } catch {
        loadedServerState.current = true
      }
    }

    void loadSavedList()
    return () => {
      cancelled = true
    }
  }, [loading, plan.weekStart, setGroceryList, setPlan, status.isAuthenticated])

  useEffect(() => {
    if (!status.isAuthenticated || loading || !loadedServerState.current || !groceryList) return
    const payload = JSON.stringify(groceryList)
    if (payload === lastSavedPayload.current) return

    const timeout = window.setTimeout(() => {
      void fetch('/api/grocery-list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStart: groceryList.weekStart, groceryList }),
      }).then((res) => {
        if (res.ok) lastSavedPayload.current = payload
      }).catch(() => {})
    }, 700)

    return () => window.clearTimeout(timeout)
  }, [groceryList, loading, status.isAuthenticated])

  // Free plan gate — show limited view
  if (!loading && !status.isPro && !groceryList) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-[#D97757]" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Grocery List</h1>
        </div>

        {/* Unlock prompt */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-orange-50/50 to-white dark:from-neutral-900 dark:to-neutral-950 py-16 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Lock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
            Your personalized grocery list lives here
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            Generate your weekly meal plan to unlock a smart grocery list with store comparison, retailer handoff, and export tools.
          </p>

          {/* Feature preview */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
            <div className="rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 px-3 py-2.5 text-center">
              <span className="text-lg">🛒</span>
              <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1">Store comparison</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 px-3 py-2.5 text-center">
              <span className="text-lg">📋</span>
              <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1">Smart exports</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 px-3 py-2.5 text-center">
              <span className="text-lg">💰</span>
              <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1">Price estimates</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ProPaywallCard
            title="Turn your meal plan into a shopping list"
            description="Upgrade to Plus to unlock auto-built smart grocery lists with store comparison, Walmart, Instacart, and Kroger handoff, PDF export, and smart pantry deduction."
            isAuthenticated={status.isAuthenticated}
            redirectPath="/grocery-list"
            feature="grocery"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
            <ShoppingCart className="h-6 w-6 text-[#D97757]" />
            Your Weekly List Ready
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Generated from your Week Plan. Edits, pantry marks, and checked items are saved for this week.
          </p>
        </div>

        {/* Region picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRegionPicker(!showRegionPicker)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-800 hover:ring-neutral-300 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {REGION_OPTIONS.find((r) => r.value === region)?.flag ?? '🌍'}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showRegionPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRegionPicker(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-800 p-1.5">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Shopping region
                </div>
                {REGION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setRegion(opt.value)
                      setShowRegionPicker(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                      region === opt.value
                        ? 'bg-[#D97757]/10 text-[#D97757] font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    )}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Provider comparison — only for supported regions with a grocery list */}
      {!regionLoading && hasProviders && groceryList && groceryList.items.length > 0 && (
        <div className="space-y-2">
          {preferredStore && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Preferred store: <span className="font-medium text-neutral-700 dark:text-neutral-300">{preferredStore}</span>
            </p>
          )}
          <ProviderComparisonCard
            estimates={estimates}
            onSelectProvider={handleProviderSelect}
          />
        </div>
      )}

      {/* Export actions — always available when there's a list */}
      {groceryList && groceryList.items.length > 0 && (
        <GroceryExportActions
          region={region}
          hasProviders={hasProviders}
          onCopy={handleCopy}
          onDownloadPDF={downloadPDF}
          onEmail={emailList}
          onShare={shareList}
          copySuccess={copySuccess}
        />
      )}

      {/* Divider */}
      {groceryList && groceryList.items.length > 0 && (
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
      )}

      {/* Existing grocery list panel */}
      <GroceryListPanel />

      {/* Legal disclaimer */}
      {hasProviders && groceryList && groceryList.items.length > 0 && (
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 px-4 py-3 text-[11px] text-neutral-400 dark:text-neutral-500 space-y-1">
          <p className="font-medium text-neutral-500 dark:text-neutral-400">ℹ️ About store links</p>
          <p>
            MealEase is not affiliated with Walmart, Instacart, or Kroger. Clicking &ldquo;Shop&rdquo; opens the
            retailer&rsquo;s website where you can search for and purchase items directly. MealEase also copies
            your full grocery list when you open a retailer so you have a reliable fallback. Estimated prices
            are approximations and may differ from actual store prices. MealEase does not process payments or
            handle orders.
          </p>
        </div>
      )}
    </div>
  )
}
