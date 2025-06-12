"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Calendar, DollarSign, Users, AlertTriangle, Download, ExternalLink, TrendingUp } from "lucide-react"

interface FinanceBill {
  id: string
  year: number
  title: string
  status: string
  totalRevenue: string
  keyChanges: string[]
  timeline: Array<{
    date: string
    event: string
    status: string
    description?: string
  }>
  documents: Array<{
    title: string
    url: string
    type: string
    date: string
  }>
  publicParticipation: {
    startDate?: string
    endDate?: string
    venues: string[]
    submissionsCount: number
    documentsUrl?: string
  }
  corruptionConcerns: string[]
  impactAssessment: {
    economicImpact: string
    socialImpact: string
    businessImpact: string
  }
}

export default function FinanceBillsPage() {
  const [bills, setBills] = useState<FinanceBill[]>([])
  const [selectedBill, setSelectedBill] = useState<FinanceBill | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFinanceBills()
  }, [])

  const fetchFinanceBills = async () => {
    try {
      const response = await fetch("/api/finance-bills")
      const result = await response.json()

      if (result.success) {
        setBills(result.data)
        setSelectedBill(result.data[0]) // Select most recent bill
      }
    } catch (error) {
      console.error("Error fetching finance bills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-600"
      case "withdrawn":
        return "bg-red-600"
      case "draft":
        return "bg-yellow-600"
      case "public_participation":
        return "bg-blue-600"
      case "parliamentary_debate":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTimelineProgress = (timeline: any[]) => {
    const completed = timeline.filter((item) => item.status === "completed").length
    return (completed / timeline.length) * 100
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading finance bills...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-kenya-red mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Finance Bills Tracker</h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Monitor Kenya's Finance Bills, track transparency, and access comprehensive documentation
          </p>
        </div>

        {/* Bill Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {bills.map((bill) => (
              <Button
                key={bill.id}
                variant={selectedBill?.id === bill.id ? "default" : "outline"}
                onClick={() => setSelectedBill(bill)}
                className={
                  selectedBill?.id === bill.id
                    ? "bg-kenya-red hover:bg-red-700 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                {bill.title}
              </Button>
            ))}
          </div>
        </div>

        {selectedBill && (
          <div className="space-y-8">
            {/* Bill Overview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">{selectedBill.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(selectedBill.status)} text-white`}>
                        {selectedBill.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-slate-400">Revenue Target: {selectedBill.totalRevenue}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-kenya-green">{selectedBill.totalRevenue}</div>
                    <div className="text-slate-400 text-sm">Projected Revenue</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 text-kenya-green mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedBill.totalRevenue}</div>
                    <div className="text-slate-400 text-sm">Revenue Target</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">
                      {selectedBill.publicParticipation.submissionsCount.toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-sm">Public Submissions</div>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-kenya-red mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedBill.corruptionConcerns.length}</div>
                    <div className="text-slate-400 text-sm">Transparency Concerns</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="participation">Public Participation</TabsTrigger>
                <TabsTrigger value="concerns">Concerns</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Key Changes */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-kenya-green" />
                        Key Tax Changes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedBill.keyChanges.map((change, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-kenya-red rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300 text-sm">{change}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Assessment */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                        Impact Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Economic Impact</h4>
                          <p className="text-slate-300 text-sm">{selectedBill.impactAssessment.economicImpact}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Social Impact</h4>
                          <p className="text-slate-300 text-sm">{selectedBill.impactAssessment.socialImpact}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Business Impact</h4>
                          <p className="text-slate-300 text-sm">{selectedBill.impactAssessment.businessImpact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                      Legislative Timeline
                    </CardTitle>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Progress</span>
                        <span className="text-slate-400 text-sm">
                          {Math.round(getTimelineProgress(selectedBill.timeline))}%
                        </span>
                      </div>
                      <Progress value={getTimelineProgress(selectedBill.timeline)} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedBill.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div
                            className={`w-4 h-4 rounded-full mt-1 ${
                              item.status === "completed"
                                ? "bg-kenya-green"
                                : item.status === "in-progress"
                                  ? "bg-yellow-500"
                                  : item.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-slate-600"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{item.event}</span>
                              <span className="text-slate-400 text-sm">{item.date}</span>
                            </div>
                            {item.description && <p className="text-slate-300 text-sm mb-2">{item.description}</p>}
                            <Badge
                              className={`text-xs ${
                                item.status === "completed"
                                  ? "bg-kenya-green"
                                  : item.status === "in-progress"
                                    ? "bg-yellow-600"
                                    : item.status === "cancelled"
                                      ? "bg-red-600"
                                      : "bg-slate-600"
                              } text-white`}
                            >
                              {item.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-kenya-red" />
                      Official Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {selectedBill.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-kenya-red" />
                            <div>
                              <h4 className="text-white font-medium">{doc.title}</h4>
                              <p className="text-slate-400 text-sm">
                                {doc.type.toUpperCase()} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Download className="h-3 w-3 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="ghost" asChild className="text-slate-400 hover:text-white">
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participation">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-500" />
                      Public Participation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Participation Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Submissions:</span>
                            <span className="text-white font-medium">
                              {selectedBill.publicParticipation.submissionsCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Venues:</span>
                            <span className="text-white font-medium">
                              {selectedBill.publicParticipation.venues.length}
                            </span>
                          </div>
                          {selectedBill.publicParticipation.startDate && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Duration:</span>
                              <span className="text-white font-medium">
                                {selectedBill.publicParticipation.startDate} -{" "}
                                {selectedBill.publicParticipation.endDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Participation Venues</h4>
                        <div className="space-y-2">
                          {selectedBill.publicParticipation.venues.map((venue, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-slate-300 text-sm">{venue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedBill.publicParticipation.documentsUrl && (
                      <div className="mt-6 pt-4 border-t border-slate-700">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <a
                            href={selectedBill.publicParticipation.documentsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public Submissions
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="concerns">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-kenya-red" />
                      Transparency Concerns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedBill.corruptionConcerns.map((concern, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-red-900/20 border border-red-600/30 rounded-lg"
                        >
                          <AlertTriangle className="h-5 w-5 text-kenya-red mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{concern}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700">
                      <Button className="bg-kenya-red hover:bg-red-700 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Report Legislative Corruption
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Action Section */}
        <div className="mt-12 text-center">
          <Card className="bg-kenya-red/20 border-kenya-red">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Monitor Legislative Transparency</h3>
              <p className="text-slate-300 mb-6">
                Help ensure transparency in Kenya's legislative process. Report corruption, lack of public
                participation, or procedural irregularities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Report Legislative Corruption
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Users className="h-4 w-4 mr-2" />
                  Track Public Participation
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
