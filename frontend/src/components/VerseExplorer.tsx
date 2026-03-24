import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { verseApi, chatApi } from '../lib/api'
import { useStore } from '../store/useStore'
import { v4 as uuidv4 } from '../lib/uuid'
import VerseCard from './VerseCard'
import type { Song } from '../types'

export default function VerseExplorer() {
  const { selectedTopicId, selectedSong, setSelectedSong, setActivePanel, addMessage, setLoading } = useStore()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearchInput(value)
    if (timer) clearTimeout(timer)
    const t = setTimeout(() => setDebouncedSearch(value), 400)
    setTimer(t)
  }

  const { data: rawVerses, isLoading: versesLoading } = useQuery({
    queryKey: ['verses', selectedTopicId, debouncedSearch],
    queryFn: () =>
      debouncedSearch
        ? verseApi.search(debouncedSearch, { topic_id: selectedTopicId ?? undefined }).then(r => r.songs)
        : verseApi.list({ topic_id: selectedTopicId ?? undefined }),
  })

  const verses = Array.isArray(rawVerses) ? rawVerses : []

  const handleExplain = async (song: Song) => {
    setSelectedSong(song)
    setActivePanel('chat')
    setLoading(true)
    try {
      addMessage({ id: uuidv4(), role: 'user', content: `Explain Song #${song.song_number}`, timestamp: new Date() })
      const response = await chatApi.explainVerse(song.song_number)
      addMessage({ id: uuidv4(), role: 'assistant', content: '', chatResponse: response, timestamp: new Date() })
    } finally {
      setLoading(false)
    }
  }

  const topicName = selectedTopicId ? `Topic ${selectedTopicId}` : 'All Songs'

  return (
    <div className="h-full flex flex-col bg-stone-950">
      <div className="p-4 border-b border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-100">
              {debouncedSearch ? `Search: "${debouncedSearch}"` : topicName}
            </h2>
            <p className="text-xs text-stone-500">
              {versesLoading ? 'Loading...' : `${verses.length} songs`}
            </p>
          </div>
          {selectedTopicId && (
            <button
              onClick={() => useStore.getState().setSelectedTopic(null)}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search verses..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-saffron-500/50"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); setDebouncedSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {versesLoading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-24 bg-stone-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : verses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-stone-500">
            <Search size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No verses found</p>
          </div>
        ) : (
          verses.map((song) => (
            <VerseCard
              key={song.id}
              song={song}
              isSelected={selectedSong?.id === song.id}
              onSelect={setSelectedSong}
              onExplain={handleExplain}
              compact={true}
            />
          ))
        )}
      </div>
    </div>
  )
}
