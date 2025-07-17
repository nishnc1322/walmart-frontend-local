"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Agent, UserAgentAccess } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, Bot } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AccessRecord extends UserAgentAccess {
  agent_name: string
  user_email: string
}

export function AccessManagement() {
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [accessResult, agentsResult] = await Promise.all([
        supabase.from("user_agent_access").select(`
            *,
            agents(name),
            users:user_id(email)
          `),
        supabase.from("agents").select("*").eq("is_active", true),
      ])

      if (accessResult.error) throw accessResult.error
      if (agentsResult.error) throw agentsResult.error

      // Transform the data to include agent names and user emails
      const transformedAccess =
        accessResult.data?.map((record) => ({
          ...record,
          agent_name: record.agents?.name || "Unknown Agent",
          user_email: record.users?.email || "Unknown User",
        })) || []

      setAccessRecords(transformedAccess)
      setAgents(agentsResult.data || [])
    } catch (error) {
      console.error("Error fetching access data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch access data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAccessLevel = async (accessId: string, newLevel: string) => {
    try {
      const { error } = await supabase.from("user_agent_access").update({ access_level: newLevel }).eq("id", accessId)

      if (error) throw error

      setAccessRecords((records) =>
        records.map((record) => (record.id === accessId ? { ...record, access_level: newLevel as any } : record)),
      )

      toast({
        title: "Success",
        description: "Access level updated successfully",
      })
    } catch (error) {
      console.error("Error updating access level:", error)
      toast({
        title: "Error",
        description: "Failed to update access level",
        variant: "destructive",
      })
    }
  }

  const revokeAccess = async (accessId: string) => {
    try {
      const { error } = await supabase.from("user_agent_access").delete().eq("id", accessId)

      if (error) throw error

      setAccessRecords((records) => records.filter((record) => record.id !== accessId))

      toast({
        title: "Success",
        description: "Access revoked successfully",
      })
    } catch (error) {
      console.error("Error revoking access:", error)
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Access Control</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{accessRecords.length} Access Records</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {accessRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{record.user_email}</span>
                    <span className="text-gray-500">has</span>
                    <Badge
                      variant={
                        record.access_level === "admin"
                          ? "default"
                          : record.access_level === "write"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {record.access_level}
                    </Badge>
                    <span className="text-gray-500">access to</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="font-medium">{record.agent_name}</span>
                  </div>
                  <div className="text-sm text-gray-500 ml-6">
                    Granted on {new Date(record.granted_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={record.access_level} onValueChange={(value) => updateAccessLevel(record.id, value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="write">Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => revokeAccess(record.id)}>
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {accessRecords.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Access Records</h3>
              <p className="text-gray-500">No user access permissions have been configured yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
