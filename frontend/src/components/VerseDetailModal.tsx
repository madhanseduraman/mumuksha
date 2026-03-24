import { X, BookOpen, Sparkles, Tag } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn, TOPIC_COLORS, TOPIC_ICONS } from '../lib/utils'

interface VerseDetailModalProps {
  onExplain: () => void
}

export default function VerseDetailModal({ onExplain }: VerseDetailModalProps) {
  const { selectedSong, setSelectedSong } = useStore()

  if (!selectedSong) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-500 bg-stone-800 px-2 py-1 rounded">
              Song #{selectedSong.song_number}
            </span>
            <div className="flex gap-1.5">
              {selectedSong.topic_names.map((name, i) => {
                const topicId = selectedSong.topics[i]
                return (
                  <span
                    key={name}
                    className={cn('topic-chip border text-xs', TOPIC_COLORS[topicId])}
                  >
                    <span className="mr-1">{TOPIC_ICONS[topicId] || '📜'}</span>
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
          <button
            onClick={() => setSelectedSong(null)}
            className="text-stone-500 hover:text-stone-300 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Tamil Verse */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
              <Tag size={11} />
              <span>Tamil Verse (பாடல்)</span>
            </div>
            <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
              <p className="tamil-text text-stone-100 text-base leading-loose whitespace-pre-line">
                {selectedSong.tamil_verse}
              </p>
            </div>
          </div>

          {/* Tamil Explanation */}
          {selectedSong.tamil_explanation && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                <BookOpen size={11} />
                <span>Tamil Explanation (விளக்கம்)</span>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <p className="tamil-text text-stone-300 text-sm leading-loose whitespace-pre-line">
                  {selectedSong.tamil_explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex gap-3">
          <button
            onClick={() => setSelectedSong(null)}
            className="flex-1 px-4 py-2 text-sm text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={onExplain}
            className="flex-1 px-4 py-2 text-sm font-medium text-stone-950 bg-saffron-500 hover:bg-saffron-400 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Ask AI to Explain
          </button>
        </div>
      </div>
    </div>
  )
}
