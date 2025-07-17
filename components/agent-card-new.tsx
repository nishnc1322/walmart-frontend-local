"use client"

import type { Agent, SearchResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AgentCardProps {
  agent: Agent
  searchResult?: SearchResult
}

const agentAvatars: Record<string, string> = {
  "Invoice Data Analyzer": "/avatars/chipper.png",
  "Code Review Assistant": "/avatars/spender.png",
  "Content Marketing Strategist": "/avatars/shopper.png",
  "Data Science Consultant": "/avatars/professor.png",
  "Legal Document Reviewer": "/avatars/polly.png",
}

const agentSubtitles: Record<string, string> = {
  "Invoice Data Analyzer": "Category Management",
  "Code Review Assistant": "SQL Analyst",
  "Content Marketing Strategist": "Strategic Sourcing",
  "Data Science Consultant": "Deep Research Agent",
  "Legal Document Reviewer": "Policy Advisor",
}

export function AgentCardNew({ agent, searchResult }: AgentCardProps) {
  const avatarSrc = agentAvatars[agent.name] || "/placeholder.svg?height=60&width=60"
  const subtitle = agentSubtitles[agent.name] || "AI Specialist"

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
              Single Agent Cluster (SAC)
            </Badge>
            {searchResult && (
              <Badge className="bg-walmart-yellow text-walmart-blue border-0 font-medium">
                <Star className="h-3 w-3 mr-1" />
                {searchResult.relevanceScore}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={agent.name} />
              <AvatarFallback className="bg-walmart-blue text-white">{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-gray-900 leading-tight">{agent.name}</CardTitle>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-walmart-blue mb-2">{subtitle}</h3>
            <CardDescription className="text-gray-600 leading-relaxed">{agent.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0">
          {searchResult && searchResult.matchedKeywords.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {searchResult.matchedKeywords.slice(0, 3).map((keyword) => (
                  <Badge key={keyword} className="text-xs bg-walmart-blue text-white border-0">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto">
            <Button asChild className="w-full walmart-gradient hover:bg-walmart-blue-dark text-white font-medium">
              <Link href={`/agent/${agent.id}`} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat with Agent
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
