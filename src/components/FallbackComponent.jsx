import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { useLanguageStore } from '@/lib/store'

export default function FallbackComponent({ error, retry, componentName = 'Component' }) {
  const { language } = useLanguageStore()

  const isBangla = language === 'bn'

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {isBangla ? `${componentName} লোড করতে ব্যর্থ হয়েছে` : `${componentName} Failed to Load`}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md">
        {isBangla
          ? 'এই কম্পোনেন্টটি লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
          : 'There was a problem loading this component. Please try again.'
        }
      </p>

      {retry && (
        <Button
          onClick={retry}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {isBangla ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
        </Button>
      )}
    </div>
  )
}

// Simple inline fallback for small components
export function InlineFallback({ message, retry }) {
  const { language } = useLanguageStore()
  const isBangla = language === 'bn'

  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {message || (isBangla ? 'কিছু ভুল হয়েছে' : 'Something went wrong')}
        </span>
        {retry && (
          <Button
            onClick={retry}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            {isBangla ? 'চেষ্টা' : 'Retry'}
          </Button>
        )}
      </div>
    </div>
  )
}