"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Scale, UserPlus, Edit } from "lucide-react"
import { toast } from "sonner"

interface ReportFormProps {
  type: "legislative" | "profile" | "update-profile"
  triggerText: string
  triggerIcon: React.ReactNode
}

export function EnhancedReportingForms({ type, triggerText, triggerIcon }: ReportFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint = "/api/reports"
      const data = { ...formData, type }

      if (type === "profile" || type === "update-profile") {
        endpoint = "/api/profiles"
        if (type === "update-profile") {
          const response = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
          const result = await response.json()
          if (result.success) {
            toast.success("Profile updated successfully")
          } else {
            toast.error("Failed to update profile")
          }
        } else {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
          const result = await response.json()
          if (result.success) {
            toast.success("Profile submitted successfully")
          } else {
            toast.error("Failed to submit profile")
          }
        }
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const result = await response.json()
        if (result.success) {
          toast.success("Report submitted successfully")
        } else {
          toast.error("Failed to submit report")
        }
      }

      setOpen(false)
      setFormData({})
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while submitting")
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    switch (type) {
      case "legislative":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Select
                  value={formData.institution || ""}
                  onValueChange={(value) => setFormData({ ...formData, institution: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
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
            </div>

            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Describe the corruption or procedural irregularity in detail..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="County, constituency, or specific location"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount Involved (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Estimated amount"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="evidence">Evidence Description</Label>
              <Textarea
                id="evidence"
                value={formData.evidence || ""}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Describe any evidence you have (documents, recordings, witnesses, etc.)"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-kenya-red hover:bg-red-700 flex-1">
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
                Cancel
              </Button>
            </div>
          </form>
        )

      case "profile":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Individual or company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "individual" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position/Title</Label>
                  <Input
                    id="position"
                    value={formData.position || ""}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., County Governor, Cabinet Secretary"
                  />
                </div>
                <div>
                  <Label htmlFor="county">County/Location</Label>
                  <Input
                    id="county"
                    value={formData.county || ""}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Nairobi, Mombasa"
                  />
                </div>
              </div>
            )}

            {formData.type === "company" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_type">Company Type</Label>
                  <Input
                    id="company_type"
                    value={formData.company_type || ""}
                    onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Construction, Medical Supplies"
                  />
                </div>
                <div>
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number || ""}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., C.12345/2020"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_amount">Total Amount Involved (KSh)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={formData.total_amount || ""}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Estimated total amount"
                />
              </div>
              <div>
                <Label htmlFor="status">Current Status *</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_investigation">Under Investigation</SelectItem>
                    <SelectItem value="convicted">Convicted</SelectItem>
                    <SelectItem value="blacklisted">Blacklisted</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="charges">Charges/Violations *</Label>
              <Textarea
                id="charges"
                value={formData.charges || ""}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Separate multiple charges with commas: Embezzlement, Money Laundering, Abuse of Office"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-kenya-red hover:bg-red-700 flex-1">
                {loading ? "Submitting..." : "Submit Profile"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
                Cancel
              </Button>
            </div>
          </form>
        )

      case "update-profile":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="profile_id">Profile ID *</Label>
              <Input
                id="profile_id"
                value={formData.id || ""}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter profile ID to update"
                required
              />
            </div>

            <div>
              <Label htmlFor="update_field">Field to Update *</Label>
              <Select
                value={formData.field || ""}
                onValueChange={(value) => setFormData({ ...formData, field: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select field to update" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="charges">Charges</SelectItem>
                  <SelectItem value="total_amount">Total Amount</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                  <SelectItem value="county">County</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="new_value">New Value *</Label>
              <Input
                id="new_value"
                value={formData.value || ""}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter new value"
                required
              />
            </div>

            <div>
              <Label htmlFor="update_reason">Reason for Update</Label>
              <Textarea
                id="update_reason"
                value={formData.reason || ""}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Explain why this update is necessary..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-kenya-red hover:bg-red-700 flex-1">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
                Cancel
              </Button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  const getDialogTitle = () => {
    switch (type) {
      case "legislative":
        return "Report Legislative Corruption"
      case "profile":
        return "Report Corruption Profile"
      case "update-profile":
        return "Update Existing Profile"
      default:
        return "Submit Report"
    }
  }

  const getDialogDescription = () => {
    switch (type) {
      case "legislative":
        return "Report corruption, procedural irregularities, or lack of transparency in legislative processes."
      case "profile":
        return "Add an individual or company to the corruption database. Information will be verified before publication."
      case "update-profile":
        return "Update existing corruption profile information with new data or status changes."
      default:
        return "Submit your report to help fight corruption in Kenya."
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-kenya-red hover:bg-red-700 text-white">
          {triggerIcon}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription className="text-slate-400">{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  )
}

// Export individual components for easy use
export function ReportLegislativeCorruption() {
  return (
    <EnhancedReportingForms
      type="legislative"
      triggerText="Report Legislative Corruption"
      triggerIcon={<Scale className="h-4 w-4 mr-2" />}
    />
  )
}

export function ReportCorruptionProfile() {
  return (
    <EnhancedReportingForms
      type="profile"
      triggerText="Report Corruption Profile"
      triggerIcon={<UserPlus className="h-4 w-4 mr-2" />}
    />
  )
}

export function UpdateExistingProfile() {
  return (
    <EnhancedReportingForms
      type="update-profile"
      triggerText="Update Existing Profile"
      triggerIcon={<Edit className="h-4 w-4 mr-2" />}
    />
  )
}
