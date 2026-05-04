'use client'

import { Camera } from 'lucide-react'
import { ScanModal } from '@/components/scan/ScanModal'
import { useScanStore } from '@/stores/scanStore'

export function LandingScanDemoButton() {
  const openDemo = useScanStore((state) => state.openDemo)

  return (
    <>
      <button
        type="button"
        onClick={() => openDemo()}
        className="inline-flex min-h-[48px] w-[88%] items-center justify-center gap-2 rounded-full border border-[#D97757]/30 bg-white/82 px-6 text-base font-semibold text-[#B75F40] shadow-sm backdrop-blur transition hover:bg-orange-50 sm:w-auto"
      >
        <Camera className="h-4 w-4" />
        Try the scanner
      </button>
      <ScanModal />
    </>
  )
}
