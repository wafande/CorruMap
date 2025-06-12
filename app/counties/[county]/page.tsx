"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, ArrowLeft, Users, DollarSign, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { kenyanCounties } from "@/lib/counties"
import { useParams } from "next/navigation"

export default function CountyPage() {
  const params = useParams()
  const countyCode = (params.county as string)?.toUpperCase()

  const county = kenyanCounties.find((c) => c.code === countyCode)

  if (!county) {
    return <div className="text-white">County not found</div>
  }

  // Mock data for the county
  const countyReports = [
    {
      id: 1,
      title: `Healthcare Supply Theft in ${county.name}`,
      category: "embezzlement",
      amount: "KSh 2.3M",
      status: "verified",
      date: "2024-01-15",
      location: `${county.name} County Hospital`,
    },
    {
      id: 2,
      title: `Road Construction Kickbacks`,
      category: "kickbacks",
      amount: "KSh 15M",
      status: "investigating",
      date: "2024-01-10",
      location: `${county.name} County Government`,
    },
    {
      id: 3,
      title: `Police Bribery Network`,
      category: "bribery",
      amount: "KSh 450K",
      status: "pending",
      date: "2024-01-08",
      location: `${county.name} Police Station`,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600"
      case "investigating":
        return "bg-yellow-600"
      case "pending":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
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
            <Link href="/counties" className="text-slate-300 hover:text-white transition-colors">
              Counties
            </Link>
            <Link href="/map" className="text-slate-300 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/reports" className="text-slate-300 hover:text-white transition-colors">
              Reports
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/counties">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Counties
          </Button>
        </Link>

        {/* County Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-white">{county.name} County</h2>
            <Badge variant="outline" className="border-slate-600 text-slate-300 text-lg px-3 py-1">
              {county.code}
            </Badge>
          </div>
          <div className="flex items-center text-slate-300">
            <Users className="h-5 w-5 mr-2" />
            <span>Population: {county.population.toLocaleString()}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">23</div>
              <div className="text-slate-400">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">18</div>
              <div className="text-slate-400">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">3</div>
              <div className="text-slate-400">Under Investigation</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">KSh 45M</div>
              <div className="text-slate-400">Total Exposed</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Corruption Reports</CardTitle>
            <CardDescription className="text-slate-400">
              Latest corruption incidents reported in {county.name} County
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {countyReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{report.title}</h4>
                    <Badge className={`${getStatusColor(report.status)} text-white text-xs`}>{report.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {report.location}
                    </div>
                    <div className="flex items-center text-slate-400">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {report.amount}
                    </div>
                    <div className="flex items-center text-slate-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.date}
                    </div>
                    <div className="capitalize text-orange-400">{report.category}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Link href="/submit">Report Corruption in {county.name}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
