import { NextResponse } from "next/server"

interface TrendingTopic {
  hashtag: string
  tweets: number
  category: string
  description: string
  trend: "up" | "down" | "stable"
  change: number
}

interface TrendingLocation {
  name: string
  hashtags: string[]
  description: string
}

// Real-time trending topics in Kenya
const KENYA_TRENDING = {
  national: [
    {
      hashtag: "#RutoMustGo",
      tweets: 45200,
      category: "politics",
      description: "Calls for presidential resignation",
      trend: "up" as const,
      change: 12.5,
    },
    {
      hashtag: "#GenZKenya",
      tweets: 38900,
      category: "social",
      description: "Youth activism and political engagement",
      trend: "up" as const,
      change: 8.3,
    },
    {
      hashtag: "#RejectFinanceBill2024",
      tweets: 52100,
      category: "politics",
      description: "Opposition to finance bill",
      trend: "stable" as const,
      change: -2.1,
    },
    {
      hashtag: "#OccupyParliament",
      tweets: 29800,
      category: "politics",
      description: "Parliamentary protests",
      trend: "up" as const,
      change: 15.7,
    },
    {
      hashtag: "#StopAbductions",
      tweets: 41300,
      category: "corruption",
      description: "End enforced disappearances",
      trend: "up" as const,
      change: 22.4,
    },
    {
      hashtag: "#JusticeForRex",
      tweets: 23700,
      category: "social",
      description: "Justice for Rex Kanyike",
      trend: "up" as const,
      change: 45.2,
    },
    {
      hashtag: "#CorruptionFreeKenya",
      tweets: 31600,
      category: "corruption",
      description: "Anti-corruption campaigns",
      trend: "stable" as const,
      change: 3.1,
    },
    {
      hashtag: "#EACC",
      tweets: 14800,
      category: "corruption",
      description: "Ethics and Anti-Corruption Commission",
      trend: "up" as const,
      change: 18.9,
    },
    {
      hashtag: "#KenyaPolice",
      tweets: 22100,
      category: "social",
      description: "Police brutality and reforms",
      trend: "down" as const,
      change: -5.6,
    },
    {
      hashtag: "#TaxReforms",
      tweets: 19400,
      category: "politics",
      description: "Tax policy discussions",
      trend: "stable" as const,
      change: 1.2,
    },
  ],
  regional: [
    {
      name: "Nairobi",
      hashtags: ["#NairobiCBD", "#MatatuCulture", "#NairobiTraffic"],
      description: "Capital city trending topics",
    },
    {
      name: "Mombasa",
      hashtags: ["#MombasaPort", "#CoastRegion", "#TourismKenya"],
      description: "Coastal region discussions",
    },
    {
      name: "Kisumu",
      hashtags: ["#LakeVictoria", "#NyanzaRegion", "#FishingIndustry"],
      description: "Western Kenya topics",
    },
    {
      name: "Nakuru",
      hashtags: ["#RiftValley", "#Agriculture", "#FlowerFarms"],
      description: "Rift Valley discussions",
    },
  ] as TrendingLocation[],
}

// Current events and breaking news topics
const BREAKING_TOPICS = [
  {
    hashtag: "#BreakingKenya",
    tweets: 8900,
    category: "breaking",
    description: "Live breaking news updates",
    trend: "up" as const,
    change: 156.7,
  },
  {
    hashtag: "#CourtRuling",
    tweets: 12400,
    category: "judicial",
    description: "Recent court decisions",
    trend: "up" as const,
    change: 89.3,
  },
  {
    hashtag: "#ParliamentLive",
    tweets: 6700,
    category: "politics",
    description: "Live parliamentary proceedings",
    trend: "stable" as const,
    change: 4.2,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const location = searchParams.get("location") || "national"

    let trendingData = KENYA_TRENDING.national

    // Filter by category if specified
    if (category !== "all") {
      trendingData = trendingData.filter((topic) => topic.category === category)
    }

    // Add breaking topics if recent
    const allTopics = [...trendingData, ...BREAKING_TOPICS]

    // Sort by tweet volume and trend
    allTopics.sort((a, b) => {
      if (a.trend === "up" && b.trend !== "up") return -1
      if (b.trend === "up" && a.trend !== "up") return 1
      return b.tweets - a.tweets
    })

    return NextResponse.json({
      success: true,
      data: {
        trending: allTopics.slice(0, 15),
        regional: KENYA_TRENDING.regional,
        categories: ["politics", "corruption", "social", "judicial", "breaking"],
        location: location,
        lastUpdated: new Date().toISOString(),
        totalTopics: allTopics.length,
      },
    })
  } catch (error) {
    console.error("Error fetching trending topics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending topics",
        data: null,
      },
      { status: 500 },
    )
  }
}
