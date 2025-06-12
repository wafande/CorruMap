"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { DesktopNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"
import { LanguageSwitcher } from "./language-switcher"
import { DonationModal } from "./donation-modal"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-kenya-green to-kenya-red">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/images/kenya-flag.png"
                alt="Kenya Flag"
                className="w-6 h-4 rounded-sm"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=16&width=24"
                }}
              />
              <h1 className="text-lg md:text-xl font-bold text-white">CorruMap</h1>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:block flex-1 mx-8">
            <DesktopNav />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden sm:block">
              <DonationModal />
            </div>

            {/* Mobile Navigation - Only visible on mobile */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
