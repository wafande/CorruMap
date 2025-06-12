"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, Calendar, MapPin, Phone, Search, Filter, Heart, Plus, Edit, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Mock data for protest casualties
const mockCasualties = [
  {
    id: "pc-001",
    name: "Rex Kanyike Masai",
    age: 29,
    gender: "Male",
    status: "killed",
    incident_date: "2024-06-20",
    location: "Parliament Road, Nairobi",
    circumstances: "Shot by police during peaceful Finance Bill 2024 protest. Was carrying Kenyan flag.",
    protest_context: "Finance Bill 2024 Protests",
    family_contact: "Family Representative",
    verification_status: "verified",
    photo_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "pc-002",
    name: "Evans Kiratu",
    age: 24,
    gender: "Male",
    status: "killed",
    incident_date: "2024-06-25",
    location: "CBD, Nairobi",
    circumstances: "Shot during anti-government demonstrations. Medical student at University of Nairobi.",
    protest_context: "Finance Bill 2024 Protests",
    family_contact: "University Administration",
    verification_status: "verified",
    photo_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "pc-003",
    name: "Billy Mwangi",
    age: 19,
    gender: "Male",
    status: "abducted",
    incident_date: "2024-12-21",
    location: "Embu",
    circumstances: "Abducted from his home by unknown individuals. Known for social media activism.",
    protest_context: "Social Media Activism",
    family_contact: "+254700000000",
    verification_status: "investigating",
    photo_url: "/placeholder.svg?height=100&width=100",
  },
]

