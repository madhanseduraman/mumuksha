import { useQuery } from '@tanstack/react-query'
import { BookOpen, Tag, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { topicApi } from '../lib/api'
import { useStore } from '../store/useStore'
import { cn, TOPIC_COLORS, TOPIC_ICONS } from '../lib/utils'

export default function ScriptureSidebar() {
  const { selectedTopicId, setSelectedTopic, selectedScriptureId } = useStore()
  const [expanded, setExpanded] = useState(true)

  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics', selectedScriptureId],
    queryFn: () => topicApi.list(selectedScriptureId),
  })

  return (
    <div className="h-full flex flex-col bg-stone-950 border-r border-stone-800">
      {/* Header */}
      <div className="p-4 border-b border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-saffron-500/20 flex items-center justify-center">
            <span className="text-saffron-400 text-lg">🕉</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-stone-100">Mumuksha</h1>
            <p className="text-xs text-stone-500">முமுக்ஷு</p>
          </div>
        </div>
      </div>

      {/* Scripture section */}
      <div className="p-3">
        <p className="panel-header">Scriptures</p>

        <button
          className={cn('sidebar-item w-full', 'active')}
          onClick={() => setSelectedTopic(null)}
        >
          <BookOpen size={14} className="text-saffron-400" />
          <div className="flex-1 text-left">
            <p className="text-sm">Sivavakiyar</p>
            <p className="text-xs text-stone-500 tamil-text">சிவவாக்கியர்</p>
          </div>
          <span className="text-xs text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded">99</span>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-800 mx-3" />

      {/* Topics section */}
      <div className="p-3 flex-1 overflow-y-auto">
        <button
          className="panel-header w-full flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Topics</span>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        {expanded && (
          <div className="space-y-1">
            {/* All songs option */}
            <button
              className={cn('sidebar-item w-full', selectedTopicId === null && 'active')}
              onClick={() => setSelectedTopic(null)}
            >
              <Tag size={13} />
              <span>All Songs</span>
              <span className="ml-auto text-xs text-stone-500">99</span>
            </button>

            {isLoading ? (
              <div className="space-y-1 py-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-stone-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              topics?.map((topic) => (
                <button
                  key={topic.id}
                  className={cn('sidebar-item w-full', selectedTopicId === topic.id && 'active')}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <span className="text-sm">{TOPIC_ICONS[topic.id] || '📜'}</span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm truncate">{topic.name}</p>
                    <p className="text-xs text-stone-500 truncate tamil-text">{topic.name_ta}</p>
                  </div>
                  <span className="text-xs text-stone-500 shrink-0">{topic.song_count}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-800">
        <p className="text-xs text-stone-600 text-center">
          Tamil Siddhar Philosophy · 10th–11th century
        </p>
      </div>
    </div>
  )
}
