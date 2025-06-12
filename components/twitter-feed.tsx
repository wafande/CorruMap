"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, RefreshCw, Twitter } from "lucide-react"

interface TwitterPost {
  id: string
  username: string
  name: string
  content: string
  timestamp: string
  likes: number
  retweets: number
  url: string
  verified: boolean
}

// Mock Twitter data - In production, this would come from Twitter API
const mockTwitterPosts: TwitterPost[] = [
  {
    id: "1",
    username: "C_NyaKundiH",
    name: "Caroline Nyakundihi",
    content:
      "The fight against corruption in Kenya continues. We must hold our leaders accountable for every shilling stolen from the people. #CorruptionFreeKenya #Accountability",
    timestamp: "2024-01-10T14:30:00Z",
    likes: 245,
    retweets: 89,
    url: "https://twitter.com/C_NyaKundiH/status/1",
    verified: true,
  },
  {
    id: "2",
    username: "lynn_ngugi1",
    name: "Lynn Ngugi",
    content:
      "Another day, another corruption scandal exposed. When will we see real consequences for those who steal from Kenyans? The people deserve better. #JusticeForKenya",
    timestamp: "2024-01-10T12:15:00Z",
    likes: 567,
    retweets: 234,
    url: "https://twitter.com/lynn_ngugi1/status/2",
    verified: true,
  },
  {
    id: "3",
    username: "Kenyans",
    name: "Kenyans.co.ke",
    content:
      "BREAKING: New report reveals massive procurement irregularities in government ministries. Billions of taxpayer money unaccounted for. Full story on our website. #CorruptionExposed",
    timestamp: "2024-01-10T10:45:00Z",
    likes: 892,
    retweets: 445,
    url: "https://twitter.com/Kenyans/status/3",
    verified: true,
  },
  {
    id: "4",
    username: "LarryMadowo",
    name: "Larry Madowo",
    content:
      "Transparency and accountability are not optional in a democracy. Every Kenyan deserves to know how their tax money is being spent. #TransparencyMatters #Kenya",
    timestamp: "2024-01-10T09:20:00Z",
    likes: 1234,
    retweets: 567,
    url: "https://twitter.com/LarryMadowo/status/4",
    verified: true,
  },
]

export function TwitterFeed() {
  const [posts, setPosts] = useState<TwitterPost[]>(mockTwitterPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshFeed = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Twitter className="mr-2 h-5 w-5 text-blue-400" />X (Twitter) Updates
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshFeed}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <p className="text-slate-400 text-sm">Latest updates from key voices in Kenya's fight against corruption</p>
        <p className="text-slate-500 text-xs">Last updated: {lastUpdated.toLocaleTimeString()}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <div key={post.id} className="border-b border-slate-700 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white text-sm">{post.name}</span>
                    {post.verified && (
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                    <span className="text-slate-400 text-sm">@{post.username}</span>
                    <span className="text-slate-500 text-sm">·</span>
                    <span className="text-slate-500 text-sm">{formatTimestamp(post.timestamp)}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-slate-400 text-xs">
                      <span>❤️ {post.likes}</span>
                      <span>🔄 {post.retweets}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-slate-400 hover:text-white hover:bg-slate-700 p-1 h-auto"
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

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              @C_NyaKundiH
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              @lynn_ngugi1
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              @Kenyans
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              @LarryMadowo
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
