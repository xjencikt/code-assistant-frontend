import { useState } from 'react'
import { Landing } from './components/Landing'
import { Sidebar } from './components/Sidebar'
import { ChatWindow } from './components/ChatWindow'
import './App.css'

type View = 'landing' | 'app'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [transitioning, setTransitioning] = useState(false)
  const [clearTrigger, setClearTrigger] = useState(0)

  const enter = () => {
    setTransitioning(true)
    setTimeout(() => { setView('app'); setTransitioning(false) }, 500)
  }

  const goHome = () => {
    setTransitioning(true)
    setTimeout(() => { setView('landing'); setTransitioning(false) }, 500)
  }

  return (
    <div className={`root ${transitioning ? 'fading' : ''}`}>
      {view === 'landing' ? (
        <Landing onEnter={enter} />
      ) : (
        <div className="app-layout">
          <header className="topbar">
            <button className="topbar-home" onClick={goHome}>← Home</button>
            <div className="topbar-brand">
              <span className="topbar-icon">{'</>'}</span>
              <span className="topbar-title">Codebase RAG</span>
            </div>
            <div className="topbar-right" />
          </header>
          <div className="app-body">
            <Sidebar onClearChat={() => setClearTrigger(n => n + 1)} />
            <main className="main-area">
              <ChatWindow clearTrigger={clearTrigger} />
            </main>
          </div>
        </div>
      )}
    </div>
  )
}
