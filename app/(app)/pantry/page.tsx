'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { Package, Plus, Trash2, Search } from 'lucide-react'
import { GROCERY_CATEGORY_ICONS } from '@/lib/utils'

interface PantryItem {
  id: string
  name: string
  amount: string
  unit: string
  category: string
  expires?: string
}

const CATEGORIES = ['Grains & Pasta', 'Canned Goods', 'Spices & Seasonings', 'Oils & Condiments', 'Snacks', 'Other']

export default function PantryPage() {
  const { status, loading } = usePaywallStatus()
  const [items, setItems] = useState<PantryItem[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', unit: '', category: 'Other', expires: '' })

  useEffect(() => {
    if (loading || !status.isPro) return
    fetch('/api/pantry')
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setItems(
            (json.data as { id: string; name: string; quantity: number; unit: string; category: string; expires_at: string | null }[]).map((row) => ({
              id: row.id,
              name: row.name,
              amount: String(row.quantity),
              unit: row.unit,
              category: row.category,
              expires: row.expires_at ?? undefined,
            }))
          )
        }
      })
      .finally(() => setFetchLoading(false))
  }, [loading, status.isPro])

  if (loading || (status.isPro && fetchLoading)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <span className="animate-pulse">Loading pantry…</span>
        </div>
      </div>
    )
  }

  if (!status.isPro) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProPaywallCard
          title="Pantry tracking is a Pro feature"
          description="Track what you already have, cut waste, and let MealEase prioritize pantry ingredients automatically with Pro."
          isAuthenticated={status.isAuthenticated}
          redirectPath="/pantry"
        />
      </div>
    )
  }

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  const grouped = filtered.reduce<Record<string, PantryItem[]>>((acc, item) => {
    const cat = item.category ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  async function addItem() {
    if (!form.name.trim()) return
    const res = await fetch('/api/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        category: form.category,
        quantity: form.amount ? parseFloat(form.amount) : 1,
        unit: form.unit || 'unit',
        expires_at: form.expires || undefined,
      }),
    })
    const json = await res.json()
    if (json.data) {
      const row = json.data as { id: string; name: string; quantity: number; unit: string; category: string; expires_at: string | null }
      setItems((prev) => [...prev, { id: row.id, name: row.name, amount: String(row.quantity), unit: row.unit, category: row.category, expires: row.expires_at ?? undefined }])
    }
    setForm({ name: '', amount: '', unit: '', category: 'Other', expires: '' })
    setShowAdd(false)
  }

  async function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await fetch(`/api/pantry?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  }

  function isExpiringSoon(expires?: string) {
    if (!expires) return false
    const days = (new Date(expires).getTime() - Date.now()) / 86400000
    return days <= 7
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-7 w-7 text-primary" />
            Pantry
          </h1>
          <p className="text-muted-foreground mt-1">{items.length} items stocked</p>
        </div>
        <Button onClick={() => setShowAdd((v) => !v)} className="gap-2 flex-shrink-0">
          <Plus className="h-4 w-4" />{showAdd ? 'Cancel' : 'Add Item'}
        </Button>
      </div>

      {showAdd && (
        <div className="glass-card rounded-xl border border-border/60 p-5 mb-6 space-y-4">
          <h2 className="font-semibold">New Pantry Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Item name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <div className="flex gap-2">
              <Input placeholder="Amount" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-24" />
              <Input placeholder="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className="w-24" />
            </div>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Expiry (optional)" value={form.expires} onChange={(e) => setForm((f) => ({ ...f, expires: e.target.value }))} />
          </div>
          <Button onClick={addItem} disabled={!form.name.trim()}>Add to Pantry</Button>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search pantry..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, catItems]) => (
          <div key={category} className="glass-card rounded-xl border border-border/60 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-muted/30 border-b border-border/40">
              <span className="text-lg">{GROCERY_CATEGORY_ICONS[category] ?? '📦'}</span>
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{category}</h2>
              <span className="ml-auto text-xs text-muted-foreground">{catItems.length} items</span>
            </div>
            <ul className="divide-y divide-border/30">
              {catItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/10 transition-colors">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{item.name}</span>
                    {(item.amount || item.unit) && (
                      <span className="text-xs text-muted-foreground ml-2">{item.amount} {item.unit}</span>
                    )}
                  </div>
                  {item.expires && (
                    <Badge className={`text-xs border-0 ${isExpiringSoon(item.expires) ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'}`}>
                      {isExpiringSoon(item.expires) ? '⚠️ ' : ''}Exp {new Date(item.expires).toLocaleDateString()}
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{search ? 'No items match your search.' : 'Your pantry is empty. Add items to get started.'}</p>
        </div>
      )}
    </div>
  )
}
