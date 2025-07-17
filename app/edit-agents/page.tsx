"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase/client"
import type { Agent } from "@/lib/types"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Bot, ArrowLeft, Plus, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAdminUser } from "@/lib/auth-utils"

export default function EditAgentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [agents, setAgents] = useState<Agent[]>([])
  const [masterAgent, setMasterAgent] = useState<Agent | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  const isAdmin = isAdminUser(user?.email)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    } else if (user && !isAdmin) {
      router.push("/dashboard")
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (user && isAdmin) {
      fetchData()
    }
  }, [user, isAdmin])

  const fetchData = async () => {
    try {
      // 🔥 FIXED: Simplified query - no more cluster references
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false })

      if (agentsError) throw agentsError

      // Separate master and regular agents
      const masterAgents = agentsData?.filter((agent) => agent.is_master || agent.name === "Knocker") || []
      const regularAgents = agentsData?.filter((agent) => !agent.is_master && agent.name !== "Knocker") || []

      setMasterAgent(masterAgents[0] || null)
      setAgents(regularAgents)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const toggleAgentStatus = async (agentId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", agentId)

      if (error) throw error

      // Update both master and regular agents
      if (masterAgent?.id === agentId) {
        setMasterAgent({ ...masterAgent, is_active: isActive })
      } else {
        setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, is_active: isActive } : agent)))
      }

      toast({
        title: "Success",
        description: `Agent ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating agent status:", error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const deleteAgent = async (agentId: string, agentName: string) => {
    // Prevent deletion of master agent
    if (masterAgent?.id === agentId) {
      toast({
        title: "Error",
        description: "Cannot delete the master agent",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete "${agentName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase.from("agents").delete().eq("id", agentId)

      if (error) throw error

      setAgents(agents.filter((agent) => agent.id !== agentId))

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-walmart-gray-light">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-walmart-blue border-t-transparent"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
              <Link href="/dashboard" className="text-walmart-blue hover:underline">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-walmart-blue hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Agents</h1>
                <p className="text-gray-600">Manage your AI agents and their configurations</p>
              </div>
              <Button asChild className="walmart-gradient hover:bg-walmart-blue-dark text-white">
                <Link href="/create-agent" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Agent
                </Link>
              </Button>
            </div>
          </div>

          {/* 🔥 NEW: Master Agent Section */}
          {masterAgent && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Agent</h2>
              <Card className="border-0 walmart-shadow bg-gradient-to-r from-walmart-yellow/10 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-walmart-yellow">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback className="bg-walmart-blue text-white">
                          <Crown className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {masterAgent.name}
                          <Badge className="bg-walmart-yellow text-walmart-blue">Master</Badge>
                          <Badge variant={masterAgent.is_active ? "default" : "secondary"}>
                            {masterAgent.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600">Model: {masterAgent.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Active</span>
                        <Switch
                          checked={masterAgent.is_active}
                          onCheckedChange={(checked) => toggleAgentStatus(masterAgent.id, checked)}
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/edit-agent/${masterAgent.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{masterAgent.description}</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {masterAgent.capabilities.slice(0, 4).map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                        {masterAgent.capabilities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{masterAgent.capabilities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Specialized Agents Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Agents</h2>
            <div className="grid gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="border-0 walmart-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback className="bg-walmart-blue text-white">
                            <Bot className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {agent.name}
                            <Badge variant={agent.is_active ? "default" : "secondary"}>
                              {agent.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-gray-600">Model: {agent.model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Active</span>
                          <Switch
                            checked={agent.is_active}
                            onCheckedChange={(checked) => toggleAgentStatus(agent.id, checked)}
                          />
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/edit-agent/${agent.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAgent(agent.id, agent.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{agent.description}</p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((capability) => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Intent Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.intent_keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
