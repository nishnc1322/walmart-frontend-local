"use client"

import type { Agent, AgentCluster, SearchResult } from "@/lib/types"
import { AgentCardNew } from "./agent-card-new"
import { AgentClusterCard } from "./agent-cluster-card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

interface AgentGridProps {
  agents: Agent[]
  clusters?: AgentCluster[]
  loading: boolean
  searchResults?: SearchResult[]
  viewMode: "single" | "clusters"
}

export function AgentGrid({ agents, clusters = [], loading, searchResults, viewMode }: AgentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (viewMode === "single" && agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No agents found. Try a different search term or cluster filter.</p>
      </div>
    )
  }

  if (viewMode === "clusters" && clusters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No clusters found.</p>
      </div>
    )
  }

  if (viewMode === "clusters") {
    // Show Knocker first, then other clusters
    const knockerCluster = clusters.find((c) => c.is_master)
    const otherClusters = clusters.filter((c) => !c.is_master)

    return (
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Knocker Master Cluster */}
        {knockerCluster && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Master Multi-Agent Cluster</h2>
            <AgentClusterCard cluster={knockerCluster} isHighlighted={true} />
          </div>
        )}

        {/* Other Clusters */}
        {otherClusters.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Single Agent Clusters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherClusters.map((cluster, index) => (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AgentClusterCard cluster={cluster} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {agents.map((agent, index) => {
          const searchResult = searchResults?.find((r) => r.agent.id === agent.id)
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AgentCardNew agent={agent} searchResult={searchResult} />
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
