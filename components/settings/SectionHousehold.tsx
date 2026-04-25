'use client'

import { useState } from 'react'
import { Users, Loader2, Minus, Plus } from 'lucide-react'

type Props = {
  household: {
    adults_count: number
    kids_count: number
    toddlers_count: number
    babies_count: number
    budget_level: string
  }
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
          disabled={value <= 0}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-white tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(10, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function SectionHousehold({ household: initial }: Props) {
  const [adults,   setAdults]   = useState(initial.adults_count)
  const [kids,     setKids]     = useState(initial.kids_count)
  const [toddlers, setToddlers] = useState(initial.toddlers_count)
  const [babies,   setBabies]   = useState(initial.babies_count)
  const [budget,   setBudget]   = useState(initial.budget_level)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household: { adults_count: adults, kids_count: kids, toddlers_count: toddlers, babies_count: babies, budget_level: budget },
        }),
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
        <Users className="h-4 w-4 text-[#D97757]" />
        Household
      </h2>

      <div className="mb-5 space-y-2">
        <Counter label="Adults"   value={adults}   onChange={setAdults} />
        <Counter label="Kids"     value={kids}     onChange={setKids} />
        <Counter label="Toddlers" value={toddlers} onChange={setToddlers} />
        <Counter label="Babies"   value={babies}   onChange={setBabies} />
      </div>

      {/* Budget */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium text-white/50">Weekly grocery budget</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBudget(b)}
              className={[
                'rounded-2xl border py-2.5 text-sm font-medium capitalize transition',
                budget === b ? 'border-[#B8935A] bg-[#B8935A]/15 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10',
              ].join(' ')}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 rounded-2xl bg-[#D97757] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4694a] disabled:opacity-60">
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {saved ? '✓ Saved' : 'Save changes'}
      </button>
    </section>
  )
}
