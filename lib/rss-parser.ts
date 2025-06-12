// Enhanced RSS feed parser with better error handling and updated URLs
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

// Updated RSS feeds with working URLs and fallbacks
export const RSS_FEEDS: RSSFeed[] = [
  {
    url: "https://www.nation.co.ke/kenya/news/-/1056/1056/-/view/asFeed/-/index.xml",
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
    url: "https://www.citizen.digital/news/feed/",
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
    url: "https://www.businessdailyafrica.com/bd/news/-/539546/539546/-/view/asFeed/-/index.xml",
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

// Fallback mock data for when RSS feeds fail
const MOCK_NEWS_DATA: ParsedRSSItem[] = [
  {
    title: "EACC Recovers Ksh 2.1 Billion in Corruption Cases This Quarter",
    description:
      "The Ethics and Anti-Corruption Commission reports significant asset recovery in ongoing corruption investigations across multiple government agencies.",
    content:
      "The Ethics and Anti-Corruption Commission reports significant asset recovery in ongoing corruption investigations across multiple government agencies.",
    url: "https://example.com/eacc-recovery",
    source: "Daily Nation",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: "corruption",
  },
  {
    title: "Parliament Committee Probes County Government Procurement Irregularities",
    description:
      "Public Accounts Committee launches investigation into questionable procurement practices in three county governments.",
    content:
      "Public Accounts Committee launches investigation into questionable procurement practices in three county governments.",
    url: "https://example.com/parliament-probe",
    source: "The Standard",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    category: "government",
  },
  {
    title: "High Court Orders Asset Freeze in Multi-Million Corruption Case",
    description:
      "Court freezes assets worth Ksh 800 million linked to former government officials in ongoing corruption trial.",
    content:
      "Court freezes assets worth Ksh 800 million linked to former government officials in ongoing corruption trial.",
    url: "https://example.com/court-freeze",
    source: "Citizen Digital",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    category: "judicial",
  },
  {
    title: "Treasury Audit Reveals Ksh 5 Billion Budget Discrepancies",
    description:
      "Auditor General's report highlights significant financial irregularities in government spending across multiple ministries.",
    content:
      "Auditor General's report highlights significant financial irregularities in government spending across multiple ministries.",
    url: "https://example.com/treasury-audit",
    source: "Business Daily",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    category: "finance",
  },
  {
    title: "Anti-Corruption Court Sentences Former PS to 10 Years in Prison",
    description:
      "Former Principal Secretary found guilty of embezzling public funds receives maximum sentence in landmark corruption case.",
    content:
      "Former Principal Secretary found guilty of embezzling public funds receives maximum sentence in landmark corruption case.",
    url: "https://example.com/ps-sentence",
    source: "Capital FM News",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    category: "judicial",
  },
  {
    title: "Kenya Ranks 123rd in Global Corruption Perception Index",
    description:
      "Transparency International's latest report shows Kenya's corruption perception score remains concerning despite anti-corruption efforts.",
    content:
      "Transparency International's latest report shows Kenya's corruption perception score remains concerning despite anti-corruption efforts.",
    url: "https://example.com/corruption-index",
    source: "BBC Africa",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    category: "corruption",
  },
]

export async function parseRSSFeed(feedUrl: string): Promise<ParsedRSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml",
        "Cache-Control": "no-cache",
      },
      redirect: "follow", // Follow redirects automatically
      timeout: 10000, // 10 second timeout
    })

    if (!response.ok) {
      console.warn(`RSS feed ${feedUrl} returned status ${response.status}, using fallback data`)
      return []
    }

    const xmlText = await response.text()

    // Check if response is actually XML
    if (!xmlText.includes("<?xml") && !xmlText.includes("<rss") && !xmlText.includes("<feed")) {
      console.warn(`RSS feed ${feedUrl} did not return valid XML, using fallback data`)
      return []
    }

    // Parse XML using DOMParser
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror")
    if (parserError) {
      console.warn(`XML parsing error for ${feedUrl}:`, parserError.textContent)
      return []
    }

    const items = xmlDoc.querySelectorAll("item, entry") // Support both RSS and Atom
    const parsedItems: ParsedRSSItem[] = []

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || ""
      const description = item.querySelector("description, summary")?.textContent?.trim() || ""
      const link =
        item.querySelector("link")?.textContent?.trim() || item.querySelector("link")?.getAttribute("href") || ""
      const pubDate = item.querySelector("pubDate, published, updated")?.textContent?.trim() || ""

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

// Function to get mock data when RSS feeds fail
export function getMockNewsData(): ParsedRSSItem[] {
  return MOCK_NEWS_DATA.map((item) => ({
    ...item,
    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(), // Random time within last 24 hours
  }))
}
