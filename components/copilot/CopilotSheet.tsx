'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion'
import { X, Send, ArrowRight, Lightbulb, Check, Ban } from 'lucide-react'
import { useCopilotStore, type CopilotScreen, type CopilotChip, type CopilotMessage, type CopilotNudge } from '@/stores/copilotStore'
import { generateChips } from '@/lib/copilot/chips'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { useLeftoversStore } from '@/stores/leftoversStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { FREE_COPILOT_DAILY_ASSISTS, getFreeCopilotUpgradeMessage, isPlusOnlyCopilotChip } from '@/lib/copilot/access'
import { VoiceInput } from './VoiceInput'

// ── Helpers ─────────────────────────────────────────────────────────────────

function pathnameToScreen(pathname: string): CopilotScreen {
  if (pathname.startsWith('/dashboard/tonight')) return 'tonight'
  if (pathname.startsWith('/dashboard/cook')) return 'cook'
  if (pathname === '/dashboard' || pathname === '/dashboard/' || pathname.startsWith('/planner')) return 'plan'
  if (pathname.startsWith('/leftovers')) return 'leftovers'
  if (pathname.startsWith('/budget')) return 'budget'
  if (pathname.startsWith('/grocery')) return 'grocery'
  return 'home'
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning! ☀️'
  if (hour < 17) return 'Good afternoon! 🌤️'
  return 'Good evening! 🌙'
}

function triggerToMessage(chip: CopilotChip): string {
  const params = chip.action.type === 'trigger' ? chip.action.params : undefined
  switch (chip.action.type === 'trigger' ? chip.action.feature : '') {
    case 'tonight-swap':
      return `Swap tonight's meal for something ${String(params?.mode ?? 'better')}.`
    case 'pantry-match':
      return 'What can I cook from my pantry?'
    case 'autopilot':
      return 'Generate my weekly plan.'
    case 'plan-swap':
      return 'Help me swap a meal this week.'
    case 'leftover-suggest':
      return 'Use my leftovers for dinner tonight.'
    case 'budget-swap':
      return 'Find cheaper swaps for my plan.'
    case 'budget-filter':
      return 'Show me budget-friendly meals only.'
    default:
      return chip.label
  }
}

// ── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onActionClick,
}: {
  message: CopilotMessage
  onActionClick: (href: string) => void
}) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-[#D97757] text-white'
            : 'rounded-bl-sm bg-neutral-100 text-neutral-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Navigate action button */}
        {!isUser && message.action?.type === 'navigate' && (
          <button
            onClick={() => onActionClick((message.action as { type: 'navigate'; href: string }).href)}
            className="mt-2 flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-[#D97757] shadow-sm transition-all hover:shadow-md active:scale-[0.97]"
          >
            <span>Take me there</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Typing Indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex justify-start mb-2">
      <div className="rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-neutral-400"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function NudgeCard({
  nudge,
  onAccept,
  onDismiss,
}: {
  nudge: CopilotNudge
  onAccept: (nudge: CopilotNudge) => void
  onDismiss: () => void
}) {
  return (
    <div className="mb-3 rounded-2xl border border-[#D97757]/20 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D97757]/10 text-[#D97757]">
          <Lightbulb size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-900">{nudge.title}</p>
          <p className="mt-0.5 text-sm text-neutral-600">{nudge.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => onAccept(nudge)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D97757] px-3 py-1.5 text-xs font-semibold text-white transition-transform active:scale-[0.97]"
            >
              <Check size={13} />
              {nudge.ctaLabel}
            </button>
            <button
              onClick={onDismiss}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
            >
              <Ban size={13} />
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function CopilotSheet({ isPlus }: { isPlus: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    state,
    open,
    close,
    setScreen,
    setChips,
    chips,
    messages,
    isStreaming,
    sendMessage,
    addMessage,
    activeNudge,
    setActiveNudge,
    acceptNudge,
    dismissNudge,
  } = useCopilotStore()
  const dragControls = useDragControls()

  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Detect screen from pathname
  const currentScreen = useMemo(() => pathnameToScreen(pathname), [pathname])

  // Get user context from stores
  const weeklyPlan = useWeeklyPlanStore((s) => s.plan)
  const hasWeeklyPlan = weeklyPlan?.days?.some((d) => d.meal) ?? false
  const groceryList = useWeeklyPlanStore((s) => s.groceryList)
  const leftovers = useLeftoversStore((s) => s.leftovers)
  const budgetRemaining = useBudgetStore((s) => {
    if (!s.settings.weeklyLimit) return null
    return s.settings.weeklyLimit - s.weekSpent - s.weekEstimated
  })
  const hasPantryItems = groceryList?.items?.some((item) => item.isInPantry) ?? false
  const hasLeftovers = leftovers.some((leftover) => leftover.status === 'active')

  // Update screen + chips when pathname changes
  useEffect(() => {
    setScreen(currentScreen)
    const hour = new Date().getHours()
    const newChips = generateChips({
      screen: currentScreen,
      hour,
      hasPantryItems,
      hasWeeklyPlan,
      hasLeftovers,
      budgetRemaining,
    })
    setChips(newChips)
  }, [currentScreen, hasPantryItems, hasWeeklyPlan, hasLeftovers, budgetRemaining, setScreen, setChips])

  useEffect(() => {
    if (!isPlus) {
      setActiveNudge(null)
      return
    }
    let ignore = false
    fetch(`/api/copilot/nudges?screen=${encodeURIComponent(currentScreen)}`)
      .then((res) => res.ok ? res.json() : { nudges: [] })
      .then((data: { nudges?: CopilotNudge[] }) => {
        if (ignore) return
        setActiveNudge(data.nudges?.[0] ?? null)
      })
      .catch(() => undefined)
    return () => {
      ignore = true
    }
  }, [currentScreen, isPlus, setActiveNudge])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (state === 'expanded') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming, state])

  // Focus input when expanded
  useEffect(() => {
    if (state === 'expanded') {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [state])

  // Handle chip tap
  const handleChipTap = useCallback((chip: CopilotChip) => {
    if (chip.action.type === 'navigate') {
      router.push(chip.action.href)
      close()
    } else if (chip.action.type === 'trigger') {
      open()
      if (!isPlus && isPlusOnlyCopilotChip(chip)) {
        addMessage({
          role: 'assistant',
          content: getFreeCopilotUpgradeMessage(triggerToMessage(chip)) ?? 'That Copilot action is included in Plus. Free Copilot can help with basic dinner and leftover questions; Plus unlocks plan refinements, budget swaps, grocery actions, voice, memory, and proactive nudges.',
          action: { type: 'navigate', href: '/upgrade?feature=copilot' },
        })
        return
      }
      sendMessage(triggerToMessage(chip), currentScreen)
    } else if (chip.action.type === 'message') {
      // Phase 2: send as a message
      open()
      sendMessage(chip.action.text, currentScreen)
    }
  }, [router, open, close, isPlus, addMessage, sendMessage, currentScreen])

  const handleNudgeAccept = useCallback(async (nudge: CopilotNudge) => {
    await acceptNudge()
    if (nudge.action.type === 'navigate') {
      router.push(nudge.action.href)
      close()
    } else if (nudge.action.type === 'message') {
      sendMessage(nudge.action.text, currentScreen)
    } else {
      close()
    }
  }, [acceptNudge, router, close, sendMessage, currentScreen])

  // Handle action button in message
  const handleActionClick = useCallback((href: string) => {
    router.push(href)
    close()
  }, [router, close])

  // Handle send
  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || isStreaming) return
    const freeUpgradeMessage = !isPlus ? getFreeCopilotUpgradeMessage(text) : null
    setInputText('')
    if (freeUpgradeMessage) {
      addMessage({ role: 'user', content: text })
      addMessage({
        role: 'assistant',
        content: freeUpgradeMessage,
        action: { type: 'navigate', href: '/upgrade?feature=copilot' },
      })
      return
    }
    sendMessage(text, currentScreen)
  }, [inputText, isStreaming, isPlus, addMessage, sendMessage, currentScreen])

  // Handle keyboard submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((text: string) => {
    if (!isPlus) {
      addMessage({
        role: 'assistant',
        content: 'Voice Copilot is included in Plus for hands-busy cooking. Free Copilot still includes basic typed meal assists.',
        action: { type: 'navigate', href: '/upgrade?feature=copilot' },
      })
      return
    }
    sendMessage(text, currentScreen)
  }, [isPlus, addMessage, sendMessage, currentScreen])

  // Handle drag end
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) {
      close()
    }
  }, [close])

  const hour = new Date().getHours()
  const isVisible = state === 'peek' || state === 'expanded'
  const hasMessages = messages.length > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          {state === 'expanded' && (
            <motion.div
              key="copilot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
              onClick={close}
            />
          )}

          {/* Sheet */}
          <motion.div
            key="copilot-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed inset-x-0 bottom-0 z-[95] flex flex-col rounded-t-3xl border-t border-neutral-200 bg-[#FFFBF7] shadow-2xl ${
              state === 'expanded' ? 'max-h-[75vh]' : ''
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-neutral-300" />
            </div>

            {/* Header (expanded only) */}
            {state === 'expanded' && (
              <div className="shrink-0 px-5 pb-3 flex items-center justify-between">
                <p className="text-base font-semibold text-neutral-800">
                  {getGreeting(hour)}
                </p>
                {!isPlus && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-500 shadow-sm">
                    {FREE_COPILOT_DAILY_ASSISTS}/day free
                  </span>
                )}
                <button
                  onClick={close}
                  className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
                  aria-label="Close copilot"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Chips row (always visible) */}
            <div className="shrink-0 px-5">
              {activeNudge && (
                <NudgeCard
                  nudge={activeNudge}
                  onAccept={handleNudgeAccept}
                  onDismiss={dismissNudge}
                />
              )}
              <div
                className={
                  state === 'expanded'
                    ? 'flex flex-wrap gap-2 pb-3'
                    : 'flex gap-2 overflow-x-auto pb-3 scrollbar-none'
                }
              >
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipTap(chip)}
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-[#D97757]/20 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-[#D97757]/40 hover:shadow-md active:scale-[0.97]"
                  >
                    {chip.icon && <span className="text-base">{chip.icon}</span>}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages (expanded only) */}
            {state === 'expanded' && (
              <>
                {/* Message list */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-1">
                  {!hasMessages && !isStreaming && (
                    <p className="py-4 text-center text-sm text-neutral-400">
                      Ask MealEase anything about dinner, planning, or groceries 🍽️
                    </p>
                  )}

                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onActionClick={handleActionClick}
                    />
                  ))}

                  {/* Typing indicator — only show when streaming and last message is user */}
                  {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                    <TypingDots />
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="shrink-0 border-t border-neutral-100 px-4 py-3">
                  <div className="flex items-end gap-2">
                    {/* Voice input */}
                    <VoiceInput
                      onTranscript={handleVoiceTranscript}
                      disabled={isStreaming || !isPlus}
                      locked={!isPlus}
                    />

                    {/* Text input */}
                    <div className="relative flex-1">
                      <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask MealEase…"
                        rows={1}
                        disabled={isStreaming}
                        className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 pr-12 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-colors focus:border-[#D97757]/40 focus:ring-2 focus:ring-[#D97757]/10 disabled:opacity-50"
                        style={{ maxHeight: '120px', overflowY: 'auto' }}
                      />
                    </div>

                    {/* Send button */}
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || isStreaming}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D97757] text-white shadow-sm transition-all hover:bg-[#c96847] active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Send message"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}

      {/* Bounce keyframes */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </AnimatePresence>
  )
}
