import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import DocPage from './pages/DocPage.jsx'

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
