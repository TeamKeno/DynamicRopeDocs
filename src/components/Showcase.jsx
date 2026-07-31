import { useEffect, useRef } from 'react'
import { asset } from '../lib/asset.js'

/**
 * A group of full-width showcase rows: prose on one side, a clip on the other.
 * Rows alternate sides, and the alternation is driven by a global index so the
 * zigzag stays continuous when a group is split across two reel panels.
 */

// Reel panels are all mounted at once, so eight clips would decode in parallel
// for the sake of the one that is actually on screen. Only the visible clip runs.
function ShowcaseVideo({ media }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="showcase__frame"
      poster={asset(media.poster)}
      aria-label={media.alt}
      muted
      loop
      playsInline
      preload="metadata"
    >
      {media.webm ? <source src={asset(media.webm)} type="video/webm" /> : null}
      {media.mp4 ? <source src={asset(media.mp4)} type="video/mp4" /> : null}
    </video>
  )
}

function ShowcaseFrame({ media, hint }) {
  if (!media) {
    return (
      <div className="showcase__frame showcase__frame--empty">
        <span className="showcase__frame-label">Clip coming soon</span>
        {hint ? <span className="showcase__frame-hint">{hint}</span> : null}
      </div>
    )
  }
  if (media.type === 'video') return <ShowcaseVideo media={media} />
  return <img className="showcase__frame" src={asset(media.src)} alt={media.alt} loading="lazy" />
}

export default function Showcase({ title, items, startIndex = 0 }) {
  return (
    <div className="showcase">
      <h2 className="section-title">{title}</h2>
      <div className="showcase__rows" data-reel-scroll>
        {items.map((item, i) => (
          <article
            key={item.id}
            className={`showcase__row${(startIndex + i) % 2 ? ' showcase__row--flip' : ''}`}
          >
            <div className="showcase__text">
              <span className="showcase__eyebrow">{item.eyebrow}</span>
              <h3 className="showcase__heading">{item.heading}</h3>
              <p className="showcase__body">{item.body}</p>
              {item.points?.length ? (
                <ul className="showcase__points">
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="showcase__media">
              <ShowcaseFrame media={item.media} hint={item.mediaHint} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
