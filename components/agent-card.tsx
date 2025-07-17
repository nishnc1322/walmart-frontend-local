"use client"

import type { Agent, SearchResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Bot, Star, Zap } from "lucide-react"
import Link from "next/link"

interface AgentCardProps {
  agent: Agent
  searchResult?: SearchResult
}

export function AgentCard({ agent, searchResult }: AgentCardProps) {
  return (
    <Card className="h-full flex flex-col walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-walmart-blue/10 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-walmart-blue" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-walmart-gray-dark leading-tight">{agent.name}</CardTitle>
              <div className="text-xs text-walmart-blue font-medium mt-1">AI Specialist</div>
            </div>
          </div>
          {searchResult && (
            <Badge className="bg-walmart-yellow text-walmart-blue border-0 font-medium">
              <Star className="h-3 w-3 mr-1" />
              {searchResult.relevanceScore}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-walmart-gray-dark/70">{agent.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <h4 className="text-sm font-medium text-walmart-gray-dark mb-2">Capabilities</h4>
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
              <h4 className="text-sm font-medium text-walmart-gray-dark mb-2">Matched Keywords</h4>
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

        <Button asChild className="w-full mt-4 walmart-gradient hover:bg-walmart-blue-dark text-white font-medium">
          <Link href={`/agent/${agent.id}`} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat with Agent
            <Zap className="h-3 w-3 ml-auto" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
