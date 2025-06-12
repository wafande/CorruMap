"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, Twitter, Users } from "lucide-react"
import { LiveNewsFeed } from "@/components/live-news-feed"
import { LiveTwitterFeed } from "@/components/live-twitter-feed"
import { PublicParticipationTracker } from "@/components/public-participation-tracker"

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-kenya-red mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Live News & Updates</h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Real-time corruption news, social media updates, and public participation opportunities
          </p>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="news" className="data-[state=active]:bg-kenya-red data-[state=active]:text-white">
              <Newspaper className="h-4 w-4 mr-2" />
              Live News
            </TabsTrigger>
            <TabsTrigger value="twitter" className="data-[state=active]:bg-kenya-red data-[state=active]:text-white">
              <Twitter className="h-4 w-4 mr-2" />X Updates
            </TabsTrigger>
            <TabsTrigger
              value="participation"
              className="data-[state=active]:bg-kenya-red data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Public Participation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <LiveNewsFeed />
          </TabsContent>

          <TabsContent value="twitter">
            <LiveTwitterFeed />
          </TabsContent>

          <TabsContent value="participation">
            <PublicParticipationTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
