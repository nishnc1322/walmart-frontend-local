export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  intent_keywords: string[]
  system_prompt: string
  model: string
  created_by?: string
  created_at: string
  updated_at: string
  is_active: boolean
  is_master: boolean
}

export interface AgentRelationship {
  id: string
  from_agent_id: string
  to_agent_id: string
  relationship_type: string
  relationship_label: string
  created_at: string
  from_agent?: Agent
  to_agent?: Agent
}

export interface UserAgentAccess {
  id: string
  user_id: string
  agent_id: string
  access_level: "read" | "write" | "admin"
  granted_by: string
  granted_at: string
}

export interface Conversation {
  id: string
  user_id: string
  agent_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
}

export interface SearchResult {
  agent: Agent
  relevanceScore: number
  matchedKeywords: string[]
}
