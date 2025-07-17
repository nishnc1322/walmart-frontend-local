"use client"

import type { Agent, AgentRelationship } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Bot, ArrowRight } from "lucide-react"

interface AgentRelationshipVisualizerProps {
  relationships: AgentRelationship[]
  masterAgent: Agent | null
  agents: Agent[]
}

export function AgentRelationshipVisualizer({ relationships, masterAgent, agents }: AgentRelationshipVisualizerProps) {
  if (!masterAgent || relationships.length === 0) {
    return null
  }

  const masterRelationships = relationships.filter((rel) => rel.from_agent_id === masterAgent.id)

  return (
    <Card className="border-0 walmart-shadow bg-gradient-to-r from-white to-walmart-gray-light">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-walmart-yellow" />
          Agent Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-8">
          {/* Master Agent */}
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 ring-4 ring-walmart-yellow">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="bg-walmart-blue text-white">
                <Crown className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center mt-2">
              <div className="font-semibold text-walmart-blue">{masterAgent.name}</div>
              <Badge className="bg-walmart-yellow text-walmart-blue text-xs">Master</Badge>
            </div>
          </div>

          {/* Relationship Lines */}
          {masterRelationships.length > 0 && (
            <>
              <div className="flex flex-col items-center space-y-2">
                <ArrowRight className="h-6 w-6 text-walmart-blue rotate-90" />
                <Badge variant="outline" className="text-xs">
                  Routes queries to
                </Badge>
              </div>

              {/* Connected Agents */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {masterRelationships.map((relationship) => {
                  const connectedAgent = agents.find((a) => a.id === relationship.to_agent_id)
                  if (!connectedAgent) return null

                  return (
                    <div key={relationship.id} className="flex flex-col items-center space-y-2">
                      <Avatar className="h-12 w-12 ring-2 ring-walmart-blue">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback className="bg-walmart-blue text-white">
                          <Bot className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{connectedAgent.name}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          Specialist
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
