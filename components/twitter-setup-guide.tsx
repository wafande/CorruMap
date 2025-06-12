"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Settings, CheckCircle, AlertCircle } from "lucide-react"

export function TwitterSetupGuide() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="mr-2 h-5 w-5 text-blue-400" />
          Twitter API v2 Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-600 bg-blue-900/20">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            To enable live Twitter data, you need to configure Twitter API v2 credentials.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-600 text-white mt-1">1</Badge>
            <div>
              <h3 className="text-white font-semibold">Create Twitter Developer Account</h3>
              <p className="text-slate-400 text-sm mb-2">
                Apply for a Twitter Developer account at developer.twitter.com
              </p>
              <Button variant="outline" size="sm" asChild className="border-slate-600 text-slate-300">
                <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Twitter Developer Portal
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-600 text-white mt-1">2</Badge>
            <div>
              <h3 className="text-white font-semibold">Create a New App</h3>
              <p className="text-slate-400 text-sm">
                Create a new app in your developer dashboard and generate API keys
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-600 text-white mt-1">3</Badge>
            <div>
              <h3 className="text-white font-semibold">Configure Environment Variables</h3>
              <p className="text-slate-400 text-sm mb-3">Add these environment variables to your deployment:</p>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <code className="text-green-400 text-sm">
                  <div>TWITTER_BEARER_TOKEN=your_bearer_token</div>
                  <div>TWITTER_API_KEY=your_api_key</div>
                  <div>TWITTER_API_SECRET=your_api_secret</div>
                  <div>TWITTER_ACCESS_TOKEN=your_access_token</div>
                  <div>TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret</div>
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-600 text-white mt-1">4</Badge>
            <div>
              <h3 className="text-white font-semibold">API Permissions</h3>
              <p className="text-slate-400 text-sm">Ensure your app has the following permissions:</p>
              <ul className="text-slate-400 text-sm mt-2 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Read tweets
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Read users
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Search tweets
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-white font-semibold mb-2">Monitored Accounts</h3>
          <p className="text-slate-400 text-sm mb-3">
            The system monitors these key Kenyan accounts for corruption-related content:
          </p>
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
              "@EACCKenya",
              "@DPPKenya",
            ].map((account) => (
              <Badge key={account} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                {account}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-white font-semibold mb-2">Features Enabled</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
              Real-time tweet fetching from monitored accounts
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
              Corruption-related content filtering
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
              Relevance scoring and categorization
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
              Hashtag trending analysis
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
              Rate limiting and error handling
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
