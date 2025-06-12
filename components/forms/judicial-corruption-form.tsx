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
import { Gavel } from "lucide-react"

export function JudicialCorruptionForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    court: "",
    judge_name: "",
    amount: "",
    case_type: "",
    evidence: "",
    impact: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo mode: Judicial corruption report would be submitted")
        setOpen(false)
        resetForm()
        return
      }

      const evidenceArray = formData.evidence
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      const { error } = await supabase.from("judicial_cases").insert([
        {
          title: formData.title,
          description: formData.description,
          court: formData.court,
          judge_name: formData.judge_name || null,
          amount: formData.amount ? Number.parseInt(formData.amount) : null,
          case_type: formData.case_type as "bribery" | "systematic_corruption" | "extortion" | "influence_peddling",
          evidence: evidenceArray,
          impact: formData.impact,
          status: "pending",
        },
      ])

      if (error) throw error

      toast.success("Judicial corruption report submitted successfully")
      setOpen(false)
      resetForm()
      window.location.reload()
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      court: "",
      judge_name: "",
      amount: "",
      case_type: "",
      evidence: "",
      impact: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
          <Gavel className="mr-2 h-4 w-4" />
          Report Judicial Corruption
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report Judicial Corruption</DialogTitle>
          <DialogDescription className="text-slate-400">
            Report corruption within the judicial system. All reports are confidential.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Case Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Brief title describing the case"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="court">Court/Institution *</Label>
              <Input
                id="court"
                value={formData.court}
                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="e.g., Nairobi High Court"
                required
              />
            </div>
            <div>
              <Label htmlFor="case_type">Type of Corruption *</Label>
              <Select
                value={formData.case_type}
                onValueChange={(value) => setFormData({ ...formData, case_type: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bribery">Bribery</SelectItem>
                  <SelectItem value="systematic_corruption">Systematic Corruption</SelectItem>
                  <SelectItem value="extortion">Extortion</SelectItem>
                  <SelectItem value="influence_peddling">Influence Peddling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="judge_name">Judge/Official Name (Optional)</Label>
              <Input
                id="judge_name"
                value={formData.judge_name}
                onChange={(e) => setFormData({ ...formData, judge_name: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Name will be protected"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount Involved (KSh)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Estimated amount"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Provide detailed information about the corruption case..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="evidence">Evidence Available</Label>
            <Input
              id="evidence"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Separate multiple items with commas: Documents, Recordings, Witnesses"
            />
          </div>

          <div>
            <Label htmlFor="impact">Impact on Justice System</Label>
            <Textarea
              id="impact"
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="How does this affect the justice system or public?"
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
      </DialogContent>
    </Dialog>
  )
}
