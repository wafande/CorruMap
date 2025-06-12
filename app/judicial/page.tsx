"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Search, Filter, Eye, Calendar, DollarSign, Gavel, Scale, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { JudicialCorruptionForm } from "@/components/forms/judicial-corruption-form"
import { supabase, type JudicialCase, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"

// Add mock data at the top of the component
const mockJudicialCases = [
  {
    id: "JUD-001",
    title: "High Court Judge Bribery Case",
    description:
      "Judge allegedly accepted KSh 5M bribe to influence land dispute ruling in favor of wealthy businessman",
    court: "Nairobi High Court",
    judge_name: "Justice [Name Protected]",
    amount: 5000000,
    status: "investigating" as const,
    case_type: "bribery" as const,
    evidence: ["Bank transfers", "Witness testimony", "Audio recordings"],
    impact: "Land ownership dispute affecting 200 families",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "JUD-002",
    title: "Magistrate Court Corruption Ring",
    description:
      "Multiple magistrates involved in systematic corruption, influencing criminal case outcomes for payment",
    court: "Mombasa Magistrate Court",
    judge_name: "Multiple Magistrates",
    amount: 2300000,
    status: "verified" as const,
    case_type: "systematic_corruption" as const,
    evidence: ["Financial records", "Multiple witnesses", "Internal investigation"],
    impact: "Over 50 criminal cases potentially compromised",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
]

export default function JudicialCorruptionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [caseTypeFilter, setCaseTypeFilter] = useState("all")
  const [selectedCase, setSelectedCase] = useState<JudicialCase | null>(null)
  const [judicialCases, setJudicialCases] = useState<JudicialCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchJudicialCases()
    } else {
      setJudicialCases(mockJudicialCases)
      setLoading(false)
    }
  }, [])

  const fetchJudicialCases = async () => {
    if (!isSupabaseConfigured()) {
      setJudicialCases(mockJudicialCases)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("judicial_cases")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setJudicialCases(data || [])
    } catch (error) {
      console.error("Error fetching judicial cases:", error)
      setJudicialCases(mockJudicialCases)
      if (typeof window !== "undefined") {
        toast.error("Using demo data - Supabase not configured")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredCases = judicialCases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.court.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    const matchesType = caseTypeFilter === "all" || case_.case_type === caseTypeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-kenya-green"
      case "investigating":
        return "bg-yellow-600"
      case "pending":
        return "bg-blue-600"
      case "dismissed":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCaseTypeColor = (type: string) => {
    switch (type) {
      case "bribery":
        return "text-kenya-red"
      case "systematic_corruption":
        return "text-purple-400"
      case "extortion":
        return "text-orange-400"
      case "influence_peddling":
        return "text-pink-400"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading judicial cases...</div>
      </div>
    )
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
            <Gavel className="mr-3 h-8 w-8 text-kenya-red" />
            Judicial Corruption Tracker
          </h2>
          <p className="text-slate-300">
            Monitor and report corruption within Kenya's judicial system - courts, judges, and legal processes
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="mb-8 bg-kenya-red/20 border-kenya-red">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Scale className="h-6 w-6 text-kenya-red mr-3" />
              <div>
                <h3 className="text-white font-semibold">Protecting Judicial Integrity</h3>
                <p className="text-slate-300 text-sm">
                  A fair and impartial judiciary is fundamental to democracy. Report any corruption in the legal system
                  to help maintain justice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter Judicial Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by case, court, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Case Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bribery">Bribery</SelectItem>
                    <SelectItem value="systematic_corruption">Systematic Corruption</SelectItem>
                    <SelectItem value="extortion">Extortion</SelectItem>
                    <SelectItem value="influence_peddling">Influence Peddling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full bg-kenya-red hover:bg-red-700">
                <Search className="mr-2 h-4 w-4" />
                Search Cases
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Judicial Cases List */}
        <div className="space-y-6">
          {filteredCases.map((case_) => (
            <Card key={case_.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-white">{case_.title}</CardTitle>
                      <Badge className={`${getStatusColor(case_.status)} text-white text-xs`}>{case_.status}</Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      Case ID: {case_.id} • {case_.court}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setSelectedCase(case_)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          {selectedCase?.title}
                          <Badge className={`${getStatusColor(selectedCase?.status || "")} text-white`}>
                            {selectedCase?.status}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Case ID: {selectedCase?.id} • Reported:{" "}
                          {selectedCase?.created_at ? new Date(selectedCase.created_at).toLocaleDateString() : "N/A"}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedCase && (
                        <div className="space-y-6">
                          {/* Case Details */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-slate-400">
                                <Scale className="h-4 w-4 mr-2" />
                                {selectedCase.court}
                              </div>
                              {selectedCase.amount && (
                                <div className="flex items-center text-slate-400">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  KSh {selectedCase.amount.toLocaleString()}
                                </div>
                              )}
                              <div className="flex items-center text-slate-400">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(selectedCase.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              {selectedCase.judge_name && (
                                <>
                                  <div className="text-slate-400 text-sm">Judge/Official:</div>
                                  <div className="text-white font-medium">{selectedCase.judge_name}</div>
                                </>
                              )}
                              <div
                                className={`capitalize font-semibold mt-2 ${getCaseTypeColor(selectedCase.case_type)}`}
                              >
                                {selectedCase.case_type.replace("_", " ")}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-semibold text-white mb-2">Case Description</h4>
                            <p className="text-slate-300 text-sm">{selectedCase.description}</p>
                          </div>

                          {/* Impact */}
                          {selectedCase.impact && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Impact on Justice System</h4>
                              <p className="text-slate-300 text-sm">{selectedCase.impact}</p>
                            </div>
                          )}

                          {/* Evidence */}
                          {selectedCase.evidence && selectedCase.evidence.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Evidence Submitted</h4>
                              <div className="space-y-1">
                                {selectedCase.evidence.map((item, index) => (
                                  <div key={index} className="flex items-center text-slate-300 text-sm">
                                    <div className="w-2 h-2 bg-kenya-green rounded-full mr-2"></div>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <h4 className="font-semibold text-white mb-3 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Take Action
                            </h4>
                            <div className="flex gap-3">
                              <Button size="sm" className="bg-kenya-red hover:bg-red-700">
                                Report to JSC
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                Contact EACC
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                Share Information
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(case_.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Scale className="h-3 w-3 mr-1" />
                    {case_.court}
                  </div>
                  {case_.amount && (
                    <div className="flex items-center text-slate-400 text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      KSh {case_.amount.toLocaleString()}
                    </div>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{case_.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm capitalize ${getCaseTypeColor(case_.case_type)}`}>
                    {case_.case_type.replace("_", " ")}
                  </span>
                  <span className="text-slate-500 text-xs">{case_.evidence?.length || 0} evidence files</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">{judicialCases.length}</div>
              <div className="text-slate-400">Total Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {judicialCases.filter((c) => c.status === "pending").length}
              </div>
              <div className="text-slate-400">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-green">
                {judicialCases.filter((c) => c.status === "verified").length}
              </div>
              <div className="text-slate-400">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {judicialCases.filter((c) => c.status === "investigating").length}
              </div>
              <div className="text-slate-400">Under Investigation</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Judicial Corruption CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-kenya-red/20 border-kenya-red">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Report Judicial Corruption</h3>
              <p className="text-slate-300 mb-6">
                Help maintain the integrity of Kenya's justice system by reporting corruption in courts and legal
                processes.
              </p>
              <div className="flex gap-4 justify-center">
                <JudicialCorruptionForm />
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Contact JSC
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
