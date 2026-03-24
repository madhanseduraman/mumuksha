import axios from 'axios'
import type { Scripture, Topic, Song, ChatResponse } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

export const scriptureApi = {
  list: () => api.get<Scripture[]>('/scriptures').then(r => r.data),
  get: (id: number) => api.get<Scripture>(`/scriptures/${id}`).then(r => r.data),
  getTopics: (id: number) => api.get<Topic[]>(`/scriptures/${id}/topics`).then(r => r.data),
}

export const topicApi = {
  list: (scriptureId?: number) =>
    api.get<Topic[]>('/topics', { params: { scripture_id: scriptureId } }).then(r => r.data),
  get: (id: number) => api.get<Topic>(`/topics/${id}`).then(r => r.data),
}

export const verseApi = {
  list: (params?: { topic_id?: number; scripture_id?: number; limit?: number; offset?: number }) =>
    api.get<Song[]>('/verses', { params }).then(r => r.data),
  get: (songNumber: number) => api.get<Song>(`/verses/${songNumber}`).then(r => r.data),
  search: (q: string, params?: { topic_id?: number; limit?: number }) =>
    api.get<{ songs: Song[]; total: number }>('/verses/search', { params: { q, ...params } }).then(r => r.data),
}

export const chatApi = {
  chat: (payload: {
    query: string
    topic_id?: number
    scripture_id?: number
    mode?: string
    song_number?: number
  }) => api.post<ChatResponse>('/chat', payload).then(r => r.data),

  explainVerse: (songNumber: number) =>
    api.post<ChatResponse>(`/chat/explain/${songNumber}`).then(r => r.data),
}

export default api
