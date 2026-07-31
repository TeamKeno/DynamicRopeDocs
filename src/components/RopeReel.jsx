import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Full-viewport panel reel. One scroll gesture hauls one panel, and the
 * transition is played as a rope being yanked taut: the slack rope on the left
 * snaps straight, a knot races along it, and the panel stack arrives with a
 * small overshoot before settling.
 *
 * Falls back to ordinary document flow when the viewport is small or the user
 * asked for reduced motion — the reel is presentation, never the only way to
 * reach the content.
 *
 * `quickActions` is an optional node pinned to the top-right corner of the
 * reel, revealed once the reader leaves the first panel. The opening panel is
 * expected to carry its own calls to action, so showing these on top of it
 * would only double them up; from the second panel on there is nothing else
 * offering a way out. The static fallback does not render them — that path
 * scrolls normally under the site header, which carries the same links.
 */

const HAUL_MS = 900 // one haul, start to settle
const WHEEL_MIN = 18 // ignore micro-scrolls / horizontal trackpad noise
const REARM_MS = 160 // quiet time before a new gesture is accepted
const SWIPE_MIN = 44 // px of touch travel that counts as a swipe

const ROPE_X = 46 // rope's resting x inside the rail
const REST_SAG = 30 // how far the slack rope bows sideways

// Fast pull, small damped overshoot, settle. Reads as "hauled in", not "eased".
function easeYank(t) {
  const c = 1 - Math.pow(1 - t, 3)
  const wobble = Math.sin(t * Math.PI * 2.2) * Math.pow(1 - t, 2.2) * 0.09
  return c + wobble
}

// Slack -> taut -> slack across one haul.
function tautness(t) {
  return Math.sin(Math.PI * Math.min(Math.max(t, 0), 1))
}

// Point on the quadratic bezier the rope is drawn as.
function ropePoint(p, sag, h) {
  const inv = 1 - p
  return {
    x: inv * inv * ROPE_X + 2 * inv * p * (ROPE_X + sag) + p * p * ROPE_X,
    y: 2 * inv * p * (h / 2) + p * p * h,
  }
}

