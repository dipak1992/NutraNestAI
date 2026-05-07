'use client'

import { useState, type ComponentType } from 'react'
import { Camera } from 'lucide-react'
import { useScanStore } from '@/stores/scanStore'

export function LandingScanDemoButton() {
  const openDemo = useScanStore((state) => state.openDemo)
  const [ScanModal, setScanModal] = useState<ComponentType | null>(null)

  const handleClick = async () => {
    if (!ScanModal) {
      const mod = await import('@/components/scan/ScanModal')
      setScanModal(() => mod.ScanModal)
    }
    openDemo()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-[48px] w-[88%] items-center justify-center gap-2 rounded-full border border-[#D97757]/30 bg-white/82 px-6 text-base font-semibold text-[#B75F40] shadow-sm backdrop-blur transition hover:bg-orange-50 sm:w-auto"
      >
        <Camera className="h-4 w-4" />
        Try the scanner
      </button>
      {ScanModal ? <ScanModal /> : null}
    </>
  )
}
