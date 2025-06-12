import { NextResponse } from "next/server"

// Manual refresh endpoint for admin use
export async function POST() {
  try {
    // Call the main news API with POST to force refresh
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/news`, {
      method: "POST",
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: "News refresh initiated",
      ...result,
    })
  } catch (error) {
    console.error("Error initiating news refresh:", error)
    return NextResponse.json({ success: false, error: "Failed to initiate news refresh" }, { status: 500 })
  }
}
