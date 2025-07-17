import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabaseAdmin } from "@/lib/supabase/server"
import { searchAgentsByIntent } from "@/lib/agent-search"

async function generateWithFallback(opts: {
  system: string
  prompt: string
  primaryModel?: string
  fallbackModel?: string
}) {
  const { system, prompt, primaryModel = "gpt-4o", fallbackModel = "gpt-3.5-turbo" } = opts

  try {
    const { text } = await generateText({
      model: openai(primaryModel),
      system,
      prompt,
    })
    return { text, modelUsed: primaryModel }
  } catch (err: any) {
    const msg = String(err?.message || err)
    const shouldFallback =
      /quota|rate limit|billing/i.test(msg) || msg.includes("insufficient_quota") || msg.includes("You exceeded")

    if (!shouldFallback) throw err

    console.warn(`[Master Agent] Primary model failed ("${primaryModel}"). Falling back to "${fallbackModel}".`)

    const { text } = await generateText({
      model: openai(fallbackModel),
      system,
      prompt,
    })
    return { text, modelUsed: fallbackModel }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Get master agent (Knocker)
    const { data: masterAgent, error: masterError } = await supabaseAdmin
      .from("agents")
      .select("*")
      .eq("is_master", true)
      .eq("is_active", true)
      .single()

    if (masterError) {
      console.error("Master agent not found:", masterError)
      return NextResponse.json({ error: "Master agent not available" }, { status: 500 })
    }

    // Get all available specialist agents
    const { data: agents, error: agentsError } = await supabaseAdmin
      .from("agents")
      .select("*")
      .eq("is_master", false)
      .eq("is_active", true)

    if (agentsError) throw agentsError

    // Search for relevant agents based on the user's message
    const searchResults = searchAgentsByIntent(agents || [], message)
    const relevantAgents = searchResults.slice(0, 3) // Top 3 most relevant agents

    // Create enhanced system prompt
    const enhancedSystemPrompt = `${masterAgent.system_prompt}

Available Specialist Agents:
${relevantAgents
  .map(
    (result) => `
- ${result.agent.name}: ${result.agent.description}
  Capabilities: ${result.agent.capabilities.join(", ")}
  Relevance Score: ${result.relevanceScore}
`,
  )
  .join("")}

Current user request: "${message}"

Please provide a comprehensive response that incorporates insights from the most relevant specialist agents. Always maintain your warm, professional tone as Walmart's customer experience specialist.`

    // Generate response using Knocker with automatic fallback
    const { text, modelUsed } = await generateWithFallback({
      system: enhancedSystemPrompt,
      prompt:
        "Please provide a comprehensive response to the user's request, incorporating insights from the most relevant specialized agents while maintaining your role as a customer experience specialist.",
    })

    return NextResponse.json({
      response: text,
      modelUsed,
      routedAgents: relevantAgents.map((r) => r.agent.name),
    })
  } catch (error) {
    console.error("Master agent error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
