import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from './ui/button'
import { useLanguageStore } from '@/lib/store'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (can be replaced with proper logging service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Log error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    }

    // Store error in localStorage for debugging (in production, send to logging service)
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]')
      existingErrors.push(errorDetails)
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.shift()
      }
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors))
    } catch (e) {
      console.error('Failed to store error log:', e)
    }

    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    })

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Render custom error UI
      return <ErrorFallbackUI
        error={this.state.error}
        retryCount={this.state.retryCount}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        fallback={this.props.fallback}
        showDetails={this.props.showDetails}
      />
    }

    return this.props.children
  }
}

// Functional component for the error UI
function ErrorFallbackUI({ error, retryCount, onRetry, onGoHome, fallback, showDetails = false }) {
  const { language } = useLanguageStore()

  // If custom fallback is provided, use it
  if (fallback) {
    return fallback
  }

  const isBangla = language === 'bn'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          {isBangla ? 'কিছু ভুল হয়েছে' : 'Something went wrong'}
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm sm:text-base">
          {isBangla
            ? 'আমরা দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করে দেখুন বা হোম পেজে ফিরে যান।'
            : 'We\'re sorry, something went wrong. Please try refreshing the page or go back to the home page.'
          }
        </p>

        {/* Retry Count Info */}
        {retryCount > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
              {isBangla
                ? `পুনরায় চেষ্টা করা হয়েছে: ${retryCount} বার`
                : `Retry attempts: ${retryCount}`
              }
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white"
            disabled={retryCount >= 3}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryCount >= 3
              ? (isBangla ? 'আর চেষ্টা করবেন না' : 'Stop Retrying')
              : (isBangla ? 'পুনরায় চেষ্টা করুন' : 'Try Again')
            }
          </Button>

          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Home className="w-4 h-4 mr-2" />
            {isBangla ? 'হোম পেজে যান' : 'Go to Home'}
          </Button>
        </div>

        {/* Error Details (only in development or when showDetails is true) */}
        {showDetails && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              {isBangla ? 'ত্রুটির বিস্তারিত তথ্য' : 'Error Details'}
            </summary>
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">
                {error?.message}
                {error?.stack && `\n\n${error.stack}`}
              </pre>
            </div>
          </details>
        )}

        {/* Support Contact */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {isBangla ? 'সমস্যা চলতে থাকলে যোগাযোগ করুন:' : 'If the problem persists, contact:'}
          </p>
          <p className="text-xs text-[#00AEEF] text-center mt-1">
            support@manzilinstitute.edu.bd
          </p>
        </div>
      </div>
    </div>
  )
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Hook for using error boundary in functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

export default ErrorBoundary