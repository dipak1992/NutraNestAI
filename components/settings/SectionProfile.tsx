'use client'

import { useState } from 'react'
import { User, Loader2 } from 'lucide-react'

type Props = {
  profile: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

export function SectionProfile({ profile }: Props) {
  const [name, setName] = useState(profile.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-white">
        <User className="h-4 w-4 text-[#D97757]" />
        Profile
      </h2>

      <div className="space-y-4">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D97757]/20 text-2xl">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{profile.email}</p>
            <p className="text-xs text-white/40">Avatar managed via your auth provider</p>
          </div>
        </div>

        {/* Name field */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#D97757]/60 focus:ring-1 focus:ring-[#D97757]/40"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-[#D97757] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4694a] disabled:opacity-60"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </section>
  )
}
