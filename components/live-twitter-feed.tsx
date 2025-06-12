"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ExternalLink, Twitter, Heart, Repeat, MessageCircle } from "lucide-react"

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
}

export function LiveTwitterFeed() {
  const [posts, setPosts] = useState<TwitterPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchTweets = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)

    try {
      const response = await fetch("/api/twitter")
      const result = await response.json()

      if (result.success) {
        setPosts(result.data)
        setLastUpdated(new Date(result.lastUpdated))
      } else {
        console.error("Failed to fetch tweets:", result.error)
      }
    } catch (error) {
      console.error("Error fetching tweets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 3 minutes
  useEffect(() => {
    fetchTweets()

    if (autoRefresh) {
      const interval = setInterval(
        () => {
          fetchTweets(false) // Silent refresh
        },
        3 * 60 * 1000,
      ) // 3 minutes

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d`
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white flex items-center">
              <Twitter className="mr-2 h-5 w-5 text-blue-400" />X (Twitter) Live Feed
              {autoRefresh && <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
            </CardTitle>
            <p className="text-slate-400 text-sm">Latest updates from key voices in Kenya's fight against corruption</p>
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
              onClick={() => fetchTweets()}
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
        {/* Loading State */}
        {isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <Twitter className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading latest tweets...</p>
          </div>
        )}

        {/* Twitter Posts */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
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
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.hashtags.slice(0, 3).map((hashtag, index) => (
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
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Twitter className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tweets available</p>
            <p className="text-sm">Check back later for updates</p>
          </div>
        )}

        {/* Monitored Accounts */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs mb-2">Monitoring:</p>
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
