export interface StatusResponse {
  is_indexing: boolean
  progress: number
  total: number
  repo_url: string | null
  error: string | null
  done: boolean
}

export interface QueryResponse {
  answer: string
  sources: string[]
}

export interface StatsResponse {
  total_vectors: number
  dimension: number
  metric: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  streaming?: boolean
}
