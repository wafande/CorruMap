import { NextResponse } from "next/server"
import { RSS_FEEDS, parseRSSFeed, calculateRelevanceScore, categorizeArticle } from "@/lib/rss-parser"
import type { NewsArticle } from "@/lib/news-api"

// Cache for storing fetched news
let newsCache: NewsArticle[] = []
let lastFetchTime = 0
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {
    // Check if we need to refresh the cache
    const now = Date.now()
    if (now - lastFetchTime > CACHE_DURATION || newsCache.length === 0) {
      console.log("Fetching fresh news from RSS feeds...")
      await refreshNewsCache()
      lastFetchTime = now
    }

    // Filter by category if specified
    let filteredNews = newsCache
    if (category !== "all") {
      filteredNews = newsCache.filter((article) => article.category === category)
    }

    // Sort by relevance score and publication date
    filteredNews.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    // Limit results
    const limitedNews = filteredNews.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedNews,
      total: filteredNews.length,
      cached: true,
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

async function refreshNewsCache() {
  const allArticles: NewsArticle[] = []

  // Fetch from all RSS feeds concurrently
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      console.log(`Fetching from ${feed.source}...`)
      const items = await parseRSSFeed(feed.url)

      return items
        .map((item): NewsArticle => {
          const relevanceScore = calculateRelevanceScore(item, feed.keywords)
          const category = categorizeArticle(item, feed.category, feed.keywords)

          return {
            id: `${feed.source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            description: item.description,
            content: item.content,
            url: item.url,
            source: feed.source,
            publishedAt: item.publishedAt,
            imageUrl: item.imageUrl,
            category: category as any,
            relevanceScore,
          }
        })
        .filter((article) => article.relevanceScore > 0) // Only include relevant articles
    } catch (error) {
      console.error(`Error fetching from ${feed.source}:`, error)
      return []
    }
  })

  const feedResults = await Promise.all(feedPromises)

  // Flatten and deduplicate articles
  feedResults.forEach((articles) => {
    articles.forEach((article) => {
      // Simple deduplication by title similarity
      const isDuplicate = allArticles.some(
        (existing) =>
          existing.title.toLowerCase().includes(article.title.toLowerCase().substring(0, 20)) ||
          article.title.toLowerCase().includes(existing.title.toLowerCase().substring(0, 20)),
      )

      if (!isDuplicate) {
        allArticles.push(article)
      }
    })
  })

  console.log(`Fetched ${allArticles.length} unique articles from ${RSS_FEEDS.length} sources`)
  newsCache = allArticles
}

// Force refresh endpoint
export async function POST() {
  try {
    await refreshNewsCache()
    lastFetchTime = Date.now()

    return NextResponse.json({
      success: true,
      message: "News cache refreshed successfully",
      articlesCount: newsCache.length,
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  } catch (error) {
    console.error("Error refreshing news cache:", error)
    return NextResponse.json({ success: false, error: "Failed to refresh news cache" }, { status: 500 })
  }
}
