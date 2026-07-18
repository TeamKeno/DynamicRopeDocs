import { PLUGIN } from '../data/nav.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>
          {PLUGIN.name} v{PLUGIN.version} · {PLUGIN.engine}
        </span>
        <span>© {PLUGIN.author}</span>
      </div>
    </footer>
  )
}
