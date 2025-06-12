"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, TrendingUp } from "lucide-react"

interface MapIncident {
  id: number
  title: string
  category: string
  location: string
  county: string
  amount: string
  status: string
  coordinates: { lat: number; lng: number }
  severity: "low" | "medium" | "high" | "critical"
}

interface CountyData {
  name: string
  incidents: number
  amount: number
  severity: "low" | "medium" | "high" | "critical"
  coordinates: { lat: number; lng: number }
}

const kenyaCounties: CountyData[] = [
  {
    name: "Nairobi",
    incidents: 45,
    amount: 2300000000,
    severity: "critical",
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
  { name: "Mombasa", incidents: 23, amount: 450000000, severity: "high", coordinates: { lat: -4.0435, lng: 39.6682 } },
  { name: "Kisumu", incidents: 18, amount: 180000000, severity: "medium", coordinates: { lat: -0.0917, lng: 34.768 } },
  { name: "Nakuru", incidents: 15, amount: 520000000, severity: "high", coordinates: { lat: -0.3031, lng: 36.08 } },
  { name: "Eldoret", incidents: 12, amount: 340000000, severity: "medium", coordinates: { lat: 0.5143, lng: 35.2698 } },
  { name: "Meru", incidents: 8, amount: 120000000, severity: "low", coordinates: { lat: 0.0469, lng: 37.6553 } },
  { name: "Kisii", incidents: 10, amount: 95000000, severity: "low", coordinates: { lat: -0.6789, lng: 34.768 } },
  {
    name: "Machakos",
    incidents: 14,
    amount: 280000000,
    severity: "medium",
    coordinates: { lat: -1.5177, lng: 37.2634 },
  },
]

const mockIncidents: MapIncident[] = [
  {
    id: 1,
    title: "Municipal Contract Fraud",
    category: "fraud",
    location: "City Hall",
    county: "Nairobi",
    amount: "KSh 2.3B",
    status: "verified",
    coordinates: { lat: -1.2921, lng: 36.8219 },
    severity: "critical",
  },
  {
    id: 2,
    title: "Police Bribery Network",
    category: "bribery",
    location: "Mombasa Road",
    county: "Mombasa",
    amount: "KSh 450M",
    status: "investigating",
    coordinates: { lat: -4.0435, lng: 39.6682 },
    severity: "high",
  },
  {
    id: 3,
    title: "Healthcare Embezzlement",
    category: "embezzlement",
    location: "County Hospital",
    county: "Kisumu",
    amount: "KSh 180M",
    status: "verified",
    coordinates: { lat: -0.0917, lng: 34.768 },
    severity: "medium",
  },
  {
    id: 4,
    title: "Construction Kickbacks",
    category: "kickbacks",
    location: "Highway Project",
    county: "Nakuru",
    amount: "KSh 520M",
    status: "pending",
    coordinates: { lat: -0.3031, lng: 36.08 },
    severity: "high",
  },
]

export function InteractiveKenyaMap() {
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<"incidents" | "heatmap">("heatmap")

  useEffect(() => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626" // red-600
      case "high":
        return "#ea580c" // orange-600
      case "medium":
        return "#ca8a04" // yellow-600
      case "low":
        return "#16a34a" // green-600
      default:
        return "#6b7280" // gray-500
    }
  }

  const getHeatmapOpacity = (incidents: number) => {
    const maxIncidents = Math.max(...kenyaCounties.map((c) => c.incidents))
    return 0.3 + (incidents / maxIncidents) * 0.7
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map Container */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <img
                  src="/images/kenya-flag.png"
                  alt="Kenya Flag"
                  className="w-6 h-4 mr-2 rounded-sm"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=16&width=24"
                  }}
                />
                Interactive Kenya Corruption Map
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "heatmap" ? "default" : "outline"}
                  onClick={() => setViewMode("heatmap")}
                  className={
                    viewMode === "heatmap" ? "bg-kenya-red hover:bg-red-700" : "border-slate-600 text-slate-300"
                  }
                >
                  Heat Map
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "incidents" ? "default" : "outline"}
                  onClick={() => setViewMode("incidents")}
                  className={
                    viewMode === "incidents" ? "bg-kenya-red hover:bg-red-700" : "border-slate-600 text-slate-300"
                  }
                >
                  Incidents
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-700 rounded-lg h-96 overflow-hidden">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kenya-red mx-auto mb-4"></div>
                    <p className="text-white font-medium">Loading interactive Kenya map...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Kenya Map SVG */}
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Kenya outline */}
                    <path
                      d="M100 100 L700 100 L700 500 L100 500 Z"
                      fill="rgba(34, 197, 94, 0.1)"
                      stroke="rgba(34, 197, 94, 0.3)"
                      strokeWidth="2"
                    />

                    {/* County Heat Zones */}
                    {viewMode === "heatmap" &&
                      kenyaCounties.map((county, index) => (
                        <g key={county.name}>
                          <circle
                            cx={150 + (index % 4) * 150}
                            cy={150 + Math.floor(index / 4) * 100}
                            r={20 + county.incidents / 5}
                            fill={getSeverityColor(county.severity)}
                            fillOpacity={getHeatmapOpacity(county.incidents)}
                            stroke={getSeverityColor(county.severity)}
                            strokeWidth="2"
                            className="cursor-pointer hover:stroke-white transition-all"
                            onClick={() => setSelectedCounty(county)}
                          />
                          <text
                            x={150 + (index % 4) * 150}
                            y={150 + Math.floor(index / 4) * 100 + 5}
                            textAnchor="middle"
                            className="fill-white text-xs font-medium pointer-events-none"
                          >
                            {county.name}
                          </text>
                          <text
                            x={150 + (index % 4) * 150}
                            y={150 + Math.floor(index / 4) * 100 - 5}
                            textAnchor="middle"
                            className="fill-white text-xs pointer-events-none"
                          >
                            {county.incidents}
                          </text>
                        </g>
                      ))}

                    {/* Individual Incidents */}
                    {viewMode === "incidents" &&
                      mockIncidents.map((incident, index) => (
                        <circle
                          key={incident.id}
                          cx={200 + index * 120}
                          cy={200 + (index % 2) * 100}
                          r="12"
                          fill={getSeverityColor(incident.severity)}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer hover:r-16 transition-all"
                          onClick={() => setSelectedIncident(incident)}
                        />
                      ))}
                  </svg>

                  {/* Map Legend */}
                  <div className="absolute top-4 right-4 bg-slate-800/90 rounded-lg p-3 text-white text-xs">
                    <h4 className="font-semibold mb-2">Corruption Severity</h4>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                        <span>Critical (40+ cases)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                        <span>High (20-39 cases)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                        <span>Medium (10-19 cases)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                        <span>Low (&lt;10 cases)</span>
                      </div>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute bottom-4 left-4 bg-slate-800/90 rounded-lg p-3 text-white text-xs">
                    <p className="font-medium">
                      Click on {viewMode === "heatmap" ? "counties" : "markers"} for details
                    </p>
                    <p className="text-slate-300">
                      Total: {kenyaCounties.reduce((sum, c) => sum + c.incidents, 0)} cases
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Panel */}
      <div className="space-y-6">
        {/* Selected Item Details */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedIncident ? "Incident Details" : selectedCounty ? "County Overview" : "Select an Area"}
            </CardTitle>
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
                    <Badge
                      className={`bg-${getSeverityColor(selectedIncident.severity).replace("#", "")} text-white text-xs`}
                    >
                      {selectedIncident.severity}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedIncident.location}, {selectedIncident.county}
                  </div>
                  <div className="flex items-center text-slate-400">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {selectedIncident.amount}
                  </div>
                </div>
              </div>
            ) : selectedCounty ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">{selectedCounty.name} County</h4>
                  <Badge
                    className={`bg-${getSeverityColor(selectedCounty.severity).replace("#", "")} text-white text-xs mb-3`}
                  >
                    {selectedCounty.severity} risk
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Active Cases:</span>
                    <span className="font-medium text-white">{selectedCounty.incidents}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Total Amount:</span>
                    <span className="font-medium text-white">KSh {(selectedCounty.amount / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-white font-medium">Interactive Kenya Map</p>
                <p className="text-sm">Click on counties or incidents to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-kenya-red" />
              National Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-kenya-red">
                  {kenyaCounties.reduce((sum, c) => sum + c.incidents, 0)}
                </div>
                <div className="text-slate-400 text-sm">Total Cases</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-500">
                  {kenyaCounties.filter((c) => c.severity === "critical").length}
                </div>
                <div className="text-slate-400 text-sm">Critical Counties</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-500">
                  KSh {(kenyaCounties.reduce((sum, c) => sum + c.amount, 0) / 1000000000).toFixed(1)}B
                </div>
                <div className="text-slate-400 text-sm">Total Exposed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-500">47</div>
                <div className="text-slate-400 text-sm">Counties</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
