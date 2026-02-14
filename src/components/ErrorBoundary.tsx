import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    // Could send to error tracking service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
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
        <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light p-6 flex items-center justify-center">
          <Card className="max-w-md w-full bg-card border-4 border-charcoal shadow-[8px_8px_0px_0px_rgba(74,68,83,0.6)]">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">😢</div>
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-coral" />
              <h1 className="text-2xl font-black text-charcoal mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-charcoal-light mb-6">
                Don't worry - your progress is safe! Try refreshing the page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 p-3 bg-coral-light rounded-lg text-left overflow-auto max-h-32">
                  <code className="text-xs text-coral">
                    {this.state.error.message}
                  </code>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="bg-card"
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="bg-lavender text-charcoal hover:bg-lavender-light"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components to throw errors to nearest boundary
export function useErrorBoundary() {
  const throwError = (error: Error) => {
    throw error
  }
  return { throwError }
}
