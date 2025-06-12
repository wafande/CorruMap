"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, FileText, Users, Scale, Heart, Shield } from "lucide-react"

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const reportType = searchParams.get("type")
  const [selectedType, setSelectedType] = useState(reportType || "corruption")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportTypes = [
    {
      id: "corruption",
      title: "General Corruption",
      description: "Report corruption, bribery, or misuse of public funds",
      icon: FileText,
      color: "bg-red-600",
    },
    {
      id: "police-brutality",
      title: "Police Brutality & Extra-Judicial Killings",
      description: "Report police misconduct, brutality, or unlawful killings",
      icon: Shield,
      color: "bg-orange-600",
    },
    {
      id: "corruption-death",
      title: "Lives Lost in Fight Against Corruption",
      description: "Report deaths related to corruption exposure or whistleblowing",
      icon: Heart,
      color: "bg-red-800",
    },
    {
      id: "legislative",
      title: "Legislative Corruption",
      description: "Report corruption in parliament, county assemblies, or legislative processes",
      icon: Scale,
      color: "bg-purple-600",
    },
    {
      id: "missing-person",
      title: "Missing Person",
      description: "Report missing persons, especially activists or whistleblowers",
      icon: Users,
      color: "bg-yellow-600",
    },
    {
      id: "judicial",
      title: "Judicial Corruption",
      description: "Report corruption in courts or judicial processes",
      icon: Scale,
      color: "bg-blue-600",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    alert("Report submitted successfully! Thank you for helping fight corruption in Kenya.")
  }

  const selectedReportType = reportTypes.find((type) => type.id === selectedType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Submit a Report</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Your voice matters in the fight against corruption. Report incidents safely and anonymously.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Report Type Selection */}
          <Card className="mb-8 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Select Report Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedType === type.id
                          ? "border-kenya-red bg-kenya-red/10"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm mb-1">{type.title}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Report Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                {selectedReportType && (
                  <>
                    <div className={`p-2 rounded-lg ${selectedReportType.color}`}>
                      <selectedReportType.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{selectedReportType.title}</CardTitle>
                      <p className="text-slate-400 text-sm">{selectedReportType.description}</p>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">
                        Report Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the incident"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white">
                        Location *
                      </Label>
                      <Input
                        id="location"
                        placeholder="County, constituency, or specific location"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-white">
                        Date of Incident
                      </Label>
                      <Input id="date" type="date" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-white">
                        {selectedType === "corruption" ? "Amount Involved (KES)" : "Severity Level"}
                      </Label>
                      {selectedType === "corruption" ? (
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      ) : (
                        <Select>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Detailed Description
                  </h3>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      What happened? *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the incident, including who was involved, what happened, and any evidence you have..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                      required
                    />
                  </div>

                  {selectedType === "police-brutality" && (
                    <div>
                      <Label htmlFor="officers" className="text-white">
                        Officers/Units Involved
                      </Label>
                      <Input
                        id="officers"
                        placeholder="Police station, officer names/badges, or unit involved"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {selectedType === "corruption-death" && (
                    <div>
                      <Label htmlFor="victim" className="text-white">
                        Victim Information
                      </Label>
                      <Textarea
                        id="victim"
                        placeholder="Name, age, role in exposing corruption, circumstances of death..."
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {selectedType === "legislative" && (
                    <div>
                      <Label htmlFor="institution" className="text-white">
                        Legislative Institution
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parliament">National Assembly</SelectItem>
                          <SelectItem value="senate">Senate</SelectItem>
                          <SelectItem value="county">County Assembly</SelectItem>
                          <SelectItem value="committee">Parliamentary Committee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Evidence */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Evidence & Documentation
                  </h3>

                  <div>
                    <Label htmlFor="evidence" className="text-white">
                      Evidence Description
                    </Label>
                    <Textarea
                      id="evidence"
                      placeholder="Describe any evidence you have (documents, photos, videos, witnesses, etc.)"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Type of Evidence (check all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        "Documents",
                        "Photos",
                        "Videos",
                        "Audio",
                        "Witnesses",
                        "Financial Records",
                        "Communications",
                        "Other",
                      ].map((evidence) => (
                        <div key={evidence} className="flex items-center space-x-2">
                          <Checkbox id={evidence.toLowerCase()} className="border-slate-600" />
                          <Label htmlFor={evidence.toLowerCase()} className="text-slate-300 text-sm">
                            {evidence}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Contact Information (Optional)
                  </h3>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-medium text-sm">Anonymous Reporting</p>
                        <p className="text-slate-300 text-sm">
                          You can submit this report anonymously. Providing contact information helps us follow up but
                          is not required.
                        </p>
                      </div>
                    </div>

                    <RadioGroup defaultValue="anonymous" className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="anonymous" id="anonymous" />
                        <Label htmlFor="anonymous" className="text-slate-300">
                          Submit anonymously
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contact" id="contact" />
                        <Label htmlFor="contact" className="text-slate-300">
                          Provide contact information
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Optional"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Optional"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Optional"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" className="border-slate-600 mt-1" required />
                    <Label htmlFor="terms" className="text-slate-300 text-sm leading-relaxed">
                      I confirm that the information provided is true to the best of my knowledge and I understand that
                      false reporting is a serious offense. I also acknowledge that this report will be handled
                      according to CorruMap's privacy policy and may be shared with relevant authorities.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="updates" className="border-slate-600 mt-1" />
                    <Label htmlFor="updates" className="text-slate-300 text-sm">
                      I would like to receive updates on this report (requires contact information)
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-kenya-red hover:bg-red-700 text-white flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8 bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-2">Emergency Contacts</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• EACC Hotline: 0800 720 721</li>
                    <li>• DCI Hotline: 0800 722 203</li>
                    <li>• Police Emergency: 999, 911, 112</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Legal Protection</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>
                      •{" "}
                      <a href="/legal" className="text-kenya-red hover:underline">
                        Know Your Rights
                      </a>
                    </li>
                    <li>• Whistleblower Protection Act</li>
                    <li>• Anonymous reporting available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
