'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/store';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const content = {
    en: {
      title: 'Something went wrong!',
      button: 'Try again',
    },
    bn: {
      title: 'কিছু ভুল হয়েছে!',
      button: 'আবার চেষ্টা করুন',
    },
  };


  const t = content[language];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
          {t.title}
        </h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t.button}
        </button>
      </div>
    </div>
  );
}