'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Loader2, X, Mic,
} from 'lucide-react'
import Link from 'next/link'

type AudioSegment = {
  stepIndex: number
  stepOrder: number
  text: string
}

type AudioData = {
  audioUrl: string | null
  script: string
  segments: AudioSegment[]
  provider: 'openai-tts' | 'web-speech'
  cached: boolean
}

type Props = {
  recipeId: string
  isPlusMember: boolean
  activeStepIndex: number
  onStepChange?: (stepIndex: number) => void
}

export function RecipeAudioPlayer({
  recipeId,
  isPlusMember,
  activeStepIndex,
  onStepChange,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [audioData, setAudioData] = useState<AudioData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [webSpeechStep, setWebSpeechStep] = useState(0)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const loadAudio = useCallback(async () => {
    if (!isPlusMember) {
      setShowUpgrade(true)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/recipes/${recipeId}/audio`)
      if (res.status === 403) {
        setShowUpgrade(true)
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error('Failed to load audio')
      const data: AudioData = await res.json()
      setAudioData(data)
    } catch {
      setError('Could not load audio guide.')
    } finally {
      setLoading(false)
    }
  }, [recipeId, isPlusMember])

  // Sync audio element playback rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate
  }, [playbackRate])

  // Web Speech API narration
  const speakStep = useCallback((stepIdx: number, segments: AudioSegment[]) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const seg = segments[stepIdx]
    if (!seg) return
    const utt = new SpeechSynthesisUtterance(seg.text)
    utt.rate = playbackRate
    utt.onend = () => {
      const next = stepIdx + 1
      if (next < segments.length) {
        setWebSpeechStep(next)
        onStepChange?.(next)
        speakStep(next, segments)
      } else {
        setIsPlaying(false)
      }
    }
    synthRef.current = utt
    window.speechSynthesis.speak(utt)
  }, [playbackRate, onStepChange])

  function togglePlay() {
    if (!audioData) return

    if (audioData.provider === 'web-speech') {
      if (isPlaying) {
        window.speechSynthesis?.pause()
        setIsPlaying(false)
      } else {
        if (window.speechSynthesis?.paused) {
          window.speechSynthesis.resume()
        } else {
          speakStep(webSpeechStep, audioData.segments)
        }
        setIsPlaying(true)
      }
      return
    }

    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
    } else {
      el.play().catch(() => setIsPlaying(false))
    }
  }

  function skipBack() {
    if (!audioData) return
    if (audioData.provider === 'web-speech') {
      const prev = Math.max(0, webSpeechStep - 1)
      setWebSpeechStep(prev)
      onStepChange?.(prev)
      if (isPlaying) speakStep(prev, audioData.segments)
      return
    }
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 10)
  }

  function skipForward() {
    if (!audioData) return
    if (audioData.provider === 'web-speech') {
      const next = Math.min(audioData.segments.length - 1, webSpeechStep + 1)
      setWebSpeechStep(next)
      onStepChange?.(next)
      if (isPlaying) speakStep(next, audioData.segments)
      return
    }
    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 10)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Upgrade prompt
  if (showUpgrade) {
    return (
      <div className="rounded-2xl border border-[#D97757]/30 bg-[#D97757]/10 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#D97757]/20">
            <Volume2 className="h-4 w-4 text-[#D97757]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Audio guide — Plus feature</p>
            <p className="text-xs text-white/50 mt-0.5">
              Listen to step-by-step narration hands-free while you cook.
            </p>
            <Link
              href="/pricing"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#D97757] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#c4694a] transition-colors"
            >
              Upgrade to Plus
            </Link>
          </div>
          <button
            onClick={() => setShowUpgrade(false)}
            className="shrink-0 text-white/30 hover:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // Not yet loaded
  if (!audioData && !loading && !error) {
    return (
      <button
        type="button"
        onClick={loadAudio}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
      >
        <Volume2 className="h-4 w-4 text-[#D97757]" />
        Listen to recipe
        {isPlusMember && (
          <span className="ml-1 rounded-full bg-[#D97757]/20 px-2 py-0.5 text-xs text-[#D97757] font-semibold">
            Plus
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4" id="audio-player">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Mic className="h-4 w-4 text-[#D97757]" />
        <span className="text-sm font-semibold text-white">Audio Guide</span>
        {audioData?.provider === 'web-speech' && (
          <span className="text-xs text-white/40">(device voice)</span>
        )}
        {audioData?.cached && (
          <span className="text-xs text-white/40">(cached)</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing audio…
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Player controls */}
      {audioData && !loading && (
        <>
          {/* Hidden audio element for URL-based audio */}
          {audioData.audioUrl && (
            <audio
              ref={audioRef}
              src={audioData.audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          )}

          {/* Web speech step indicator */}
          {audioData.provider === 'web-speech' && (
            <p className="text-xs text-white/40 mb-3 truncate">
              {audioData.segments[webSpeechStep]?.text ?? ''}
            </p>
          )}

          {/* Seek bar (URL audio only) */}
          {audioData.audioUrl && duration > 0 && (
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (audioRef.current) audioRef.current.currentTime = val
                  setCurrentTime(val)
                }}
                className="w-full accent-[#D97757]"
                aria-label="Seek"
              />
              <div className="flex justify-between text-xs text-white/30 mt-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={skipBack}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={audioData.provider === 'web-speech' ? 'Previous step' : 'Rewind 10s'}
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D97757] text-white hover:bg-[#c4694a] shadow-md"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={skipForward}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={audioData.provider === 'web-speech' ? 'Next step' : 'Forward 10s'}
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>

            {/* Speed selector */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="ml-auto text-xs bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white/70"
              aria-label="Playback speed"
            >
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
