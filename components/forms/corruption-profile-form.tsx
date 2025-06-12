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
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"

export function CorruptionProfileForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    position: "",
    company_type: "",
    registration_number: "",
    county: "",
    total_amount: "",
    status: "",
    charges: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo mode: Corruption profile would be submitted")
        setOpen(false)
        resetForm()
        return
      }

      const chargesArray = formData.charges
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      const { error } = await supabase.from("corruption_profiles").insert([
        {
          name: formData.name,
          type: formData.type as "individual" | "company",
          position: formData.type === "individual" ? formData.position : null,
          company_type: formData.type === "company" ? formData.company_type : null,
          registration_number: formData.type === "company" ? formData.registration_number : null,
          county: formData.county,
          cases_count: 1,
          total_amount: Number.parseInt(formData.total_amount) || 0,
          status: formData.status as "under_investigation" | "convicted" | "blacklisted" | "cleared",
          charges: chargesArray,
        },
      ])

      if (error) throw error

      toast.success("Corruption profile submitted successfully")
      setOpen(false)
      resetForm()
      window.location.reload()
    } catch (error) {
      console.error("Error submitting profile:", error)
      toast.error("Failed to submit profile")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      position: "",
      company_type: "",
      registration_number: "",
      county: "",
      total_amount: "",
      status: "",
      charges: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Report Corruption Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report Corruption Profile</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add an individual or company to the corruption database. Information will be verified before publication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Individual or company name"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., County Governor, Cabinet Secretary"
                />
              </div>
              <div>
                <Label htmlFor="county">County/Location</Label>
                <Input
                  id="county"
                  value={formData.county}
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
                  value={formData.company_type}
                  onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., Construction, Medical Supplies"
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
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
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Estimated total amount"
              />
            </div>
            <div>
              <Label htmlFor="status">Current Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
              value={formData.charges}
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
      </DialogContent>
    </Dialog>
  )
}
