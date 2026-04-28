'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'
import { Plus, Users, Crown, ChevronUp, ChevronDown, Trash2, Copy, Sparkles, Lock, ArrowRight } from 'lucide-react'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import type { FamilyMemberRecord } from '@/lib/family/types'
import { Analytics } from '@/lib/analytics'

type MemberDraft = Partial<FamilyMemberRecord>
type TierName = 'free' | 'pro' | 'family'

const ROLES = ['adult', 'teen', 'child', 'toddler', 'baby'] as const
const PORTION_SIZES = ['small', 'medium', 'large'] as const
const WEIGHT_GOALS = ['lose', 'maintain', 'gain', 'build_muscle'] as const

const TIER_LABELS: Record<TierName, string> = {
  free: 'Free',
  pro: 'Pro',
  family: 'Family Plus',
}

const TIER_BADGE_STYLES: Record<TierName, string> = {
  free: 'bg-slate-100 text-slate-600 border-0',
  pro: 'bg-emerald-100 text-emerald-700 border-0',
  family: 'bg-amber-100 text-amber-700 border-0',
}

function toCsv(v: string[] | undefined) {
  return (v ?? []).join(', ')
}

function fromCsv(v: string) {
  return v
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

function blankDraft(order: number): MemberDraft {
  return {
    first_name: '',
    role: 'adult',
    picky_eater_level: 0,
    display_order: order,
    allergies_json: [],
    foods_loved_json: [],
    foods_disliked_json: [],
    protein_preferences_json: [],
    cuisine_likes_json: [],
    foods_accepted_json: [],
    foods_rejected_json: [],
    portion_size: 'medium',
    weight_goal: null,
  }
}

function weightGoalLabel(goal: string | null | undefined): string {
  switch (goal) {
    case 'lose': return 'Lose weight'
    case 'maintain': return 'Maintain'
    case 'gain': return 'Gain weight'
    case 'build_muscle': return 'Build muscle'
    default: return ''
  }
}

export default function FamilySettingsPage() {
  const { status, loading } = usePaywallStatus()
  const [paywallOpen, setPaywallOpen] = useState(false)

  const [householdName, setHouseholdName] = useState('My Household')
  const [members, setMembers] = useState<FamilyMemberRecord[]>([])
  const [maxMembers, setMaxMembers] = useState(1)
  const [tier, setTier] = useState<TierName>('free')
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MemberDraft>(blankDraft(0))

  const isFamily = tier === 'family'
  const isPro = tier === 'pro' || tier === 'family'
  const atLimit = members.length >= maxMembers

  const adults = useMemo(() => members.filter((m) => m.role === 'adult' || m.role === 'teen').length, [members])
  const kids = useMemo(() => members.filter((m) => m.role === 'child' || m.role === 'toddler' || m.role === 'baby').length, [members])

  const load = useCallback(async () => {
    const res = await fetch('/api/family/members', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setHouseholdName(data.household?.name ?? 'My Household')
    setMembers(data.members ?? [])
    setMaxMembers(data.maxMembers ?? 1)
    setTier(data.tier ?? 'free')
    setUpgradeMessage(data.upgradeMessage ?? null)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!status.isAuthenticated) return
    void load()
  }, [loading, status.isAuthenticated, load])

  const openAdd = () => {
    if (atLimit) {
      setPaywallOpen(true)
      return
    }
    setEditingId(null)
    setDraft(blankDraft(members.length))
    setEditorOpen(true)
  }

  const openEdit = (m: FamilyMemberRecord) => {
    setEditingId(m.id)
    setDraft({ ...m })
    setEditorOpen(true)
  }

  const saveHouseholdName = async () => {
    setSaving(true)
    try {
      await fetch('/api/family/household', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: householdName }),
      })
    } finally {
      setSaving(false)
    }
  }

  const saveMember = async () => {
    setSaving(true)
    try {
      const payload = {
        ...draft,
        allergies_json: Array.isArray(draft.allergies_json) ? draft.allergies_json : [],
        foods_loved_json: Array.isArray(draft.foods_loved_json) ? draft.foods_loved_json : [],
        foods_disliked_json: Array.isArray(draft.foods_disliked_json) ? draft.foods_disliked_json : [],
        protein_preferences_json: Array.isArray(draft.protein_preferences_json) ? draft.protein_preferences_json : [],
        cuisine_likes_json: Array.isArray(draft.cuisine_likes_json) ? draft.cuisine_likes_json : [],
        foods_accepted_json: Array.isArray(draft.foods_accepted_json) ? draft.foods_accepted_json : [],
        foods_rejected_json: Array.isArray(draft.foods_rejected_json) ? draft.foods_rejected_json : [],
      }

      const res = await fetch(editingId ? `/api/family/members/${editingId}` : '/api/family/members', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        posthog.capture(Analytics.MEMBER_ADDED, { role: draft.role, editing: Boolean(editingId), tier })
        if (draft.role === 'child' || draft.role === 'toddler' || draft.role === 'baby') {
          posthog.capture(Analytics.CHILD_PROFILE_ADDED, { role: draft.role })
        }
        setEditorOpen(false)
        await load()
      } else {
        const data = await res.json().catch(() => null)
        if (res.status === 403) {
          setPaywallOpen(true)
        } else {
          alert(data?.error ?? 'Unable to save member')
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const removeMember = async (id: string) => {
    const res = await fetch(`/api/family/members/${id}`, { method: 'DELETE' })
    if (res.ok) await load()
  }

  const moveMember = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= members.length) return

    const sorted = [...members]
    const current = sorted[index]
    const next = sorted[target]

    await fetch(`/api/family/members/${current.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_order: next.display_order }),
    })

    await fetch(`/api/family/members/${next.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_order: current.display_order }),
    })

    await load()
  }

  const duplicateSettings = async (id: string) => {
    const member = members.find((m) => m.id === id)
    if (!member || atLimit) return

    setEditingId(null)
    setDraft({
      ...member,
      first_name: `${member.first_name} Copy`,
      display_order: members.length,
      is_primary_cook: false,
      is_primary_shopper: false,
    })
    setEditorOpen(true)
  }

  // ── Tier-specific descriptions ──────────────────────────────────────────
  const tierDescription = useMemo(() => {
    switch (tier) {
      case 'free':
        return 'Add 1 member profile to personalize your meals. Upgrade for more.'
      case 'pro':
        return 'Add up to 2 simplified profiles. Upgrade to Family Plus for full profiles and up to 6 members.'
      case 'family':
        return `Add up to ${maxMembers} members with full profiles — allergies, preferences, picky eater settings, and more.`
      default:
        return ''
    }
  }, [tier, maxMembers])

  // ── Paywall dialog config ───────────────────────────────────────────────
  const paywallTitle = tier === 'free'
    ? 'Unlock More Profiles'
    : 'Profile Limit Reached'

  const paywallDescription = tier === 'free'
    ? 'Upgrade to Plus for up to 6 household member profiles with full preferences.'
    : `Plus supports up to ${maxMembers} members.`

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-3" />
        </div>
      </div>
    )
  }

  if (!status.isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold">Family Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your household profiles.</p>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/family">Sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Household Profiles
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{tierDescription}</p>
          </div>
          <Badge className={TIER_BADGE_STYLES[tier]}>
            {tier === 'family' && <Crown className="h-3.5 w-3.5 mr-1" />}
            {tier === 'pro' && <Sparkles className="h-3.5 w-3.5 mr-1" />}
            {TIER_LABELS[tier]}
          </Badge>
        </div>

        {/* Household name — only for Pro+ */}
        {isPro && (
          <div className="mt-4 flex gap-2">
            <Input value={householdName} onChange={(e) => setHouseholdName(e.target.value)} placeholder="Household name" />
            <Button variant="outline" onClick={() => void saveHouseholdName()} disabled={saving}>Save</Button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {isFamily && <Badge variant="secondary">Adults: {adults}</Badge>}
          {isFamily && <Badge variant="secondary">Kids: {kids}</Badge>}
          <Badge variant="secondary">Profiles: {members.length}/{maxMembers}</Badge>
        </div>
      </div>

      {/* ── Upgrade nudge (non-family tiers) ── */}
      {upgradeMessage && (
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-orange-50/60 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Crown className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">Want more profiles?</p>
            <p className="text-sm text-amber-800/80 mt-0.5">{upgradeMessage}</p>
            <Button asChild size="sm" className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white hover:opacity-90">
              <Link href={tier === 'free' ? '/pricing?intent=pro' : '/pricing?intent=family'}>
                Upgrade now <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Member list ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Member Profiles</h2>
        <Button onClick={openAdd} disabled={atLimit && isFamily}>
          {atLimit && !isFamily ? (
            <><Lock className="h-4 w-4 mr-1" /> Upgrade to add</>
          ) : (
            <><Plus className="h-4 w-4 mr-1" /> Add member</>
          )}
        </Button>
      </div>

      {members.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No profiles yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            {tier === 'free'
              ? 'Add your profile to personalize meal suggestions.'
              : tier === 'pro'
                ? 'Add up to 2 profiles to personalize meals for you and a partner.'
                : 'Add family members to personalize meals for everyone.'}
          </p>
          <Button size="sm" className="mt-4" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add your first profile
          </Button>
        </div>
      )}

      <div className="grid gap-3">
        {members.map((m, i) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.first_name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {m.role}{m.age_years ? ` · ${m.age_years}y` : m.age_range ? ` · ${m.age_range}` : ''}
                  {m.weight_goal ? ` · ${weightGoalLabel(m.weight_goal)}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {m.dietary_type ? <Badge variant="outline">{m.dietary_type}</Badge> : null}
                  {m.picky_eater_level >= 3 ? <Badge variant="outline">Picky eater</Badge> : null}
                  {m.allergies_json?.length ? <Badge variant="outline">{m.allergies_json.length} allergies</Badge> : null}
                  {m.weight_goal ? <Badge variant="outline">{weightGoalLabel(m.weight_goal)}</Badge> : null}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isFamily && (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => void moveMember(i, -1)} disabled={i === 0}><ChevronUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => void moveMember(i, 1)} disabled={i === members.length - 1}><ChevronDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => duplicateSettings(m.id)} disabled={atLimit}><Copy className="h-4 w-4" /></Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void removeMember(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Editor form ── */}
      {editorOpen ? (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit profile' : 'Add profile'}</h3>

          {/* Core fields — all tiers */}
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="First name" value={draft.first_name ?? ''} onChange={(e) => setDraft((d) => ({ ...d, first_name: e.target.value }))} />
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={draft.role ?? 'adult'} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value as any }))}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <Input type="number" placeholder="Age (years)" value={draft.age_years ?? ''} onChange={(e) => setDraft((d) => ({ ...d, age_years: e.target.value ? Number(e.target.value) : null }))} />
            <Input placeholder="Dietary type (e.g. vegetarian)" value={draft.dietary_type ?? ''} onChange={(e) => setDraft((d) => ({ ...d, dietary_type: e.target.value }))} />
            <Input placeholder="Allergies (comma separated)" value={toCsv(draft.allergies_json)} onChange={(e) => setDraft((d) => ({ ...d, allergies_json: fromCsv(e.target.value) }))} />
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={draft.weight_goal ?? ''} onChange={(e) => setDraft((d) => ({ ...d, weight_goal: (e.target.value || null) as FamilyMemberRecord['weight_goal'] }))}>
              <option value="">Weight goal (optional)</option>
              {WEIGHT_GOALS.map((g) => <option key={g} value={g}>{weightGoalLabel(g)}</option>)}
            </select>
          </div>

          {/* Full profile fields — Family Plus only */}
          {isFamily && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Full Profile (Family Plus)
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="Age range (optional)" value={draft.age_range ?? ''} onChange={(e) => setDraft((d) => ({ ...d, age_range: e.target.value }))} />
                  <Input placeholder="Spice tolerance (none/mild/medium/high)" value={draft.spice_tolerance ?? ''} onChange={(e) => setDraft((d) => ({ ...d, spice_tolerance: e.target.value as any }))} />
                  <Input placeholder="Foods loved (comma separated)" value={toCsv(draft.foods_loved_json)} onChange={(e) => setDraft((d) => ({ ...d, foods_loved_json: fromCsv(e.target.value) }))} />
                  <Input placeholder="Foods disliked (comma separated)" value={toCsv(draft.foods_disliked_json)} onChange={(e) => setDraft((d) => ({ ...d, foods_disliked_json: fromCsv(e.target.value) }))} />
                  <Input placeholder="Protein preferences (comma separated)" value={toCsv(draft.protein_preferences_json)} onChange={(e) => setDraft((d) => ({ ...d, protein_preferences_json: fromCsv(e.target.value) }))} />
                  <Input placeholder="Cuisine likes (comma separated)" value={toCsv(draft.cuisine_likes_json)} onChange={(e) => setDraft((d) => ({ ...d, cuisine_likes_json: fromCsv(e.target.value) }))} />
                  <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={draft.portion_size ?? 'medium'} onChange={(e) => setDraft((d) => ({ ...d, portion_size: e.target.value as any }))}>
                    {PORTION_SIZES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <Input type="number" min={0} max={5} placeholder="Picky eater level (0-5)" value={draft.picky_eater_level ?? 0} onChange={(e) => setDraft((d) => ({ ...d, picky_eater_level: Number(e.target.value) }))} />
                  <Input placeholder="Foods accepted (kids) comma separated" value={toCsv(draft.foods_accepted_json)} onChange={(e) => setDraft((d) => ({ ...d, foods_accepted_json: fromCsv(e.target.value) }))} />
                  <Input placeholder="Foods rejected (kids) comma separated" value={toCsv(draft.foods_rejected_json)} onChange={(e) => setDraft((d) => ({ ...d, foods_rejected_json: fromCsv(e.target.value) }))} />
                  <Input placeholder="Texture sensitivity" value={draft.texture_sensitivity ?? ''} onChange={(e) => setDraft((d) => ({ ...d, texture_sensitivity: e.target.value }))} />
                  <Input placeholder="Snack frequency" value={draft.snack_frequency ?? ''} onChange={(e) => setDraft((d) => ({ ...d, snack_frequency: e.target.value }))} />
                  <Input placeholder="Notes" value={draft.notes ?? ''} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm mt-3">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={Boolean(draft.school_lunch_needed)} onChange={(e) => setDraft((d) => ({ ...d, school_lunch_needed: e.target.checked }))} /> School lunch needed</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={Boolean(draft.is_primary_shopper)} onChange={(e) => setDraft((d) => ({ ...d, is_primary_shopper: e.target.checked }))} /> Primary shopper</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={Boolean(draft.is_primary_cook)} onChange={(e) => setDraft((d) => ({ ...d, is_primary_cook: e.target.checked }))} /> Primary cook</label>
                </div>
              </div>
            </>
          )}

          {/* Locked fields teaser for non-family tiers */}
          {!isFamily && (
            <div className="rounded-xl border border-dashed border-amber-300/60 bg-amber-50/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <Lock className="h-4 w-4" />
                Full profile fields available with Family Plus
              </div>
              <p className="text-xs text-amber-700/70 mt-1">
                Picky eater settings, cuisine preferences, portion sizes, lunchbox planning, and more.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                <Link href="/pricing?intent=family">See Family Plus →</Link>
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => void saveMember()} disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
          </div>
        </div>
      ) : null}

      {/* ── Paywall dialog ── */}
      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title={paywallTitle}
        description={paywallDescription}
        isAuthenticated={status.isAuthenticated}
        redirectPath="/family"
      />
    </div>
  )
}
