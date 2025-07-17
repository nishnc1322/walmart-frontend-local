import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Get all users from auth.users (requires service role key)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) throw authError

    // Get agent counts for each user
    const { data: agentCounts, error: agentError } = await supabaseAdmin
      .from("agents")
      .select("created_by")
      .eq("is_active", true)

    if (agentError) throw agentError

    // Count agents per user
    const agentCountMap = agentCounts.reduce(
      (acc, agent) => {
        acc[agent.created_by] = (acc[agent.created_by] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Transform user data
    const users = authUsers.users.map((user) => ({
      id: user.id,
      email: user.email || "No email",
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      agent_count: agentCountMap[user.id] || 0,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
