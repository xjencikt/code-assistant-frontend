import axios from 'axios'
import type { StatusResponse, StatsResponse } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const api = axios.create({ baseURL: BASE })

export const indexRepo = (repo_url: string) =>
  api.post('/index', { repo_url })

export const getStatus = (): Promise<StatusResponse> =>
  api.get('/status').then(r => r.data)

export const getStats = (): Promise<StatsResponse> =>
  api.get('/stats').then(r => r.data)

export const deleteIndex = () =>
  api.delete('/index')

export const clearConversation = () =>
  api.delete('/conversation')

export const queryStream = async (
  question: string,
  onToken: (token: string) => void,
  onDone: () => void
) => {
  const res = await fetch(`${BASE}/query/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) throw new Error(`Query failed: ${res.status}`)
  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') { onDone(); return }
      onToken(data)
    }
  }
}
