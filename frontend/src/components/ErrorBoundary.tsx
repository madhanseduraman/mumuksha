import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-red-950/50 border border-red-800 rounded-2xl p-6">
            <h1 className="text-red-400 text-lg font-semibold mb-2">App Error</h1>
            <p className="text-red-300 text-sm font-mono mb-4">{this.state.error.message}</p>
            <pre className="text-red-400/70 text-xs overflow-auto bg-stone-950 p-4 rounded-lg">
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
