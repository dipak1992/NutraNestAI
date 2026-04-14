'use client'

import { useMemo } from 'react'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { CATEGORY_ORDER, GROCERY_ICONS, WALMART_AISLES } from '@/lib/planner/types'
import type { GroceryLine, StoreFormat } from '@/lib/planner/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ShoppingCart,
  CheckCheck,
  RotateCcw,
  Leaf,
  Store,
  Package,
  Info,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ── Store format tab ──────────────────────────────────────────

const FORMAT_OPTIONS: Array<{ value: StoreFormat; label: string; icon: string }> = [
  { value: 'standard', label: 'Standard', icon: '🛒' },
  { value: 'walmart', label: 'Walmart', icon: '🏪' },
  { value: 'costco', label: 'Costco', icon: '📦' },
]

// ── Per-item row ──────────────────────────────────────────────

function GroceryItemRow({
  item,
  onToggleChecked,
  onTogglePantry,
}: {
  item: GroceryLine
  onToggleChecked: (id: string) => void
  onTogglePantry: (id: string) => void
}) {
  const qty = item.quantity % 1 === 0 ? String(item.quantity) : item.quantity.toFixed(2)

  return (
    <div
      className={cn(
        'flex items-start gap-3 py-2 px-1 rounded-lg transition-colors group',
        item.isChecked && 'opacity-50',
        item.isInPantry && 'bg-emerald-50/50',
      )}
    >
      {/* Checkbox */}
      <Checkbox
        id={item.id}
        checked={item.isChecked}
        onCheckedChange={() => onToggleChecked(item.id)}
        className="mt-0.5 flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={item.id}
          className={cn(
            'text-sm font-medium cursor-pointer leading-snug flex items-center gap-1.5 flex-wrap',
            item.isChecked && 'line-through text-muted-foreground',
          )}
        >
          <span>{item.name}</span>

          {/* Pantry badge */}
          {item.isInPantry && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-emerald-700 border-emerald-300 bg-emerald-50">
              <Leaf className="h-2.5 w-2.5 mr-0.5" />pantry
            </Badge>
          )}

          {/* Cart integration placeholder (future) */}
          {/* <Button variant="ghost" size="sm">Add to Cart</Button> */}
        </label>

        {/* Quantity + unit */}
        <p className="text-xs text-muted-foreground mt-0.5">
          {qty} {item.unit}
          {item.walmartAisle && (
            <span className="ml-2 text-blue-600">{item.walmartAisle}</span>
          )}
          {item.costcoBulkNote && (
            <span className="ml-2 text-orange-600">{item.costcoBulkNote}</span>
          )}
        </p>

        {/* From meals tooltip */}
        {item.fromMeals.length > 0 && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
            For: {item.fromMeals.join(', ')}
          </p>
        )}
      </div>

      {/* Cost */}
      {item.estimatedCost > 0 && (
        <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">
          ~${item.estimatedCost.toFixed(2)}
        </span>
      )}

      {/* Pantry toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onTogglePantry(item.id)}
              className={cn(
                'flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md',
                item.isInPantry
                  ? 'text-emerald-600 opacity-100'
                  : 'text-muted-foreground hover:text-emerald-600',
              )}
            >
              <Leaf className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {item.isInPantry ? 'Remove from pantry' : 'Mark as in pantry'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// ── Category section ──────────────────────────────────────────

function CategorySection({
  category,
  items,
  onCheckAll,
  onToggleChecked,
  onTogglePantry,
}: {
  category: string
  items: GroceryLine[]
  onCheckAll: (cat: string) => void
  onToggleChecked: (id: string) => void
  onTogglePantry: (id: string) => void
}) {
  const icon = GROCERY_ICONS[category] ?? '🛒'
  const allChecked = items.every((i) => i.isChecked)
  const checkedCount = items.filter((i) => i.isChecked).length
  const pantryCount = items.filter((i) => i.isInPantry).length

  return (
    <div className="space-y-0.5">
      {/* Category header */}
      <div className="flex items-center justify-between py-1.5 border-b border-border/50 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-semibold text-sm capitalize">{category}</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
            {checkedCount}/{items.length}
          </Badge>
          {pantryCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-emerald-700 border-emerald-300">
              {pantryCount} in pantry
            </Badge>
          )}
        </div>
        {!allChecked && (
          <button
            type="button"
            onClick={() => onCheckAll(category)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            check all
          </button>
        )}
      </div>

      {items.map((item) => (
        <GroceryItemRow
          key={item.id}
          item={item}
          onToggleChecked={onToggleChecked}
          onTogglePantry={onTogglePantry}
        />
      ))}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────

export function GroceryListPanel() {
  const {
    groceryList,
    storeFormat,
    setStoreFormat,
    togglePantryItem,
    toggleChecked,
    checkAllInCategory,
    uncheckAll,
    clearGrocery,
  } = useWeeklyPlanStore()

  // Group items by category, sorted by CATEGORY_ORDER
  const grouped = useMemo(() => {
    if (!groceryList) return []
    const map = new Map<string, GroceryLine[]>()
    for (const item of groceryList.items) {
      if (!map.has(item.category)) map.set(item.category, [])
      map.get(item.category)!.push(item)
    }
    return CATEGORY_ORDER
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, items: map.get(cat)! }))
      .concat(
        Array.from(map.entries())
          .filter(([cat]) => !CATEGORY_ORDER.includes(cat))
          .map(([cat, items]) => ({ category: cat, items })),
      )
  }, [groceryList])

  if (!groceryList) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No grocery list yet</p>
        <p className="text-sm mt-1">Go to the planner and tap "Get everything for this week"</p>
      </div>
    )
  }

  const totalItems = groceryList.items.length
  const checkedCount = groceryList.items.filter((i) => i.isChecked).length
  const pantryItems = groceryList.items.filter((i) => i.isInPantry)
  const toBuyItems = groceryList.items.filter((i) => !i.isInPantry)
  const toBuyCost = toBuyItems.reduce((sum, i) => sum + (i.isChecked ? 0 : i.estimatedCost), 0)
  const pantryValue = pantryItems.reduce((sum, i) => sum + i.estimatedCost, 0)

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Grocery List</h2>
            <Badge className="bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs">
              {checkedCount}/{totalItems}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Week of {groceryList.weekStart} · {toBuyItems.length} items to buy
            {pantryItems.length > 0 && (
              <span className="text-emerald-700 ml-1">
                · {pantryItems.length} already in pantry
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={uncheckAll}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              groceryList.items.forEach((i) => {
                if (!i.isChecked) checkAllInCategory(i.category)
              })
            }
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            Check all
          </Button>
        </div>
      </div>

      {/* ── Store format picker ── */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-muted w-fit">
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStoreFormat(opt.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              storeFormat === opt.value
                ? 'bg-white shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* ── Store format hints ── */}
      {storeFormat === 'walmart' && (
        <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 rounded-xl px-3 py-2">
          <Store className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Items organized by <strong>Walmart aisle</strong>. Aisle labels shown next to each item.</span>
        </div>
      )}
      {storeFormat === 'costco' && (
        <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 rounded-xl px-3 py-2">
          <Package className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Quantities adjusted for <strong>Costco bulk sizes</strong>. Bulk notes shown next to each item.</span>
        </div>
      )}

      {/* ── Category sections ── */}
      <div className="space-y-6">
        {grouped.map(({ category, items }) => (
          <CategorySection
            key={category}
            category={category}
            items={items}
            onCheckAll={checkAllInCategory}
            onToggleChecked={toggleChecked}
            onTogglePantry={togglePantryItem}
          />
        ))}
      </div>

      {/* ── Footer cost summary ── */}
      <div className="border-t pt-4 mt-4 space-y-2">
        {pantryValue > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4" />
              Pantry savings
            </span>
            <span>-${pantryValue.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold">
          <span>Estimated total</span>
          <span>${toBuyCost > 0 ? toBuyCost.toFixed(2) : groceryList.totalEstimatedCost.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimates based on average grocery prices. Actual costs may vary.
        </p>

        {/* Future: Cart integration CTA */}
        <div className="mt-3 rounded-xl border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
          🛒 <strong>Cart integration coming soon</strong> — add items directly to Walmart or Instacart
        </div>

        {checkedCount === totalItems && totalItems > 0 && (
          <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-sm text-emerald-700 font-medium">
            🎉 You've got everything! Time to cook.
          </div>
        )}
      </div>
    </div>
  )
}
