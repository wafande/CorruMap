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
import { Shield, Search, Filter, Eye, Calendar, MapPin, User, Phone, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MissingPersonForm } from "@/components/forms/missing-person-form"
import { supabase, type MissingPerson, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"

// Add mock data at the top of the component
const mockMissingPersons = [
  {
    id: "MP-001",
    name: "John Kamau Mwangi",
    age: 34,
    gender: "Male" as const,
    last_seen: "2024-01-15",
    location: "Nairobi CBD",
    description: "Last seen wearing blue jeans and white shirt. Height 5'8\", medium build.",
    status: "active" as const,
    reported_by: "Family Member",
    contact_phone: "+254 700 123 456",
    circumstances: "Disappeared after leaving work at 6 PM. Car found abandoned in Westlands.",
    photo_url: "/placeholder.svg?height=200&width=200",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "MP-002",
    name: "Grace Wanjiku Njeri",
    age: 28,
    gender: "Female" as const,
    last_seen: "2024-01-10",
    location: "Kisumu",
    description: "Last seen wearing red dress. Height 5'4\", slim build, long black hair.",
    status: "found" as const,
    reported_by: "Friend",
    contact_phone: "+254 722 987 654",
    circumstances: "Went missing after attending a political rally. Found safe after 3 days.",
    photo_url: "/placeholder.svg?height=200&width=200",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
]

export default function MissingPersonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null)
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchMissingPersons()
    } else {
      // Use mock data when Supabase is not configured
      setMissingPersons(mockMissingPersons)
      setLoading(false)
    }
  }, [])

  const fetchMissingPersons = async () => {
    if (!isSupabaseConfigured()) {
      setMissingPersons(mockMissingPersons)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("missing_persons")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setMissingPersons(data || [])
    } catch (error) {
      console.error("Error fetching missing persons:", error)
      // Fallback to mock data on error
      setMissingPersons(mockMissingPersons)
      if (typeof window !== "undefined") {
        toast.error("Using demo data - Supabase not configured")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPersons = missingPersons.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || person.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "found":
        return "bg-kenya-green"
      case "investigating":
        return "bg-yellow-600"
      case "active":
        return "bg-kenya-red"
      default:
        return "bg-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading missing persons data...</div>
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
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
            <User className="mr-3 h-8 w-8 text-kenya-red" />
            Missing Persons Registry
          </h2>
          <p className="text-slate-300">
            Track missing persons cases, especially those related to corruption whistleblowing and activism
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="mb-8 bg-kenya-red/20 border-kenya-red">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-kenya-red mr-3" />
              <div>
                <h3 className="text-white font-semibold">Report Missing Persons Immediately</h3>
                <p className="text-slate-300 text-sm">
                  If you know someone who has gone missing, especially after reporting corruption or activism, contact
                  authorities and report here.
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
              Search & Filter Missing Persons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search by name, location, or ID..."
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
                    <SelectItem value="active">Active Search</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
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

        {/* Missing Persons List */}
        <div className="space-y-6">
          {filteredPersons.map((person) => (
            <Card key={person.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={person.photo_url || "/placeholder.svg?height=80&width=80"}
                      alt={person.name}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-slate-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white">{person.name}</CardTitle>
                        <Badge className={`${getStatusColor(person.status)} text-white text-xs`}>{person.status}</Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Age: {person.age} • {person.gender} • Last seen: {person.last_seen}
                      </CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          {selectedPerson?.name}
                          <Badge className={`${getStatusColor(selectedPerson?.status || "")} text-white`}>
                            {selectedPerson?.status}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Last seen: {selectedPerson?.last_seen}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedPerson && (
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={selectedPerson.photo_url || "/placeholder.svg?height=128&width=128"}
                              alt={selectedPerson.name}
                              className="w-32 h-32 rounded-lg object-cover border-2 border-slate-600"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-400">Age:</span>
                                  <span className="text-white ml-2">{selectedPerson.age}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Gender:</span>
                                  <span className="text-white ml-2">{selectedPerson.gender}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Last Seen:</span>
                                  <span className="text-white ml-2">{selectedPerson.last_seen}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Location:</span>
                                  <span className="text-white ml-2">{selectedPerson.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2">Description</h4>
                            <p className="text-slate-300 text-sm">{selectedPerson.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2">Circumstances</h4>
                            <p className="text-slate-300 text-sm">{selectedPerson.circumstances}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-white mb-2">Reported By</h4>
                              <p className="text-slate-300 text-sm">{selectedPerson.reported_by}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-2">Contact</h4>
                              <p className="text-slate-300 text-sm">{selectedPerson.contact_phone}</p>
                            </div>
                          </div>

                          <div className="bg-kenya-red/20 border border-kenya-red rounded-lg p-4">
                            <h4 className="font-semibold text-white mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Have Information?
                            </h4>
                            <p className="text-slate-300 text-sm mb-3">
                              If you have any information about this missing person, please contact the authorities
                              immediately.
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-kenya-red hover:bg-red-700">
                                <Phone className="mr-1 h-3 w-3" />
                                Call Police: 999
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                Report Information
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
                    Last seen: {person.last_seen}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {person.location}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <User className="h-3 w-3 mr-1" />
                    Reported by: {person.reported_by}
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{person.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Age: {person.age}</span>
                  <span className="text-slate-500 text-xs">{person.gender}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">{missingPersons.length}</div>
              <div className="text-slate-400">Total Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">
                {missingPersons.filter((p) => p.status === "active").length}
              </div>
              <div className="text-slate-400">Active Search</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-green">
                {missingPersons.filter((p) => p.status === "found").length}
              </div>
              <div className="text-slate-400">Found Safe</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {missingPersons.filter((p) => p.status === "investigating").length}
              </div>
              <div className="text-slate-400">Under Investigation</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Missing Person CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-kenya-red/20 border-kenya-red">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Report a Missing Person</h3>
              <p className="text-slate-300 mb-6">
                If someone you know has gone missing, especially after corruption reporting or activism, report it
                immediately.
              </p>
              <div className="flex gap-4 justify-center">
                <MissingPersonForm />
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Emergency: Call 999
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
