import { NextResponse } from "next/server"
import { parseRSSFeed, RSS_FEEDS, calculateRelevanceScore, categorizeArticle, getMockNewsData } from "@/lib/rss-parser"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Fetch from multiple RSS sources concurrently with timeout
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const items = await Promise.race([
          parseRSSFeed(feed.url),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)),
        ])

        return items.map((item) => ({
          ...item,
          source: feed.source,
          category: categorizeArticle(item, feed.category, feed.keywords),
          relevanceScore: calculateRelevanceScore(item, feed.keywords),
        }))
      } catch (error) {
        console.warn(`Error fetching ${feed.source}:`, error)
        return []
      }
    })

    const allFeeds = await Promise.all(feedPromises)
    let allArticles = allFeeds.flat()

    // If no articles were fetched (all feeds failed), use mock data
    if (allArticles.length === 0) {
      console.log("All RSS feeds failed, using mock data")
      allArticles = getMockNewsData().map((item) => ({
        ...item,
        relevanceScore: calculateRelevanceScore(item, ["corruption", "government", "eacc", "fraud"]),
      }))
    }

    // Filter by category if specified
    if (category !== "all") {
      allArticles = allArticles.filter((article) => article.category === category)
    }

    // Sort by relevance score and publication date
    allArticles.sort((a, b) => {
      const scoreA = a.relevanceScore
      const scoreB = b.relevanceScore
      if (scoreA !== scoreB) return scoreB - scoreA
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    // Limit results
    const limitedArticles = allArticles.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedArticles,
      total: allArticles.length,
      lastUpdated: new Date().toISOString(),
      usingMockData: allFeeds.flat().length === 0,
    })
  } catch (error) {
    console.error("Error fetching live news:", error)

    // Return mock data as fallback
    const mockData = getMockNewsData().map((item) => ({
      ...item,
      relevanceScore: calculateRelevanceScore(item, ["corruption", "government", "eacc", "fraud"]),
    }))

    return NextResponse.json({
      success: true,
      data: mockData.slice(0, Number.parseInt(new URL(request.url).searchParams.get("limit") || "20")),
      total: mockData.length,
      lastUpdated: new Date().toISOString(),
      usingMockData: true,
      error: "RSS feeds unavailable, showing sample data",
    })
  }
}

export async function POST() {
  // Force refresh cache
  try {
    // In a real implementation, this would clear any caching
    return NextResponse.json({
      success: true,
      message: "News cache refreshed",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh cache",
      },
      { status: 500 },
    )
  }
}
