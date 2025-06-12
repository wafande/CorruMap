// Updated news API to use real RSS feeds
export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: "corruption" | "government" | "finance" | "judicial" | "general"
  relevanceScore: number
}

export interface PublicParticipationEvent {
  id: string
  title: string
  description: string
  type: "public_hearing" | "consultation" | "town_hall" | "budget_participation" | "policy_review"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  startDate: string
  endDate?: string
  location: string
  organizer: string
  participantCount?: number
  documentsUrl?: string
  feedbackUrl?: string
  livestreamUrl?: string
}

// Fetch real news from RSS feeds via API route
export const fetchCorruptionNews = async (category = "all", limit = 20): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams({
      category,
      limit: limit.toString(),
    })

    const response = await fetch(`/api/news?${params}`, {
      next: { revalidate: 900 }, // Cache for 15 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      return result.data
    } else {
      console.error("API returned error:", result.error)
      return []
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return empty array instead of mock data on error
    return []
  }
}

// Force refresh news cache
export const refreshNewsCache = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/news", {
      method: "POST",
    })

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("Error refreshing news cache:", error)
    return false
  }
}

export const fetchPublicParticipationEvents = async (): Promise<PublicParticipationEvent[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "pp-001",
      title: "County Budget Public Hearing - Nairobi",
      description:
        "Public hearing for Nairobi County Budget 2024/25. Citizens invited to provide input on budget priorities.",
      type: "public_hearing",
      status: "upcoming",
      startDate: "2024-02-15T09:00:00Z",
      endDate: "2024-02-15T17:00:00Z",
      location: "Nairobi City Hall",
      organizer: "Nairobi County Government",
      documentsUrl: "https://nairobi.go.ke/budget-documents",
      feedbackUrl: "https://nairobi.go.ke/budget-feedback",
    },
    {
      id: "pp-002",
      title: "National Health Insurance Fund Consultation",
      description:
        "Public consultation on proposed changes to the National Health Insurance Fund structure and benefits.",
      type: "consultation",
      status: "ongoing",
      startDate: "2024-01-20T00:00:00Z",
      endDate: "2024-02-20T23:59:59Z",
      location: "Online & Regional Centers",
      organizer: "Ministry of Health",
      participantCount: 15420,
      feedbackUrl: "https://health.go.ke/nhif-consultation",
    },
    {
      id: "pp-003",
      title: "Finance Bill 2025 Public Participation",
      description: "Constitutional requirement for public participation in the Finance Bill 2025 drafting process.",
      type: "policy_review",
      status: "upcoming",
      startDate: "2024-03-01T00:00:00Z",
      endDate: "2024-03-31T23:59:59Z",
      location: "Nationwide",
      organizer: "National Treasury",
      documentsUrl: "https://treasury.go.ke/finance-bill-2025",
    },
  ]
}
