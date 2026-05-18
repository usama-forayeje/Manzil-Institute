'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Language } from '@/types/api';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  resetLanguage: () => void;
  debug: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'bn',
      setLanguage: (language: Language) => {
        if (language !== get().language) {
          set({ language });
        }
      },
      // Reset to default
      resetLanguage: () => {
        set({ language: 'bn' });
      },
      // Debug function to log current state
      debug: () => {
        console.log('🔍 Language Store Debug:', get());
      },
    }),
    {
      name: 'manzil-language-v3', // New key to avoid old cache conflicts
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        };
      }),
      // Only persist the language value
      partialize: state => ({ language: state.language }),
    }
  )
);
