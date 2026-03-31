import { useState } from 'react';
import type { Language } from '@/types/api';

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome to Manzil International Institute',
    about: 'About Us',
    contact: 'Contact',
    admission: 'Admission',
  },
  bn: {
    welcome: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে স্বাগতম',
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    admission: 'ভর্তি',
  },
};

const useTranslation = () => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string) => translations[lang]?.[key] || key;

  return { t, lang, setLang };
};

export default useTranslation;
