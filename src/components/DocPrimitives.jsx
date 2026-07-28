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
