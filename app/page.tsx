"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Search, Users, Shield, Sparkles, Zap, Target } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-walmart-gray-light">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-walmart-blue border-t-transparent"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-walmart-gray-light to-white">
      {/* Header */}
      <header className="walmart-gradient text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-walmart-yellow rounded-lg flex items-center justify-center">
                <Bot className="h-7 w-7 text-walmart-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IPT AgentHub</h1>
                <p className="text-walmart-blue-light text-sm">Intelligent Process Technology</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-walmart-yellow font-semibold">Walmart</div>
              <div className="text-sm text-walmart-blue-light">Save money. Live better.</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 walmart-gradient rounded-2xl flex items-center justify-center walmart-shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-walmart-yellow rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-walmart-blue" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-walmart-gray-dark mb-4">Welcome to IPT AgentHub</h2>
          <p className="text-xl text-walmart-gray-dark max-w-3xl mx-auto leading-relaxed">
            Your intelligent gateway to specialized AI agents. Streamline processes, enhance productivity, and deliver
            exceptional results with our comprehensive agent ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-blue/10 rounded-xl flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Smart Intent Search</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">
                Find the perfect agent by describing your goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Simply type "Analyze invoice data" and discover all relevant agents that can accomplish your task
                efficiently.
              </p>
            </CardContent>
          </Card>

          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-yellow/20 rounded-xl flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Master Agent Routing</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">
                Intelligent coordination across multiple specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Ask complex questions and receive comprehensive responses from multiple specialized agents working
                together.
              </p>
            </CardContent>
          </Card>

          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-green/20 rounded-xl flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Team Collaboration</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">
                Secure access control and user management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Manage team access with granular permissions and ensure the right people have access to the right
                agents.
              </p>
            </CardContent>
          </Card>

          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-orange/20 rounded-xl flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Enterprise Security</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">
                Built with Walmart's security standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Enterprise-grade security with role-based access control and comprehensive audit trails.
              </p>
            </CardContent>
          </Card>

          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-blue/10 rounded-xl flex items-center justify-center mb-3">
                <Bot className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Specialized Agents</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">
                Direct access to expert AI assistants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Chat directly with specialized agents for focused assistance in areas like data analysis, code review,
                and more.
              </p>
            </CardContent>
          </Card>

          <Card className="walmart-shadow hover:walmart-shadow-lg transition-all duration-300 border-0">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-walmart-yellow/20 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-walmart-blue" />
              </div>
              <CardTitle className="text-walmart-gray-dark">Process Innovation</CardTitle>
              <CardDescription className="text-walmart-gray-dark/70">Transform how work gets done</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-walmart-gray-dark/80">
                Leverage AI to streamline processes, reduce manual work, and focus on high-value strategic initiatives.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-walmart-gray-dark text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-walmart-yellow rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-walmart-blue" />
              </div>
              <div>
                <div className="font-semibold">IPT AgentHub</div>
                <div className="text-sm text-gray-400">Powered by Walmart Technology</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-walmart-yellow text-sm">© 2024 Walmart Inc.</div>
              <div className="text-xs text-gray-400">All rights reserved</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
