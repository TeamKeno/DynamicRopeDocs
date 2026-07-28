import { useEffect } from 'react'
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

function DocsLayout() {
  return (
    <div className="docs-layout">
      <Sidebar />
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
