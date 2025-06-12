import { NextResponse } from "next/server"
import {
  TwitterApiClient,
  KENYAN_CORRUPTION_ACCOUNTS,
  calculateRelevanceScore,
  extractHashtags,
} from "@/lib/twitter-api"

interface ProcessedTweet {
  id: string
  username: string
  name: string
  content: string
  timestamp: string
  likes: number
  retweets: number
  replies: number
  url: string
  verified: boolean
  hashtags: string[]
  mentions: string[]
  category: "breaking" | "trending" | "corruption" | "politics" | "social"
  relevanceScore: number
  profileImage?: string
}

// Global rate limit state at the API route level
let isGloballyRateLimited = false
let globalRateLimitResetTime = 0
let lastFetchTime = 0
const CACHE_DURATION = 20 * 60 * 1000 // 20 minutes cache

// Cache for API responses
let cachedResponse: any = null

// Check if we're currently rate limited
function checkRateLimit(): { isRateLimited: boolean; resetInSeconds: number } {
  const now = Date.now()

  if (isGloballyRateLimited && now < globalRateLimitResetTime) {
    return {
      isRateLimited: true,
      resetInSeconds: Math.ceil((globalRateLimitResetTime - now) / 1000),
    }
  }

  // Reset if time has passed
  if (isGloballyRateLimited && now >= globalRateLimitResetTime) {
    isGloballyRateLimited = false
    globalRateLimitResetTime = 0
    console.log("Rate limit automatically reset")
  }

  return {
    isRateLimited: false,
    resetInSeconds: 0,
  }
}

// Set rate limit status
function setRateLimit(resetTimeSeconds?: number): void {
  isGloballyRateLimited = true
  if (resetTimeSeconds) {
    globalRateLimitResetTime = Date.now() + resetTimeSeconds * 1000
  } else {
    globalRateLimitResetTime = Date.now() + 15 * 60 * 1000 // Default 15 minutes
  }
  console.log(`Rate limited until: ${new Date(globalRateLimitResetTime).toISOString()}`)
}

function initializeTwitterClient() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.log("Twitter Bearer Token not found in environment variables")
    return null
  }

  return new TwitterApiClient({ bearerToken })
}

function categorizeContent(text: string): ProcessedTweet["category"] {
  const lowerText = text.toLowerCase()

  if (lowerText.includes("breaking") || lowerText.includes("urgent") || lowerText.includes("🚨")) {
    return "breaking"
  }

  if (
    lowerText.includes("corruption") ||
    lowerText.includes("eacc") ||
    lowerText.includes("scandal") ||
    lowerText.includes("fraud") ||
    lowerText.includes("embezzlement")
  ) {
    return "corruption"
  }

  if (
    lowerText.includes("parliament") ||
    lowerText.includes("government") ||
    lowerText.includes("president") ||
    lowerText.includes("politics") ||
    lowerText.includes("election")
  ) {
    return "politics"
  }

  if (
    lowerText.includes("abduction") ||
    lowerText.includes("police") ||
    lowerText.includes("rights") ||
    lowerText.includes("justice") ||
    lowerText.includes("protest")
  ) {
    return "social"
  }

  return "trending"
}

function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(`@${match[1]}`)
  }

  return mentions
}

// Generate trending topics from hashtags
function generateTrendingTopics(tweets: any[]): any[] {
  const hashtagCounts = new Map<string, number>()

  tweets.forEach((tweet) => {
    const hashtags = tweet.entities?.hashtags?.map((h: any) => `#${h.tag}`) || []
    hashtags.forEach((hashtag: string) => {
      hashtagCounts.set(hashtag, (hashtagCounts.get(hashtag) || 0) + 1)
    })
  })

  return Array.from(hashtagCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([hashtag, count]) => ({
      hashtag,
      tweets: count * Math.floor(Math.random() * 1000 + 500),
      category: hashtag.toLowerCase().includes("corruption")
        ? "corruption"
        : hashtag.toLowerCase().includes("ruto") || hashtag.toLowerCase().includes("parliament")
          ? "politics"
          : "social",
      description: `Trending discussions about ${hashtag.replace("#", "")}`,
      trend: Math.random() > 0.5 ? "up" : "down",
      change: Math.random() * 50 + 10,
    }))
}

