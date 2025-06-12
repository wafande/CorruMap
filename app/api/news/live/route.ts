import { NextResponse } from "next/server"
import { parseRSSFeed, RSS_FEEDS, calculateRelevanceScore, categorizeArticle } from "@/lib/rss-parser"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Fetch from multiple RSS sources concurrently
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const items = await parseRSSFeed(feed.url)
        return items.map((item) => ({
          ...item,
          source: feed.source,
          category: categorizeArticle(item, feed.category, feed.keywords),
          relevanceScore: calculateRelevanceScore(item, feed.keywords),
        }))
      } catch (error) {
        console.error(`Error fetching ${feed.source}:`, error)
        return []
      }
    })

    const allFeeds = await Promise.all(feedPromises)
    let allArticles = allFeeds.flat()

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
    })
  } catch (error) {
    console.error("Error fetching live news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch live news",
        data: [],
      },
      { status: 500 },
    )
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
