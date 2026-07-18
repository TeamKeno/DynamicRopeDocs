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
