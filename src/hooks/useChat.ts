import { useState, useRef } from 'react'
import { queryStream, clearConversation } from '../api/client'
import type { Message } from '../types'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])
    setLoading(true)
    scrollToBottom()

    try {
      await queryStream(
        q,
        (token) => {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.role === 'assistant') last.content += token
            return next
          })
          scrollToBottom()
        },
        () => {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last.role === 'assistant') last.streaming = false
            return next
          })
          setLoading(false)
        }
      )
    } catch (e: any) {
      setError(e.message)
      setMessages(prev => prev.slice(0, -1))
      setLoading(false)
    }
  }

  const clear = async () => {
    await clearConversation()
    setMessages([])
    setError(null)
  }

  return { messages, input, setInput, loading, error, send, clear, bottomRef }
}
