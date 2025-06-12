"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Clock, Newspaper, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { fetchCorruptionNews, refreshNewsCache, type NewsArticle } from "@/lib/news-api"

export function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadNews = async (category = "all") => {
    try {
      setLoading(true)
      const articles = await fetchCorruptionNews(category, 50)
      setNews(articles)
      setLastUpdated(new Date().toLocaleString())
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!isOnline) return

    try {
      setRefreshing(true)
      const success = await refreshNewsCache()
      if (success) {
        await loadNews(selectedCategory)
      }
    } catch (error) {
      console.error("Error refreshing news:", error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadNews(selectedCategory)
  }, [selectedCategory])

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isOnline && !loading && !refreshing) {
          handleRefresh()
        }
      },
      15 * 60 * 1000,
    ) // 15 minutes

    return () => clearInterval(interval)
  }, [isOnline, loading, refreshing])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "corruption":
        return "bg-kenya-red"
      case "government":
        return "bg-blue-600"
      case "finance":
        return "bg-kenya-green"
      case "judicial":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 70) return "text-kenya-red"
    if (score >= 40) return "text-yellow-500"
    if (score >= 20) return "text-kenya-green"
    return "text-slate-400"
  }

  if (loading && news.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kenya-red"></div>
            <span className="ml-3 text-slate-300">Loading latest news from RSS feeds...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Newspaper className="mr-2 h-5 w-5 text-kenya-red" />
              Live News Feed
              {!isOnline && <WifiOff className="ml-2 h-4 w-4 text-red-500" />}
              {isOnline && <Wifi className="ml-2 h-4 w-4 text-green-500" />}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time corruption & governance news from major Kenyan sources
              {lastUpdated && <span className="block text-xs mt-1">Last updated: {lastUpdated}</span>}
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || !isOnline}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="bg-slate-700 border-slate-600">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-600">
              All ({news.length})
            </TabsTrigger>
            <TabsTrigger value="corruption" className="data-[state=active]:bg-slate-600">
              Corruption ({news.filter((n) => n.category === "corruption").length})
            </TabsTrigger>
            <TabsTrigger value="government" className="data-[state=active]:bg-slate-600">
              Government ({news.filter((n) => n.category === "government").length})
            </TabsTrigger>
            <TabsTrigger value="judicial" className="data-[state=active]:bg-slate-600">
              Judicial ({news.filter((n) => n.category === "judicial").length})
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-slate-600">
              Finance ({news.filter((n) => n.category === "finance").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {news.map((article) => (
            <div
              key={article.id}
              className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getCategoryColor(article.category)} text-white text-xs`}>
                      {article.category}
                    </Badge>
                    {article.relevanceScore > 0 && (
                      <div className={`text-xs font-medium ${getRelevanceColor(article.relevanceScore)}`}>
                        {article.relevanceScore}% relevant
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-white mb-2 leading-tight">{article.title}</h4>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">{article.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="font-medium">{article.source}</div>
                  </div>
                </div>
                {article.imageUrl && (
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-20 h-20 rounded-lg object-cover ml-4 flex-shrink-0"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                asChild
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Read Full Article
                </a>
              </Button>
            </div>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className="text-center py-8 text-slate-400">
            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No news articles found.</p>
            {!isOnline && (
              <p className="text-sm mt-2 text-red-400">
                You appear to be offline. Please check your internet connection.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
