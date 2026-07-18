import { useParams, Navigate, Link } from 'react-router-dom'
import { DOCS } from '../data/docs.jsx'
import { DOC_ORDER, DOC_NAV } from '../data/nav.js'

function titleForSlug(slug) {
  for (const g of DOC_NAV) {
    const item = g.items.find((i) => i.slug === slug)
    if (item) return item.title
  }
  return slug
}

export default function DocPage() {
  const { slug } = useParams()
  const doc = DOCS[slug]

  if (!doc) return <Navigate to="/docs/overview" replace />

  const idx = DOC_ORDER.indexOf(slug)
  const prev = idx > 0 ? DOC_ORDER[idx - 1] : null
  const next = idx < DOC_ORDER.length - 1 ? DOC_ORDER[idx + 1] : null

  return (
    <article className="doc">
      <h1 className="doc__title">{doc.title}</h1>
      <div className="doc__body">{doc.body}</div>

      <nav className="doc__pager">
        {prev ? (
          <Link className="doc__pager-link doc__pager-link--prev" to={`/docs/${prev}`}>
            <span className="doc__pager-dir">← Previous</span>
            <span className="doc__pager-title">{titleForSlug(prev)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="doc__pager-link doc__pager-link--next" to={`/docs/${next}`}>
            <span className="doc__pager-dir">Next →</span>
            <span className="doc__pager-title">{titleForSlug(next)}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
