"use client"

import type { Agent, SearchResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Bot, Star, Edit, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AgentCardSimpleProps {
  agent: Agent
  searchResult?: SearchResult
  isAdmin: boolean
}

const agentAvatars: Record<string, string> = {
  "Invoice Data Analyzer": "/avatars/chipper.png",
  "Code Review Assistant": "/avatars/spender.png",
  "Content Marketing Strategist": "/avatars/shopper.png",
  "Data Science Consultant": "/avatars/professor.png",
  "Legal Document Reviewer": "/avatars/polly.png",
}

export function AgentCardSimple({ agent, searchResult, isAdmin }: AgentCardSimpleProps) {
  const avatarSrc = agentAvatars[agent.name] || "/placeholder.svg?height=48&width=48"

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
              Specialized Agent
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
              <AvatarFallback className="bg-walmart-blue text-white">
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900 leading-tight">{agent.name}</CardTitle>
              <div className="text-sm text-walmart-blue font-medium">AI Specialist</div>
            </div>
          </div>

          <CardDescription className="text-gray-600 leading-relaxed line-clamp-3">{agent.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0">
          <div className="space-y-4 flex-1">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability) => (
                  <Badge
                    key={capability}
                    variant="outline"
                    className="text-xs border-walmart-gray-medium text-walmart-gray-dark"
                  >
                    {capability}
                  </Badge>
                ))}
                {agent.capabilities.length > 3 && (
                  <Badge variant="outline" className="text-xs border-walmart-gray-medium text-walmart-gray-dark">
                    +{agent.capabilities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {searchResult && searchResult.matchedKeywords.length > 0 && (
              <div>
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
          </div>

          <div className="mt-6 space-y-2">
            <Button asChild className="w-full walmart-gradient hover:bg-walmart-blue-dark text-white font-medium">
              <Link href={`/agent/${agent.id}`} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat with Agent
                <Zap className="h-3 w-3 ml-auto" />
              </Link>
            </Button>

            {isAdmin && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white bg-transparent"
              >
                <Link href={`/edit-agent/${agent.id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Agent
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
