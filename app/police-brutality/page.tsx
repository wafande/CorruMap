"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Calendar, MapPin, Users, Phone } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function PoliceBrutalityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for police brutality cases
  const brutalityCases = [
    {
      id: "PB-001",
      title: "Extra-judicial killing in Mathare",
      description: "Young man shot dead by police during routine patrol, no weapon found",
      location: "Mathare, Nairobi",
      date: "2024-01-15",
      status: "investigating",
      type: "extra-judicial-killing",
      victims: 1,
    },
    {
      id: "PB-002",
      title: "Torture in police custody",
      description: "Suspect tortured during interrogation, hospitalized with severe injuries",
      location: "Kisumu Central Police Station",
      date: "2024-01-10",
      status: "reported",
      type: "torture",
      victims: 1,
    },
    {
      id: "PB-003",
      title: "Excessive force during protests",
      description: "Multiple protesters injured during Finance Bill demonstrations",
      location: "CBD, Nairobi",
      date: "2024-06-25",
      status: "verified",
      type: "excessive-force",
      victims: 23,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-kenya-green"
      case "investigating":
        return "bg-yellow-600"
      case "reported":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "extra-judicial-killing":
        return "text-kenya-red"
      case "torture":
        return "text-orange-400"
      case "excessive-force":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-kenya-red" />
            <h1 className="text-2xl font-bold text-white">CorruMap</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/map" className="text-slate-300 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/reports" className="text-slate-300 hover:text-white transition-colors">
              Reports
            </Link>
            <Link href="/missing-persons" className="text-slate-300 hover:text-white transition-colors">
              Missing Persons
            </Link>
            <Link href="/submit" className="text-slate-300 hover:text-white transition-colors">
              Submit Report
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8 text-kenya-red" />
            Police Brutality & Extra-Judicial Killings
          </h2>
          <p className="text-slate-300">
            Tracking cases of police brutality, extra-judicial killings, and human rights violations by law enforcement
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">156</div>
              <div className="text-slate-400">Total Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">89</div>
              <div className="text-slate-400">Extra-Judicial Killings</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">34</div>
              <div className="text-slate-400">Torture Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-500">33</div>
              <div className="text-slate-400">Excessive Force</div>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <div className="space-y-6">
          {brutalityCases.map((case_) => (
            <Card key={case_.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-white">{case_.title}</CardTitle>
                      <Badge className={`${getStatusColor(case_.status)} text-white text-xs`}>{case_.status}</Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      Case ID: {case_.id} • {case_.victims} victim(s)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {case_.date}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {case_.location}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    {case_.victims} victim(s)
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3">{case_.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm capitalize ${getTypeColor(case_.type)}`}>
                    {case_.type.replace("-", " ")}
                  </span>
                  <Button size="sm" className="bg-kenya-red hover:bg-red-700">
                    Report Similar Case
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-12 bg-kenya-red/20 border-kenya-red">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Phone className="mr-2 h-6 w-6" />
              Emergency & Reporting Contacts
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-kenya-red mb-2">999</div>
                <div className="text-white font-medium">Police Emergency</div>
                <div className="text-slate-300 text-sm">For immediate danger</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kenya-red mb-2">0800 720 721</div>
                <div className="text-white font-medium">IPOA Hotline</div>
                <div className="text-slate-300 text-sm">Independent Police Oversight</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kenya-red mb-2">0800 221 221</div>
                <div className="text-white font-medium">KNCHR</div>
                <div className="text-slate-300 text-sm">Human Rights Commission</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
