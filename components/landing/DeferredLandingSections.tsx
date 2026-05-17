'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const LandingSectionsClient = dynamic(
  () => import('./LandingSectionsClient').then((mod) => mod.LandingSectionsClient),
  {
    ssr: false,
    loading: () => <LandingSectionsFallback />,
  },
)

export function DeferredLandingSections() {
  const [canLoad, setCanLoad] = useState(false)

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setCanLoad(true), { timeout: 900 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = globalThis.setTimeout(() => setCanLoad(true), 250)
    return () => globalThis.clearTimeout(timeoutId)
  }, [])

  if (!canLoad) return <LandingSectionsFallback />

  return <LandingSectionsClient />
}

function LandingSectionsFallback() {
  return (
    <section className="bg-white py-10 dark:bg-neutral-950 md:py-12" aria-hidden>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="h-24 rounded-[1.75rem] bg-[#FDF6F1] ring-1 ring-orange-100 dark:bg-neutral-900 dark:ring-neutral-800" />
      </div>
    </section>
  )
}
