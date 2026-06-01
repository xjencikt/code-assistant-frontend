import { useState, useEffect, useRef } from 'react'
import { indexRepo, getStatus, getStats, deleteIndex } from '../api/client'
import type { StatusResponse, StatsResponse } from '../types'

export const useIndexing = () => {
  const [status, setStatus] = useState<StatusResponse>({
    is_indexing: false, progress: 0, total: 0,
    repo_url: null, error: null, done: false,
  })
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [repoInput, setRepoInput] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStats = async () => {
    try { setStats(await getStats()) } catch {}
  }

  const startPolling = () => {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      try {
        const s = await getStatus()
        setStatus(s)
        if (!s.is_indexing) {
          stopPolling()
          if (s.done) fetchStats()
        }
      } catch {}
    }, 1500)
  }

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }

  useEffect(() => {
    getStatus().then(s => { setStatus(s); if (s.is_indexing) startPolling() })
    fetchStats()
    return stopPolling
  }, [])

  const startIndexing = async () => {
    if (!repoInput.trim()) return
    try {
      await indexRepo(repoInput.trim())
      startPolling()
    } catch (e: any) {
      setStatus(prev => ({ ...prev, error: e.message }))
    }
  }

  const wipeIndex = async () => {
    await deleteIndex()
    setStats(null)
    setStatus({ is_indexing: false, progress: 0, total: 0, repo_url: null, error: null, done: false })
  }

  return { status, stats, repoInput, setRepoInput, startIndexing, wipeIndex, fetchStats }
}
