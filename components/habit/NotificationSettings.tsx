'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const HOUR_OPTIONS = [
  { label: '4:00 PM', value: 16 },
  { label: '5:00 PM', value: 17 },
  { label: '6:00 PM', value: 18 },
  { label: '7:00 PM', value: 19 },
]

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(false)
  const [preferredHour, setPreferredHour] = useState(17)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/habit/notifications')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setEnabled(data.enabled ?? false)
          setPreferredHour(data.preferred_hour ?? 17)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function save(nextEnabled: boolean, nextHour: number) {
    setSaving(true)
    try {
      await fetch('/api/habit/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled, preferred_hour: nextHour }),
      })
    } catch {
      // silent — best effort
    } finally {
      setSaving(false)
    }
  }

  function handleToggle(checked: boolean) {
    setEnabled(checked)
    save(checked, preferredHour)
  }

  function handleHourChange(hour: number) {
    setPreferredHour(hour)
    save(enabled, hour)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 py-2">
      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
        <div>
          <Label className="text-base font-semibold">Dinner reminders</Label>
          <p className="text-sm text-muted-foreground mt-0.5">
            Get a nudge to plan tonight&apos;s meal
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={saving}
          />
        </div>
      </div>

      {/* Time picker (only visible when enabled) */}
      {enabled && (
        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <Label className="text-base font-semibold block mb-3">Reminder time</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {HOUR_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleHourChange(value)}
                disabled={saving}
                className={[
                  'rounded-xl py-2.5 text-sm font-medium border transition-colors',
                  preferredHour === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground hover:bg-muted/60',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Note: push notification support requires a native app. This preference is saved for future use.
          </p>
        </div>
      )}
    </div>
  )
}
