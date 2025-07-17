import type { Agent, SearchResult } from "./types"

export function searchAgentsByIntent(agents: Agent[], query: string): SearchResult[] {
  const queryWords = query
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2)

  const results: SearchResult[] = agents.map((agent) => {
    let relevanceScore = 0
    const matchedKeywords: string[] = []

    // Check intent keywords
    agent.intent_keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase()
      queryWords.forEach((queryWord) => {
        if (keywordLower.includes(queryWord) || queryWord.includes(keywordLower)) {
          relevanceScore += 3
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword)
          }
        }
      })
    })

    // Check capabilities
    agent.capabilities.forEach((capability) => {
      const capabilityLower = capability.toLowerCase()
      queryWords.forEach((queryWord) => {
        if (capabilityLower.includes(queryWord) || queryWord.includes(capabilityLower)) {
          relevanceScore += 2
          if (!matchedKeywords.includes(capability)) {
            matchedKeywords.push(capability)
          }
        }
      })
    })

    // Check description
    const descriptionLower = agent.description.toLowerCase()
    queryWords.forEach((queryWord) => {
      if (descriptionLower.includes(queryWord)) {
        relevanceScore += 1
      }
    })

    // Check name
    const nameLower = agent.name.toLowerCase()
    queryWords.forEach((queryWord) => {
      if (nameLower.includes(queryWord)) {
        relevanceScore += 2
      }
    })

    return {
      agent,
      relevanceScore,
      matchedKeywords,
    }
  })

  return results.filter((result) => result.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore)
}
