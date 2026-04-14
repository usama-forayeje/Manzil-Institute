'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/lib/store';

export default function NotFound() {
  const { language } = useLanguageStore();

  const content = {
    en: {
      title: '404 - Page Not Found',
      description: "The page you're looking for doesn't exist.",
      button: 'Go Home',
    },
    bn: {
      title: '৪০৪ - পেজ পাওয়া যায়নি',
      description: 'আপনি যে পেজ খুঁজছেন সেটি বিদ্যমান নেই।',
      button: 'হোম পেজে যান',
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 kalpurush-font">
          {t.description}
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t.button}
        </Link>
      </div>
    </div>
  );
}