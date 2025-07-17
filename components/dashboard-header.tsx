"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bot, LogOut, Settings, User, Sparkles } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="walmart-gradient text-white border-b-4 border-walmart-yellow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-walmart-yellow rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-walmart-blue" />
            </div>
            <div>
              <span className="text-xl font-bold">IPT AgentHub</span>
              <div className="text-walmart-blue-light text-sm">Intelligent Process Technology</div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-walmart-yellow">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Walmart Technology</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-walmart-blue-dark">
                  <Avatar className="h-10 w-10 border-2 border-walmart-yellow">
                    <AvatarFallback className="bg-walmart-yellow text-walmart-blue font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-3 bg-walmart-gray-light">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-walmart-blue text-white text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-walmart-gray-dark text-sm">{user?.email}</p>
                    <p className="text-xs text-walmart-gray-dark/70">AgentHub User</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 text-walmart-gray-dark">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2 text-walmart-gray-dark">
                    <Settings className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
