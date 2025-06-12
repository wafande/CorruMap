"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  MapPin,
  Users,
  Scale,
  FileText,
  User,
  Building,
  DollarSign,
  BookOpen,
  Shield,
  AlertTriangle,
  Newspaper,
  Plus,
} from "lucide-react"
import { LanguageSwitcher } from "./language-switcher"
import { DonationModal } from "./donation-modal"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Interactive Map", icon: MapPin },
    { href: "/reports", label: "Corruption Reports", icon: FileText },
    { href: "/counties", label: "Counties", icon: Building },
    { href: "/missing-persons", label: "Missing Persons", icon: Users },
    { href: "/judicial", label: "Judicial Corruption", icon: Scale },
    { href: "/finance-bills", label: "Finance Bills", icon: DollarSign },
    { href: "/profiles", label: "Corruption Profiles", icon: User },
    { href: "/protest-casualties", label: "Gen Z Casualties", icon: AlertTriangle },
    { href: "/police-brutality", label: "Police Brutality", icon: Shield },
    { href: "/news", label: "News & Participation", icon: Newspaper },
    { href: "/constitution", label: "Constitution", icon: BookOpen },
    { href: "/legal", label: "Legal Protection", icon: Scale },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800 p-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-slate-900 border-slate-700 text-white p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Shield className="h-6 w-6 text-kenya-red" />
              <span className="font-bold text-lg text-white">CorruMap</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-slate-800 text-white hover:text-white transition-colors text-sm"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-slate-700 p-4 space-y-4">
            <Button asChild className="w-full bg-kenya-red hover:bg-red-700 text-white">
              <Link href="/submit" onClick={() => setOpen(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Report
              </Link>
            </Button>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Language</span>
              <LanguageSwitcher />
            </div>

            <div className="sm:hidden">
              <DonationModal />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
