import { create } from 'zustand'
import type { Song, Topic, ChatMessage, LearningMode } from '../types'

interface MumuксhaState {
  // Navigation
  selectedScriptureId: number
  selectedTopicId: number | null
  selectedSong: Song | null

  // Chat
  messages: ChatMessage[]
  isLoading: boolean
  mode: LearningMode

  // UI
  activePanel: 'explorer' | 'chat'
  searchQuery: string

  // Actions
  setSelectedScripture: (id: number) => void
  setSelectedTopic: (id: number | null) => void
  setSelectedSong: (song: Song | null) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setMode: (mode: LearningMode) => void
  setActivePanel: (panel: 'explorer' | 'chat') => void
  setSearchQuery: (q: string) => void
}

export const useStore = create<MumuксhaState>((set) => ({
  selectedScriptureId: 1,
  selectedTopicId: null,
  selectedSong: null,
  messages: [],
  isLoading: false,
  mode: 'free',
  activePanel: 'explorer',
  searchQuery: '',

  setSelectedScripture: (id) => set({ selectedScriptureId: id, selectedTopicId: null }),
  setSelectedTopic: (id) => set({ selectedTopicId: id, selectedSong: null }),
  setSelectedSong: (song) => set({ selectedSong: song }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setMode: (mode) => set({ mode }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
