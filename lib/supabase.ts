import { createClient } from "@supabase/supabase-js"

// Use fallback values for build time when environment variables might not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence for SSR
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  )
}

// Database types remain the same...
export interface Report {
  id: string
  title: string
  description: string
  category: string
  location: string
  coordinates?: string
  estimated_amount?: number
  status: "pending" | "investigating" | "verified" | "rejected"
  anonymous: boolean
  blockchain_hash?: string
  created_at: string
  updated_at: string
  verified_at?: string
  verification_score: number
}

export interface MissingPerson {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  last_seen: string
  location: string
  description: string
  status: "active" | "found" | "investigating"
  reported_by: string
  contact_phone: string
  circumstances: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface JudicialCase {
  id: string
  title: string
  description: string
  court: string
  judge_name?: string
  amount?: number
  status: "pending" | "investigating" | "verified" | "dismissed"
  case_type: "bribery" | "systematic_corruption" | "extortion" | "influence_peddling"
  evidence: string[]
  impact: string
  created_at: string
  updated_at: string
}

export interface CorruptionProfile {
  id: string
  name: string
  type: "individual" | "company"
  position?: string
  company_type?: string
  registration_number?: string
  county?: string
  cases_count: number
  total_amount: number
  status: "under_investigation" | "convicted" | "blacklisted" | "cleared"
  charges: string[]
  photo_url?: string
  created_at: string
  updated_at: string
}
