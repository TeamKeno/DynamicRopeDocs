import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import DocPage from './pages/DocPage.jsx'

/**
 * A router keeps the document scrolled where it was when the route changes, so
 * following the pager off the bottom of one doc page lands you at the bottom of
 * the next one, several screens below its heading.
 *
 * Back and forward are left alone: returning to a page you had scrolled into
 * should put you back where you were reading, not at the top.
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}

/**
 * The sidebar is twenty entries. On a wide screen it sits beside the page and
 * costs nothing, but once the layout collapses to one column it pushed every
 * doc down by a screenful of links before its first heading. Below 900px it
 * folds behind this button instead.
 *
 * The button is rendered at every width and hidden by CSS on PC, so which tier
 * shows it stays a stylesheet decision — matchMedia here would be a second
 * breakpoint to keep in step with the two that already exist.
 */
function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  // Picking a page is the end of using the nav, so it closes itself. Without
  // this the panel stays open over the page it was just asked for.
  useEffect(() => setNavOpen(false), [pathname])

  // Escape is the expected way out of anything that opens over the content, and
  // it is the only way out for a keyboard user who has not reached the button.
  useEffect(() => {
    if (!navOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <div className={`docs-layout${navOpen ? ' docs-layout--nav-open' : ''}`}>
      <button
        type="button"
        className="docs-nav-toggle"
        aria-expanded={navOpen}
        aria-controls="docs-sidebar"
        onClick={() => setNavOpen((open) => !open)}
      >
        {navOpen ? 'Close' : 'Contents'}
      </button>
      <Sidebar id="docs-sidebar" />
      <main className="docs-main">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path=":slug" element={<DocPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs/*" element={<DocsLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}
