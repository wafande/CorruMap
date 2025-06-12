import { NextResponse } from "next/server"

// This route now redirects to the live Twitter API
export async function GET(request: Request) {
  // Forward to the live Twitter API endpoint
  const { searchParams } = new URL(request.url)
  const liveUrl = new URL("/api/twitter/live", request.url)

  // Copy search parameters
  searchParams.forEach((value, key) => {
    liveUrl.searchParams.set(key, value)
  })

  try {
    const response = await fetch(liveUrl.toString())
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Twitter data",
        data: [],
        trending: [],
      },
      { status: 500 },
    )
  }
}
