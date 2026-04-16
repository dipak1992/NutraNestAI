'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  if (!visible) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-4 bg-background/95 border-t border-border/60">
      <Button asChild className="w-full" size="lg">
        <Link href="/signup">Try MealEase free →</Link>
      </Button>
    </div>
  )
}
