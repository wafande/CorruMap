import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      position,
      company_type,
      registration_number,
      county,
      total_amount,
      status,
      charges,
      photo_url,
    } = body

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Profile submitted successfully (Demo Mode)",
        profileId: `PROF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      })
    }

    const chargesArray = typeof charges === "string" ? charges.split(",").map((c) => c.trim()) : charges

    const profileData = {
      name,
      type,
      position: type === "individual" ? position : null,
      company_type: type === "company" ? company_type : null,
      registration_number: type === "company" ? registration_number : null,
      county,
      cases_count: 1,
      total_amount: total_amount ? Number.parseInt(total_amount) : 0,
      status,
      charges: chargesArray,
      photo_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("corruption_profiles").insert([profileData]).select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Profile submitted successfully",
      profileId: data[0]?.id || "UNKNOWN",
    })
  } catch (error) {
    console.error("Error submitting profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit profile",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully (Demo Mode)",
      })
    }

    const { data, error } = await supabase
      .from("corruption_profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Demo mode - no profiles available",
      })
    }

    let query = supabase.from("corruption_profiles").select("*")

    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,position.ilike.%${search}%,company_type.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profiles",
        data: [],
      },
      { status: 500 },
    )
  }
}
