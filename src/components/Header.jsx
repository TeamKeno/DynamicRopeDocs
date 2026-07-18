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
          <NavLink to="/docs/overview" className="site-nav__link">
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
