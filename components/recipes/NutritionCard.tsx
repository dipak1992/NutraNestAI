import { Activity } from 'lucide-react'

type NutritionData = {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sodium?: number
}

type Props = {
  nutrition: NutritionData
  perServing?: boolean
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function NutritionCard({ nutrition, perServing = true }: Props) {
  const items = [
    { label: 'Calories',  value: nutrition.calories, unit: 'kcal', max: 800,  color: '#D97757' },
    { label: 'Protein',   value: nutrition.protein,  unit: 'g',    max: 60,   color: '#B8935A' },
    { label: 'Carbs',     value: nutrition.carbs,    unit: 'g',    max: 100,  color: '#6B9E78' },
    { label: 'Fat',       value: nutrition.fat,      unit: 'g',    max: 50,   color: '#8B7EC8' },
    { label: 'Fiber',     value: nutrition.fiber,    unit: 'g',    max: 30,   color: '#5BA4A4' },
  ].filter((i) => i.value !== undefined)

  if (items.length === 0) return null

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
        <Activity className="h-4 w-4 text-[#D97757]" />
        Nutrition
        {perServing && <span className="text-xs font-normal text-white/40">per serving</span>}
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-white/60">{item.label}</span>
              <span className="text-xs font-medium text-white/80">
                {item.value}{item.unit}
              </span>
            </div>
            <Bar value={item.value!} max={item.max} color={item.color} />
          </div>
        ))}
      </div>
    </div>
  )
}
