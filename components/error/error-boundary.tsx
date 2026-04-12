'use client';

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }
      
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong.
          </h2>
          <p className="text-red-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.resetError}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default fallback component for ErrorBoundary
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => (
  <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
      Something went wrong.
    </h2>
    <p className="text-red-500 dark:text-red-400 mb-4">
      {error.message || 'An unexpected error occurred.'}
    </p>
    <button
      onClick={resetError}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
    >
      Try again
    </button>
  </div>
);

export { ErrorBoundary, DefaultErrorFallback };
