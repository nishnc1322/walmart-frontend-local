"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { Agent } from "@/lib/types"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Bot, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAgentPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingAgent, setLoadingAgent] = useState(true)
  const [agent, setAgent] = useState<Agent | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    system_prompt: "",
    model: "gpt-4o",
  })

  const [capabilities, setCapabilities] = useState<string[]>([])
  const [intentKeywords, setIntentKeywords] = useState<string[]>([])
  const [newCapability, setNewCapability] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchAgent()
    }
  }, [params.id])

  const fetchAgent = async () => {
    try {
      const { data, error } = await supabase.from("agents").select("*").eq("id", params.id).single()

      if (error) throw error

      setAgent(data)
      setFormData({
        name: data.name,
        description: data.description,
        system_prompt: data.system_prompt,
        model: data.model,
      })
      setCapabilities(data.capabilities || [])
      setIntentKeywords(data.intent_keywords || [])
    } catch (error) {
      console.error("Error fetching agent:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agent details",
        variant: "destructive",
      })
      router.push("/edit-agents")
    } finally {
      setLoadingAgent(false)
    }
  }

  const addCapability = () => {
    if (newCapability.trim() && !capabilities.includes(newCapability.trim())) {
      setCapabilities([...capabilities, newCapability.trim()])
      setNewCapability("")
    }
  }

  const removeCapability = (capability: string) => {
    setCapabilities(capabilities.filter((c) => c !== capability))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !intentKeywords.includes(newKeyword.trim())) {
      setIntentKeywords([...intentKeywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setIntentKeywords(intentKeywords.filter((k) => k !== keyword))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !agent) return

    if (capabilities.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one capability",
        variant: "destructive",
      })
      return
    }

    if (intentKeywords.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one intent keyword",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from("agents")
        .update({
          name: formData.name,
          description: formData.description,
          capabilities,
          intent_keywords: intentKeywords,
          system_prompt: formData.system_prompt,
          model: formData.model,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agent.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Agent updated successfully!",
      })

      router.push("/edit-agents")
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Error",
        description: "Failed to update agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-walmart-gray-light">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-walmart-blue border-t-transparent"></div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
              <Link href="/edit-agents" className="text-walmart-blue hover:underline">
                Return to Edit Agents
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
          <div className="mb-6">
            <Link href="/edit-agents" className="inline-flex items-center gap-2 text-walmart-blue hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Edit Agents
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Agent</h1>
            <p className="text-gray-600">Modify the configuration and behavior of {agent.name}</p>
          </div>

          <Card className="max-w-4xl mx-auto border-0 walmart-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-walmart-blue" />
                Agent Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Data Analysis Expert"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => setFormData({ ...formData, model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this agent specializes in and how it can help users..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_prompt">System Prompt *</Label>
                  <Textarea
                    id="system_prompt"
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    placeholder="You are an expert in... Your role is to... When users ask you to..."
                    rows={4}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    This defines the agent's personality, expertise, and behavior. Be specific about what the agent
                    should do.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Capabilities *</Label>
                    <p className="text-sm text-gray-500 mb-2">What specific skills or tasks can this agent perform?</p>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newCapability}
                        onChange={(e) => setNewCapability(e.target.value)}
                        placeholder="e.g., data visualization, statistical analysis"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCapability())}
                      />
                      <Button type="button" onClick={addCapability} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {capabilities.map((capability) => (
                        <Badge key={capability} variant="secondary" className="flex items-center gap-1">
                          {capability}
                          <button
                            type="button"
                            onClick={() => removeCapability(capability)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Intent Keywords *</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Keywords that users might use when searching for this agent
                    </p>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="e.g., analyze data, create charts, statistics"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {intentKeywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 walmart-gradient hover:bg-walmart-blue-dark text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Updating Agent..." : "Update Agent"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/edit-agents")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