// Enhanced mock data generator - always returns fresh data
function generateMockKenyanTweets(): { tweets: any[]; users: any[] } {
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

  // Generate fresh timestamps and content for each request
  const currentTime = Date.now()
  const tweetTemplates = [
    {
      template:
        "BREAKING: EACC has recovered assets worth Ksh {amount} billion in the last fiscal year. This is the highest recovery in Kenya's history. The fight against corruption is yielding results! #CorruptionFreeKenya #AssetRecovery #EACC",
      author_id: "mock_4",
      hashtags: [{ tag: "CorruptionFreeKenya" }, { tag: "AssetRecovery" }, { tag: "EACC" }],
    },
    {
      template:
        "The Finance Bill protests have exposed deep corruption in our procurement systems. We need transparency in ALL government contracts. Young Kenyans are demanding accountability! #RejectFinanceBill2024 #GenZKenya #CorruptionKills",
      author_id: "mock_1",
      hashtags: [{ tag: "RejectFinanceBill2024" }, { tag: "GenZKenya" }, { tag: "CorruptionKills" }],
    },
    {
      template:
        "Just interviewed Kenya's anti-corruption czar for @CNN. The EACC says they're investigating {count} governors for corruption and misappropriation of county funds. Full story tonight at 9pm EAT. This is huge! #KenyaCorruption #CountyGovernors",
      author_id: "mock_2",
      hashtags: [{ tag: "KenyaCorruption" }, { tag: "CountyGovernors" }],
    },
    {
      template:
        "The Judiciary must remain independent to effectively fight corruption. When courts are compromised, impunity thrives. We need judges who cannot be bought! #JudicialIndependence #RuleOfLaw #AntiCorruption",
      author_id: "mock_3",
      hashtags: [{ tag: "JudicialIndependence" }, { tag: "RuleOfLaw" }, { tag: "AntiCorruption" }],
    },
    {
      template:
        "Human rights activists are being targeted for exposing corruption. This must stop! We need protection for whistleblowers and anti-corruption advocates. Their lives are in danger! #ProtectWhistleblowers #HumanRights #StopAbductions",
      author_id: "mock_5",
      hashtags: [{ tag: "ProtectWhistleblowers" }, { tag: "HumanRights" }, { tag: "StopAbductions" }],
    },
    {
      template:
        "Today we charged {count} senior procurement officers with abuse of office and fraudulent acquisition of public property worth Ksh {amount} million. Justice will be served! #FightingCorruption #Accountability #Justice",
      author_id: "mock_4",
      hashtags: [{ tag: "FightingCorruption" }, { tag: "Accountability" }, { tag: "Justice" }],
    },
    {
      template:
        "The youth of Kenya are demanding accountability from their leaders. Their voices cannot be ignored. #GenZKenya is leading the charge against corruption and impunity. Power to the people! #YouthPower #RutoMustGo",
      author_id: "mock_1",
      hashtags: [{ tag: "GenZKenya" }, { tag: "YouthPower" }, { tag: "RutoMustGo" }],
    },
    {
      template:
        "The DPP must prosecute all corruption cases without fear or favor. We cannot have sacred cows in the fight against graft. Equal justice under the law! #DPP #EqualJustice #NoSacredCows",
      author_id: "mock_6",
      hashtags: [{ tag: "DPP" }, { tag: "EqualJustice" }, { tag: "NoSacredCows" }],
    },
    {
      template:
        "Corruption is not just about money - it's about denying Kenyans their right to quality healthcare, education, and infrastructure. Every stolen shilling is a life affected! #CorruptionKills #KenyansDeserveBetter",
      author_id: "mock_7",
      hashtags: [{ tag: "CorruptionKills" }, { tag: "KenyansDeserveBetter" }],
    },
    {
      template:
        "Tonight on my show, we discuss the impact of corruption on ordinary Kenyans. How do we build a corruption-free society? Join the conversation at 8pm. #LynnNgugiShow #CorruptionFreeKenya #BuildingKenya",
      author_id: "mock_8",
      hashtags: [{ tag: "LynnNgugiShow" }, { tag: "CorruptionFreeKenya" }, { tag: "BuildingKenya" }],
    },
  ]

  const mockTweets = tweetTemplates.map((template, index) => {
    // Generate dynamic content
    let text = template.template
    text = text.replace("{amount}", (Math.random() * 50 + 10).toFixed(1))
    text = text.replace("{count}", Math.floor(Math.random() * 30 + 15).toString())

    return {
      id: `mock_tweet_${index + 1}_${Date.now()}`,
      text,
      created_at: new Date(currentTime - 1000 * 60 * Math.floor(Math.random() * 600 + 10)).toISOString(),
      author_id: template.author_id,
      public_metrics: {
        retweet_count: Math.floor(Math.random() * 3000 + 500),
        like_count: Math.floor(Math.random() * 8000 + 1000),
        reply_count: Math.floor(Math.random() * 800 + 100),
        quote_count: Math.floor(Math.random() * 400 + 50),
      },
      entities: {
        hashtags: template.hashtags,
      },
    }
  })

  return {
    tweets: mockTweets,
    users: mockUsers,
  }
}

