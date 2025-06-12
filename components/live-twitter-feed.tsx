"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwitterSetupGuide } from "./twitter-setup-guide"
import {
  RefreshCw,
  ExternalLink,
  Twitter,
  Heart,
  Repeat,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Wifi,
  WifiOff,
  Database,
  Clock,
} from "lucide-react"

interface TwitterPost {
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

interface TrendingTopic {
  hashtag: string
  tweets: number
  category: string
  description: string
  trend: "up" | "down" | "stable"
  change: number
}

export function LiveTwitterFeed() {
  const [posts, setPosts] = useState<TwitterPost[]>([])
  const [trending, setTrending] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false) // Disabled by default to prevent rate limiting
  const [activeTab, setActiveTab] = useState("all")
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [method, setMethod] = useState<"accounts" | "search">("accounts")
  const [isMockData, setIsMockData] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [isCached, setIsCached] = useState(false)
  const [resetInSeconds, setResetInSeconds] = useState(0)

  const fetchTwitterData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/twitter/live?method=${method}&max_results=30`)
      const result = await response.json()

      if (result.success) {
        setPosts(result.data)
        setTrending(result.trending || [])
        setLastUpdated(new Date(result.lastUpdated))
        setApiConnected(true)
        setIsMockData(result.mock || false)
        setIsCached(result.cached || false)
        setIsRateLimited(result.rate_limited || false)
        setResetInSeconds(result.reset_in_seconds || 0)

        // Show appropriate messages
        if (result.rate_limited) {
          setError(`Twitter API rate limited. Using sample data. Reset in ${result.reset_in_seconds || 0} seconds.`)
        } else if (result.mock) {
          setError("Using sample data. Configure Twitter API credentials for live data.")
        } else {
          setError(null)
        }
      } else {
        setError(result.error)
        setApiConnected(false)

        // If API is not configured, show setup guide
        if (result.error && result.error.includes("not configured")) {
          setApiConnected(false)
        }
      }
    } catch (error) {
      console.error("Error fetching Twitter data:", error)
      setError("Failed to connect to Twitter API")
      setApiConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 10 minutes when enabled and not rate limited
  useEffect(() => {
    fetchTwitterData()

    if (autoRefresh && apiConnected && !isRateLimited) {
      const interval = setInterval(
        () => {
          fetchTwitterData(false) // Silent refresh
        },
        10 * 60 * 1000,
      ) // 10 minutes

      return () => clearInterval(interval)
    }
  }, [autoRefresh, apiConnected, method, isRateLimited])

  // Countdown timer for rate limit reset
  useEffect(() => {
    if (resetInSeconds > 0) {
      const interval = setInterval(() => {
        setResetInSeconds((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [resetInSeconds])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const filteredPosts = activeTab === "all" ? posts : posts.filter((post) => post.category === activeTab)

  // Show setup guide if API is not connected
  if (apiConnected === false && error?.includes("not configured")) {
    return <TwitterSetupGuide />
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white flex items-center">
              <Twitter className="mr-2 h-5 w-5 text-blue-400" />
              Live X (Twitter) Feed - Kenya
              {isRateLimited ? (
                <Clock className="ml-2 h-4 w-4 text-yellow-500" title="Rate limited" />
              ) : isMockData ? (
                <Database className="ml-2 h-4 w-4 text-yellow-500" title="Using sample data" />
              ) : apiConnected === true ? (
                <Wifi className="ml-2 h-4 w-4 text-green-500" title="Connected to Twitter API" />
              ) : apiConnected === false ? (
                <WifiOff className="ml-2 h-4 w-4 text-red-500" title="Not connected to Twitter API" />
              ) : null}
              {autoRefresh && apiConnected && !isRateLimited && (
                <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </CardTitle>
            <p className="text-slate-400 text-sm">
              {isRateLimited
                ? `Twitter API rate limited - Reset in ${formatTime(resetInSeconds)}`
                : isMockData
                  ? "Using sample data (Twitter API not configured or rate limited)"
                  : apiConnected === true
                    ? "Real-time updates from Twitter API v2"
                    : "Twitter API integration status unknown"}
            </p>
            {lastUpdated && (
              <p className="text-slate-500 text-xs flex items-center">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {isCached && <span className="ml-2 text-yellow-500">(cached)</span>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMethod(method === "accounts" ? "search" : "accounts")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
              disabled={isRateLimited}
            >
              {method === "accounts" ? "Accounts" : "Search"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              disabled={!apiConnected || isRateLimited}
              className={`border-slate-600 text-xs ${
                autoRefresh && apiConnected && !isRateLimited
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              Auto {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button
              onClick={() => fetchTwitterData()}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Rate Limit Warning */}
        {isRateLimited && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg flex items-center">
            <Clock className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-yellow-200 text-sm">Twitter API rate limit reached. Using sample data.</span>
              <div className="text-yellow-300 text-xs mt-1">Reset in: {formatTime(resetInSeconds)}</div>
            </div>
          </div>
        )}

