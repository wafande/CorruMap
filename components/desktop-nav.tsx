"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const navItems = [
  { href: "/map", label: "Map" },
  { href: "/reports", label: "Reports" },
  { href: "/counties", label: "Counties" },
  { href: "/missing-persons", label: "Missing Persons" },
  { href: "/judicial", label: "Judicial" },
  { href: "/finance-bills", label: "Finance Bills" },
  { href: "/profiles", label: "Profiles" },
  { href: "/protest-casualties", label: "Gen Z Casualties" },
  { href: "/news", label: "News & Participation" },
]

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full">
      <nav className="flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white whitespace-nowrap",
              pathname === item.href
                ? "text-white border-b-2 border-kenya-red pb-1"
                : "text-slate-300 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Button asChild size="sm" className="bg-kenya-red hover:bg-red-700 text-white ml-4">
        <Link href="/submit">
          <Plus className="h-4 w-4 mr-2" />
          Submit Report
        </Link>
      </Button>
    </div>
  )
}
