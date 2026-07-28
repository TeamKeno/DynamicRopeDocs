import { Link } from 'react-router-dom'
import { PLUGIN } from '../data/nav.js'
import { FEATURES, SHOWCASE } from '../data/features.js'
import RopeReel from '../components/RopeReel.jsx'
import Showcase from '../components/Showcase.jsx'

function Hero() {
  return (
    <div className="hero">
      <div className="hero__inner">
        <span className="hero__eyebrow">{PLUGIN.engine} Plugin</span>
        <h1 className="hero__title">{PLUGIN.name}</h1>
        <p className="hero__tagline">{PLUGIN.tagline}</p>
        <p className="hero__lead">
          Throw it, and it flies, wraps around a character’s bones, then holds, pulls, or releases.
          The wrap rides the skeleton it caught, so it keeps holding while they run, struggle, and
          go limp.
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
    </div>
  )
}

function Features() {
  return (
    <div className="features">
      <h2 className="section-title">Everything in one component</h2>
      <div className="features__grid" data-reel-scroll>
        {FEATURES.map((f) => (
          <article key={f.title} className="feature-card">
            <div className="feature-card__icon" aria-hidden>
              {f.icon}
            </div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__body">{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Cta() {
  return (
    <div className="cta">
      <h2 className="section-title">Ready in minutes</h2>
      <p className="cta__lead">
        Add a component, call <code>Throw()</code>, and you have a full throw → wrap → pull loop.
      </p>
      <div className="cta__actions">
        <Link to="/docs/overview" className="btn btn--primary">
          Read the Docs
        </Link>
      </div>
      <p className="cta__meta">
        Unreal Engine {PLUGIN.engineVersions.join(' / ')} · {PLUGIN.platforms} · by {PLUGIN.author}
      </p>
    </div>
  )
}

// Showcase groups become panels of their own. `startIndex` keeps the left/right
// alternation running across the panel break instead of restarting each time.
let shown = 0
const SHOWCASE_PANELS = SHOWCASE.map((group) => {
  const startIndex = shown
  shown += group.items.length
  return {
    id: group.id,
    title: group.title,
    content: <Showcase title={group.title} items={group.items} startIndex={startIndex} />,
  }
})

// One panel per scroll gesture; the reel hauls between them on a rope.
const PANELS = [
  { id: 'hero', title: 'DynamicRope', content: <Hero /> },
  { id: 'features', title: 'Everything in one component', content: <Features /> },
  ...SHOWCASE_PANELS,
  { id: 'cta', title: 'Ready in minutes', content: <Cta /> },
]

export default function Home() {
  return (
    <div className="home">
      <RopeReel panels={PANELS} label="DynamicRope highlights" />
    </div>
  )
}
