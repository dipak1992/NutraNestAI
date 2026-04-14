'use client'

import { useState, useCallback } from 'react'
import { usePlannerStore } from '@/lib/store'
import { WeeklyGrid } from '@/components/planner/WeeklyGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatWeekRange } from '@/lib/utils'
import type { Plan } from '@/types'

export default function PlannerPage() {
  const { currentPlan, setCurrentPlan, isGenerating, setIsGenerating } = usePlannerStore()
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const activePlan: Plan = currentPlan ?? DEMO_WEEKLY_PLAN

  const handleGenerateNew = useCallback(async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      if (!res.ok) throw new Error()
      const data: Plan = await res.json()
      setCurrentPlan(data)
      toast.success('New meal plan generated!')
    } catch {
      toast.error('Could not generate plan. Using demo data.')
      setCurrentPlan(DEMO_WEEKLY_PLAN)
    } finally {
      setIsGenerating(false)
    }
  }, [setCurrentPlan, setIsGenerating])

  const handleRegenerate = useCallback(async (mealId: string) => {
    setRegeneratingId(mealId)
    try {
      const res = await fetch('/api/regenerate-meal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mealId }) })
      if (!res.ok) throw new Error()
      toast.success('Meal regenerated!')
    } catch {
      toast.error('Could not regenerate meal.')
    } finally {
      setRegeneratingId(null)
    }
  }, [])

  const weekRange = activePlan.days.length > 0
    ? formatWeekRange(new Date(activePlan.days[0].date), new Date(activePlan.days[activePlan.days.length - 1].date))
    : 'This week'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Weekly Planner</h1>
            {!currentPlan && <Badge variant="secondary">Demo</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">{weekRange}</p>
        </div>
        <Button onClick={handleGenerateNew} disabled={isGenerating} className="gap-2">
          {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</> : <><RefreshCw className="h-4 w-4" />New plan</>}
        </Button>
      </div>

      {isGenerating ? (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 py-24 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <p className="font-medium">Generating your personalized meal plan…</p>
          <p className="text-sm text-muted-foreground mt-1">Claude AI is creating safe variations for each family member</p>
        </div>
      ) : (
        <WeeklyGrid days={activePlan.days} onRegenerate={handleRegenerate} regeneratingId={regeneratingId} />
      )}
    </div>
  )
}
