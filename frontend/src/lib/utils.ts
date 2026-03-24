import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMarkdown(text: string): string {
  // Simple markdown to HTML conversion for AI responses
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l|b])(.+)$/gm, (match) => match ? match : '')
}

export const TOPIC_COLORS: Record<number, string> = {
  1: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  2: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  3: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  4: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  5: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  6: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  7: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  8: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
}

export const TOPIC_ICONS: Record<number, string> = {
  1: '🔱',
  2: '🧘',
  3: '🌟',
  4: '⚡',
  5: '📿',
  6: '🏛️',
  7: '☯️',
  8: '🔮',
}
