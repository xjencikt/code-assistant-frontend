import { useIndexing } from '../hooks/useIndexing'

interface SidebarProps {
  onClearChat: () => void
}

export const Sidebar = ({ onClearChat }: SidebarProps) => {
  const { status, stats, repoInput, setRepoInput, startIndexing, wipeIndex } = useIndexing()
  const pct = status.total > 0 ? Math.round((status.progress / status.total) * 100) : 0

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="panel-label">Index repository</div>
        <div className="url-row">
          <input
            type="text"
            placeholder="https://github.com/user/repo"
            value={repoInput}
            onChange={e => setRepoInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startIndexing()}
            disabled={status.is_indexing}
          />
          <button
            className="btn-primary"
            onClick={startIndexing}
            disabled={status.is_indexing || !repoInput.trim()}
          >
            {status.is_indexing ? 'Indexing…' : 'Index'}
          </button>
        </div>

        {(status.is_indexing || status.done) && (
          <div className="progress-section">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              {status.is_indexing
                ? `${status.progress} / ${status.total} chunks (${pct}%)`
                : status.done ? '✓ Indexing complete' : ''}
            </div>
          </div>
        )}

        {status.error && <div className="error-pill">{status.error}</div>}
      </div>

      <div className="divider" />

      <div className="sidebar-section">
        <div className="panel-label">Index stats</div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-val">{stats?.total_vectors ?? '—'}</div>
            <div className="stat-lbl">vectors</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats?.dimension ?? '—'}</div>
            <div className="stat-lbl">dimensions</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats?.metric ?? '—'}</div>
            <div className="stat-lbl">metric</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{status.repo_url ? '4' : '—'}</div>
            <div className="stat-lbl">top-k</div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="sidebar-section">
        <div className="panel-label">Actions</div>
        <div className="action-list">
          <button className="btn-action" onClick={wipeIndex}>
            <span className="icon">⊗</span> Wipe index
          </button>
          <button className="btn-action" onClick={onClearChat}>
            <span className="icon">↺</span> Clear conversation
          </button>
        </div>
      </div>

      {status.repo_url && (
        <>
          <div className="divider" />
          <div className="sidebar-section">
            <div className="panel-label">Current repo</div>
            <div className="repo-tag">{status.repo_url.replace('https://github.com/', '')}</div>
          </div>
        </>
      )}
    </aside>
  )
}
