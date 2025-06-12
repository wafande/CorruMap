"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const fetchTwitterData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)

    try {
      const [twitterResponse, trendingResponse] = await Promise.all([fetch("/api/twitter"), fetch("/api/trending")])

      const twitterResult = await twitterResponse.json()
      const trendingResult = await trendingResponse.json()

      if (twitterResult.success) {
        setPosts(twitterResult.data)
        setTrending(twitterResult.trending || [])
        setLastUpdated(new Date(twitterResult.lastUpdated))
      }

      if (trendingResult.success) {
        setTrending(trendingResult.data.trending)
      }
    } catch (error) {
      console.error("Error fetching Twitter data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 2 minutes for more real-time feel
  useEffect(() => {
    fetchTwitterData()

    if (autoRefresh) {
      const interval = setInterval(
        () => {
          fetchTwitterData(false) // Silent refresh
        },
        2 * 60 * 1000,
      ) // 2 minutes

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white flex items-center">
              <Twitter className="mr-2 h-5 w-5 text-blue-400" />
              Live X (Twitter) Feed - Kenya
              {autoRefresh && <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
            </CardTitle>
            <p className="text-slate-400 text-sm">Real-time updates from key Kenyan voices and trending topics</p>
            {lastUpdated && <p className="text-slate-500 text-xs">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-slate-600 text-xs ${
                autoRefresh ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              Live {autoRefresh ? "ON" : "OFF"}
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
          <div className="mt-4 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
              Trending in Kenya
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
                  {topic.change !== 0 && (
                    <p
                      className={`text-xs mt-1 ${topic.trend === "up" ? "text-green-400" : topic.trend === "down" ? "text-red-400" : "text-gray-400"}`}
                    >
                      {topic.trend === "up" ? "+" : ""}
                      {topic.change.toFixed(1)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <Twitter className="h-5 w-5 text-blue-400" />
                      </div>
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
                <p className="text-sm">Try switching to a different tab</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Monitored Accounts */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs mb-2">Monitoring Key Kenyan Voices:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "@C_NyaKundiH",
              "@lynn_ngugi1",
              "@Kenyans",
              "@LarryMadowo",
              "@bonifacemwangi",
              "@ahmednasirlaw",
              "@RobertAlai",
              "@MarthaKarua",
              "@WilliamsRuto",
              "@RailaOdinga",
            ].map((account) => (
              <Badge key={account} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                {account}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
