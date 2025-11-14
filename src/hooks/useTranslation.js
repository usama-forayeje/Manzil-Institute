import { useLanguageStore } from '@/lib/store'
import { translations } from '@/lib/translations'

export function useTranslation() {
  const { language } = useLanguageStore()

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t, language }
}