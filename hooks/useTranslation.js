import { useState } from 'react';

const translations = {
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
  const [lang, setLang] = useState('en');

  const t = key => translations[lang]?.[key] || key;

  return { t, lang, setLang };
};

export default useTranslation;
