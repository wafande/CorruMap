"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign } from "lucide-react"

interface MapIncident {
  id: number
  title: string
  category: string
  location: string
  amount: string
  status: string
  coordinates: { lat: number; lng: number }
}

const mockIncidents: MapIncident[] = [
  {
    id: 1,
    title: "Municipal Contract Fraud",
    category: "fraud",
    location: "Nairobi County",
    amount: "KSh 2.3M",
    status: "verified",
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
  {
    id: 2,
    title: "Police Bribery Network",
    category: "bribery",
    location: "Mombasa County",
    amount: "KSh 450K",
    status: "investigating",
    coordinates: { lat: -4.0435, lng: 39.6682 },
  },
  {
    id: 3,
    title: "Healthcare Embezzlement",
    category: "embezzlement",
    location: "Kisumu County",
    amount: "KSh 1.8M",
    status: "verified",
    coordinates: { lat: -0.0917, lng: 34.768 },
  },
  {
    id: 4,
    title: "Construction Kickbacks",
    category: "kickbacks",
    location: "Nakuru County",
    amount: "KSh 5.2M",
    status: "pending",
    coordinates: { lat: -0.3031, lng: 36.08 },
  },
]

export function InteractiveMap() {
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

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
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map Container */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Kenya Corruption Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-700 rounded-lg h-96 overflow-hidden">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p>Loading interactive map...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Simplified Kenya Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-green-800/20">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                      {/* Simplified Kenya outline */}
                      <path
                        d="M50 50 L350 50 L350 250 L50 250 Z"
                        fill="rgba(34, 197, 94, 0.1)"
                        stroke="rgba(34, 197, 94, 0.3)"
                        strokeWidth="2"
                      />

                      {/* Incident Markers */}
                      {mockIncidents.map((incident) => (
                        <circle
                          key={incident.id}
                          cx={100 + incident.id * 60}
                          cy={80 + incident.id * 40}
                          r="8"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer hover:r-10 transition-all"
                          onClick={() => setSelectedIncident(incident)}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-slate-800/80 rounded p-2 text-white text-xs">
                      <div className="flex items-center mb-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        Corruption Incidents
                      </div>
                      <div className="text-slate-400">Click markers for details</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident Details */}
      <div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{selectedIncident ? "Incident Details" : "Select an Incident"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedIncident ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">{selectedIncident.title}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getStatusColor(selectedIncident.status)} text-white text-xs`}>
                      {selectedIncident.status}
                    </Badge>
                    <span className={`text-sm capitalize ${getCategoryColor(selectedIncident.category)}`}>
                      {selectedIncident.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedIncident.location}
                  </div>
                  <div className="flex items-center text-slate-400">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {selectedIncident.amount}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-600">
                  <p className="text-slate-300 text-sm">Click on other markers to view more incidents across Kenya.</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a red marker on the map to view incident details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Map Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-red-500">{mockIncidents.length}</div>
                <div className="text-slate-400 text-sm">Incidents Shown</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-500">
                  {mockIncidents.filter((i) => i.status === "verified").length}
                </div>
                <div className="text-slate-400 text-sm">Verified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
