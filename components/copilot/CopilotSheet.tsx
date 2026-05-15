'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion'
import { X, Send, ArrowRight } from 'lucide-react'
import { useCopilotStore, type CopilotScreen, type CopilotChip, type CopilotMessage } from '@/stores/copilotStore'
import { generateChips } from '@/lib/copilot/chips'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { VoiceInput } from './VoiceInput'

// ── Helpers ─────────────────────────────────────────────────────────────────

function pathnameToScreen(pathname: string): CopilotScreen {
  if (pathname.startsWith('/dashboard/tonight')) return 'tonight'
  if (pathname.startsWith('/dashboard/cook')) return 'cook'
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'plan'
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

// ── Component ────────────────────────────────────────────────────────────────

export function CopilotSheet() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    state,
    close,
    setScreen,
    setChips,
    chips,
    screen,
    messages,
    isStreaming,
    sendMessage,
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

  // Update screen + chips when pathname changes
  useEffect(() => {
    setScreen(currentScreen)
    const hour = new Date().getHours()
    const newChips = generateChips({
      screen: currentScreen,
      hour,
      hasPantryItems: false, // TODO: wire to pantry store
      hasWeeklyPlan,
      hasLeftovers: false, // TODO: wire to leftovers store
      budgetRemaining: null, // TODO: wire to budget store
    })
    setChips(newChips)
  }, [currentScreen, hasWeeklyPlan, setScreen, setChips])

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
      close()
    } else if (chip.action.type === 'message') {
      // Phase 2: send as a message
      sendMessage(chip.action.text, currentScreen)
    }
  }, [router, close, sendMessage, currentScreen])

  // Handle action button in message
  const handleActionClick = useCallback((href: string) => {
    router.push(href)
    close()
  }, [router, close])

  // Handle send
  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || isStreaming) return
    setInputText('')
    sendMessage(text, currentScreen)
  }, [inputText, isStreaming, sendMessage, currentScreen])

  // Handle keyboard submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((text: string) => {
    sendMessage(text, currentScreen)
  }, [sendMessage, currentScreen])

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
                      disabled={isStreaming}
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
