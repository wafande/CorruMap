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
import { Plus } from "lucide-react"

export function MissingPersonForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    last_seen: "",
    location: "",
    description: "",
    circumstances: "",
    reported_by: "",
    contact_phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode - just show success message
        toast.success("Demo mode: Missing person report would be submitted")
        setOpen(false)
        setFormData({
          name: "",
          age: "",
          gender: "",
          last_seen: "",
          location: "",
          description: "",
          circumstances: "",
          reported_by: "",
          contact_phone: "",
        })
        return
      }

      const { error } = await supabase.from("missing_persons").insert([
        {
          name: formData.name,
          age: Number.parseInt(formData.age),
          gender: formData.gender as "Male" | "Female" | "Other",
          last_seen: formData.last_seen,
          location: formData.location,
          description: formData.description,
          circumstances: formData.circumstances,
          reported_by: formData.reported_by,
          contact_phone: formData.contact_phone,
          status: "active",
        },
      ])

      if (error) throw error

      toast.success("Missing person report submitted successfully")
      setOpen(false)
      setFormData({
        name: "",
        age: "",
        gender: "",
        last_seen: "",
        location: "",
        description: "",
        circumstances: "",
        reported_by: "",
        contact_phone: "",
      })

      // Refresh the page to show new data
      window.location.reload()
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Report Missing Person
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report a Missing Person</DialogTitle>
          <DialogDescription className="text-slate-400">
            Provide details about the missing person. All information will be kept confidential.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="last_seen">Last Seen Date *</Label>
              <Input
                id="last_seen"
                type="date"
                value={formData.last_seen}
                onChange={(e) => setFormData({ ...formData, last_seen: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Last Known Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="e.g., Nairobi CBD, Westlands"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Physical Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Height, build, clothing, distinguishing features..."
              required
            />
          </div>

          <div>
            <Label htmlFor="circumstances">Circumstances of Disappearance *</Label>
            <Textarea
              id="circumstances"
              value={formData.circumstances}
              onChange={(e) => setFormData({ ...formData, circumstances: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="What happened? Any suspicious circumstances?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reported_by">Reported By *</Label>
              <Input
                id="reported_by"
                value={formData.reported_by}
                onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Family member, friend, colleague..."
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone *</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="+254 700 000 000"
                required
              />
            </div>
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
      </DialogContent>
    </Dialog>
  )
}
