import { Link } from 'react-router-dom'
import { PLUGIN } from '../data/nav.js'
import { FEATURES } from '../data/features.js'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__inner">
          <span className="hero__eyebrow">{PLUGIN.engine} Plugin</span>
          <h1 className="hero__title">{PLUGIN.name}</h1>
          <p className="hero__tagline">{PLUGIN.tagline}</p>
          <p className="hero__lead">
            Throw it, and it flies, wraps around a character’s bones, then holds, pulls, or releases.
            GPU-solved, animation-following, and ready for gameplay.
          </p>
          <div className="hero__actions">
            <Link to="/docs/quick-start" className="btn btn--primary">
              Quick Start
            </Link>
            <a href={PLUGIN.fabUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
              Get on Fab
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden>
          {/* TODO: replace with a looping gameplay clip or hero screenshot */}
          <div className="hero__visual-placeholder">Gameplay clip / screenshot</div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Everything in one component</h2>
        <div className="features__grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <div className="feature-card__icon" aria-hidden>{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__body">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2 className="section-title">Ready in minutes</h2>
        <p className="cta__lead">
          Add a component, call <code>Throw()</code>, and you have a full throw → wrap → pull loop.
        </p>
        <Link to="/docs/overview" className="btn btn--primary">
          Read the Docs
        </Link>
      </section>
    </div>
  )
}
