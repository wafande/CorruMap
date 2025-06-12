interface TwitterApiConfig {
  bearerToken: string
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  accessTokenSecret?: string
}

interface TwitterUser {
  id: string
  username: string
  name: string
  verified: boolean
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
  profile_image_url?: string
  description?: string
}

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  entities?: {
    hashtags?: Array<{ tag: string }>
    mentions?: Array<{ username: string }>
    urls?: Array<{ expanded_url: string }>
  }
  context_annotations?: Array<{
    domain: { name: string }
    entity: { name: string }
  }>
}

interface TwitterApiResponse<T> {
  data?: T
  includes?: {
    users?: TwitterUser[]
  }
  meta?: {
    result_count: number
    next_token?: string
  }
  errors?: Array<{
    title: string
    detail: string
    type: string
  }>
}

// Kenyan accounts to monitor for corruption-related content
export const KENYAN_CORRUPTION_ACCOUNTS = [
  "C_NyaKundiH", // Caroline Nyakundihi - Human Rights Activist
  "lynn_ngugi1", // Lynn Ngugi - Journalist
  "Kenyans", // Kenyans.co.ke - News Platform
  "LarryMadowo", // Larry Madowo - CNN Correspondent
  "bonifacemwangi", // Boniface Mwangi - Activist
  "ahmednasirlaw", // Ahmednasir Abdullahi - Senior Counsel
  "RobertAlai", // Robert Alai - Blogger
  "MarthaKarua", // Martha Karua - Politician
  "WilliamsRuto", // William Ruto - President
  "RailaOdinga", // Raila Odinga - Former PM
  "EACCKenya", // EACC Official Account
  "DPPKenya", // Director of Public Prosecutions
  "KenyaParliament", // Parliament of Kenya
  "NationMediaGrp", // Nation Media Group
  "StandardKenya", // The Standard
  "CitizenTVKenya", // Citizen TV
  "KTNNewsKE", // KTN News
  "CapitalFMKenya", // Capital FM
]

// Corruption-related keywords for filtering
export const CORRUPTION_KEYWORDS = [
  "corruption",
  "corrupt",
  "EACC",
  "tender",
  "scandal",
  "embezzlement",
  "misappropriation",
  "fraud",
  "bribery",
  "kickback",
  "procurement",
  "accountability",
  "transparency",
  "audit",
  "investigation",
  "prosecution",
  "asset recovery",
  "whistleblower",
  "ethics",
  "integrity",
  "graft",
  "looting",
  "plunder",
  "cartels",
  "impunity",
  "justice",
]

export class TwitterApiClient {
  private bearerToken: string
  private baseUrl = "https://api.twitter.com/2"

