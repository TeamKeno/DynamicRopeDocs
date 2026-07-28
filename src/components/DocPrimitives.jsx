// Small presentational primitives used inside doc content.

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
