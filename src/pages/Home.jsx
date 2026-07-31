import { Link } from 'react-router-dom'
import { PLUGIN, hasSupportEmail } from '../data/nav.js'
import { HERO_MEDIA, HERO_MEDIA_HINT, SHOWCASE } from '../data/features.js'
import { asset } from '../lib/asset.js'
import RopeReel from '../components/RopeReel.jsx'
import Showcase from '../components/Showcase.jsx'

// The hero frame is the LCP element, so nothing here is lazy and the video is
// left to autoplay rather than waiting on an observer the way the showcase
// clips do — it is on screen at load by definition. The placeholder keeps
// aria-hidden because it is decorative filler; real media carries its own alt
// and is exposed.
function HeroVisual() {
  if (!HERO_MEDIA) {
    return (
      <div className="hero__visual" aria-hidden>
        <div className="hero__visual-placeholder">{HERO_MEDIA_HINT}</div>
      </div>
    )
  }
  if (HERO_MEDIA.type === 'video') {
    return (
      <div className="hero__visual">
        <video
          className="hero__visual-media"
          poster={asset(HERO_MEDIA.poster)}
          aria-label={HERO_MEDIA.alt}
          autoPlay
          muted
          loop
          playsInline
        >
          {HERO_MEDIA.webm ? <source src={asset(HERO_MEDIA.webm)} type="video/webm" /> : null}
          {HERO_MEDIA.mp4 ? <source src={asset(HERO_MEDIA.mp4)} type="video/mp4" /> : null}
        </video>
      </div>
    )
  }
  return (
    <div className="hero__visual">
      <img className="hero__visual-media" src={asset(HERO_MEDIA.src)} alt={HERO_MEDIA.alt} />
    </div>
  )
}

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
          go ragdoll.
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
      <HeroVisual />
    </div>
  )
}

function Cta() {
  return (
    <div className="cta">
      <h2 className="section-title">Ready in Minutes</h2>
      <p className="cta__lead">
        A component on the rope, one on what it grabs, then <code>Throw()</code> — a full throw → wrap →
        pull loop.
      </p>
      <div className="cta__actions">
        <Link to="/docs/overview" className="btn btn--primary">
          Read the Docs
        </Link>
      </div>
      {/* The last thing a buyer checks before clicking, so it goes next to the
          button rather than in a page they would have to go looking for. The
          network row costs us the sale of anyone who needs multiplayer, which
          is the point: finding out afterwards costs a refund and a review. */}
      <dl className="cta__spec">
        <dt>Engine</dt>
        <dd>Unreal Engine {PLUGIN.engineVersions.join(' / ')}</dd>
        <dt>Platform</dt>
        <dd>{PLUGIN.platforms} — tested</dd>
        <dt>Scripting</dt>
        <dd>Blueprint or C++</dd>
        <dt>Network</dt>
        <dd>Single-player — no replication</dd>
        <dt>Included</dt>
        <dd>Demo map, stress-test map, 13 sample Blueprints</dd>
      </dl>
      {/* The site footer is hidden while the reel is running (see
          body.reel-active in global.css), so this is the only contact route on
          the landing page. Guarded the same way as the footer and the support
          doc: a mailto: that goes nowhere is worse than no address at all. */}
      <p className="cta__meta">
        by {PLUGIN.author}
        {hasSupportEmail() ? (
          <>
            <br />
            <a href={`mailto:${PLUGIN.supportEmail}`}>{PLUGIN.supportEmail}</a>
          </>
        ) : null}
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
  ...SHOWCASE_PANELS,
  { id: 'cta', title: 'Ready in Minutes', content: <Cta /> },
]

// The same two calls to action the hero carries. Once the reader hauls past the
// hero those scroll away with it, and every panel after is a feature with no
// way out of it — so the reel re-offers them in the corner.
const QUICK_ACTIONS = (
  <>
    <Link to="/docs/quick-start" className="btn btn--primary btn--sm">
      Quick Start
    </Link>
    <a
      href={PLUGIN.fabUrl}
      className="btn btn--ghost btn--sm"
      target="_blank"
      rel="noreferrer"
    >
      Get on Fab
    </a>
  </>
)

export default function Home() {
  return (
    <div className="home">
      <RopeReel panels={PANELS} label="DynamicRope highlights" quickActions={QUICK_ACTIONS} />
    </div>
  )
}
