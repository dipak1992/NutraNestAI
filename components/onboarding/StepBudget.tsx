'use client'

import { useOnboardingStore } from '@/stores/onboardingStore'
import { DollarSign } from 'lucide-react'

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: '$50 / week',  value: 50,  hint: 'Budget-friendly, smart swaps' },
  { label: '$100 / week', value: 100, hint: 'Balanced variety and quality' },
  { label: '$150 / week', value: 150, hint: 'More premium ingredients' },
  { label: '$200+ / week', value: 200, hint: 'No restrictions on quality' },
]

// ─── Step ─────────────────────────────────────────────────────────────────────

export default function StepBudget() {
  const { data, patch } = useOnboardingStore()
  const selected = data.weeklyBudget

  return (
    <div className="space-y-6">
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8935A]/20">
          <DollarSign className="h-8 w-8 text-[#B8935A]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly grocery budget</h2>
          <p className="mt-1 text-sm text-white/60">
            We'll optimise ingredient overlap to keep costs down.
          </p>
        </div>
      </div>

      {/* Preset cards */}
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((preset) => {
          const active = selected === preset.value
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => patch({ weeklyBudget: preset.value })}
              className={[
                'flex flex-col items-start rounded-2xl border px-4 py-4 text-left transition',
                active
                  ? 'border-[#B8935A] bg-[#B8935A]/15'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
              ].join(' ')}
            >
              <span
                className={[
                  'text-base font-bold',
                  active ? 'text-[#B8935A]' : 'text-white',
                ].join(' ')}
              >
                {preset.label}
              </span>
              <span className="mt-1 text-xs text-white/50">{preset.hint}</span>
            </button>
          )
        })}
      </div>

      {/* Custom amount */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/50">
          Or enter a custom amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
          <input
            type="number"
            min={10}
            max={2000}
            step={10}
            value={selected ?? ''}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              patch({ weeklyBudget: isNaN(v) ? null : v })
            }}
            placeholder="e.g. 120"
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-8 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#B8935A]/60 focus:ring-1 focus:ring-[#B8935A]/40"
          />
        </div>
      </div>

      {selected === null && (
        <p className="text-center text-xs text-white/40">
          Skip if you'd rather not set a budget.
        </p>
      )}
    </div>
  )
}
