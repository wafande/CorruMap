"use client"

import { useState } from "react"
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
import { Shield, Search, Filter, Eye, Calendar, MapPin, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

// Mock reports data
const mockReports = [
  {
    id: "RPT-001",
    title: "Municipal Contract Fraud in Nairobi",
    description:
      "City officials awarded construction contracts to shell companies owned by relatives, inflating costs by 300%. Multiple witnesses and financial records available.",
    category: "fraud",
    location: "Nairobi County",
    amount: "KSh 2.3M",
    status: "verified",
    date: "2024-01-15",
    reporter: "Anonymous",
    evidence: ["Financial records", "Witness statements", "Contract documents"],
    updates: [
      { date: "2024-01-15", status: "submitted", note: "Report received and assigned case number" },
      { date: "2024-01-18", status: "investigating", note: "Initial investigation started" },
      { date: "2024-01-25", status: "verified", note: "Evidence verified, case forwarded to EACC" },
    ],
  },
  {
    id: "RPT-002",
    title: "Police Bribery Network in Mombasa",
    description:
      "Systematic bribery scheme involving traffic police demanding payments to avoid citations. Multiple video recordings and witness testimonies collected.",
    category: "bribery",
    location: "Mombasa County",
    amount: "KSh 450K",
    status: "investigating",
    date: "2024-01-10",
    reporter: "Anonymous",
    evidence: ["Video recordings", "Witness testimonies"],
    updates: [
      { date: "2024-01-10", status: "submitted", note: "Report received" },
      { date: "2024-01-12", status: "investigating", note: "Investigation ongoing" },
    ],
  },
  {
    id: "RPT-003",
    title: "Healthcare Embezzlement in Kisumu",
    description:
      "Hospital administrator diverted medical supplies and equipment worth millions to private clinics. Financial audit reveals discrepancies.",
    category: "embezzlement",
    location: "Kisumu County",
    amount: "KSh 1.8M",
    status: "verified",
    date: "2024-01-08",
    reporter: "Anonymous",
    evidence: ["Financial audit", "Supply records"],
    updates: [
      { date: "2024-01-08", status: "submitted", note: "Report submitted" },
      { date: "2024-01-15", status: "verified", note: "Audit confirms embezzlement" },
    ],
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600"
      case "investigating":
        return "bg-yellow-600"
      case "pending":
        return "bg-blue-600"
      case "submitted":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fraud":
        return "text-red-400"
      case "bribery":
        return "text-orange-400"
      case "embezzlement":
        return "text-purple-400"
      case "kickbacks":
        return "text-pink-400"
      default:
        return "text-gray-400"
    }
  }

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
              Map
            </Link>
            <Link href="/counties" className="text-slate-300 hover:text-white transition-colors">
              Counties
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
          <h2 className="text-3xl font-bold text-white mb-4">Corruption Reports</h2>
          <p className="text-slate-300">Track and monitor corruption cases across Kenya</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by title, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="bribery">Bribery</SelectItem>
                    <SelectItem value="embezzlement">Embezzlement</SelectItem>
                    <SelectItem value="kickbacks">Kickbacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-white">{report.title}</CardTitle>
                      <Badge className={`${getStatusColor(report.status)} text-white text-xs`}>{report.status}</Badge>
                    </div>
                    <CardDescription className="text-slate-400">Report ID: {report.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            {selectedReport?.title}
                            <Badge className={`${getStatusColor(selectedReport?.status || "")} text-white`}>
                              {selectedReport?.status}
                            </Badge>
                          </DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Report ID: {selectedReport?.id} • Submitted: {selectedReport?.date}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedReport && (
                          <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-slate-400">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {selectedReport.location}
                                </div>
                                <div className="flex items-center text-slate-400">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  {selectedReport.amount}
                                </div>
                                <div className="flex items-center text-slate-400">
                                  <User className="h-4 w-4 mr-2" />
                                  {selectedReport.reporter}
                                </div>
                              </div>
                              <div>
                                <div
                                  className={`capitalize font-semibold ${getCategoryColor(selectedReport.category)}`}
                                >
                                  {selectedReport.category}
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <h4 className="font-semibold text-white mb-2">Description</h4>
                              <p className="text-slate-300 text-sm">{selectedReport.description}</p>
                            </div>

                            {/* Evidence */}
                            <div>
                              <h4 className="font-semibold text-white mb-2">Evidence Submitted</h4>
                              <div className="space-y-1">
                                {selectedReport.evidence.map((item, index) => (
                                  <div key={index} className="flex items-center text-slate-300 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Updates Timeline */}
                            <div>
                              <h4 className="font-semibold text-white mb-3">Case Updates</h4>
                              <div className="space-y-3">
                                {selectedReport.updates.map((update, index) => (
                                  <div key={index} className="flex items-start space-x-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(update.status)}`}></div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-white text-sm font-medium capitalize">
                                          {update.status}
                                        </span>
                                        <span className="text-slate-400 text-xs">{update.date}</span>
                                      </div>
                                      <p className="text-slate-300 text-sm mt-1">{update.note}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {report.location}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {report.amount}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {report.date}
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm capitalize ${getCategoryColor(report.category)}`}>{report.category}</span>
                  <span className="text-slate-500 text-xs">{report.evidence.length} evidence files</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">{mockReports.length}</div>
              <div className="text-slate-400">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {mockReports.filter((r) => r.status === "verified").length}
              </div>
              <div className="text-slate-400">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {mockReports.filter((r) => r.status === "investigating").length}
              </div>
              <div className="text-slate-400">Under Investigation</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">KSh 4.55M</div>
              <div className="text-slate-400">Total Exposed</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
