// Enhanced RSS feed parser with BBC and social media integration
export interface RSSFeed {
  url: string
  source: string
  category: "corruption" | "government" | "finance" | "judicial" | "general"
  keywords: string[]
}

export interface TwitterAccount {
  username: string
  name: string
  category: "journalist" | "activist" | "official" | "media"
}

export interface ParsedRSSItem {
  title: string
  description: string
  content: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: string
}

// Enhanced RSS feeds including BBC
export const RSS_FEEDS: RSSFeed[] = [
  {
    url: "https://www.nation.co.ke/kenya/news/rss",
    source: "Daily Nation",
    category: "general",
    keywords: ["corruption", "EACC", "DCI", "government", "treasury", "audit", "scandal", "protest", "genz"],
  },
  {
    url: "https://www.standardmedia.co.ke/rss/headlines.php",
    source: "The Standard",
    category: "general",
    keywords: ["corruption", "ethics", "anti-corruption", "government", "parliament", "county", "protest"],
  },
  {
    url: "https://www.citizen.digital/news/rss",
    source: "Citizen Digital",
    category: "general",
    keywords: ["corruption", "judiciary", "EACC", "DPP", "investigation", "fraud", "protest", "abduction"],
  },
  {
    url: "https://www.capitalfm.co.ke/news/feed/",
    source: "Capital FM News",
    category: "general",
    keywords: ["corruption", "government", "transparency", "accountability", "audit", "protest"],
  },
  {
    url: "https://www.businessdailyafrica.com/bd/news/rss",
    source: "Business Daily",
    category: "finance",
    keywords: ["corruption", "financial", "treasury", "budget", "procurement", "tender"],
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    source: "BBC Africa",
    category: "general",
    keywords: ["kenya", "corruption", "government", "nairobi", "protest", "finance bill"],
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    source: "BBC World",
    category: "general",
    keywords: ["kenya", "corruption", "east africa", "protest", "government"],
  },
]

// Twitter accounts to monitor
export const TWITTER_ACCOUNTS: TwitterAccount[] = [
  { username: "C_NyaKundiH", name: "Caroline Nyakundihi", category: "activist" },
  { username: "lynn_ngugi1", name: "Lynn Ngugi", category: "journalist" },
  { username: "Kenyans", name: "Kenyans.co.ke", category: "media" },
  { username: "LarryMadowo", name: "Larry Madowo", category: "journalist" },
]

export async function parseRSSFeed(feedUrl: string): Promise<ParsedRSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "CorruMap News Aggregator 1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML using DOMParser
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    const items = xmlDoc.querySelectorAll("item")
    const parsedItems: ParsedRSSItem[] = []

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || ""
      const description = item.querySelector("description")?.textContent?.trim() || ""
      const link = item.querySelector("link")?.textContent?.trim() || ""
      const pubDate = item.querySelector("pubDate")?.textContent?.trim() || ""

      // Extract image from description or media:content
      let imageUrl = ""
      const mediaContent = item.querySelector("media\\:content, content")
      if (mediaContent) {
        imageUrl = mediaContent.getAttribute("url") || ""
      } else {
        // Try to extract image from description HTML
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i)
        if (imgMatch) {
          imageUrl = imgMatch[1]
        }
      }

      // Clean description of HTML tags
      const cleanDescription = description.replace(/<[^>]*>/g, "").substring(0, 300)

      if (title && link) {
        parsedItems.push({
          title,
          description: cleanDescription,
          content: cleanDescription,
          url: link,
          source: "",
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          imageUrl: imageUrl || undefined,
          category: "general",
        })
      }
    })

    return parsedItems
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error)
    return []
  }
}

export function calculateRelevanceScore(item: ParsedRSSItem, keywords: string[]): number {
  const text = `${item.title} ${item.description}`.toLowerCase()
  let score = 0

  keywords.forEach((keyword) => {
    const keywordLower = keyword.toLowerCase()
    const titleMatches = (item.title.toLowerCase().match(new RegExp(keywordLower, "g")) || []).length
    const descMatches = (item.description.toLowerCase().match(new RegExp(keywordLower, "g")) || []).length

    // Title matches are weighted more heavily
    score += titleMatches * 30 + descMatches * 10
  })

  // Normalize score to 0-100 range
  return Math.min(100, Math.max(0, score))
}

export function categorizeArticle(item: ParsedRSSItem, feedCategory: string, keywords: string[]): string {
  const text = `${item.title} ${item.description}`.toLowerCase()

  // Check for specific category keywords
  if (text.includes("eacc") || text.includes("corruption") || text.includes("fraud") || text.includes("scandal")) {
    return "corruption"
  }
  if (text.includes("court") || text.includes("judge") || text.includes("judiciary") || text.includes("legal")) {
    return "judicial"
  }
  if (text.includes("budget") || text.includes("treasury") || text.includes("finance") || text.includes("tax")) {
    return "finance"
  }
  if (
    text.includes("government") ||
    text.includes("parliament") ||
    text.includes("county") ||
    text.includes("ministry")
  ) {
    return "government"
  }

  return feedCategory
}
