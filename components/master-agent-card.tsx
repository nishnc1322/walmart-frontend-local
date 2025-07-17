"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function MasterAgentCard() {
  return (
    <Card className="h-fit sticky top-4 walmart-shadow-lg border-0 bg-gradient-to-br from-white to-walmart-gray-light">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 walmart-gradient rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-walmart-gray-dark">Master Agent</CardTitle>
            <div className="text-xs text-walmart-blue font-medium">Intelligent Coordinator</div>
          </div>
        </div>
        <CardDescription className="text-walmart-gray-dark/70">
          Ask complex questions and get coordinated responses from multiple specialized agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-walmart-gray-dark/80">
            <p className="mb-3 font-medium text-walmart-gray-dark">The Master Agent can:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-walmart-blue rounded-full"></div>
                Route requests to appropriate agents
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-walmart-green rounded-full"></div>
                Coordinate multi-agent responses
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-walmart-orange rounded-full"></div>
                Provide comprehensive answers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-walmart-yellow rounded-full"></div>
                Handle complex, multi-step tasks
              </li>
            </ul>
          </div>

          <Button asChild className="w-full walmart-gradient hover:bg-walmart-blue-dark text-white font-medium">
            <Link href="/master-agent" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Master Agent
              <Zap className="h-3 w-3 ml-auto" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
