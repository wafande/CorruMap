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

  constructor(ttlMinutes = 15) {
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

  // Get all keys that match a prefix
  getKeysByPrefix(prefix: string): string[] {
    return Array.from(this.cache.keys()).filter((key) => key.startsWith(prefix))
  }
}

// Rate limiter implementation
class RateLimiter {
  private requestTimes: number[] = []
  private maxRequests: number
  private timeWindow: number // in milliseconds

  constructor(maxRequests = 15, timeWindowSeconds = 15 * 60) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowSeconds * 1000
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now()

    // Remove old requests outside the time window
    this.requestTimes = this.requestTimes.filter((time) => now - time < this.timeWindow)

    // Check if we've hit the limit
    if (this.requestTimes.length >= this.maxRequests) {
      return false
    }

    // Add current request time
    this.requestTimes.push(now)
    return true
  }

  getTimeUntilReset(): number {
    if (this.requestTimes.length === 0) return 0

    const oldestRequest = Math.min(...this.requestTimes)
    const resetTime = oldestRequest + this.timeWindow - Date.now()

    return Math.max(0, resetTime)
  }
}

export class TwitterApiClient {
  private bearerToken: string
  private baseUrl = "https://api.twitter.com/2"
  private cache: TwitterCache
  private rateLimiter: RateLimiter
  private isRateLimited = false
  private rateLimitResetTime = 0

  constructor(config: TwitterApiConfig) {
    this.bearerToken = config.bearerToken
    this.cache = new TwitterCache(15) // 15 minute cache
    this.rateLimiter = new RateLimiter(15, 15 * 60) // 15 requests per 15 minutes
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<TwitterApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    // Check if we're rate limited
    if (this.isRateLimited) {
      const now = Date.now()
      if (now < this.rateLimitResetTime) {
        throw new Error(`Rate limited. Try again in ${Math.ceil((this.rateLimitResetTime - now) / 1000)} seconds.`)
      }
      this.isRateLimited = false
    }

    // Check rate limiter
    const canProceed = await this.rateLimiter.checkLimit()
    if (!canProceed) {
      this.isRateLimited = true
      this.rateLimitResetTime = Date.now() + this.rateLimiter.getTimeUntilReset()
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(this.rateLimiter.getTimeUntilReset() / 1000)} seconds.`,
      )
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
        this.isRateLimited = true

        // Get reset time from headers or default to 15 minutes
        const resetHeader = response.headers.get("x-rate-limit-reset")
        if (resetHeader) {
          this.rateLimitResetTime = Number.parseInt(resetHeader) * 1000
        } else {
          this.rateLimitResetTime = Date.now() + 15 * 60 * 1000
        }

        throw new Error(
          `Twitter API rate limit exceeded. Try again in ${Math.ceil((this.rateLimitResetTime - Date.now()) / 1000)} seconds.`,
        )
      }

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
      return null
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

    // Fetch uncached users in batches of 5 to avoid rate limits
    const batchSize = 5
    const batches = []

    for (let i = 0; i < uncachedUsernames.length; i += batchSize) {
      batches.push(uncachedUsernames.slice(i, i + batchSize))
    }

    const fetchedUsers: TwitterUser[] = []

    for (const batch of batches) {
      try {
        const response = await this.makeRequest<TwitterUser[]>("/users/by", {
          usernames: batch.join(","),
          "user.fields": "id,username,name,verified,public_metrics,profile_image_url,description",
        })

        if (response.data) {
          // Cache each user
          response.data.forEach((user) => {
            this.cache.set(`user:${user.username}`, user)
            fetchedUsers.push(user)
          })
        }

        // Add delay between batches to avoid rate limits
        if (batches.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error("Failed to get users batch:", error)
        // Continue with next batch
      }
    }

    return [...cachedUsers, ...fetchedUsers]
  }

  // Get recent tweets from a user
  async getUserTweets(userId: string, maxResults = 5): Promise<{ tweets: TwitterTweet[]; user: TwitterUser | null }> {
    const cacheKey = `tweets:${userId}:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; user: TwitterUser | null }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await this.makeRequest<TwitterTweet[]>(`/users/${userId}/tweets`, {
        max_results: maxResults.toString(),
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
      return { tweets: [], user: null }
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
        max_results: maxResults.toString(),
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
      return { tweets: [], users: [] }
    }
  }

  // Get corruption-related tweets from monitored accounts
  async getCorruptionTweets(maxResults = 30): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    const cacheKey = `corruption:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Build search query for corruption-related content from Kenyan accounts
      const accountQuery = KENYAN_CORRUPTION_ACCOUNTS.slice(0, 5)
        .map((username) => `from:${username}`)
        .join(" OR ")
      const keywordQuery = CORRUPTION_KEYWORDS.slice(0, 10)
        .map((keyword) => `"${keyword}"`)
        .join(" OR ")

      // Combine account and keyword filters
      const query = `(${accountQuery}) AND (${keywordQuery}) -is:retweet lang:en`

      const result = await this.searchTweets(query, maxResults)
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error("Failed to get corruption tweets:", error)
      return { tweets: [], users: [] }
    }
  }

  // Get tweets from specific Kenyan accounts
  async getKenyanAccountsTweets(maxResults = 30): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    const cacheKey = `kenyan:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Only get 5 users at a time to avoid rate limits
      const users = await this.getUsersByUsernames(KENYAN_CORRUPTION_ACCOUNTS.slice(0, 5))
      const allTweets: TwitterTweet[] = []
      const allUsers: TwitterUser[] = []

