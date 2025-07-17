"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Clock, Bot } from "lucide-react"

export default function ConversationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversations</h1>
            <p className="text-gray-600">View and manage your chat history with agents</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-walmart-blue" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bot className="h-8 w-8 text-walmart-blue" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Invoice Data Analysis</h3>
                      <p className="text-sm text-gray-600">Chat with Invoice Data Analyzer</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />2 hours ago
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bot className="h-8 w-8 text-walmart-blue" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Code Review Session</h3>
                      <p className="text-sm text-gray-600">Chat with Code Review Assistant</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />1 day ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
