"use client"

import { create } from "zustand"
import { translations, type Language, type TranslationKey } from "@/lib/translations"

interface TranslationStore {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

export const useTranslation = create<TranslationStore>((set, get) => ({
  language: "en",
  setLanguage: (lang: Language) => set({ language: lang }),
  t: (key: TranslationKey) => {
    const { language } = get()
    return translations[language][key] || translations.en[key]
  },
}))
