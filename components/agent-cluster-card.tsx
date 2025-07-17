"use client"

import type { AgentCluster } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users, Crown, Edit, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AgentClusterCardProps {
  cluster: AgentCluster
  isHighlighted?: boolean
}

export function AgentClusterCard({ cluster, isHighlighted = false }: AgentClusterCardProps) {
  const isMaster = cluster.is_master
  const cardClass = cn(
    "h-full flex flex-col bg-white border transition-all duration-300 rounded-xl",
    isHighlighted ? "border-walmart-yellow shadow-lg ring-2 ring-walmart-yellow/20" : "border-gray-200 hover:shadow-lg",
  )

  return (
    <motion.div
      whileHover={{ y: -4, scale: isHighlighted ? 1.01 : 1.02 }}
      transition={{ duration: 0.2 }}
      className={isHighlighted ? "max-w-2xl mx-auto" : ""}
    >
      <Card className={cardClass}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant={isMaster ? "default" : "outline"}
              className={cn(
                "text-xs",
                isMaster
                  ? "bg-walmart-yellow text-walmart-blue border-0 font-semibold"
                  : "text-gray-500 border-gray-300",
              )}
            >
              {isMaster ? "Master Multi-Agent Cluster (MAC)" : "Single Agent Cluster (SAC)"}
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/edit-cluster/${cluster.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Avatar className={cn("h-12 w-12", isMaster && "ring-2 ring-walmart-yellow")}>
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback
                className={cn(
                  "text-white font-semibold",
                  isMaster ? "bg-walmart-yellow text-walmart-blue" : "bg-walmart-blue",
                )}
              >
                {isMaster ? <Crown className="h-6 w-6" /> : <Users className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-gray-900 leading-tight flex items-center gap-2">
                {isMaster ? "Knocker" : cluster.name.replace(" Cluster", "")}
                {isMaster && <Crown className="h-4 w-4 text-walmart-yellow" />}
              </CardTitle>
              <div className="text-sm text-walmart-blue">
                {isMaster ? "User Experience Coordinator" : "Specialized Agent"}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-walmart-blue mb-2">{cluster.name}</h3>
            <CardDescription className="text-gray-600 leading-relaxed">{cluster.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0">
          {/* Agent Avatars */}
          <div className="mb-6">
            <div className="flex -space-x-2 mb-2">
              {cluster.agents?.slice(0, 8).map((agent, index) => (
                <Avatar key={agent.id} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&query=agent avatar ${index + 1}`} />
                  <AvatarFallback className="bg-walmart-blue text-white text-xs">{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {(cluster.member_count || 0) > 8 && (
                <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{(cluster.member_count || 0) - 8}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {cluster.member_count || 0} agent{(cluster.member_count || 0) !== 1 ? "s" : ""} in this cluster
            </p>
          </div>

          <div className="mt-auto space-y-2">
            <Button asChild className="w-full walmart-gradient hover:bg-walmart-blue-dark text-white font-medium">
              <Link href={isMaster ? "/master-agent" : `/cluster/${cluster.id}`} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {isMaster ? "Chat with Master Agent" : "Chat with Cluster"}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white bg-transparent"
            >
              <Link href={`/manage-cluster/${cluster.id}`} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Cluster
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
