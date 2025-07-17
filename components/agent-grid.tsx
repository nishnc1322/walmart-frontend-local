"use client"

import type { Agent, SearchResult } from "@/lib/types"
import { AgentCard } from "./agent-card"
import { Skeleton } from "@/components/ui/skeleton"

interface AgentGridProps {
  agents: Agent[]
  loading: boolean
  searchResults?: SearchResult[]
}

export function AgentGrid({ agents, loading, searchResults }: AgentGridProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No agents found. Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => {
        const searchResult = searchResults?.find((r) => r.agent.id === agent.id)
        return <AgentCard key={agent.id} agent={agent} searchResult={searchResult} />
      })}
    </div>
  )
}
