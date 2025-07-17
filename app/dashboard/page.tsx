"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase/client"
import type { Agent, AgentRelationship, SearchResult } from "@/lib/types"
import { searchAgentsByIntent } from "@/lib/agent-search"
import { isAdminUser } from "@/lib/auth-utils"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MasterAgentCard } from "@/components/master-agent-card-new"
import { AgentCardSimple } from "@/components/agent-card-simple"
import { SearchBar } from "@/components/search-bar"
import { AgentRelationshipVisualizer } from "@/components/agent-relationship-visualizer"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [masterAgent, setMasterAgent] = useState<Agent | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [relationships, setRelationships] = useState<AgentRelationship[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingData, setLoadingData] = useState(true)

  const isAdmin = isAdminUser(user?.email)
  const isSearching = searchQuery.trim().length > 0

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch master agent (Knocker) - handle if column doesn't exist
      let masterData = null
      try {
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .eq("is_master", true)
          .eq("is_active", true)
          .single()

        if (!error) {
          masterData = data
        }
      } catch (err) {
        console.log("Master agent query failed, likely is_master column missing")
      }

      // Fetch all other agents
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (agentsError) throw agentsError

      // If no master agent found, try to find Knocker by name
      if (!masterData && agentsData) {
        masterData = agentsData.find((agent) => agent.name === "Knocker")
        // Remove Knocker from regular agents list
        const filteredAgents = agentsData.filter((agent) => agent.name !== "Knocker")
        setAgents(filteredAgents || [])
      } else {
        // Filter out master agents from regular agents list
        const filteredAgents = agentsData?.filter((agent) => !agent.is_master) || []
        setAgents(filteredAgents)
      }

      // Fetch relationships - handle if table doesn't exist
      let relationshipsData = []
      try {
        const { data, error } = await supabase.from("agent_relationships").select(`
          *,
          from_agent:agents!agent_relationships_from_agent_id_fkey(*),
          to_agent:agents!agent_relationships_to_agent_id_fkey(*)
        `)

        if (!error) {
          relationshipsData = data || []
        }
      } catch (err) {
        console.log("Relationships query failed, likely table doesn't exist yet")
      }

      setMasterAgent(masterData)
      setRelationships(relationshipsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchAgentsByIntent(agents, query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const getFilteredAgents = () => {
    if (searchQuery) {
      return searchResults.map((r) => r.agent)
    }
    return agents
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-walmart-gray-light">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-walmart-blue border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isAdmin ? "Agent Management Dashboard" : "AI Agent Portal"}
              </h1>
              <div className="flex items-center gap-4">
                <SearchBar onSearch={handleSearch} />
                {isAdmin && (
                  <div className="flex items-center gap-2 text-sm text-walmart-blue">
                    <Edit className="h-4 w-4" />
                    Admin Mode
                  </div>
                )}
                {!isAdmin && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    View Mode
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-4">
                <Button asChild className="walmart-gradient hover:bg-walmart-blue-dark text-white">
                  <Link href="/create-agent" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Agent
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white bg-transparent"
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* 🔥 CHANGE: Search Results View - Only show when searching */}
          {isSearching ? (
            <div>
              {/* Back to Dashboard Button */}
              <div className="mb-6">
                <Button variant="outline" onClick={() => handleSearch("")} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>

              {/* Search Results Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Search Results for "{searchQuery}"</h2>
                <p className="text-gray-600">
                  Found {getFilteredAgents().length} agent{getFilteredAgents().length !== 1 ? "s" : ""} matching your
                  search
                </p>
              </div>

              {/* Search Results Grid */}
              {loadingData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : getFilteredAgents().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No agents found matching "{searchQuery}"</p>
                  <p className="text-gray-400 mb-6">
                    Try different keywords like "data analysis", "code review", or "marketing"
                  </p>
                  <Button variant="outline" onClick={() => handleSearch("")} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    View All Agents
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredAgents().map((agent) => {
                    const searchResult = searchResults.find((r) => r.agent.id === agent.id)
                    return (
                      <AgentCardSimple key={agent.id} agent={agent} searchResult={searchResult} isAdmin={isAdmin} />
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            /* 🔥 CHANGE: Normal Dashboard View - Only show when NOT searching */
            <>
              {/* Master Agent Section */}
              {masterAgent && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Agent</h2>
                  <MasterAgentCard agent={masterAgent} isAdmin={isAdmin} />
                </div>
              )}

              {/* Relationship Visualizer */}
              {relationships.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Relationships</h2>
                  <AgentRelationshipVisualizer
                    relationships={relationships}
                    masterAgent={masterAgent}
                    agents={agents}
                  />
                </div>
              )}

              {/* Other Agents Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Agents</h2>

                {loadingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
                    ))}
                  </div>
                ) : agents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No agents available.</p>
                    {isAdmin && (
                      <Button asChild className="mt-4 walmart-gradient hover:bg-walmart-blue-dark text-white">
                        <Link href="/create-agent">Create Your First Agent</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                      <AgentCardSimple key={agent.id} agent={agent} isAdmin={isAdmin} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
