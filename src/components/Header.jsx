import { Link, NavLink } from 'react-router-dom'
import { PLUGIN } from '../data/nav.js'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden>🪢</span>
          <span className="brand__name">{PLUGIN.name}</span>
          <span className="brand__badge">{PLUGIN.engine}</span>
        </Link>
        <nav className="site-nav">
          <NavLink to="/" end className="site-nav__link">
            Home
          </NavLink>
          {/* The section root, not the first page in it. NavLink marks itself
              active for its own path and anything under it, so pointing at
              /docs/overview lit the link on that one page and left it dark on
              every sibling. /docs covers the section, and the index route
              redirects it to the overview so it still lands in the same place. */}
          <NavLink to="/docs" className="site-nav__link">
            Docs
          </NavLink>
          <a className="site-nav__link" href={PLUGIN.fabUrl} target="_blank" rel="noreferrer">
            Get on Fab
          </a>
        </nav>
      </div>
    </header>
  )
}
