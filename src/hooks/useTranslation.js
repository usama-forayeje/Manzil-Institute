import { useLanguageStore } from "@/lib/store";

export function useTranslation() {
  const { language } = useLanguageStore();
  return { language };
}
