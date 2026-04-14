'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOnboardingStore } from '@/lib/store'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, User, Home, Leaf, LogOut, Trash2, Crown } from 'lucide-react'
import { getStageEmoji, stageLabelDisplay, ALLERGY_LABELS, CONDITION_LABELS } from '@/lib/utils'
import { toast } from 'sonner'

const CUISINE_OPTIONS = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'Middle Eastern', 'Japanese', 'Thai', 'French']
const COOKING_TIME_OPTIONS = [
  { label: '< 20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: 'No limit', value: 120 },
]

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { status } = usePaywallStatus()
  const { householdName, members, cuisinePreferences, maxCookingTime, setHouseholdName, setCuisinePreferences, setMaxCookingTime } = useOnboardingStore()
  const [signingOut, setSigningOut] = useState(false)
  const [nameInput, setNameInput] = useState(householdName)

  async function handleSignOut() {
    setSigningOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Failed to sign out')
      setSigningOut(false)
      return
    }
    router.push('/login')
  }

  function saveName() {
    if (nameInput.trim()) {
      setHouseholdName(nameInput.trim())
      toast.success('Household name updated')
    }
  }

  function toggleCuisine(c: string) {
    const current = cuisinePreferences ?? []
    setCuisinePreferences(current.includes(c) ? current.filter((x) => x !== c) : [...current, c])
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and household preferences</p>
      </div>

      <Tabs defaultValue="household">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="household" className="gap-2"><Home className="h-4 w-4" />Household</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Leaf className="h-4 w-4" />Preferences</TabsTrigger>
          <TabsTrigger value="account" className="gap-2"><User className="h-4 w-4" />Account</TabsTrigger>
        </TabsList>

        <TabsContent value="household" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <h2 className="font-semibold">Household Name</h2>
            <div className="flex gap-2">
              <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="e.g. The Garcia-Chen Family" />
              <Button onClick={saveName} variant="outline">Save</Button>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-border/60 p-5">
            <h2 className="font-semibold mb-4">Members ({members.length})</h2>
            {members.length > 0 ? (
              <ul className="space-y-3">
                {members.map((member) => (
                  <li key={member.id} className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
                    <span className="text-xl mt-0.5">{getStageEmoji(member.life_stage)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{stageLabelDisplay(member.life_stage)}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {member.allergies?.map((a) => (
                          <Badge key={a} className="bg-amber-100 text-amber-700 border-0 text-xs">{ALLERGY_LABELS[a] ?? a}</Badge>
                        ))}
                        {member.medical_conditions?.map((c) => (
                          <Badge key={c} className="bg-blue-100 text-blue-700 border-0 text-xs">{CONDITION_LABELS[c] ?? c}</Badge>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No members yet. Complete onboarding to add family members.</p>
            )}
            <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/onboarding')}>
              Edit Members in Onboarding
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5">
            <h2 className="font-semibold mb-4">Cuisine Preferences</h2>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((c) => {
                const selected = cuisinePreferences?.includes(c)
                return (
                  <button
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="glass-card rounded-xl border border-border/60 p-5">
            <h2 className="font-semibold mb-4">Max Cooking Time</h2>
            <div className="flex flex-wrap gap-2">
              {COOKING_TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMaxCookingTime(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${maxCookingTime === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Current Plan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {status.isPro
                    ? 'Pro is active. Full planner, grocery list, pantry, and insights are unlocked.'
                    : 'You are on Free. Upgrade to Pro to unlock the full weekly planner and advanced tools.'}
                </p>
              </div>
              <Badge className={status.isPro ? 'bg-amber-100 text-amber-800 border-0' : 'bg-primary/10 text-primary border-0'}>
                {status.tier}
              </Badge>
            </div>
            {!status.isPro && (
              <Button asChild>
                <Link href="/pricing?intent=pro">Upgrade to Pro</Link>
              </Button>
            )}
          </div>

          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <h2 className="font-semibold">Session</h2>
            <p className="text-sm text-muted-foreground">Sign out of your NutriNest account on this device.</p>
            <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5">
              <LogOut className="h-4 w-4" />{signingOut ? 'Signing out…' : 'Sign Out'}
            </Button>
          </div>
          <div className="glass-card rounded-xl border border-red-200/60 p-5 space-y-4">
            <h2 className="font-semibold text-destructive flex items-center gap-2"><Trash2 className="h-4 w-4" />Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all household data. This cannot be undone.</p>
            <Button variant="outline" disabled className="gap-2 text-destructive border-destructive/30">
              <Trash2 className="h-4 w-4" />Delete Account (coming soon)
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
