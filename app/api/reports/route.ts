import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, title, description, location, evidence, amount, anonymous, ...otherData } = body

    if (!isSupabaseConfigured()) {
      // Demo mode - simulate successful submission
      return NextResponse.json({
        success: true,
        message: "Report submitted successfully (Demo Mode)",
        reportId: `DEMO_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      })
    }

    // Insert into appropriate table based on report type
    let tableName = "corruption_reports"
    let reportData = {
      title,
      description,
      location,
      evidence_description: evidence,
      amount: amount ? Number.parseInt(amount) : null,
      anonymous: anonymous || true,
      status: "pending",
      created_at: new Date().toISOString(),
      ...otherData,
    }

    switch (type) {
      case "police-brutality":
        tableName = "police_brutality_reports"
        reportData = {
          ...reportData,
          officers_involved: otherData.officers,
          incident_type: "brutality",
        }
        break
      case "corruption-death":
        tableName = "corruption_deaths"
        reportData = {
          ...reportData,
          victim_name: otherData.victim,
          circumstances: description,
        }
        break
      case "legislative":
        tableName = "legislative_corruption"
        reportData = {
          ...reportData,
          institution: otherData.institution,
          corruption_type: "legislative",
        }
        break
      case "missing-person":
        tableName = "missing_persons"
        reportData = {
          ...reportData,
          person_name: otherData.name,
          last_seen: otherData.lastSeen,
          age: otherData.age ? Number.parseInt(otherData.age) : null,
        }
        break
    }

    const { data, error } = await supabase.from(tableName).insert([reportData]).select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
      reportId: data[0]?.id || "UNKNOWN",
    })
  } catch (error) {
    console.error("Error submitting report:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit report",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "corruption"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Demo mode - no reports available",
      })
    }

    let tableName = "corruption_reports"
    switch (type) {
      case "police-brutality":
        tableName = "police_brutality_reports"
        break
      case "legislative":
        tableName = "legislative_corruption"
        break
      case "missing-person":
        tableName = "missing_persons"
        break
    }

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reports",
        data: [],
      },
      { status: 500 },
    )
  }
}
