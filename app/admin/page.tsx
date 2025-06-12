"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Shield, BarChart3, Users, FileText, Settings, LogOut, Eye, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  )
}

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [statusUpdate, setStatusUpdate] = useState("")
  const [updateNote, setUpdateNote] = useState("")

  // Mock admin data
  const dashboardStats = {
    totalReports: 247,
    pendingReports: 23,
    verifiedReports: 189,
    underInvestigation: 35,
    totalExposed: "KSh 2.8B",
    newReportsToday: 5,
    missingPersons: 12,
    judicialCases: 8,
  }

  const recentReports = [
    {
      id: "RPT-004",
      title: "County Government Procurement Fraud",
      category: "fraud",
      location: "Kiambu County",
      amount: "KSh 3.2M",
      status: "pending",
      date: "2024-01-20",
      priority: "high",
      reporter: "Anonymous",
    },
    {
      id: "RPT-005",
      title: "Police Station Bribery",
      category: "bribery",
      location: "Nakuru County",
      amount: "KSh 150K",
      status: "investigating",
      date: "2024-01-19",
      priority: "medium",
      reporter: "Anonymous",
    },
    {
      id: "RPT-006",
      title: "Hospital Supply Chain Corruption",
      category: "embezzlement",
      location: "Meru County",
      amount: "KSh 890K",
      status: "pending",
      date: "2024-01-18",
      priority: "high",
      reporter: "Anonymous",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-kenya-green"
      case "investigating":
        return "bg-yellow-600"
      case "pending":
        return "bg-blue-600"
      case "rejected":
        return "bg-kenya-red"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-kenya-red"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-kenya-green"
      default:
        return "text-gray-400"
    }
  }

  const handleStatusUpdate = (reportId: string) => {
    // Mock status update
    console.log(`Updating report ${reportId} to ${statusUpdate} with note: ${updateNote}`)
    setStatusUpdate("")
    setUpdateNote("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-kenya-red" />
            <h1 className="text-2xl font-bold text-white">CorruMap Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">{dashboardStats.totalReports}</div>
              <div className="text-slate-400 text-sm">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{dashboardStats.pendingReports}</div>
              <div className="text-slate-400 text-sm">Pending Review</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-green">{dashboardStats.verifiedReports}</div>
              <div className="text-slate-400 text-sm">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">{dashboardStats.underInvestigation}</div>
              <div className="text-slate-400 text-sm">Investigating</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-kenya-red">{dashboardStats.missingPersons}</div>
              <div className="text-slate-400 text-sm">Missing Persons</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-500">{dashboardStats.judicialCases}</div>
              <div className="text-slate-400 text-sm">Judicial Cases</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Reports Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Reports Management */}
          <TabsContent value="reports">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Reports Requiring Action</CardTitle>
                <CardDescription className="text-slate-400">
                  Review and update the status of corruption reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-white">{report.title}</h4>
                            <Badge className={`${getStatusColor(report.status)} text-white text-xs`}>
                              {report.status}
                            </Badge>
                            <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                              {report.priority} priority
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            ID: {report.id} • {report.location} • {report.amount} • {report.date}
                          </div>
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
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Report: {selectedReport?.id}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the status and add notes for this corruption report
                                </DialogDescription>
                              </DialogHeader>

                              {selectedReport && (
                                <div className="space-y-6">
                                  {/* Report Details */}
                                  <div className="bg-slate-700/50 rounded-lg p-4">
                                    <h4 className="font-semibold text-white mb-2">{selectedReport.title}</h4>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-slate-400">Location:</span>
                                        <span className="text-white ml-2">{selectedReport.location}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Amount:</span>
                                        <span className="text-white ml-2">{selectedReport.amount}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Category:</span>
                                        <span className="text-white ml-2 capitalize">{selectedReport.category}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Priority:</span>
                                        <span
                                          className={`ml-2 capitalize ${getPriorityColor(selectedReport.priority)}`}
                                        >
                                          {selectedReport.priority}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status Update */}
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="status" className="text-slate-300">
                                        Update Status
                                      </Label>
                                      <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="investigating">Under Investigation</SelectItem>
                                          <SelectItem value="verified">Verified</SelectItem>
                                          <SelectItem value="rejected">Rejected</SelectItem>
                                          <SelectItem value="pending">Pending Review</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="note" className="text-slate-300">
                                        Update Note
                                      </Label>
                                      <Textarea
                                        id="note"
                                        value={updateNote}
                                        onChange={(e) => setUpdateNote(e.target.value)}
                                        placeholder="Add a note about this status update..."
                                        className="bg-slate-700 border-slate-600 text-white"
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <Button
                                        onClick={() => handleStatusUpdate(selectedReport.id)}
                                        className="bg-kenya-green hover:bg-green-700"
                                        disabled={!statusUpdate}
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Update Status
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-kenya-red text-kenya-red hover:bg-kenya-red hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Reports by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Fraud</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-kenya-red h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <span className="text-white text-sm">111</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Bribery</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                        <span className="text-white text-sm">86</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Embezzlement</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                        <span className="text-white text-sm">62</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Judicial</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-kenya-green h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <span className="text-white text-sm">38</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Report Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-slate-400 py-12">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Chart visualization would be implemented here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">Manage admin users and access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>User management interface</p>
                  <p className="text-sm">Admin user creation and permission management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure platform settings and security options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>System configuration panel</p>
                  <p className="text-sm">Security settings, notifications, and platform configuration</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
