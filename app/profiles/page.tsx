"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Search, Filter, Eye, User, Building, AlertTriangle, DollarSign, MapPin } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CorruptionProfileForm } from "@/components/forms/corruption-profile-form"
import { supabase, type CorruptionProfile, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProfile, setSelectedProfile] = useState<CorruptionProfile | null>(null)
  const [activeTab, setActiveTab] = useState("individuals")
  const [profiles, setProfiles] = useState<CorruptionProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProfiles()
    } else {
      setProfiles(getMockProfiles())
      setLoading(false)
    }
  }, [activeTab])

  const fetchProfiles = async () => {
    if (!isSupabaseConfigured()) {
      setProfiles(getMockProfiles())
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("corruption_profiles")
        .select("*")
        .eq("type", activeTab === "individuals" ? "individual" : "company")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setProfiles(data || [])
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setProfiles(getMockProfiles())
      if (typeof window !== "undefined") {
        toast.error("Using demo data - Supabase not configured")
      }
    } finally {
      setLoading(false)
    }
  }

  const getMockProfiles = (): CorruptionProfile[] => {
    const mockIndividuals = [
      {
        id: "IND-001",
        name: "[Name Protected - Under Investigation]",
        type: "individual" as const,
        position: "Former County Governor",
        county: "Nairobi",
        cases_count: 3,
        total_amount: 2100000000,
        status: "under_investigation" as const,
        charges: ["Embezzlement", "Money Laundering", "Abuse of Office"],
        photo_url: "/placeholder.svg?height=150&width=150",
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
      },
    ]

    const mockCompanies = [
      {
        id: "COM-001",
        name: "[Company Name Protected]",
        type: "company" as const,
        company_type: "Construction Company",
        registration_number: "C.12345/2018",
        cases_count: 5,
        total_amount: 8200000000,
        status: "blacklisted" as const,
        charges: ["Inflated Contracts", "Substandard Work", "Bribery"],
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
      },
    ]

    return activeTab === "individuals" ? mockIndividuals : mockCompanies
  }

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.position || profile.company_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || profile.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "convicted":
        return "bg-kenya-red"
      case "under_investigation":
        return "bg-yellow-600"
      case "blacklisted":
        return "bg-purple-600"
      case "cleared":
        return "bg-kenya-green"
      default:
        return "bg-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading profiles...</div>
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
            <Link href="/judicial" className="text-slate-300 hover:text-white transition-colors">
              Judicial
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
            Corruption Profiles Database
          </h2>
          <p className="text-slate-300">Track individuals and companies involved in corruption cases across Kenya</p>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-8 bg-yellow-900/20 border-yellow-600">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-white font-semibold">Privacy & Legal Notice</h3>
                <p className="text-slate-300 text-sm">
                  Names are protected during ongoing investigations. Information is based on public records and court
                  proceedings. All individuals are presumed innocent until proven guilty in a court of law.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="individuals" className="data-[state=active]:bg-slate-700">
              <User className="h-4 w-4 mr-2" />
              Individuals
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-slate-700">
              <Building className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Filters */}
            <Card className="mb-8 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Search & Filter Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder={`Search ${activeTab}...`}
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
                        <SelectItem value="under_investigation">Under Investigation</SelectItem>
                        <SelectItem value="convicted">Convicted</SelectItem>
                        <SelectItem value="blacklisted">Blacklisted</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
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

            {/* Profiles List */}
            <div className="space-y-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {activeTab === "individuals" && (
                          <img
                            src={profile.photo_url || "/placeholder.svg?height=64&width=64"}
                            alt="Profile"
                            className="w-16 h-16 rounded-lg object-cover border-2 border-slate-600"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-white">{profile.name}</CardTitle>
                            <Badge className={`${getStatusColor(profile.status)} text-white text-xs`}>
                              {profile.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-400">
                            {activeTab === "individuals"
                              ? `${profile.position || "Position not specified"} • ${profile.county || "Location not specified"}`
                              : `${profile.company_type || "Type not specified"} • Registration: ${profile.registration_number || "N/A"}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => setSelectedProfile(profile)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              {selectedProfile?.name}
                              <Badge className={`${getStatusColor(selectedProfile?.status || "")} text-white`}>
                                {selectedProfile?.status.replace("_", " ")}
                              </Badge>
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Profile ID: {selectedProfile?.id}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedProfile && (
                            <div className="space-y-6">
                              {/* Profile Overview */}
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  {activeTab === "individuals" && (
                                    <img
                                      src={selectedProfile.photo_url || "/placeholder.svg?height=128&width=128"}
                                      alt="Profile"
                                      className="w-32 h-32 rounded-lg object-cover border-2 border-slate-600"
                                    />
                                  )}
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-slate-400">
                                        {activeTab === "individuals" ? "Position:" : "Type:"}
                                      </span>
                                      <span className="text-white ml-2">
                                        {selectedProfile.position || selectedProfile.company_type || "Not specified"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">
                                        {activeTab === "individuals" ? "County:" : "Registration:"}
                                      </span>
                                      <span className="text-white ml-2">
                                        {selectedProfile.county ||
                                          selectedProfile.registration_number ||
                                          "Not specified"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">Total Cases:</span>
                                      <span className="text-white ml-2">{selectedProfile.cases_count}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">Total Amount:</span>
                                      <span className="text-kenya-red ml-2 font-bold">
                                        KSh {selectedProfile.total_amount.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-white mb-3">
                                    {activeTab === "individuals" ? "Charges:" : "Violations:"}
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedProfile.charges.map((item, index) => (
                                      <div key={index} className="flex items-center text-slate-300">
                                        <div className="w-2 h-2 bg-kenya-red rounded-full mr-2"></div>
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="font-semibold text-white mb-3 flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Report Additional Information
                                </h4>
                                <div className="flex gap-3">
                                  <Button size="sm" className="bg-kenya-red hover:bg-red-700">
                                    Report New Case
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                    Update Information
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                    Share Profile
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
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-slate-400 text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        KSh {profile.total_amount.toLocaleString()}
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {profile.cases_count} cases
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        {activeTab === "individuals" ? (
                          <>
                            <MapPin className="h-3 w-3 mr-1" />
                            {profile.county || "N/A"}
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 mr-1" />
                            {profile.company_type || "N/A"}
                          </>
                        )}
                      </div>
                      <div className="text-slate-500 text-xs">ID: {profile.id.slice(0, 8)}...</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs">
                        {activeTab === "individuals" ? profile.position : `Reg: ${profile.registration_number}`}
                      </span>
                      <span className="text-slate-500 text-xs">{profile.charges.length} violations</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">{profiles.length}</div>
              <div className="text-slate-400">Total {activeTab}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {profiles.filter((p) => p.status === "under_investigation").length}
              </div>
              <div className="text-slate-400">Under Investigation</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">
                {profiles.filter((p) => p.status === "convicted" || p.status === "blacklisted").length}
              </div>
              <div className="text-slate-400">Convicted/Blacklisted</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                KSh {profiles.reduce((sum, p) => sum + p.total_amount, 0).toLocaleString()}
              </div>
              <div className="text-slate-400">Total Amount Involved</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Section */}
        <div className="mt-12 text-center">
          <Card className="bg-kenya-red/20 border-kenya-red">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Help Build the Database</h3>
              <p className="text-slate-300 mb-6">
                Have information about individuals or companies involved in corruption? Help us maintain accurate
                records.
              </p>
              <div className="flex gap-4 justify-center">
                <CorruptionProfileForm />
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Update Existing Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