      // Get recent tweets from each user (max 2 per user)
      for (const user of users) {
        const { tweets, user: userInfo } = await this.getUserTweets(user.id, 2)
        allTweets.push(...tweets)
        if (userInfo) allUsers.push(userInfo)

        // Add delay between requests
        await new Promise((resolve) => setTimeout(resolve, 500))
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
      return { tweets: [], users: [] }
    }
  }

  // Get mock data when rate limited
  getMockKenyanTweets(): { tweets: any[]; users: any[] } {
    const mockUsers = [
      {
        id: "mock_1",
        username: "bonifacemwangi",
        name: "Boniface Mwangi",
        verified: true,
        public_metrics: {
          followers_count: 1800000,
          following_count: 2500,
          tweet_count: 45000,
          listed_count: 1200,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/boniface_400x400.jpg",
      },
      {
        id: "mock_2",
        username: "LarryMadowo",
        name: "Larry Madowo",
        verified: true,
        public_metrics: {
          followers_count: 2100000,
          following_count: 1800,
          tweet_count: 62000,
          listed_count: 1500,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/larry_400x400.jpg",
      },
      {
        id: "mock_3",
        username: "MarthaKarua",
        name: "Martha Karua",
        verified: true,
        public_metrics: {
          followers_count: 1500000,
          following_count: 950,
          tweet_count: 28000,
          listed_count: 800,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/martha_400x400.jpg",
      },
      {
        id: "mock_4",
        username: "EACCKenya",
        name: "EACC Kenya",
        verified: true,
        public_metrics: {
          followers_count: 850000,
          following_count: 350,
          tweet_count: 12000,
          listed_count: 450,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/eacc_400x400.jpg",
      },
      {
        id: "mock_5",
        username: "C_NyaKundiH",
        name: "Caroline Nyakundihi",
        verified: false,
        public_metrics: {
          followers_count: 320000,
          following_count: 1200,
          tweet_count: 18000,
          listed_count: 250,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/caroline_400x400.jpg",
      },
    ]

    const mockTweets = [
      {
        id: "mock_tweet_1",
        text: "BREAKING: EACC has recovered assets worth Ksh 22.8 billion in the last fiscal year. This is the highest recovery in Kenya's history. #CorruptionFreeKenya #AssetRecovery",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        author_id: "mock_4",
        public_metrics: {
          retweet_count: 1245,
          like_count: 3782,
          reply_count: 421,
          quote_count: 189,
        },
        entities: {
          hashtags: [{ tag: "CorruptionFreeKenya" }, { tag: "AssetRecovery" }],
        },
      },
      {
        id: "mock_tweet_2",
        text: "The Finance Bill protests have exposed deep corruption in our procurement systems. We need transparency in ALL government contracts. #RejectFinanceBill2024 #CorruptionKills",
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        author_id: "mock_1",
        public_metrics: {
          retweet_count: 2876,
          like_count: 9541,
          reply_count: 732,
          quote_count: 412,
        },
        entities: {
          hashtags: [{ tag: "RejectFinanceBill2024" }, { tag: "CorruptionKills" }],
        },
      },
      {
        id: "mock_tweet_3",
        text: "Just interviewed Kenya's anti-corruption czar for CNN. The EACC says they're investigating 24 governors for corruption and misappropriation of county funds. Full story tonight at 9pm EAT. #KenyaCorruption",
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        author_id: "mock_2",
        public_metrics: {
          retweet_count: 1532,
          like_count: 4267,
          reply_count: 328,
          quote_count: 156,
        },
        entities: {
          hashtags: [{ tag: "KenyaCorruption" }],
        },
      },
      {
        id: "mock_tweet_4",
        text: "The Judiciary must remain independent to effectively fight corruption. When courts are compromised, impunity thrives. #JudicialIndependence #RuleOfLaw",
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        author_id: "mock_3",
        public_metrics: {
          retweet_count: 1876,
          like_count: 5432,
          reply_count: 421,
          quote_count: 187,
        },
        entities: {
          hashtags: [{ tag: "JudicialIndependence" }, { tag: "RuleOfLaw" }],
        },
      },
      {
        id: "mock_tweet_5",
        text: "Human rights activists are being targeted for exposing corruption. This must stop! We need protection for whistleblowers and anti-corruption advocates. #ProtectWhistleblowers #HumanRights",
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        author_id: "mock_5",
        public_metrics: {
          retweet_count: 987,
          like_count: 2543,
          reply_count: 213,
          quote_count: 98,
        },
        entities: {
          hashtags: [{ tag: "ProtectWhistleblowers" }, { tag: "HumanRights" }],
        },
      },
      {
        id: "mock_tweet_6",
        text: "Today we charged 3 senior procurement officers with abuse of office and fraudulent acquisition of public property worth Ksh 348 million. #FightingCorruption #Accountability",
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
        author_id: "mock_4",
        public_metrics: {
          retweet_count: 876,
          like_count: 2134,
          reply_count: 187,
          quote_count: 76,
        },
        entities: {
          hashtags: [{ tag: "FightingCorruption" }, { tag: "Accountability" }],
        },
      },
      {
        id: "mock_tweet_7",
        text: "The youth of Kenya are demanding accountability. Their voices cannot be ignored. #GenZKenya is leading the charge against corruption. #YouthPower",
        created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7 hours ago
        author_id: "mock_1",
        public_metrics: {
          retweet_count: 3421,
          like_count: 8765,
          reply_count: 654,
          quote_count: 321,
        },
        entities: {
          hashtags: [{ tag: "GenZKenya" }, { tag: "YouthPower" }],
        },
      },
    ]

    return {
      tweets: mockTweets,
      users: mockUsers,
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