export default function RopeReel({ panels, label = 'Highlights', quickActions = null }) {
  const rootRef = useRef(null)
  const stackRef = useRef(null)
  const panelRefs = useRef([])
  const ropeRef = useRef(null)
  const tautRef = useRef(null)
  const beadRef = useRef(null)
  const glowRef = useRef(null)
  const quickRef = useRef(null)

  const [index, setIndex] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const [height, setHeight] = useState(0)

  const indexRef = useRef(0)
  const heightRef = useRef(0)
  const rafRef = useRef(0)
  const animatingRef = useRef(false)
  const armedRef = useRef(true)
  const quietRef = useRef(0)
  const touchYRef = useRef(null)

  const count = panels.length

  // --- enable / disable -----------------------------------------------------
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    // 901, not 900, so this and the stylesheet draw the same line from opposite
    // sides. global.css hands over to its Tablet tier at (max-width: 900px); at
    // exactly 900px both queries used to match, and the reel ran over a showcase
    // the stylesheet had already stacked.
    const wide = window.matchMedia('(min-width: 901px) and (min-height: 560px)')
    const sync = () => setEnabled(!motion.matches && wide.matches)
    sync()
    motion.addEventListener('change', sync)
    wide.addEventListener('change', sync)
    return () => {
      motion.removeEventListener('change', sync)
      wide.removeEventListener('change', sync)
    }
  }, [])

  // The reel owns the viewport while it is active: no document scroll, no
  // site footer competing for the space below the last panel.
  useEffect(() => {
    document.body.classList.toggle('reel-active', enabled)
    return () => document.body.classList.remove('reel-active')
  }, [enabled])

  useLayoutEffect(() => {
    if (!enabled) return undefined
    const el = rootRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(() => {
      heightRef.current = el.clientHeight
      setHeight(el.clientHeight)
    })
    ro.observe(el)
    heightRef.current = el.clientHeight
    setHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [enabled])

  // --- painting -------------------------------------------------------------
  // Written straight to the DOM rather than through state: this runs every
  // frame of the haul and re-rendering three panels at 60fps is wasted work.
  const paint = useCallback(
    (pos, taut) => {
      const h = heightRef.current
      if (!h) return

      if (stackRef.current) {
        stackRef.current.style.transform = `translate3d(0, ${-pos * h}px, 0)`
      }

      panelRefs.current.forEach((el, i) => {
        if (!el) return
        const dist = i - pos
        const away = Math.min(Math.abs(dist), 1)
        // The panel lags slightly behind its slot, like weight on the line.
        el.style.transform = `translate3d(0, ${dist * -26}px, 0)`
        el.style.opacity = String(1 - away * 0.72)
      })

      const sag = REST_SAG * (1 - 0.92 * taut)
      const d = `M ${ROPE_X} 0 Q ${ROPE_X + sag} ${h / 2} ${ROPE_X} ${h}`
      if (ropeRef.current) ropeRef.current.setAttribute('d', d)
      if (tautRef.current) {
        tautRef.current.setAttribute('d', d)
        tautRef.current.style.opacity = String(taut * 0.9)
      }

      const p = count > 1 ? pos / (count - 1) : 0
      const knot = ropePoint(p, sag, h)
      if (beadRef.current) {
        beadRef.current.setAttribute('cx', knot.x.toFixed(2))
        beadRef.current.setAttribute('cy', knot.y.toFixed(2))
      }
      if (glowRef.current) {
        glowRef.current.setAttribute('cx', knot.x.toFixed(2))
        glowRef.current.setAttribute('cy', knot.y.toFixed(2))
        glowRef.current.style.opacity = String(0.18 + taut * 0.5)
      }
    },
    [count],
  )

  useLayoutEffect(() => {
    if (enabled && height) paint(indexRef.current, 0)
  }, [enabled, height, paint])

  // --- the haul -------------------------------------------------------------
  const haulTo = useCallback(
    (next) => {
      const target = Math.max(0, Math.min(count - 1, next))
      const from = indexRef.current
      if (target === from) return

      cancelAnimationFrame(rafRef.current)
      animatingRef.current = true
      setIndex(target)

      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / HAUL_MS)
        paint(from + (target - from) * easeYank(t), tautness(t))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          indexRef.current = target
          animatingRef.current = false
          paint(target, 0)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [count, paint],
  )

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  // The quick actions stay mounted so they can fade, which means fading them
  // out is not enough: a transparent link is still tabbable and still read
  // aloud. `inert` takes the whole subtree out of both. It is set imperatively
  // because React 18 does not forward the attribute.
  useEffect(() => {
    const el = quickRef.current
    if (el) el.inert = index === 0
  }, [index])

  // --- input ---------------------------------------------------------------
  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    if (!root) return undefined

    // A panel whose own content overflows keeps its scroll; the reel only
    // takes over once that inner scroll has reached its edge.
    const innerCanScroll = (target, dir) => {
      let el = target instanceof Element ? target : null
      while (el && el !== root) {
        if (el.hasAttribute('data-reel-scroll')) {
          const max = el.scrollHeight - el.clientHeight
          if (max > 2) {
            if (dir > 0 && el.scrollTop < max - 1) return true
            if (dir < 0 && el.scrollTop > 1) return true
          }
        }
        el = el.parentElement
      }
      return false
    }

    const onWheel = (e) => {
      const dir = Math.sign(e.deltaY)
      if (dir !== 0 && innerCanScroll(e.target, dir)) return
      e.preventDefault()

      // Trackpad inertia arrives as a long tail of events; re-arm only after
      // the gesture has actually stopped, so one flick moves one panel.
      window.clearTimeout(quietRef.current)
      quietRef.current = window.setTimeout(() => {
        armedRef.current = true
      }, REARM_MS)

      if (!armedRef.current || animatingRef.current) return
      if (Math.abs(e.deltaY) < WHEEL_MIN) return
      armedRef.current = false
      haulTo(indexRef.current + dir)
    }

    const onTouchStart = (e) => {
      touchYRef.current = e.touches[0]?.clientY ?? null
    }
    const onTouchEnd = (e) => {
      const from = touchYRef.current
      touchYRef.current = null
      if (from == null || animatingRef.current) return
      const dy = from - (e.changedTouches[0]?.clientY ?? from)
      if (Math.abs(dy) < SWIPE_MIN) return
      if (innerCanScroll(e.target, Math.sign(dy))) return
      haulTo(indexRef.current + Math.sign(dy))
    }

    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const next =
        e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' '
          ? indexRef.current + 1
          : e.key === 'ArrowUp' || e.key === 'PageUp'
            ? indexRef.current - 1
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? count - 1
                : null
      if (next == null) return
      e.preventDefault()
      haulTo(next)
    }

    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(quietRef.current)
    }
  }, [enabled, count, haulTo])

  // --- render ---------------------------------------------------------------
  if (!enabled) {
    return (
      <div className="reel reel--static">
        {panels.map((p) => (
          <section key={p.id} className="reel__panel">
            <div className="reel__panel-inner">{p.content}</div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div className="reel" ref={rootRef} aria-roledescription="carousel" aria-label={label}>
      <div className="reel__rail" aria-hidden>
        <svg className="reel__rope" width="120" height={height || 0} viewBox={`0 0 120 ${height || 1}`}>
          <circle className="reel__anchor" cx={ROPE_X} cy="0" r="7" />
          <circle className="reel__anchor" cx={ROPE_X} cy={height || 0} r="7" />
          <path className="reel__rope-line" ref={ropeRef} d="" />
          <path className="reel__rope-taut" ref={tautRef} d="" />
          <circle className="reel__knot-glow" ref={glowRef} r="17" cx={ROPE_X} cy="0" />
          <circle className="reel__knot" ref={beadRef} r="6.5" cx={ROPE_X} cy="0" />
        </svg>
      </div>

      <div className="reel__stack" ref={stackRef}>
        {panels.map((p, i) => (
          <section
            key={p.id}
            className="reel__panel"
            aria-hidden={i !== index}
            aria-label={p.title}
          >
            <div className="reel__panel-inner" ref={(el) => (panelRefs.current[i] = el)}>
              {p.content}
            </div>
          </section>
        ))}
      </div>

      <nav className="reel__dots" aria-label="Sections">
        {panels.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`reel__dot${i === index ? ' reel__dot--on' : ''}`}
            aria-current={i === index}
            onClick={() => haulTo(i)}
          >
            <span className="reel__dot-label">{p.title}</span>
          </button>
        ))}
      </nav>

      {quickActions ? (
        <nav
          className={`reel__quick${index > 0 ? ' reel__quick--on' : ''}`}
          aria-label="Quick links"
          ref={quickRef}
        >
          {quickActions}
        </nav>
      ) : null}

      <div className={`reel__hint${index === 0 ? '' : ' reel__hint--gone'}`} aria-hidden>
        Scroll to haul
      </div>
    </div>
  )
}
