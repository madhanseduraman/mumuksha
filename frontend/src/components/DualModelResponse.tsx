import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Sparkles, Brain } from 'lucide-react'
import { cn } from '../lib/utils'
import type { ChatResponse } from '../types'

interface DualModelResponseProps {
  chatResponse: ChatResponse
}

function ModelPanel({
  title,
  icon,
  response,
  color,
  badge,
}: {
  title: string
  icon: React.ReactNode
  response: string
  color: string
  badge: string
}) {
  return (
    <div className={cn('flex-1 rounded-xl border p-4', color)}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-stone-800/50 text-stone-400">
          {badge}
        </span>
      </div>
      <div
        className="ai-response text-sm"
        dangerouslySetInnerHTML={{
          __html: response
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-3 mb-1">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-2 mb-1">$1</h3>')
            .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-current pl-3 opacity-70 my-2 italic text-xs">$1</blockquote>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>'),
        }}
      />
    </div>
  )
}

export default function DualModelResponse({ chatResponse }: DualModelResponseProps) {
  const [showSources, setShowSources] = useState(false)

  return (
    <div className="space-y-3">
      {/* Dual model comparison */}
      <div className="flex gap-3">
        <ModelPanel
          title="Gemini"
          icon={<Sparkles size={14} className="text-blue-400" />}
          response={chatResponse.gemini.response}
          color="border-blue-500/20 bg-blue-500/5"
          badge="Philosophical"
        />
        <ModelPanel
          title="Sarvam AI"
          icon={<Brain size={14} className="text-orange-400" />}
          response={chatResponse.sarvam.response}
          color="border-orange-500/20 bg-orange-500/5"
          badge="Cultural"
        />
      </div>

      {/* Sources */}
      {chatResponse.sources.length > 0 && (
        <div className="rounded-xl border border-stone-800 bg-stone-900/50">
          <button
            className="w-full flex items-center gap-2 p-3 text-sm text-stone-400 hover:text-stone-200"
            onClick={() => setShowSources(!showSources)}
          >
            <BookOpen size={13} />
            <span>Sources ({chatResponse.sources.length} verses)</span>
            {showSources ? <ChevronUp size={13} className="ml-auto" /> : <ChevronDown size={13} className="ml-auto" />}
          </button>

          {showSources && (
            <div className="border-t border-stone-800 p-3 space-y-3">
              {chatResponse.sources.map((src) => (
                <div key={src.song_number} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded">
                      #{src.song_number}
                    </span>
                    {src.relevance_score && (
                      <span className="text-xs text-stone-600">
                        relevance: {(src.relevance_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="tamil-text text-xs text-stone-300 leading-relaxed">
                    {src.tamil_verse.split('\n')[0]}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
