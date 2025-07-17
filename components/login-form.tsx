"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Only allow specific admin emails
    const allowedEmails = ["nishant.chintalapati@walmart.com"]

    if (!allowedEmails.includes(email.toLowerCase())) {
      toast({
        title: "Access Denied",
        description: "This email is not authorized to access the system.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Welcome to IPT AgentHub",
        description: "Successfully signed in!",
      })
    }

    setLoading(false)
  }

  return (
    <Card className="walmart-shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl text-walmart-gray-dark">Access IPT AgentHub</CardTitle>
        <CardDescription className="text-walmart-gray-dark/70">
          Sign in with your authorized Walmart account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-walmart-gray-dark font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-walmart-gray-dark/50" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your authorized Walmart email"
                className="pl-10 border-walmart-gray-medium focus:border-walmart-blue focus:ring-walmart-blue/20"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-walmart-gray-dark font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-walmart-gray-dark/50" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 border-walmart-gray-medium focus:border-walmart-blue focus:ring-walmart-blue/20"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full walmart-gradient hover:bg-walmart-blue-dark text-white font-medium py-2.5"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In to AgentHub
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-walmart-gray-dark/60">Access restricted to authorized Walmart personnel only</p>
        </div>
      </CardContent>
    </Card>
  )
}