  constructor(config: TwitterApiConfig) {
    this.bearerToken = config.bearerToken
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<TwitterApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Twitter API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Twitter API request failed:", error)
      throw error
    }
  }

  // Get user information by username
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    try {
      const response = await this.makeRequest<TwitterUser>(`/users/by/username/${username}`, {
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url,description",
      })

      return response.data || null
    } catch (error) {
      console.error(`Failed to get user ${username}:`, error)
      return null
    }
  }

  // Get multiple users by usernames
  async getUsersByUsernames(usernames: string[]): Promise<TwitterUser[]> {
    try {
      const response = await this.makeRequest<TwitterUser[]>("/users/by", {
        usernames: usernames.join(","),
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url,description",
      })

      return response.data || []
    } catch (error) {
      console.error("Failed to get users:", error)
      return []
    }
  }

  // Get recent tweets from a user
  async getUserTweets(userId: string, maxResults = 10): Promise<{ tweets: TwitterTweet[]; user: TwitterUser | null }> {
    try {
      const response = await this.makeRequest<TwitterTweet[]>(`/users/${userId}/tweets`, {
        max_results: maxResults.toString(),
        "tweet.fields": "id,text,created_at,author_id,public_metrics,entities,context_annotations",
        expansions: "author_id",
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url",
      })

      const tweets = response.data || []
      const user = response.includes?.users?.[0] || null

      return { tweets, user }
    } catch (error) {
      console.error(`Failed to get tweets for user ${userId}:`, error)
      return { tweets: [], user: null }
    }
  }

  // Search for tweets with specific keywords
  async searchTweets(query: string, maxResults = 10): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    try {
      const response = await this.makeRequest<TwitterTweet[]>("/tweets/search/recent", {
        query: query,
        max_results: maxResults.toString(),
        "tweet.fields": "id,text,created_at,author_id,public_metrics,entities,context_annotations",
        expansions: "author_id",
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url",
      })

      const tweets = response.data || []
      const users = response.includes?.users || []

      return { tweets, users }
    } catch (error) {
      console.error("Failed to search tweets:", error)
      return { tweets: [], users: [] }
    }
  }

  // Get trending topics (requires Twitter API v2 with specific access)
  async getTrendingTopics(woeid = 23424863): Promise<any[]> {
    // 23424863 is Kenya's WOEID
    try {
      // Note: Trending topics require Twitter API v1.1 or special v2 access
      // This is a placeholder for the actual implementation
      console.warn("Trending topics require special API access or v1.1 endpoint")
      return []
    } catch (error) {
      console.error("Failed to get trending topics:", error)
      return []
    }
  }

  // Get corruption-related tweets from monitored accounts
  async getCorruptionTweets(maxResults = 50): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    try {
      // Build search query for corruption-related content from Kenyan accounts
      const accountQuery = KENYAN_CORRUPTION_ACCOUNTS.map((username) => `from:${username}`).join(" OR ")
      const keywordQuery = CORRUPTION_KEYWORDS.map((keyword) => `"${keyword}"`).join(" OR ")

      // Combine account and keyword filters
      const query = `(${accountQuery}) AND (${keywordQuery}) -is:retweet lang:en`

      return await this.searchTweets(query, maxResults)
    } catch (error) {
      console.error("Failed to get corruption tweets:", error)
      return { tweets: [], users: [] }
    }
  }

  // Get tweets from specific Kenyan accounts
  async getKenyanAccountsTweets(maxResults = 30): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    try {
      const users = await this.getUsersByUsernames(KENYAN_CORRUPTION_ACCOUNTS.slice(0, 10)) // Limit to avoid rate limits
      const allTweets: TwitterTweet[] = []
      const allUsers: TwitterUser[] = []

      // Get recent tweets from each user
      for (const user of users) {
        const { tweets, user: userInfo } = await this.getUserTweets(user.id, 3) // 3 tweets per user
        allTweets.push(...tweets)
        if (userInfo) allUsers.push(userInfo)

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Sort tweets by creation date (most recent first)
      allTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      return {
        tweets: allTweets.slice(0, maxResults),
        users: allUsers,
      }
    } catch (error) {
      console.error("Failed to get Kenyan accounts tweets:", error)
      return { tweets: [], users: [] }
    }
  }
}

// Helper function to check if tweet is corruption-related
export function isCorruptionRelated(tweet: TwitterTweet): boolean {
  const text = tweet.text.toLowerCase()
  return CORRUPTION_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()))
}

// Helper function to extract hashtags from tweet
export function extractHashtags(tweet: TwitterTweet): string[] {
  return tweet.entities?.hashtags?.map((h) => `#${h.tag}`) || []
}

// Helper function to calculate relevance score
export function calculateRelevanceScore(tweet: TwitterTweet): number {
  let score = 0
  const text = tweet.text.toLowerCase()

  // Base score from engagement
  const engagement =
    tweet.public_metrics.like_count + tweet.public_metrics.retweet_count + tweet.public_metrics.reply_count
  score += Math.min(engagement / 100, 50) // Max 50 points from engagement

  // Keyword relevance
  const keywordMatches = CORRUPTION_KEYWORDS.filter((keyword) => text.includes(keyword.toLowerCase())).length
  score += keywordMatches * 10 // 10 points per keyword match

  // Context annotations (if available)
  if (tweet.context_annotations) {
    const relevantContexts = tweet.context_annotations.filter(
      (ctx) =>
        ctx.domain.name.toLowerCase().includes("government") ||
        ctx.domain.name.toLowerCase().includes("politics") ||
        ctx.entity.name.toLowerCase().includes("kenya"),
    )
    score += relevantContexts.length * 5 // 5 points per relevant context
  }

  // Recency bonus (newer tweets get higher scores)
  const hoursOld = (Date.now() - new Date(tweet.created_at).getTime()) / (1000 * 60 * 60)
  if (hoursOld < 24) {
    score += ((24 - hoursOld) / 24) * 20 // Up to 20 points for recent tweets
  }

  return Math.min(score, 100) // Cap at 100
}
