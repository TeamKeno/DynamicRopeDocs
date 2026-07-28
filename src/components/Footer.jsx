import { PLUGIN, hasSupportEmail } from '../data/nav.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>
          {PLUGIN.name} v{PLUGIN.version} · {PLUGIN.engine}
        </span>
        <span>
          {/* Appears only once nav.js carries a real address — a mailto: that
              goes nowhere is worse than no contact route at all. */}
          {hasSupportEmail() ? (
            <>
              <a href={`mailto:${PLUGIN.supportEmail}`}>Support</a>
              {' · '}
            </>
          ) : null}
          © {PLUGIN.author}
        </span>
      </div>
    </footer>
  )
}
