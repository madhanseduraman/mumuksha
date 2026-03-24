export interface Scripture {
  id: number
  name: string
  name_ta: string
  author: string
  period: string
  description: string
  song_count: number
}

export interface Topic {
  id: number
  name: string
  name_ta: string
  description: string
  song_count: number
}

export interface Song {
  id: number
  song_number: number
  tamil_verse: string
  tamil_explanation: string
  topics: number[]
  scripture_id: number
  topic_names: string[]
}

export interface AIModelResponse {
  model: string
  response: string
  confidence?: number
}

export interface SourceVerse {
  song_number: number
  tamil_verse: string
  tamil_explanation: string
  relevance_score?: number
}

export interface ChatResponse {
  gemini: AIModelResponse
  sarvam: AIModelResponse
  sources: SourceVerse[]
  query: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  chatResponse?: ChatResponse
  timestamp: Date
}

export type LearningMode = 'free' | 'guided'
