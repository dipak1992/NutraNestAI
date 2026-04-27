import { Check, X } from 'lucide-react'

// ─── Feature comparison rows ──────────────────────────────────────────────────

type Row = {
  feature: string
  free: boolean | string
  plus: boolean | string
}

const ROWS: Row[] = [
  { feature: 'Tonight suggestions',        free: true,          plus: true },
  { feature: 'Fridge scans',               free: '3 / week',    plus: 'Unlimited' },
  { feature: 'Menu scans',                 free: '3 / month',   plus: 'Unlimited' },
  { feature: 'Leftovers AI',               free: 'Limited',     plus: 'Unlimited' },
  { feature: 'Weekly Autopilot',           free: false,         plus: true },
  { feature: 'Budget Intelligence',        free: false,         plus: true },
  { feature: 'Grocery list export',        free: false,         plus: true },
  { feature: 'Household members',          free: '1',           plus: 'Up to 6' },
  { feature: 'Shared meal plans',          free: false,         plus: true },
  { feature: 'Kid-friendly suggestions',   free: false,         plus: true },
  { feature: 'Priority support',           free: false,         plus: false },
]

// ─── Cell ─────────────────────────────────────────────────────────────────────

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm text-white/80">{value}</span>
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-[#D97757]" />
  ) : (
    <X className="mx-auto h-4 w-4 text-white/20" />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PricingCompare() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">
              Feature
            </th>
            {(['Free', 'Plus'] as const).map((name) => (
              <th
                key={name}
                className={[
                  'px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider',
                  name === 'Plus' ? 'text-[#D97757]' : 'text-white/60',
                ].join(' ')}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr
              key={row.feature}
              className={[
                'border-b border-white/5',
                i % 2 === 0 ? 'bg-white/[0.02]' : '',
              ].join(' ')}
            >
              <td className="py-3 pr-4 text-white/70">{row.feature}</td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.free} />
              </td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.plus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
