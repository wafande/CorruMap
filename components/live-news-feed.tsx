"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ExternalLink, Calendar, TrendingUp, AlertCircle } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
  relevanceScore: number
  imageUrl?: string
}

export function LiveNewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(true)

  const categories = [
    { id: "all", label: "All", count: 0 },
    { id: "corruption", label: "Corruption", count: 0 },
    { id: "government", label: "Government", count: 0 },
    { id: "judicial", label: "Judicial", count: 0 },
    { id: "finance", label: "Finance", count: 0 },
  ]

  const fetchNews = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)

    try {
      const response = await fetch(`/api/news/live?category=${activeCategory}&limit=20`)
      const result = await response.json()

      if (result.success) {
        setArticles(result.data)
        setLastUpdated(new Date(result.lastUpdated))
      } else {
        console.error("Failed to fetch news:", result.error)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchNews()

    if (autoRefresh) {
      const interval = setInterval(
        () => {
          fetchNews(false) // Silent refresh
        },
        5 * 60 * 1000,
      ) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [activeCategory, autoRefresh])

  // Update category counts
  const updatedCategories = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? articles.length : articles.filter((a) => a.category === cat.id).length,
  }))

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "corruption":
        return "bg-red-600"
      case "government":
        return "bg-blue-600"
      case "judicial":
        return "bg-purple-600"
      case "finance":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-kenya-red" />
              Live News Feed
              {autoRefresh && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </CardTitle>
            <p className="text-slate-400 text-sm">Real-time corruption & governance news from major Kenyan sources</p>
            {lastUpdated && <p className="text-slate-500 text-xs">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-slate-600 text-xs ${
                autoRefresh ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button
              onClick={() => fetchNews()}
              disabled={isLoading}
              size="sm"
              className="bg-kenya-red hover:bg-red-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {updatedCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-kenya-red hover:bg-red-700 text-white"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
              }
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-kenya-red mx-auto mb-4" />
            <p className="text-slate-400">Loading latest news...</p>
          </div>
        )}

        {/* News Articles */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {articles.map((article, index) => (
            <div
              key={`${article.url}-${index}`}
              className="border-b border-slate-700 pb-4 last:border-b-0 hover:bg-slate-700/30 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3 line-clamp-2">{article.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge className={`${getCategoryColor(article.category)} text-white text-xs`}>
                    {article.category}
                  </Badge>
                  {article.relevanceScore > 70 && (
                    <div className="flex items-center text-xs text-yellow-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {article.relevanceScore}%
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-400 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatTimeAgo(article.publishedAt)} • {article.source}
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-600 p-1 h-auto"
                >
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No news articles found</p>
            <p className="text-sm">Try refreshing or check back later</p>
          </div>
        )}

        {/* News Sources */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs mb-2">Sources:</p>
          <div className="flex flex-wrap gap-2">
            {["Daily Nation", "The Standard", "Citizen Digital", "Capital FM", "Business Daily", "BBC Africa"].map(
              (source) => (
                <Badge key={source} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {source}
                </Badge>
              ),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
