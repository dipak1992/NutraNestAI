'use client'

import { useState } from 'react'
import { Users, Loader2, Mail, Trash2, Crown, UserCheck } from 'lucide-react'
import type { PlanId } from '@/lib/stripe/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

type HouseholdMember = {
  id: string
  invited_email: string
  role: string
  status: string
  created_at: string
}

type Props = {
  members: HouseholdMember[]
  currentPlan: PlanId
}

// ─── Member limits per plan ───────────────────────────────────────────────────

const MEMBER_LIMITS: Record<PlanId, number> = {
  free: 1,
  plus: 6,
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SectionHousehold({ members: initialMembers, currentPlan }: Props) {
  const [members, setMembers] = useState<HouseholdMember[]>(initialMembers)
  const [email, setEmail]     = useState('')
  const [inviting, setInviting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const limit = MEMBER_LIMITS[currentPlan]
  const canInvite = members.length < limit

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !canInvite) return
    setInviting(true)
    setError(null)
    try {
      const res = await fetch('/api/settings/household/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json() as { ok?: boolean; error?: string; member?: HouseholdMember }
      if (!res.ok) {
        setError(data.error ?? 'Failed to send invite')
      } else {
        // Optimistically add a pending member
        const newMember: HouseholdMember = data.member ?? {
          id: crypto.randomUUID(),
          invited_email: email.trim(),
          role: 'member',
          status: 'pending',
          created_at: new Date().toISOString(),
        }
        setMembers((prev) => [...prev, newMember])
        setEmail('')
      }
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(memberId: string) {
    setRemoving(memberId)
    try {
      const res = await fetch(`/api/settings/household/${memberId}`, { method: 'DELETE' })
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId))
      }
    } finally {
      setRemoving(null)
    }
  }

  return (
    <section className="rounded-3xl border border-orange-100 bg-white/82 p-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-950">
        <Users className="h-4 w-4 text-[#D97757]" />
        Household members
        <span className="ml-auto text-xs font-normal text-slate-400">
          {members.length} / {limit} members
        </span>
      </h2>

      {/* Member list */}
      {members.length > 0 && (
        <ul className="mb-5 space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/82 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-sm">
                  {member.role === 'owner' ? (
                    <Crown className="h-4 w-4 text-[#B8935A]" />
                  ) : member.status === 'accepted' ? (
                    <UserCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Mail className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-700">{member.invited_email}</p>
                  <p className="text-xs capitalize text-slate-400">
                    {member.status === 'pending' ? 'Invite pending' : member.status}
                  </p>
                </div>
              </div>

              {member.role !== 'owner' && (
                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  disabled={removing === member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                  aria-label="Remove member"
                >
                  {removing === member.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Invite form */}
      {canInvite ? (
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Invite by email…"
            required
            className="flex-1 rounded-2xl border border-orange-100 bg-white/82 px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#D97757]/60 focus:ring-1 focus:ring-[#D97757]/40"
          />
          <button
            type="submit"
            disabled={inviting || !email.trim()}
            className="flex items-center gap-2 rounded-2xl bg-[#D97757] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4694a] disabled:opacity-60"
          >
            {inviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
            Invite
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/82 px-4 py-3 text-sm text-slate-500">
          Member limit reached for your{' '}
          <span className="capitalize text-slate-600">{currentPlan}</span> plan.{' '}
          <a href="/pricing" className="text-[#D97757] hover:underline">
            Upgrade to add more
          </a>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </section>
  )
}
