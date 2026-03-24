import { BookOpen, Sparkles, ChevronRight } from 'lucide-react'
import { cn, TOPIC_COLORS, TOPIC_ICONS } from '../lib/utils'
import type { Song } from '../types'

interface VerseCardProps {
  song: Song
  isSelected?: boolean
  onSelect: (song: Song) => void
  onExplain: (song: Song) => void
  compact?: boolean
}

export default function VerseCard({ song, isSelected, onSelect, onExplain, compact }: VerseCardProps) {
  const firstLine = (song.tamil_verse || '').split('\n')[0]
  const topicNames = Array.isArray(song.topic_names) ? song.topic_names : []
  const topics = Array.isArray(song.topics) ? song.topics : []

  return (
    <div
      className={cn(
        'verse-card group',
        isSelected && 'border-saffron-500/70 bg-saffron-500/5',
      )}
      onClick={() => onSelect(song)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-stone-500 bg-stone-800 px-2 py-0.5 rounded">
            #{song.song_number}
          </span>
          {topicNames.slice(0, 2).map((name, i) => {
            const topicId = topics[i]
            return (
              <span
                key={name}
                className={cn('topic-chip border text-xs', TOPIC_COLORS[topicId] || 'bg-stone-700 text-stone-300')}
              >
                <span className="mr-1">{TOPIC_ICONS[topicId] || '📜'}</span>
                {name}
              </span>
            )
          })}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onExplain(song) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-saffron-400 hover:text-saffron-300 bg-saffron-500/10 hover:bg-saffron-500/20 px-2 py-1 rounded-lg shrink-0"
        >
          <Sparkles size={12} />
          Explain
        </button>
      </div>

      <p className="tamil-text text-stone-200 text-sm mb-2 leading-relaxed">
        {compact ? firstLine + (song.tamil_verse?.includes('\n') ? '...' : '') : song.tamil_verse}
      </p>

      {!compact && song.tamil_explanation && (
        <div className="mt-3 pt-3 border-t border-stone-800">
          <div className="flex items-center gap-1 text-xs text-stone-500 mb-1">
            <BookOpen size={11} />
            <span>விளக்கம் (Explanation)</span>
          </div>
          <p className="tamil-text text-stone-400 text-xs leading-relaxed line-clamp-3">
            {song.tamil_explanation.split('\n')[0]}
          </p>
        </div>
      )}

      {isSelected && (
        <div className="mt-2 flex items-center gap-1 text-xs text-saffron-400">
          <ChevronRight size={12} />
          <span>Selected for chat</span>
        </div>
      )}
    </div>
  )
}
