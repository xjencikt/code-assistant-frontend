import { useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import type { Message } from '../types'

interface ChatWindowProps {
  clearTrigger: number
}

export const ChatWindow = ({ clearTrigger }: ChatWindowProps) => {
  const { messages, input, setInput, loading, error, send, clear, bottomRef } = useChat()

  useEffect(() => { if (clearTrigger > 0) clear() }, [clearTrigger])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">{ '{ }' }</div>
            <p>Index a repository, then ask anything about its codebase.</p>
          </div>
        )}
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
        {error && <div className="error-pill">{error}</div>}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          placeholder="Ask about the codebase… (Enter to send, Shift+Enter for newline)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          rows={1}
        />
        <button className="btn-send" onClick={send} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  )
}

const ChatMessage = ({ message }: { message: Message }) => (
  <div className={`msg msg-${message.role}`}>
    <div className="msg-bubble">
      {message.content}
      {message.streaming && <span className="cursor-blink">▋</span>}
    </div>
    {message.sources && message.sources.length > 0 && (
      <div className="sources">
        {message.sources.map((s, i) => (
          <span key={i} className="source-chip">{s}</span>
        ))}
      </div>
    )}
  </div>
)
