'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for Staff Form
 * Catches unexpected errors and reports them
 */
export class StaffFormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    console.error('Staff Form Error:', error, errorInfo);

    // Could integrate with Sentry/Auth0 here
    if (typeof window !== 'undefined' && (window as any).sentry) {
      (window as any).sentry.captureException(error, {
        extra: { errorInfo },
        tags: { component: 'StaffForm' },
      });
    }

    // Show user-friendly error
    toast.error('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              আমরা ক্ষমাপ্রদuration করছি। দয়া করে পৃষ্ঠাটি রিলোড করুন বা
              পুনরায়Attempt করুন.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              পৃষ্ঠা রিলোড করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