        {/* Mock Data Notice */}
        {isMockData && !isRateLimited && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg flex items-center">
            <Database className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
            <span className="text-blue-200 text-sm">
              Using sample data. To see real tweets, configure Twitter API credentials in your environment variables.
            </span>
          </div>
        )}

        {/* Error Display */}
        {error && !isRateLimited && !isMockData && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-600 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-700">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="breaking" className="text-xs">
              Breaking
            </TabsTrigger>
            <TabsTrigger value="politics" className="text-xs">
              Politics
            </TabsTrigger>
            <TabsTrigger value="corruption" className="text-xs">
              Corruption
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs">
              Social
            </TabsTrigger>
          </TabsList>

          {/* Trending Topics */}
          {trending.length > 0 && (
            <div className="mt-4 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                Trending in Kenya
                {isMockData && <span className="text-xs text-slate-400 ml-2">(Sample Data)</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {trending.slice(0, 6).map((topic, index) => (
                  <div key={topic.hashtag} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-xs">#{index + 1}</span>
                        <span className="text-blue-400 font-medium text-sm">{topic.hashtag}</span>
                        {getTrendIcon(topic.trend)}
                      </div>
                      <Badge variant="outline" className="border-slate-500 text-slate-300 text-xs">
                        {formatNumber(topic.tweets)}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-xs mt-1 truncate">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <TabsContent value={activeTab} className="mt-0">
            {/* Loading State */}
            {isLoading && posts.length === 0 && (
              <div className="text-center py-12">
                <Twitter className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400">Loading latest posts...</p>
              </div>
            )}

            {/* Twitter Posts */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-slate-700 pb-4 last:border-b-0 hover:bg-slate-700/30 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {post.profileImage ? (
                        <img
                          src={post.profileImage || "/placeholder.svg"}
                          alt={post.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <Twitter className="h-5 w-5 text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white text-sm truncate">{post.name}</span>
                        {post.verified && (
                          <Badge variant="secondary" className="bg-blue-600 text-white text-xs px-1 py-0">
                            ✓
                          </Badge>
                        )}
                        <span className="text-slate-400 text-sm truncate">@{post.username}</span>
                        <span className="text-slate-500 text-sm">·</span>
                        <span className="text-slate-500 text-sm">{formatTimestamp(post.timestamp)}</span>
                        {post.category === "breaking" && (
                          <Badge className="bg-red-600 text-white text-xs px-1 py-0">BREAKING</Badge>
                        )}
                        {post.relevanceScore > 80 && (
                          <Badge className="bg-orange-600 text-white text-xs px-1 py-0">HIGH</Badge>
                        )}
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>

                      {/* Hashtags */}
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.slice(0, 4).map((hashtag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-blue-600 text-blue-400 text-xs px-1 py-0"
                            >
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-slate-400 text-xs">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{formatNumber(post.replies)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Repeat className="h-3 w-3" />
                            <span>{formatNumber(post.retweets)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{formatNumber(post.likes)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-slate-400 hover:text-white hover:bg-slate-600 p-1 h-auto"
                        >
                          <a href={post.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Twitter className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No posts in this category</p>
                <p className="text-sm">Try switching to a different tab or check your API connection</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* API Status */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs mb-1">
                API Status:{" "}
                {isRateLimited
                  ? `Rate Limited (${formatTime(resetInSeconds)})`
                  : isMockData
                    ? "Using Sample Data"
                    : apiConnected === true
                      ? "Connected"
                      : apiConnected === false
                        ? "Disconnected"
                        : "Unknown"}
              </p>
              <p className="text-slate-500 text-xs">
                Method: {method === "accounts" ? "Monitoring Accounts" : "Keyword Search"} | Posts: {posts.length} |
                Trending: {trending.length}
              </p>
            </div>
            {isRateLimited ? (
              <Badge className="bg-yellow-600 text-white text-xs">Rate Limited</Badge>
            ) : isMockData ? (
              <Badge className="bg-yellow-600 text-white text-xs">Sample Data</Badge>
            ) : isCached ? (
              <Badge className="bg-blue-600 text-white text-xs">Cached Data</Badge>
            ) : apiConnected === true ? (
              <Badge className="bg-green-600 text-white text-xs">Live API v2</Badge>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