export default function ProtestCasualtiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contextFilter, setContextFilter] = useState("all")
  const [editingCase, setEditingCase] = useState<any>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const filteredCasualties = mockCasualties.filter((casualty) => {
    const matchesSearch =
      casualty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      casualty.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      casualty.circumstances.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || casualty.status === statusFilter
    const matchesContext =
      contextFilter === "all" || casualty.protest_context.toLowerCase().includes(contextFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesContext
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "killed":
        return "bg-red-600"
      case "abducted":
        return "bg-orange-600"
      case "missing":
        return "bg-yellow-600"
      case "injured":
        return "bg-blue-600"
      case "found":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-400"
      case "investigating":
        return "text-yellow-400"
      case "unverified":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  const stats = {
    total: mockCasualties.length,
    killed: mockCasualties.filter((c) => c.status === "killed").length,
    abducted: mockCasualties.filter((c) => c.status === "abducted").length,
    missing: mockCasualties.filter((c) => c.status === "missing").length,
    found: mockCasualties.filter((c) => c.status === "found").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Gen Z Casualties & Missing Persons</h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Remembering those who lost their lives, were abducted, or went missing during protests and activism. Their
            sacrifice for a better Kenya will never be forgotten.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kenya-red hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Report New Case
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Report Gen Z Casualty</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Full Name *
                    </Label>
                    <Input id="name" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-white">
                      Age
                    </Label>
                    <Input id="age" type="number" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-white">
                      Status *
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="killed">Killed</SelectItem>
                        <SelectItem value="abducted">Abducted</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                        <SelectItem value="injured">Injured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-white">
                      Incident Date *
                    </Label>
                    <Input id="date" type="date" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-white">
                    Location *
                  </Label>
                  <Input id="location" className="bg-slate-700 border-slate-600 text-white" />
                </div>

                <div>
                  <Label htmlFor="circumstances" className="text-white">
                    Circumstances *
                  </Label>
                  <Textarea
                    id="circumstances"
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    placeholder="Describe what happened..."
                  />
                </div>

                <div>
                  <Label htmlFor="contact" className="text-white">
                    Family/Contact Information
                  </Label>
                  <Input id="contact" className="bg-slate-700 border-slate-600 text-white" />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-kenya-red hover:bg-red-700">Submit Report</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            asChild
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
          >
            <Link href="/police-brutality">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Police Brutality
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
          >
            <Link href="/submit?type=corruption-death">Lives Lost Fighting Corruption</Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-4">
              <div className="text-xl md:text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-slate-400 text-xs md:text-sm">Total Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-red-600/20 border-red-600 text-center">
            <CardContent className="pt-4">
              <div className="text-xl md:text-2xl font-bold text-red-400">{stats.killed}</div>
              <div className="text-slate-400 text-xs md:text-sm">Lives Lost</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-600/20 border-orange-600 text-center">
            <CardContent className="pt-4">
              <div className="text-xl md:text-2xl font-bold text-orange-400">{stats.abducted}</div>
              <div className="text-slate-400 text-xs md:text-sm">Abducted</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-600/20 border-yellow-600 text-center">
            <CardContent className="pt-4">
              <div className="text-xl md:text-2xl font-bold text-yellow-400">{stats.missing}</div>
              <div className="text-slate-400 text-xs md:text-sm">Missing</div>
            </CardContent>
          </Card>
          <Card className="bg-green-600/20 border-green-600 text-center">
            <CardContent className="pt-4">
              <div className="text-xl md:text-2xl font-bold text-green-400">{stats.found}</div>
              <div className="text-slate-400 text-xs md:text-sm">Found/Safe</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-lg">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="killed">Killed</SelectItem>
                    <SelectItem value="abducted">Abducted</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={contextFilter} onValueChange={setContextFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contexts</SelectItem>
                    <SelectItem value="finance">Finance Bill 2024</SelectItem>
                    <SelectItem value="social">Social Media Activism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full bg-kenya-red hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Casualties List */}
        <div className="space-y-6">
          {filteredCasualties.map((casualty) => (
            <Card key={casualty.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={casualty.photo_url || "/placeholder.svg"}
                      alt={casualty.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border-2 border-slate-600"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                      <div className="text-center md:text-left">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{casualty.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-slate-400">
                          <span>Age: {casualty.age}</span>
                          <span>•</span>
                          <span>{casualty.gender}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-2 mt-2 md:mt-0">
                        <Badge className={`${getStatusColor(casualty.status)} text-white text-xs`}>
                          {casualty.status.toUpperCase()}
                        </Badge>
                        <div className={`text-xs ${getVerificationColor(casualty.verification_status)}`}>
                          {casualty.verification_status}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => setEditingCase(casualty)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start text-slate-400 text-sm">
                          <Calendar className="h-3 w-3 mr-2" />
                          {new Date(casualty.incident_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-center md:justify-start text-slate-400 text-sm">
                          <MapPin className="h-3 w-3 mr-2" />
                          {casualty.location}
                        </div>
                        {casualty.family_contact && (
                          <div className="flex items-center justify-center md:justify-start text-slate-400 text-sm">
                            <Phone className="h-3 w-3 mr-2" />
                            {casualty.family_contact}
                          </div>
                        )}
                      </div>
                      <div className="text-center md:text-left">
                        <div className="text-sm text-slate-300 mb-2">
                          <strong>Context:</strong> {casualty.protest_context}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-600 pt-3">
                      <p className="text-slate-300 text-sm leading-relaxed text-center md:text-left">
                        {casualty.circumstances}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCasualties.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No cases found matching your search criteria.</p>
          </div>
        )}

        {/* Memorial Section */}
        <Card className="mt-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700">
          <CardContent className="p-6 md:p-8 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">In Memory</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6 text-sm md:text-base">
              We honor the courage of young Kenyans who stood up for justice and transparency. Their sacrifice reminds
              us that the fight for a better Kenya continues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-kenya-red hover:bg-red-700">
                <Link href="/submit">Report a Case</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                <Link href="/legal">Know Your Rights</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Case Dialog */}
        {editingCase && (
          <Dialog open={!!editingCase} onOpenChange={() => setEditingCase(null)}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Update Case: {editingCase.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      defaultValue={editingCase.name}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status" className="text-white">
                      Status
                    </Label>
                    <Select defaultValue={editingCase.status}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="killed">Killed</SelectItem>
                        <SelectItem value="abducted">Abducted</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                        <SelectItem value="injured">Injured</SelectItem>
                        <SelectItem value="found">Found</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-circumstances" className="text-white">
                    Update Circumstances
                  </Label>
                  <Textarea
                    id="edit-circumstances"
                    defaultValue={editingCase.circumstances}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-verification" className="text-white">
                    Verification Status
                  </Label>
                  <Select defaultValue={editingCase.verification_status}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setEditingCase(null)}>
                    Cancel
                  </Button>
                  <Button className="bg-kenya-red hover:bg-red-700">Update Case</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
