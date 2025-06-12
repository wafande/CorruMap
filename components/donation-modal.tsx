"use client"

import { useState } from "react"
import { Heart, Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/use-translation"

export function DonationModal() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "User-1bfbb"
  const { t } = useTranslation()

  // Define fallback reasons in case translations aren't available
  const donationReasons = [
    "Help maintain our secure whistleblowing infrastructure",
    "Support investigations into corruption cases",
    "Enable us to protect whistleblowers",
    "Keep this platform independent and free from influence",
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-kenya-red text-kenya-red hover:bg-kenya-red hover:text-white"
        >
          <Heart className="h-4 w-4" />
          <span>{t("donation.donate") || "Donate"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">{t("donation.support") || "Support CorruMap"}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {t("donation.help_text") ||
              "Your donations help us maintain this platform and continue fighting corruption in Kenya."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qr.jpg-ApFYKGYNu0KYwzLDy07reRxylbKxlW.jpeg"
              alt="Binance Pay QR Code"
              className="h-64 w-64 rounded-lg border border-slate-600"
            />
            <p className="text-sm text-slate-400">Scan via the Binance App to send</p>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm text-slate-300">
              Nickname: <span className="font-medium text-white">{walletAddress}</span>
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy wallet address</span>
            </Button>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-sm">
          <p className="font-medium text-white">{t("donation.why_donate") || "Why donate?"}</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            {donationReasons.map((reason, index) => (
              <li key={index} className="text-slate-300">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
