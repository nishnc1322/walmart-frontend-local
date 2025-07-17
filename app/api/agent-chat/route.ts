import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, systemPrompt, model = "gpt-4o" } = await request.json()

    const { text } = await generateText({
      model: openai(model),
      system: systemPrompt,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Agent chat error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
