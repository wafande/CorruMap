import { NextResponse } from "next/server"

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

// Simulated real-time Twitter data - In production, use Twitter API v2
const generateLiveTweets = (): TwitterPost[] => {
  const accounts = [
    { username: "C_NyaKundiH", name: "Caroline Nyakundihi", verified: true },
    { username: "lynn_ngugi1", name: "Lynn Ngugi", verified: true },
    { username: "Kenyans", name: "Kenyans.co.ke", verified: true },
    { username: "LarryMadowo", name: "Larry Madowo", verified: true },
    { username: "bonifacemwangi", name: "Boniface Mwangi", verified: true },
    { username: "ahmednasirlaw", name: "Ahmednasir Abdullahi", verified: true },
    { username: "RobertAlai", name: "Robert Alai", verified: true },
    { username: "MarthaKarua", name: "Martha Karua", verified: true },
  ]

  const corruptionTweets = [
    "BREAKING: New corruption scandal exposed in {ministry}. Billions of taxpayer money unaccounted for. When will this end? #CorruptionFreeKenya #Accountability",
    "The audacity of these corrupt officials is astounding. While Kenyans struggle, they loot with impunity. We demand justice! #StopCorruption #Kenya",
    "Another day, another tender scandal. The procurement system in Kenya is broken and needs urgent reform. #ProcurementReform #Transparency",
    "Whistleblowers are being silenced while corrupt officials walk free. This is not the Kenya we want. #ProtectWhistleblowers #Justice",
    "The EACC must step up and prosecute these corruption cases. Kenyans are tired of investigations that lead nowhere. #EACC #Prosecution",
    "County governments continue to misuse devolution funds meant for development. Governors must be held accountable. #Devolution #CountyGovernment",
    "The judiciary must remain independent and prosecute corruption cases without fear or favor. Justice delayed is justice denied. #JudicialIndependence",
    "Young Kenyans are demanding transparency and accountability. The old ways of doing things must change. #GenZKenya #YouthPower",
    "Parliament must pass stronger anti-corruption laws with real teeth. The current penalties are too weak. #AntiCorruption #Parliament",
    "Civil society organizations play a crucial role in fighting corruption. We must support their work. #CivilSociety #Transparency",
  ]

  const ministries = ["Health", "Education", "Transport", "Energy", "Agriculture", "Water", "Housing", "Treasury"]

  return accounts.slice(0, 6).map((account, index) => {
    const tweetTemplate = corruptionTweets[Math.floor(Math.random() * corruptionTweets.length)]
    const ministry = ministries[Math.floor(Math.random() * ministries.length)]
    const content = tweetTemplate.replace("{ministry}", `Ministry of ${ministry}`)

    const now = new Date()
    const hoursAgo = Math.floor(Math.random() * 12) + 1
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString()

    return {
      id: `tweet_${index + 1}_${Date.now()}`,
      username: account.username,
      name: account.name,
      content,
      timestamp,
      likes: Math.floor(Math.random() * 2000) + 100,
      retweets: Math.floor(Math.random() * 500) + 20,
      replies: Math.floor(Math.random() * 200) + 10,
      url: `https://twitter.com/${account.username}/status/${Date.now() + index}`,
      verified: account.verified,
      hashtags: content.match(/#\w+/g) || [],
      mentions: content.match(/@\w+/g) || [],
    }
  })
}

export async function GET() {
  try {
    const tweets = generateLiveTweets()

    return NextResponse.json({
      success: true,
      data: tweets,
      lastUpdated: new Date().toISOString(),
      total: tweets.length,
    })
  } catch (error) {
    console.error("Error fetching Twitter data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Twitter data",
        data: [],
      },
      { status: 500 },
    )
  }
}
