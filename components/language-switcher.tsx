"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === "sw" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("sw")}
        className="text-xs"
      >
        SW
      </Button>
    </div>
  )
}
