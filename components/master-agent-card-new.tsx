"use client"

import type { Agent } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Crown, Edit, Sparkles, Zap, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface MasterAgentCardProps {
  agent: Agent
  isAdmin: boolean
}

export function MasterAgentCard({ agent, isAdmin }: MasterAgentCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden border-0 walmart-shadow-lg bg-gradient-to-br from-white via-walmart-gray-light to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-walmart-blue to-walmart-yellow"></div>
        </div>

        {/* Master Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-walmart-yellow text-walmart-blue border-0 font-bold px-3 py-1">
            <Crown className="h-3 w-3 mr-1" />
            MASTER AGENT
          </Badge>
        </div>

        <CardHeader className="pb-6 relative">
          <div className="flex items-center gap-6 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-walmart-yellow shadow-lg">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="bg-walmart-blue text-white text-2xl font-bold">
                  <Crown className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-walmart-yellow rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-walmart-blue" />
              </div>
            </div>

            <div className="flex-1">
              <CardTitle className="text-3xl text-walmart-blue mb-2 flex items-center gap-3">
                {agent.name}
                <Crown className="h-6 w-6 text-walmart-yellow" />
              </CardTitle>
              <div className="text-lg font-semibold text-walmart-gray-dark mb-2">Customer Experience Specialist</div>
              <CardDescription className="text-base text-walmart-gray-dark leading-relaxed">
                {agent.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Capabilities */}
            <div>
              <h4 className="text-lg font-semibold text-walmart-gray-dark mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-walmart-blue" />
                Core Capabilities
              </h4>
              <div className="space-y-2">
                {agent.capabilities.slice(0, 4).map((capability) => (
                  <div key={capability} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-walmart-blue rounded-full"></div>
                    <span className="text-sm text-walmart-gray-dark font-medium">{capability}</span>
                  </div>
                ))}
                {agent.capabilities.length > 4 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-walmart-yellow rounded-full"></div>
                    <span className="text-sm text-walmart-gray-dark">
                      +{agent.capabilities.length - 4} more capabilities
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-lg font-semibold text-walmart-gray-dark mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-walmart-yellow" />
                Key Features
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-walmart-green rounded-full"></div>
                  <span className="text-sm text-walmart-gray-dark">Intelligent Query Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-walmart-orange rounded-full"></div>
                  <span className="text-sm text-walmart-gray-dark">Multi-Agent Coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-walmart-blue rounded-full"></div>
                  <span className="text-sm text-walmart-gray-dark">Response Synthesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-walmart-yellow rounded-full"></div>
                  <span className="text-sm text-walmart-gray-dark">Customer Experience Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              asChild
              className="flex-1 walmart-gradient hover:bg-walmart-blue-dark text-white font-semibold py-3"
            >
              <Link href="/master-agent" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with Knocker
                <Sparkles className="h-4 w-4 ml-auto" />
              </Link>
            </Button>

            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white bg-transparent"
              >
                <Link href={`/edit-agent/${agent.id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Master
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
