"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, Users } from "lucide-react"
import Link from "next/link"
import { kenyanCounties } from "@/lib/counties"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function CountiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useTranslation()

  const filteredCounties = kenyanCounties.filter((county) =>
    county.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">CorruMap</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/map" className="text-slate-300 hover:text-white transition-colors">
              {t("map")}
            </Link>
            <Link href="/reports" className="text-slate-300 hover:text-white transition-colors">
              {t("reports")}
            </Link>
            <Link href="/submit" className="text-slate-300 hover:text-white transition-colors">
              {t("submitReport")}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Kenya Counties</h2>
          <p className="text-slate-300">Explore corruption reports and statistics by county</p>
        </div>

        {/* Search */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search counties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Counties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounties.map((county) => (
            <Link key={county.code} href={`/counties/${county.code.toLowerCase()}`}>
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{county.name}</CardTitle>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {county.code}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Population: {county.population.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-red-500 font-bold">{Math.floor(Math.random() * 20) + 1}</div>
                      <div className="text-slate-400">Reports</div>
                    </div>
                    <div>
                      <div className="text-green-500 font-bold">{Math.floor(Math.random() * 15) + 1}</div>
                      <div className="text-slate-400">Verified</div>
                    </div>
                    <div>
                      <div className="text-yellow-500 font-bold">{Math.floor(Math.random() * 5) + 1}</div>
                      <div className="text-slate-400">Pending</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
