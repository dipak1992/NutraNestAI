'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOnboardingStore, useLightOnboardingStore } from '@/lib/store'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, User, Home, Leaf, LogOut, Trash2, Crown, Bell } from 'lucide-react'
import { getStageEmoji, stageLabelDisplay, ALLERGY_LABELS, CONDITION_LABELS } from '@/lib/utils'
import { toast } from 'sonner'
import { NotificationSettings } from '@/components/habit/NotificationSettings'

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
  const { state: { householdName, members, cuisinePreferences }, updateState } = useOnboardingStore()
  const { cookingTimeMinutes, setCookingTimeMinutes, hasKids, kidsAgeGroup, setKidsAgeGroup } = useLightOnboardingStore()
  const [signingOut, setSigningOut] = useState(false)
  const [nameInput, setNameInput] = useState(householdName)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [managingBilling, setManagingBilling] = useState(false)

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
      updateState({ householdName: nameInput.trim() })
      fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ householdName: nameInput.trim() }),
      }).catch(() => null)
      toast.success('Household name updated')
    }
  }

  function toggleCuisine(c: string) {
    const current = cuisinePreferences ?? []
    const next = current.includes(c) ? current.filter((x) => x !== c) : [...current, c]
    updateState({ cuisinePreferences: next })
    fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuisines: next }),
    }).catch(() => null)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    const res = await fetch('/api/settings', { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Failed to delete account. Please try again.')
      setDeleting(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleManageSubscription() {
    setManagingBilling(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    if (!res.ok) {
      toast.error('Could not open billing portal. Please try again.')
      setManagingBilling(false)
      return
    }
    const { url } = await res.json()
    window.location.href = url
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
        <div className="overflow-x-auto">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="household" className="gap-2"><Home className="h-4 w-4" />Household</TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><Leaf className="h-4 w-4" />Preferences</TabsTrigger>
            <TabsTrigger value="account" className="gap-2"><User className="h-4 w-4" />Account</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="billing" className="gap-2"><Crown className="h-4 w-4" />Billing</TabsTrigger>
          </TabsList>
        </div>

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
                    <span className="text-xl mt-0.5">{getStageEmoji(member.stage ?? 'adult')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{stageLabelDisplay(member.stage ?? 'adult')}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {member.allergies?.map((a) => (
                          <Badge key={a.allergy} className="bg-amber-100 text-amber-700 border-0 text-xs">{ALLERGY_LABELS[a.allergy] ?? a.allergy}</Badge>
                        ))}
                        {member.conditions?.map((c) => (
                          <Badge key={c.condition} className="bg-blue-100 text-blue-700 border-0 text-xs">{CONDITION_LABELS[c.condition] ?? c.condition}</Badge>
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
              Edit Members
            </Button>
          </div>

          {hasKids && (
            <div className="glass-card rounded-xl border border-border/60 p-5 space-y-3">
              <h2 className="font-semibold text-sm">Kids Age Group</h2>
              <p className="text-xs text-muted-foreground">Helps us suggest meals that match your children&apos;s eating stage.</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'baby', label: '🍼 Baby', desc: '< 1 yr' },
                  { value: 'toddler', label: '🥄 Toddler', desc: '1–3 yr' },
                  { value: 'school_age', label: '🎒 School Age', desc: '4+ yr' },
                  { value: 'mixed', label: '👨‍👩‍👧‍👦 Mixed ages', desc: '' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setKidsAgeGroup(kidsAgeGroup === opt.value ? null : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      kidsAgeGroup === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {opt.label}{opt.desc ? ` (${opt.desc})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                  onClick={() => {
                    setCookingTimeMinutes(opt.value)
                    fetch('/api/settings', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cookingTimeMinutes: opt.value }),
                    }).catch(() => null)
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${cookingTimeMinutes === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <h2 className="font-semibold">Session</h2>
            <p className="text-sm text-muted-foreground">Sign out of your MealEase account on this device.</p>
            <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5">
              <LogOut className="h-4 w-4" />{signingOut ? 'Signing out…' : 'Sign Out'}
            </Button>
          </div>
          <div className="glass-card rounded-xl border border-red-200/60 p-5 space-y-4">
            <h2 className="font-semibold text-destructive flex items-center gap-2"><Trash2 className="h-4 w-4" />Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all household data. This cannot be undone.</p>
            {!deleteConfirm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(true)}
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4" />Delete My Account
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-destructive">
                  Are you sure? This will permanently delete your household, meal plans, pantry, and all saved data. This cannot be undone.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Yes, permanently delete'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(false)} disabled={deleting}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Cive">
                  Are you sure? This will permanently delete your household, meal plans, pantry, and all saved data. This cannot be undone.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Yes, permanently delete'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(false)} disabled={deleting}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="glass-card rounded-xl border border-border/60 p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              Billing &amp; Plan
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Current plan: <span className="font-medium text-foreground capitalize">{status.tier}</span>
              </p>
              <Badge className={status.isPro ? 'bg-amber-100 text-amber-800 border-0' : 'bg-primary/10 text-primary border-0'}>
                {status.isPro ? 'Pro' : 'Free'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {status.isTempPro
                ? `You're on a free trial${status.tempProUntil ? ` — ends ${new Date(status.tempProUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}.`
                : status.isPro
                  ? 'Your Pro subscription is active. All features are unlocked.'
                  : 'Upgrade to Pro to unlock the full weekly planner, grocery list, pantry, and more.'}
            </p>
            {status.isPro && !status.isTempPro ? (
              <Button size="sm" variant="outline" onClick={handleManageSubscription} disabled={managingBilling} className="gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                {managingBilling ? 'Opening portal…' : 'Manage Subscription →'}
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/pricing?intent=pro">
                  {status.isTempPro ? 'Upgrade to Pro →' : 'Upgrade to Pro'}
                </Link>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
