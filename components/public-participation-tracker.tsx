"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ExternalLink, FileText, Video } from "lucide-react"
import { fetchPublicParticipationEvents, type PublicParticipationEvent } from "@/lib/news-api"

export function PublicParticipationTracker() {
  const [events, setEvents] = useState<PublicParticipationEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const participationEvents = await fetchPublicParticipationEvents()
        setEvents(participationEvents)
      } catch (error) {
        console.error("Error loading participation events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600"
      case "ongoing":
        return "bg-kenya-green"
      case "completed":
        return "bg-gray-600"
      case "cancelled":
        return "bg-kenya-red"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "public_hearing":
        return "text-kenya-red"
      case "consultation":
        return "text-blue-400"
      case "town_hall":
        return "text-kenya-green"
      case "budget_participation":
        return "text-purple-400"
      case "policy_review":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kenya-red"></div>
            <span className="ml-3 text-slate-300">Loading participation events...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="mr-2 h-5 w-5 text-kenya-green" />
          Public Participation Tracker
        </CardTitle>
        <CardDescription className="text-slate-400">
          Track opportunities for citizen engagement in government processes and policy-making
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{event.title}</h4>
                    <Badge className={`${getStatusColor(event.status)} text-white text-xs`}>{event.status}</Badge>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{event.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="h-3 w-3 mr-2" />
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="h-3 w-3 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Users className="h-3 w-3 mr-2" />
                        {event.organizer}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className={`text-sm font-medium capitalize ${getTypeColor(event.type)}`}>
                        {event.type.replace("_", " ")}
                      </div>
                      {event.participantCount && (
                        <div className="text-slate-400 text-sm">
                          {event.participantCount.toLocaleString()} participants
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {event.documentsUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        asChild
                      >
                        <a href={event.documentsUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-1 h-3 w-3" />
                          Documents
                        </a>
                      </Button>
                    )}

                    {event.feedbackUrl && (
                      <Button size="sm" className="bg-kenya-green hover:bg-green-700" asChild>
                        <a href={event.feedbackUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Participate
                        </a>
                      </Button>
                    )}

                    {event.livestreamUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-kenya-red text-kenya-red hover:bg-kenya-red hover:text-white"
                        asChild
                      >
                        <a href={event.livestreamUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="mr-1 h-3 w-3" />
                          Live Stream
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No public participation events found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
