// Small presentational primitives used inside doc content.
import { Fragment } from 'react'

/**
 * A table cell listing several node or function names, written slash-separated.
 *
 * Each name becomes its own <code>, which is what lets the cell wrap: one
 * <code> holding the whole list is a single unbreakable run, and a long enough
 * one pushes every other column down to a sliver — the first column takes the
 * width it demands and the rest divide what is left. Paired with the CSS, which
 * keeps any individual name from breaking mid-identifier, the cell now wraps at
 * the separators and nowhere else.
 */
export function Names({ children }) {
  const names = String(children)
    .split('/')
    .map((n) => n.trim())
    .filter(Boolean)

  return names.map((name, i) => (
    <Fragment key={name}>
      {i > 0 ? ' / ' : null}
      <code>{name}</code>
    </Fragment>
  ))
}

export function CodeBlock({ code, language }) {
  return (
    <pre className="code-block" data-lang={language}>
      <code>{code}</code>
    </pre>
  )
}

/**
 * An embedded YouTube player, sized by a 16:9 box so it fills the doc measure
 * at any width. The nocookie host is the one that does not write tracking
 * cookies for a reader who never presses play, and the frame is lazy so a page
 * that opens below the video does not pay for the player on load.
 */
export function VideoEmbed({ id, title, caption }) {
  return (
    <figure className="video-embed">
      <div className="video-embed__frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption ? <figcaption className="video-embed__caption">{caption}</figcaption> : null}
    </figure>
  )
}

export function Callout({ type = 'info', title, children }) {
  return (
    <div className={`callout callout--${type}`}>
      {title && <div className="callout__title">{title}</div>}
      <div className="callout__body">{children}</div>
    </div>
  )
}

// Reference table for config struct fields / properties. `rows` is an array of
// arrays matching `columns`; cells may be strings or JSX.
export function PropTable({ columns = ['Property', 'Default', 'What it does'], rows }) {
  return (
    <div className="prop-table-wrap">
      <table className="prop-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
