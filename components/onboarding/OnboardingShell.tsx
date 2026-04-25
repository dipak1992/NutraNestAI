'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { STEPS } from '@/lib/onboarding/steps'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  canProceed: boolean
  ctaLabel?: string
  skippable?: boolean
  onNext?: () => void | Promise<void>
}

export function OnboardingShell({
  children,
  canProceed,
  ctaLabel = 'Continue',
  skippable = false,
  onNext,
}: Props) {
  const router = useRouter()
  const step = useOnboardingStore((s) => s.step)
  const next = useOnboardingStore((s) => s.next)
  const back = useOnboardingStore((s) => s.back)
  const isSubmitting = useOnboardingStore((s) => s.isSubmitting)

  const stepIndex = STEPS.findIndex((s) => s.id === step)
  const progress = ((stepIndex + 1) / STEPS.length) * 100
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEPS.length - 1

  // ESC to go back
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isFirst) back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFirst, back])

  async function handleNext() {
    if (onNext) await onNext()
    if (!isLast) next()
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between gap-3">
          <button
            onClick={() => (isFirst ? router.push('/') : back())}
            aria-label={isFirst ? 'Go home' : 'Previous step'}
            className="w-9 h-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100">
            MealEase
          </span>

          {skippable ? (
            <button
              onClick={() => next()}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 px-2 py-1"
            >
              Skip
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-full bg-[#D97757] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Step indicator (desktop) */}
      <div className="hidden sm:flex justify-center pt-6 pb-2">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                    i < stepIndex
                      ? 'bg-[#D97757] text-white'
                      : i === stepIndex
                      ? 'bg-[#D97757]/20 text-[#D97757] ring-2 ring-[#D97757]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400',
                  )}
                >
                  {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    i === stepIndex ? 'text-[#D97757]' : 'text-neutral-400',
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-px mb-4',
                    i < stepIndex ? 'bg-[#D97757]' : 'bg-neutral-200 dark:bg-neutral-700',
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">{children}</div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto max-w-lg flex items-center gap-3">
          {!isFirst && (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#C86646] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
          >
            {isSubmitting ? 'Saving…' : ctaLabel}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  )
}
