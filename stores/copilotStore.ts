'use client'
import { create } from 'zustand'

export type CopilotState = 'collapsed' | 'peek' | 'expanded'
export type CopilotScreen = 'tonight' | 'cook' | 'plan' | 'leftovers' | 'budget' | 'grocery' | 'home'

export interface CopilotChip {
  id: string
  label: string
  icon?: string // emoji
  action: CopilotChipAction
}

export type CopilotChipAction =
  | { type: 'navigate'; href: string }
  | { type: 'trigger'; feature: string; params?: Record<string, unknown> }
  | { type: 'message'; text: string } // for Phase 2

interface CopilotStore {
  state: CopilotState
  screen: CopilotScreen
  chips: CopilotChip[]
  // Actions
  open: () => void
  peek: () => void
  close: () => void
  setScreen: (screen: CopilotScreen) => void
  setChips: (chips: CopilotChip[]) => void
}

export const useCopilotStore = create<CopilotStore>((set) => ({
  state: 'collapsed',
  screen: 'home',
  chips: [],
  open: () => set({ state: 'expanded' }),
  peek: () => set({ state: 'peek' }),
  close: () => set({ state: 'collapsed' }),
  setScreen: (screen) => set({ screen }),
  setChips: (chips) => set({ chips }),
}))