export async function GET(request: Request) {
  try {
    const now = Date.now()

    // Check rate limit status first
    const rateLimitStatus = checkRateLimit()

    // If rate limited, immediately return mock data
    if (rateLimitStatus.isRateLimited) {
      console.log(`Rate limited. Reset in ${rateLimitStatus.resetInSeconds} seconds. Using mock data.`)

      const mockData = generateMockKenyanTweets()
      const processedTweets = mockData.tweets.map((tweet: any) => {
        const author = mockData.users.find((u: any) => u.id === tweet.author_id)
        const hashtags = tweet.entities?.hashtags?.map((h: any) => `#${h.tag}`) || []
        const mentions = extractMentions(tweet.text)
        const category = categorizeContent(tweet.text)

        return {
          id: tweet.id,
          username: author?.username || "unknown",
          name: author?.name || "Unknown User",
          content: tweet.text,
          timestamp: tweet.created_at,
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
          verified: author?.verified || false,
          hashtags,
          mentions,
          category,
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          profileImage: author?.profile_image_url,
        }
      })

      const trending = generateTrendingTopics(mockData.tweets)

      return NextResponse.json({
        success: true,
        data: processedTweets,
        trending,
        lastUpdated: new Date().toISOString(),
        total: processedTweets.length,
        accounts_monitored: KENYAN_CORRUPTION_ACCOUNTS.length,
        method_used: "mock_data_rate_limited",
        api_source: "mock",
        mock: true,
        rate_limited: true,
        reset_in_seconds: rateLimitStatus.resetInSeconds,
      })
    }

    // Check if we have a cached response that's still valid
    if (cachedResponse && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedResponse,
        cached: true,
        cache_age: Math.floor((now - lastFetchTime) / 1000) + " seconds",
      })
    }

    const { searchParams } = new URL(request.url)
    const method = searchParams.get("method") || "accounts"
    const maxResults = Number.parseInt(searchParams.get("max_results") || "30")

    // Initialize Twitter client
    const twitterClient = initializeTwitterClient()

    // If no Twitter client (no API key), use mock data
    if (!twitterClient) {
      console.log("No Twitter API client available, using mock data")
      const mockData = generateMockKenyanTweets()

      const processedTweets = mockData.tweets.map((tweet: any) => {
        const author = mockData.users.find((u: any) => u.id === tweet.author_id)
        const hashtags = tweet.entities?.hashtags?.map((h: any) => `#${h.tag}`) || []
        const mentions = extractMentions(tweet.text)
        const category = categorizeContent(tweet.text)

        return {
          id: tweet.id,
          username: author?.username || "unknown",
          name: author?.name || "Unknown User",
          content: tweet.text,
          timestamp: tweet.created_at,
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
          verified: author?.verified || false,
          hashtags,
          mentions,
          category,
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          profileImage: author?.profile_image_url,
        }
      })

      const trending = generateTrendingTopics(mockData.tweets)

      const response = {
        success: true,
        data: processedTweets,
        trending,
        lastUpdated: new Date().toISOString(),
        total: processedTweets.length,
        accounts_monitored: KENYAN_CORRUPTION_ACCOUNTS.length,
        method_used: "mock_data_no_api",
        api_source: "mock",
        mock: true,
      }

      // Cache the response
      cachedResponse = response
      lastFetchTime = now

      return NextResponse.json(response)
    }

    // Try to fetch real data, but catch any rate limit errors
    let tweets: any[] = []
    let users: any[] = []

    try {
      console.log("Attempting to fetch real Twitter data...")

      if (method === "search") {
        const result = await twitterClient.getCorruptionTweets(maxResults)
        tweets = result.tweets
        users = result.users
      } else {
        const result = await twitterClient.getKenyanAccountsTweets(maxResults)
        tweets = result.tweets
        users = result.users
      }

      console.log(`Successfully fetched ${tweets.length} tweets from Twitter API`)
    } catch (error) {
      console.error("Error fetching tweets:", error)

      // Check if it's a rate limit error and set the flag
      if (error instanceof Error && error.message.includes("rate limit")) {
        const resetMatch = error.message.match(/Try again in (\d+) seconds/)
        if (resetMatch) {
          setRateLimit(Number.parseInt(resetMatch[1]))
        } else {
          setRateLimit()
        }
        console.log("Rate limit detected and set")
      }

      // Use mock data on any error
      console.log("Using mock data due to API error")
      const mockData = generateMockKenyanTweets()
      tweets = mockData.tweets
      users = mockData.users
    }

    // Create user lookup map
    const userMap = new Map()
    users.forEach((user) => {
      userMap.set(user.id, user)
    })

    // Process tweets into our format
    const processedTweets: ProcessedTweet[] = tweets.map((tweet) => {
      const author = userMap.get(tweet.author_id)
      const hashtags = extractHashtags(tweet)
      const mentions = extractMentions(tweet.text)
      const category = categorizeContent(tweet.text)
      const relevanceScore = calculateRelevanceScore
        ? calculateRelevanceScore(tweet)
        : Math.floor(Math.random() * 40) + 60

      return {
        id: tweet.id,
        username: author?.username || "unknown",
        name: author?.name || "Unknown User",
        content: tweet.text,
        timestamp: tweet.created_at,
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        replies: tweet.public_metrics.reply_count,
        url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
        verified: author?.verified || false,
        hashtags,
        mentions,
        category,
        relevanceScore,
        profileImage: author?.profile_image_url,
      }
    })

    // Sort by relevance score and recency
    processedTweets.sort((a, b) => {
      const scoreA = a.relevanceScore + new Date(a.timestamp).getTime() / 1000000000
      const scoreB = b.relevanceScore + new Date(b.timestamp).getTime() / 1000000000
      return scoreB - scoreA
    })

    // Generate trending topics from hashtags
    const trending = generateTrendingTopics(tweets)

    const response = {
      success: true,
      data: processedTweets,
      trending,
      lastUpdated: new Date().toISOString(),
      total: processedTweets.length,
      accounts_monitored: KENYAN_CORRUPTION_ACCOUNTS.length,
      method_used: method,
      api_source: tweets.length > 0 && tweets[0].id?.includes("mock_") ? "mock" : "twitter_api_v2",
      mock: tweets.length > 0 && tweets[0].id?.includes("mock_"),
      rate_limited: false,
    }

    // Cache the response
    cachedResponse = response
    lastFetchTime = now

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in Twitter API:", error)

    // Always return mock data on any error
    const mockData = generateMockKenyanTweets()

    const processedTweets = mockData.tweets.map((tweet: any) => {
      const author = mockData.users.find((u: any) => u.id === tweet.author_id)
      const hashtags = tweet.entities?.hashtags?.map((h: any) => `#${h.tag}`) || []
      const mentions = extractMentions(tweet.text)
      const category = categorizeContent(tweet.text)

      return {
        id: tweet.id,
        username: author?.username || "unknown",
        name: author?.name || "Unknown User",
        content: tweet.text,
        timestamp: tweet.created_at,
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        replies: tweet.public_metrics.reply_count,
        url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
        verified: author?.verified || false,
        hashtags,
        mentions,
        category,
        relevanceScore: Math.floor(Math.random() * 40) + 60,
        profileImage: author?.profile_image_url,
      }
    })

    const trending = generateTrendingTopics(mockData.tweets)

    return NextResponse.json(
      {
        success: true,
        data: processedTweets,
        trending,
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Failed to fetch Twitter data",
        fallback: true,
        mock: true,
        total: processedTweets.length,
      },
      { status: 200 },
    )
  }
}

// POST endpoint to refresh cache or change settings
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "refresh") {
      // Force refresh by clearing cache and rate limit
      cachedResponse = null
      lastFetchTime = 0

      return NextResponse.json({
        success: true,
        message: "Twitter API cache cleared",
      })
    }

    if (action === "reset_rate_limit") {
      // Manually reset rate limit (for testing)
      isGloballyRateLimited = false
      globalRateLimitResetTime = 0

      return NextResponse.json({
        success: true,
        message: "Rate limit manually reset",
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error in Twitter API POST:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
      },
      { status: 500 },
    )
  }
}
