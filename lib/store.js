'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: language => {
        if (language !== get().language) {
          set({ language });
        }
      },
      // Reset to default
      resetLanguage: () => {
        set({ language: 'en' });
      },
      // Debug function to log current state
      debug: () => {
        console.log('🔍 Language Store Debug:', get());
      },
    }),
    {
      name: 'manzil-language-v2', // New key to avoid old cache conflicts
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
