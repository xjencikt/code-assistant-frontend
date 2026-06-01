interface LandingProps {
  onEnter: () => void
}

export const Landing = ({ onEnter }: LandingProps) => (
  <div className="landing">
    <div className="landing-glow" />
    <div className="landing-content">
      <div className="landing-eyebrow">
        <span className="eyebrow-line" />
        AI-powered code explorer
        <span className="eyebrow-line" />
      </div>
      <h1 className="landing-title">
        Got a GitHub repo<br />question? <span className="title-accent">Ask now.</span>
      </h1>
      <p className="landing-sub">
        Index any public repository and chat with its codebase.<br />
        Get instant answers with exact file references.
      </p>
      <div className="landing-features">
        <div className="feature-pill">⎇ Any public repo</div>
        <div className="feature-pill">⚡ Streaming answers</div>
        <div className="feature-pill">⌗ Source citations</div>
      </div>
      <button className="btn-cta" onClick={onEnter}>
        Start exploring <span className="cta-arrow">→</span>
      </button>
    </div>
  </div>
)
