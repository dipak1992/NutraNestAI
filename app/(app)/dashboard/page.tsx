import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEMO_WEEKLY_PLAN, DEMO_HOUSEHOLD } from '@/lib/demo-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ShoppingCart, Leaf, ChevronRight, Sparkles, Users, Clock } from 'lucide-react'
import { DAY_NAMES } from '@/lib/utils'

export const metadata = { title: 'Dashboard' }

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="glass-card rounded-xl border border-border/60 p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${color}`}><Icon className="h-5 w-5" /></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const plan = DEMO_WEEKLY_PLAN
  const today = new Date()
  const todayDayIndex = (today.getDay() + 6) % 7 // Mon=0
  const todayMeals = plan.days[todayDayIndex]?.meals ?? []
  const totalMeals = plan.days.reduce((sum, d) => sum + (d.meals?.length ?? 0), 0)
  const totalMembers = DEMO_HOUSEHOLD.members?.length ?? 5

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Good {getGreeting()}, {user.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your meal plan overview for the week.</p>
        </div>
        <Button asChild><Link href="/planner"><Sparkles className="mr-2 h-4 w-4" />View planner</Link></Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Meals this week" value={totalMeals} icon={Calendar} color="bg-primary/10 text-primary" />
        <StatCard label="Family members" value={totalMembers} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard label="Avg cook time" value="28 min" icon={Clock} color="bg-amber-100 text-amber-700" />
        <StatCard label="Pantry items" value={12} icon={Leaf} color="bg-emerald-100 text-emerald-700" />
      </div>

      {/* Today's meals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today — {DAY_NAMES[todayDayIndex]}</h2>
          <Button asChild variant="ghost" size="sm"><Link href="/planner">View all <ChevronRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        {todayMeals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayMeals.map((meal) => (
              <Link key={meal.id} href={`/meal/${meal.id}`} className="glass-card rounded-xl border border-border/60 p-5 hover:border-primary/30 transition-colors group">
                <Badge variant="secondary" className="mb-2 capitalize text-xs">{meal.meal_type}</Badge>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{meal.name}</h3>
                {meal.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{meal.description}</p>}
                {meal.variations && meal.variations.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{meal.variations.length} member variations</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border/60 py-12 text-center text-muted-foreground">
            <p>No meals planned today.</p>
            <Button asChild variant="outline" className="mt-3"><Link href="/planner">Add to planner</Link></Button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/grocery-list" className="glass-card rounded-xl border border-border/60 p-5 hover:border-primary/30 transition-colors flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0"><ShoppingCart className="h-5 w-5" /></div>
            <div><p className="font-semibold group-hover:text-primary transition-colors">Grocery list</p><p className="text-sm text-muted-foreground">View this week&apos;s shopping list</p></div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link href="/pantry" className="glass-card rounded-xl border border-border/60 p-5 hover:border-primary/30 transition-colors flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0"><Leaf className="h-5 w-5" /></div>
            <div><p className="font-semibold group-hover:text-primary transition-colors">Pantry</p><p className="text-sm text-muted-foreground">Manage what you have at home</p></div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
