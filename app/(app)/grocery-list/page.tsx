'use client'

import { useState, useMemo } from 'react'
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data'
import { GROCERY_CATEGORY_ICONS } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCheck, RotateCcw } from 'lucide-react'
import type { GroceryItem } from '@/types'

const groceryList = DEMO_WEEKLY_PLAN.grocery_list

export default function GroceryListPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const groupedItems = useMemo(() => {
    const map = new Map<string, GroceryItem[]>()
    for (const item of groceryList?.items ?? []) {
      const cat = item.category ?? 'Other'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [])

  const total = groceryList?.items?.length ?? 0
  const checkedCount = checked.size

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function checkAll() {
    setChecked(new Set(groceryList?.items?.map((i) => i.id) ?? []))
  }

  function uncheckAll() {
    setChecked(new Set())
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-primary" />
            Grocery List
          </h1>
          <p className="text-muted-foreground mt-1">
            Week of {groceryList?.week_start ?? 'this week'} · {total} items
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Badge className="bg-primary/10 text-primary border-0 px-3 py-1.5 text-sm font-medium">
            {checkedCount}/{total}
          </Badge>
          {checkedCount < total ? (
            <Button variant="outline" size="sm" onClick={checkAll} className="gap-1.5">
              <CheckCheck className="h-4 w-4" />Check all
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={uncheckAll} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />Reset
            </Button>
          )}
        </div>
      </div>

      {checkedCount === total && total > 0 && (
        <div className="mb-6 glass-card rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-emerald-700 font-medium">
          All items collected — you&apos;re ready to cook! 🛒
        </div>
      )}

      <div className="space-y-6">
        {groupedItems.map(([category, items]) => {
          const icon = GROCERY_CATEGORY_ICONS[category] ?? '🛒'
          const allCatChecked = items.every((i) => checked.has(i.id))
          return (
            <div key={category} className="glass-card rounded-xl border border-border/60 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-muted/30 border-b border-border/40">
                <span className="text-lg">{icon}</span>
                <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{category}</h2>
                <span className="ml-auto text-xs text-muted-foreground">{items.filter((i) => checked.has(i.id)).length}/{items.length}</span>
                {!allCatChecked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() => setChecked((prev) => { const next = new Set(prev); items.forEach((i) => next.add(i.id)); return next })}
                  >
                    Check all
                  </Button>
                )}
              </div>
              <ul className="divide-y divide-border/30">
                {items.map((item) => {
                  const isChecked = checked.has(item.id)
                  return (
                    <li key={item.id} className={`flex items-center gap-3 px-5 py-3 transition-colors ${isChecked ? 'bg-muted/20' : 'hover:bg-muted/10'}`}>
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggle(item.id)}
                      />
                      <label
                        htmlFor={item.id}
                        className={`flex-1 text-sm cursor-pointer flex items-center gap-2 ${isChecked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        <span className="font-medium">{item.name}</span>
                        {(item.amount || item.unit) && (
                          <span className="text-muted-foreground text-xs">
                            · {item.amount} {item.unit}
                          </span>
                        )}
                      </label>
                      {item.for_members && item.for_members.length > 0 && (
                        <div className="flex gap-1">
                          {item.for_members.map((m, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{m}</span>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {groupedItems.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No grocery items yet. Generate a meal plan to get your list.</p>
        </div>
      )}
    </div>
  )
}
