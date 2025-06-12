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

// Global rate limit state
let globalRateLimited = false
let globalRateLimitResetTime = 0

// Cache implementation
interface CacheItem<T> {
  data: T
  timestamp: number
}

class TwitterCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private ttl: number // Time to live in milliseconds

  constructor(ttlMinutes = 30) {
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

export class TwitterApiClient {
  private bearerToken: string
  private baseUrl = "https://api.twitter.com/2"
  private cache: TwitterCache

  constructor(config: TwitterApiConfig) {
    this.bearerToken = config.bearerToken
    this.cache = new TwitterCache(30) // 30 minute cache
  }

  // Check if we're currently rate limited
  private isCurrentlyRateLimited(): boolean {
    const now = Date.now()
    if (globalRateLimited && now < globalRateLimitResetTime) {
      return true
    }

    // Reset if time has passed
    if (globalRateLimited && now >= globalRateLimitResetTime) {
      globalRateLimited = false
      globalRateLimitResetTime = 0
    }

    return false
  }

  // Set rate limit status
  private setRateLimited(resetTimeSeconds?: number): void {
    globalRateLimited = true
    if (resetTimeSeconds) {
      globalRateLimitResetTime = Date.now() + resetTimeSeconds * 1000
    } else {
      globalRateLimitResetTime = Date.now() + 15 * 60 * 1000 // Default 15 minutes
    }
    console.log(`Rate limited until: ${new Date(globalRateLimitResetTime).toISOString()}`)
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<TwitterApiResponse<T>> {
    // Check if we're rate limited before making any request
    if (this.isCurrentlyRateLimited()) {
      const remainingTime = Math.ceil((globalRateLimitResetTime - Date.now()) / 1000)
      throw new Error(`Twitter API rate limit exceeded. Try again in ${remainingTime} seconds.`)
    }

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

        this.setRateLimited(resetTimeSeconds)
        throw new Error(`Twitter API rate limit exceeded. Try again in ${resetTimeSeconds} seconds.`)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Twitter API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      // Check if it's a rate limit error and set the flag
      if (error instanceof Error && error.message.includes("rate limit")) {
        const match = error.message.match(/Try again in (\d+) seconds/)
        if (match) {
          this.setRateLimited(Number.parseInt(match[1]))
        } else {
          this.setRateLimited()
        }
      }
      throw error
    }
  }

  // Get user information by username
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log(`Rate limited, skipping getUserByUsername for ${username}`)
      return null
    }

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
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, skipping getUsersByUsernames")
      return []
    }

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

    // If rate limited, return only cached users
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, returning only cached users")
      return cachedUsers
    }

    try {
      // Only fetch first 3 users to minimize API calls
      const limitedUsernames = uncachedUsernames.slice(0, 3)

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
      return cachedUsers // Return cached users on error
    }
  }

  // Get recent tweets from a user
  async getUserTweets(userId: string, maxResults = 3): Promise<{ tweets: TwitterTweet[]; user: TwitterUser | null }> {
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log(`Rate limited, skipping getUserTweets for ${userId}`)
      return { tweets: [], user: null }
    }

    const cacheKey = `tweets:${userId}:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; user: TwitterUser | null }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await this.makeRequest<TwitterTweet[]>(`/users/${userId}/tweets`, {
        max_results: Math.min(maxResults, 5).toString(), // Limit to 5 max
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
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, skipping searchTweets")
      return { tweets: [], users: [] }
    }

    const cacheKey = `search:${query}:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await this.makeRequest<TwitterTweet[]>("/tweets/search/recent", {
        query: query,
        max_results: Math.min(maxResults, 10).toString(), // Limit to 10 max
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
  async getCorruptionTweets(maxResults = 20): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, returning mock corruption tweets")
      return this.getMockKenyanTweets()
    }

    const cacheKey = `corruption:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Use a simpler search to avoid complex queries
      const query = `(corruption OR EACC OR scandal) lang:en -is:retweet`

      const result = await this.searchTweets(query, Math.min(maxResults, 15))
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error("Failed to get corruption tweets:", error)
      return this.getMockKenyanTweets()
    }
  }

  // Get tweets from specific Kenyan accounts
  async getKenyanAccountsTweets(maxResults = 20): Promise<{ tweets: TwitterTweet[]; users: TwitterUser[] }> {
    // Check rate limit first
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, returning mock Kenyan tweets")
      return this.getMockKenyanTweets()
    }

    const cacheKey = `kenyan:${maxResults}`
    const cachedData = this.cache.get<{ tweets: TwitterTweet[]; users: TwitterUser[] }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      // Only get 2 users at a time to minimize API calls
      const limitedAccounts = KENYAN_CORRUPTION_ACCOUNTS.slice(0, 2)
      const users = await this.getUsersByUsernames(limitedAccounts)

      if (users.length === 0) {
        console.log("No users found, returning mock data")
        return this.getMockKenyanTweets()
      }

      const allTweets: TwitterTweet[] = []
      const allUsers: TwitterUser[] = []

      // Get recent tweets from each user (max 2 per user)
      for (const user of users) {
        if (this.isCurrentlyRateLimited()) {
          console.log("Rate limited during user tweets fetch, breaking")
          break
        }

        const { tweets, user: userInfo } = await this.getUserTweets(user.id, 2)
        allTweets.push(...tweets)
        if (userInfo) allUsers.push(userInfo)

        // Add delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // If we got no tweets, return mock data
      if (allTweets.length === 0) {
        console.log("No tweets found, returning mock data")
        return this.getMockKenyanTweets()
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
      return this.getMockKenyanTweets()
    }
  }

  // Get mock data when rate limited or API unavailable
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
      {
        id: "mock_6",
        username: "ahmednasirlaw",
        name: "Ahmednasir Abdullahi",
        verified: true,
        public_metrics: {
          followers_count: 445000,
          following_count: 890,
          tweet_count: 35000,
          listed_count: 320,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/ahmed_400x400.jpg",
      },
      {
        id: "mock_7",
        username: "RobertAlai",
        name: "Robert Alai",
        verified: true,
        public_metrics: {
          followers_count: 680000,
          following_count: 1500,
          tweet_count: 78000,
          listed_count: 450,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/robert_400x400.jpg",
      },
      {
        id: "mock_8",
        username: "lynn_ngugi1",
        name: "Lynn Ngugi",
        verified: true,
        public_metrics: {
          followers_count: 1200000,
          following_count: 2100,
          tweet_count: 42000,
          listed_count: 890,
        },
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/lynn_400x400.jpg",
      },
    ]

    // Generate fresh timestamps for mock tweets
    const currentTime = Date.now()
    const mockTweets = [
      {
        id: "mock_tweet_1",
        text: "BREAKING: EACC has recovered assets worth Ksh 22.8 billion in the last fiscal year. This is the highest recovery in Kenya's history. The fight against corruption is yielding results! #CorruptionFreeKenya #AssetRecovery #EACC",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 60 + 10)).toISOString(),
        author_id: "mock_4",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 2000 + 500),
          like_count: Math.floor(Math.random() * 5000 + 1000),
          reply_count: Math.floor(Math.random() * 500 + 100),
          quote_count: Math.floor(Math.random() * 300 + 50),
        },
        entities: {
          hashtags: [{ tag: "CorruptionFreeKenya" }, { tag: "AssetRecovery" }, { tag: "EACC" }],
        },
      },
      {
        id: "mock_tweet_2",
        text: "The Finance Bill protests have exposed deep corruption in our procurement systems. We need transparency in ALL government contracts. Young Kenyans are demanding accountability! #RejectFinanceBill2024 #GenZKenya #CorruptionKills",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 120 + 30)).toISOString(),
        author_id: "mock_1",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 3000 + 1000),
          like_count: Math.floor(Math.random() * 8000 + 2000),
          reply_count: Math.floor(Math.random() * 800 + 200),
          quote_count: Math.floor(Math.random() * 500 + 100),
        },
        entities: {
          hashtags: [{ tag: "RejectFinanceBill2024" }, { tag: "GenZKenya" }, { tag: "CorruptionKills" }],
        },
      },
      {
        id: "mock_tweet_3",
        text: "Just interviewed Kenya's anti-corruption czar for @CNN. The EACC says they're investigating 24 governors for corruption and misappropriation of county funds. Full story tonight at 9pm EAT. This is huge! #KenyaCorruption #CountyGovernors",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 180 + 60)).toISOString(),
        author_id: "mock_2",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 2000 + 800),
          like_count: Math.floor(Math.random() * 6000 + 1500),
          reply_count: Math.floor(Math.random() * 400 + 150),
          quote_count: Math.floor(Math.random() * 200 + 80),
        },
        entities: {
          hashtags: [{ tag: "KenyaCorruption" }, { tag: "CountyGovernors" }],
        },
      },
      {
        id: "mock_tweet_4",
        text: "The Judiciary must remain independent to effectively fight corruption. When courts are compromised, impunity thrives. We need judges who cannot be bought! #JudicialIndependence #RuleOfLaw #AntiCorruption",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 240 + 90)).toISOString(),
        author_id: "mock_3",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 2500 + 1000),
          like_count: Math.floor(Math.random() * 7000 + 2000),
          reply_count: Math.floor(Math.random() * 600 + 200),
          quote_count: Math.floor(Math.random() * 300 + 100),
        },
        entities: {
          hashtags: [{ tag: "JudicialIndependence" }, { tag: "RuleOfLaw" }, { tag: "AntiCorruption" }],
        },
      },
      {
        id: "mock_tweet_5",
        text: "Human rights activists are being targeted for exposing corruption. This must stop! We need protection for whistleblowers and anti-corruption advocates. Their lives are in danger! #ProtectWhistleblowers #HumanRights #StopAbductions",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 300 + 120)).toISOString(),
        author_id: "mock_5",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 1500 + 500),
          like_count: Math.floor(Math.random() * 4000 + 1000),
          reply_count: Math.floor(Math.random() * 300 + 100),
          quote_count: Math.floor(Math.random() * 150 + 50),
        },
        entities: {
          hashtags: [{ tag: "ProtectWhistleblowers" }, { tag: "HumanRights" }, { tag: "StopAbductions" }],
        },
      },
      {
        id: "mock_tweet_6",
        text: "Today we charged 3 senior procurement officers with abuse of office and fraudulent acquisition of public property worth Ksh 348 million. Justice will be served! #FightingCorruption #Accountability #Justice",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 360 + 150)).toISOString(),
        author_id: "mock_4",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 1200 + 400),
          like_count: Math.floor(Math.random() * 3000 + 800),
          reply_count: Math.floor(Math.random() * 250 + 80),
          quote_count: Math.floor(Math.random() * 120 + 40),
        },
        entities: {
          hashtags: [{ tag: "FightingCorruption" }, { tag: "Accountability" }, { tag: "Justice" }],
        },
      },
      {
        id: "mock_tweet_7",
        text: "The youth of Kenya are demanding accountability from their leaders. Their voices cannot be ignored. #GenZKenya is leading the charge against corruption and impunity. Power to the people! #YouthPower #RutoMustGo",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 420 + 180)).toISOString(),
        author_id: "mock_1",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 4000 + 1500),
          like_count: Math.floor(Math.random() * 10000 + 3000),
          reply_count: Math.floor(Math.random() * 800 + 300),
          quote_count: Math.floor(Math.random() * 400 + 150),
        },
        entities: {
          hashtags: [{ tag: "GenZKenya" }, { tag: "YouthPower" }, { tag: "RutoMustGo" }],
        },
      },
      {
        id: "mock_tweet_8",
        text: "The DPP must prosecute all corruption cases without fear or favor. We cannot have sacred cows in the fight against graft. Equal justice under the law! #DPP #EqualJustice #NoSacredCows",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 480 + 210)).toISOString(),
        author_id: "mock_6",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 1800 + 600),
          like_count: Math.floor(Math.random() * 4500 + 1200),
          reply_count: Math.floor(Math.random() * 350 + 120),
          quote_count: Math.floor(Math.random() * 180 + 60),
        },
        entities: {
          hashtags: [{ tag: "DPP" }, { tag: "EqualJustice" }, { tag: "NoSacredCows" }],
        },
      },
      {
        id: "mock_tweet_9",
        text: "Corruption is not just about money - it's about denying Kenyans their right to quality healthcare, education, and infrastructure. Every stolen shilling is a life affected! #CorruptionKills #KenyansDeserveBetter",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 540 + 240)).toISOString(),
        author_id: "mock_7",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 2500 + 800),
          like_count: Math.floor(Math.random() * 6000 + 1800),
          reply_count: Math.floor(Math.random() * 450 + 150),
          quote_count: Math.floor(Math.random() * 250 + 80),
        },
        entities: {
          hashtags: [{ tag: "CorruptionKills" }, { tag: "KenyansDeserveBetter" }],
        },
      },
      {
        id: "mock_tweet_10",
        text: "Tonight on my show, we discuss the impact of corruption on ordinary Kenyans. How do we build a corruption-free society? Join the conversation at 8pm. #LynnNgugiShow #CorruptionFreeKenya #BuildingKenya",
        created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 600 + 270)).toISOString(),
        author_id: "mock_8",
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 1200 + 400),
          like_count: Math.floor(Math.random() * 3500 + 1000),
          reply_count: Math.floor(Math.random() * 200 + 80),
          quote_count: Math.floor(Math.random() * 120 + 40),
        },
        entities: {
          hashtags: [{ tag: "LynnNgugiShow" }, { tag: "CorruptionFreeKenya" }, { tag: "BuildingKenya" }],
        },
      },
    ]

    return {
      tweets: mockTweets,
      users: mockUsers,
    }
  }

  // Get current rate limit status
  getRateLimitStatus(): { isRateLimited: boolean; resetTime: number; resetInSeconds: number } {
    const now = Date.now()
    const resetInSeconds = globalRateLimited ? Math.max(0, Math.ceil((globalRateLimitResetTime - now) / 1000)) : 0

    return {
      isRateLimited: this.isCurrentlyRateLimited(),
      resetTime: globalRateLimitResetTime,
      resetInSeconds,
    }
  }

  // Manually reset rate limit (for testing)
  resetRateLimit(): void {
    globalRateLimited = false
    globalRateLimitResetTime = 0
    console.log("Rate limit manually reset")
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
