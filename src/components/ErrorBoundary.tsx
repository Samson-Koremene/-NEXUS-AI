import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // trackError(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center h-screen bg-[#070809] text-zinc-300 p-6">
          <div className="max-w-md w-full bg-[#0d0e10] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Something went wrong</h1>
                <p className="text-xs text-zinc-500 mt-1">
                  The application encountered an unexpected error
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="ghost"
                className="flex-1"
              >
                <RefreshCw size={16} className="mr-2" />
                Reload Page
              </Button>
            </div>

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer text-zinc-500 hover:text-zinc-300">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-3 bg-black/30 rounded overflow-auto text-[10px] text-zinc-400">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Lightweight error boundary for smaller sections
export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-500/5 border border-red-500/20 rounded-xl">
      <AlertTriangle className="text-red-500 mb-3" size={32} />
      <p className="text-sm font-semibold text-white mb-1">Component Error</p>
      <p className="text-xs text-zinc-400 mb-4 text-center max-w-sm">
        {error.message}
      </p>
      <Button onClick={reset} size="sm" variant="ghost">
        Retry
      </Button>
    </div>
  )
}
