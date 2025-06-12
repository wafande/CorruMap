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

// Cache implementation
interface CacheItem<T> {
  data: T
  timestamp: number
}

class TwitterCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private ttl: number // Time to live in milliseconds

  constructor(ttlMinutes = 60) {
    this.ttl = ttlMinutes * 60 * 1000
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if item is expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }
}

export class TwitterApiClient {
  private bearerToken: string
  private baseUrl = "https://api.twitter.com/2"
  private cache: TwitterCache

  constructor(config: TwitterApiConfig) {
    this.bearerToken = config.bearerToken
    this.cache = new TwitterCache(60) // 60 minute cache
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

      if (response.status === 429) {
        // Rate limited by Twitter
        const resetHeader = response.headers.get("x-rate-limit-reset")
        let resetTimeSeconds = 15 * 60 // Default 15 minutes

        if (resetHeader) {
          const resetTime = Number.parseInt(resetHeader) * 1000
          resetTimeSeconds = Math.ceil((resetTime - Date.now()) / 1000)
        }

        throw new Error(`Twitter API rate limit exceeded. Try again in ${resetTimeSeconds} seconds.`)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Twitter API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // Get user information by username
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    const cacheKey = `user:${username}`
    const cachedUser = this.cache.get<TwitterUser>(cacheKey)

    if (cachedUser) {
      return cachedUser
    }

    try {
      const response = await this.makeRequest<TwitterUser>(`/users/by/username/${username}`, {
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url,description",
      })

      if (response.data) {
        this.cache.set(cacheKey, response.data)
        return response.data
      }
      return null
    } catch (error) {
      console.error(`Failed to get user ${username}:`, error)
      throw error // Re-throw to be caught by the API route
    }
  }

  // Get multiple users by usernames
  async getUsersByUsernames(usernames: string[]): Promise<TwitterUser[]> {
    // Check cache first
    const cachedUsers: TwitterUser[] = []
    const uncachedUsernames: string[] = []

    for (const username of usernames) {
      const cachedUser = this.cache.get<TwitterUser>(`user:${username}`)
      if (cachedUser) {
        cachedUsers.push(cachedUser)
      } else {
        uncachedUsernames.push(username)
      }
    }

    // If all users are cached, return them
    if (uncachedUsernames.length === 0) {
      return cachedUsers
    }

    try {
      // Only fetch first 2 users to minimize API calls
      const limitedUsernames = uncachedUsernames.slice(0, 2)

      const response = await this.makeRequest<TwitterUser[]>("/users/by", {
        usernames: limitedUsernames.join(","),
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url,description",
      })

      if (response.data) {
        // Cache each user
        response.data.forEach((user) => {
          this.cache.set(`user:${user.username}`, user)
        })
        return [...cachedUsers, ...response.data]
      }

      return cachedUsers
    } catch (error) {
      console.error("Failed to get users batch:", error)
      throw error // Re-throw to be caught by the API route
    }
  }

  // Get recent tweets from a user
  async getUserTweets(userId: string, maxResults = 3): Promise<{ tweets: TwitterTweet[]; user: TwitterUser | null }> {
    const cacheKey = `tweets:${userId}:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; user: TwitterUser | null }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await this.makeRequest<TwitterTweet[]>(`/users/${userId}/tweets`, {
        max_results: Math.min(maxResults, 5).toString(),
        "tweet.fields": "id,text,created_at,author_id,public_metrics,entities,context_annotations",
        expansions: "author_id",
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url",
      })

      const tweets = response.data || []
      const user = response.includes?.users?.[0] || null

      const result = { tweets, user }
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error(`Failed to get tweets for user ${userId}:`, error)
      throw error // Re-throw to be caught by the API route
    }
  }

  // Search for tweets with specific keywords
  async searchTweets(query: string, maxResults = 10): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    const cacheKey = `search:${query}:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await this.makeRequest<TwitterTweet[]>("/tweets/search/recent", {
        query: query,
        max_results: Math.min(maxResults, 10).toString(),
        "tweet.fields": "id,text,created_at,author_id,public_metrics,entities,context_annotations",
        expansions: "author_id",
        "user.fields": "id,username,name,verified,public_metrics,profile_image_url",
      })

      const tweets = response.data || []
      const users = response.includes?.users || []

      const result = { tweets, users }
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error("Failed to search tweets:", error)
      throw error // Re-throw to be caught by the API route
    }
  }

  // Get corruption-related tweets from monitored accounts
  async getCorruptionTweets(maxResults = 15): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    const cacheKey = `corruption:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Use a simpler search to avoid complex queries
      const query = `(corruption OR EACC) lang:en -is:retweet`

      const result = await this.searchTweets(query, Math.min(maxResults, 10))
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error("Failed to get corruption tweets:", error)
      throw error // Re-throw to be caught by the API route
    }
  }

  // Get tweets from specific Kenyan accounts
  async getKenyanAccountsTweets(maxResults = 15): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    const cacheKey = `kenyan:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Only get 1 user at a time to minimize API calls
      const limitedAccounts = KENYAN_CORRUPTION_ACCOUNTS.slice(0, 1)
      const users = await this.getUsersByUsernames(limitedAccounts)

      if (users.length === 0) {
        throw new Error("No users found")
      }

      const allTweets: TwitterTweet[] = []
      const allUsers: TwitterUser[] = []

      // Get recent tweets from the user (max 3 per user)
      for (const user of users) {
        const { tweets, user: userInfo } = await this.getUserTweets(user.id, 3)
        allTweets.push(...tweets)
        if (userInfo) allUsers.push(userInfo)
      }

      // Sort tweets by creation date (most recent first)
      allTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      const result = {
        tweets: allTweets.slice(0, maxResults),
        users: allUsers,
      }

      this.cache.set(cacheKey, result)
      return result
    } catch (error) {
      console.error("Failed to get Kenyan accounts tweets:", error)
      throw error // Re-throw to be caught by the API route
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
