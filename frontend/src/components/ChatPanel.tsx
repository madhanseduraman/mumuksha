import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, BookOpen, Sparkles, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { chatApi } from '../lib/api'
import { v4 as uuidv4 } from '../lib/uuid'
import DualModelResponse from './DualModelResponse'
import { cn } from '../lib/utils'
import type { ChatMessage } from '../types'

const SUGGESTED_QUESTIONS = [
  'What is the meaning of Namachivayam in these songs?',
  'What does Sivavakiyar say about the body and soul?',
  'Explain the concept of kundalini in Siddhar tradition',
  'How does Sivavakiyar critique empty rituals?',
  'What is spiritual liberation according to Sivavakiyar?',
]

export default function ChatPanel() {
  const {
    messages,
    isLoading,
    mode,
    selectedSong,
    selectedTopicId,
    addMessage,
    setLoading,
    setMode,
    clearMessages,
  } = useStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      const response = await chatApi.chat({
        query: query.trim(),
        topic_id: selectedTopicId ?? undefined,
        song_number: selectedSong?.song_number,
        mode,
      })

      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        chatResponse: response,
        timestamp: new Date(),
      }
      addMessage(assistantMsg)
    } catch (err) {
      const errMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Error connecting to the AI service. Please check if the backend is running.',
        timestamp: new Date(),
      }
      addMessage(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
    }
  }

  return (
    <div className="h-full flex flex-col bg-stone-950">
      {/* Header */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
            <Sparkles size={14} className="text-saffron-400" />
            AI Learning
          </h2>
          <p className="text-xs text-stone-500">
            {selectedSong ? `Context: Song #${selectedSong.song_number}` : 'Dual-model: Gemini + Sarvam AI'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-stone-700 overflow-hidden">
            {(['free', 'guided'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'px-3 py-1 text-xs capitalize transition-colors',
                  mode === m
                    ? 'bg-saffron-500/20 text-saffron-300'
                    : 'text-stone-500 hover:text-stone-300',
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-stone-500 hover:text-stone-300 p-1 rounded"
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-4xl mb-3">🕉</div>
            <h3 className="text-stone-300 font-medium mb-1">Ask about Sivavakiyar's wisdom</h3>
            <p className="text-stone-500 text-sm mb-6">
              Get dual perspectives from Gemini and Sarvam AI, grounded in the original Tamil verses
            </p>

            <div className="w-full space-y-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSubmit(q)}
                  className="w-full text-left text-xs text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-lg p-3 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] bg-saffron-500/20 border border-saffron-500/30 rounded-2xl rounded-tr-sm px-4 py-2">
                  <p className="text-sm text-stone-200">{msg.content}</p>
                </div>
              ) : msg.chatResponse ? (
                <div className="w-full">
                  <DualModelResponse chatResponse={msg.chatResponse} />
                </div>
              ) : (
                <div className="max-w-[85%] bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-sm px-4 py-2">
                  <p className="text-sm text-stone-300">{msg.content}</p>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-stone-400">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Consulting Gemini & Sarvam AI...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-stone-800">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Sivavakiyar's teachings..."
              rows={2}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 resize-none"
            />
            {selectedSong && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-saffron-500/70 bg-stone-900">
                <BookOpen size={10} />
                <span>Song #{selectedSong.song_number}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-saffron-500 hover:bg-saffron-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 rounded-xl transition-colors"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-xs text-stone-600 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
