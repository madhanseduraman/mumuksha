import { useState, useCallback } from 'react'
import { MessageSquare, BookOpen, Search, Github } from 'lucide-react'
import { useStore } from './store/useStore'
import { chatApi } from './lib/api'
import { v4 as uuidv4 } from './lib/uuid'
import ScriptureSidebar from './components/ScriptureSidebar'
import VerseExplorer from './components/VerseExplorer'
import ChatPanel from './components/ChatPanel'
import VerseDetailModal from './components/VerseDetailModal'
import { cn } from './lib/utils'
import type { ChatMessage } from './types'

export default function App() {
  const { activePanel, setActivePanel, selectedSong, setSelectedSong, addMessage, setLoading, clearMessages } = useStore()
  const [showDetail, setShowDetail] = useState(false)

  // When a song is selected from the verse list, show detail modal
  const handleSongSelect = useCallback((song: typeof selectedSong) => {
    setSelectedSong(song)
    setShowDetail(true)
  }, [setSelectedSong])

  // Intercept verse selection in VerseExplorer
  const handleExplainFromModal = useCallback(async () => {
    if (!selectedSong) return
    setShowDetail(false)
    setActivePanel('chat')
    setLoading(true)

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: `Explain Song #${selectedSong.song_number} of Sivavakiyar`,
      timestamp: new Date(),
    }
    addMessage(userMsg)

    try {
      const response = await chatApi.explainVerse(selectedSong.song_number)
      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        chatResponse: response,
        timestamp: new Date(),
      }
      addMessage(assistantMsg)
    } finally {
      setLoading(false)
    }
  }, [selectedSong, setActivePanel, setLoading, addMessage])

  return (
    <div className="h-screen flex overflow-hidden bg-stone-950">
      {/* Left Sidebar — Scriptures & Topics */}
      <div className="w-56 shrink-0">
        <ScriptureSidebar />
      </div>

      {/* Middle Panel — Verse Explorer */}
      <div className="w-80 shrink-0 border-x border-stone-800">
        <VerseExplorer />
      </div>

      {/* Right Panel — Chat / Learning */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Panel tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-4 pt-3">
          <button
            onClick={() => setActivePanel('explorer')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg border border-b-0 -mb-px transition-colors',
              activePanel === 'explorer'
                ? 'bg-stone-900 border-stone-700 text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-300',
            )}
          >
            <BookOpen size={14} />
            Verse Detail
          </button>
          <button
            onClick={() => setActivePanel('chat')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg border border-b-0 -mb-px transition-colors ml-1',
              activePanel === 'chat'
                ? 'bg-stone-900 border-stone-700 text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-300',
            )}
          >
            <MessageSquare size={14} />
            AI Chat
          </button>

          {/* Right-aligned info */}
          <div className="ml-auto flex items-center gap-3 pb-2">
            <span className="text-xs text-stone-600">Gemini + Sarvam AI</span>
            <a
              href="https://github.com/madhanseduraman/mumuksha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-400 transition-colors"
            >
              <Github size={14} />
            </a>
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 bg-stone-900 overflow-hidden">
          {activePanel === 'explorer' ? (
            <VerseDetailView />
          ) : (
            <ChatPanel />
          )}
        </div>
      </div>

      {/* Verse Detail Modal */}
      {showDetail && selectedSong && (
        <VerseDetailModal onExplain={handleExplainFromModal} />
      )}
    </div>
  )
}

function VerseDetailView() {
  const { selectedSong } = useStore()

  if (!selectedSong) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-500 p-8 text-center">
        <BookOpen size={48} className="mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-stone-400 mb-2">Select a verse to explore</h3>
        <p className="text-sm text-stone-600">
          Click on any verse in the middle panel to view its full Tamil text and explanation
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Song header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-100 mb-1">
            Song #{selectedSong.song_number}
          </h2>
          <p className="text-sm text-stone-500">Sivavakiyar · சிவவாக்கியர்</p>
        </div>
      </div>

      {/* Tamil Verse */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl p-6 border border-stone-800">
        <p className="text-xs text-stone-500 mb-3 flex items-center gap-1.5">
          <span className="text-saffron-500">✦</span>
          Tamil Verse (பாடல்)
        </p>
        <p className="tamil-text text-stone-100 text-lg leading-loose whitespace-pre-line">
          {selectedSong.tamil_verse}
        </p>
      </div>

      {/* Tamil Explanation */}
      {selectedSong.tamil_explanation && (
        <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800">
          <p className="text-xs text-stone-500 mb-3 flex items-center gap-1.5">
            <BookOpen size={12} className="text-saffron-500" />
            Traditional Explanation (விளக்கம்)
          </p>
          <p className="tamil-text text-stone-300 text-sm leading-loose whitespace-pre-line">
            {selectedSong.tamil_explanation}
          </p>
        </div>
      )}

      {/* Topics */}
      {selectedSong.topic_names.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSong.topic_names.map((name) => (
            <span key={name} className="text-xs text-stone-400 bg-stone-800 border border-stone-700 px-3 py-1 rounded-full">
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
