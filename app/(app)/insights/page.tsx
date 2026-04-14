import { DEMO_WEEKLY_PLAN, DEMO_MEMBERS } from '@/lib/demo-data'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { getPaywallStatus } from '@/lib/paywall/server'
import { getStageEmoji, stageLabelDisplay } from '@/lib/utils'
import { TrendingUp, Utensils, Users, Clock, Leaf, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Insights' }

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="glass-card rounded-xl border border-border/60 p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default async function InsightsPage() {
  const status = await getPaywallStatus()

  if (!status.isPro) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProPaywallCard
          title="Insights unlock when you upgrade to Pro"
          description="Track cuisine trends, cook-time patterns, and household personalization once you move beyond the free preview."
          isAuthenticated={status.isAuthenticated}
          redirectPath="/insights"
        />
      </div>
    )
  }

  const days = DEMO_WEEKLY_PLAN.days ?? []
  const allMeals = days.flatMap((d) => d.meals ?? [])
  const totalMeals = allMeals.length
  const avgCookTime = Math.round(allMeals.reduce((sum, m) => sum + (m.cook_time_minutes ?? 0), 0) / (totalMeals || 1))
  const mealsWithVariations = allMeals.filter((m) => m.variations && m.variations.length > 0).length

  const cuisineCounts = allMeals.reduce<Record<string, number>>((acc, m) => {
    if (m.cuisine_type) acc[m.cuisine_type] = (acc[m.cuisine_type] ?? 0) + 1
    return acc
  }, {})
  const topCuisines = Object.entries(cuisineCounts).sort(([, a], [, b]) => b - a).slice(0, 5)

  const mealTypeCounts = allMeals.reduce<Record<string, number>>((acc, m) => {
    acc[m.meal_type] = (acc[m.meal_type] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          Insights
        </h1>
        <p className="text-muted-foreground mt-1">Weekly overview of your family&apos;s meal plan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Utensils className="h-5 w-5" />} label="Total Meals" value={String(totalMeals)} sub="this week" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Family Members" value={String(DEMO_MEMBERS.length)} sub="being planned for" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Avg Cook Time" value={`${avgCookTime}m`} sub="per meal" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Personalized" value={`${mealsWithVariations}/${totalMeals}`} sub="meals with variations" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl border border-border/60 p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" />Top Cuisines</h2>
          {topCuisines.length > 0 ? (
            <div className="space-y-2">
              {topCuisines.map(([cuisine, count]) => (
                <div key={cuisine} className="flex items-center gap-3">
                  <span className="text-sm w-32 truncate">{cuisine}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(count / totalMeals) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generate a plan to see cuisine stats.</p>
          )}
        </div>

        <div className="glass-card rounded-xl border border-border/60 p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Utensils className="h-4 w-4 text-primary" />Meals by Type</h2>
          <div className="space-y-2">
            {Object.entries(mealTypeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm capitalize w-24">{type}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${(count / totalMeals) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-border/60 p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />Member Profiles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DEMO_MEMBERS.map((member) => (
            <div key={member.id} className="rounded-lg border border-border/40 bg-muted/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getStageEmoji(member.life_stage)}</span>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{stageLabelDisplay(member.life_stage)}</p>
                </div>
              </div>
              {member.allergies && member.allergies.length > 0 && (
                <p className="text-xs text-amber-600">⚠️ {member.allergies.join(', ')}</p>
              )}
              {member.medical_conditions && member.medical_conditions.length > 0 && (
                <p className="text-xs text-blue-600 mt-0.5">💊 {member.medical_conditions.join(', ')}</p>
              )}
              {(!member.allergies?.length && !member.medical_conditions?.length) && (
                <p className="text-xs text-emerald-600">✓ No restrictions</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
