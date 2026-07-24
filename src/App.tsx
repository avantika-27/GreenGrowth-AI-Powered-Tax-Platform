import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { OnboardingGate } from './components/OnboardingGate'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { useApp } from './context/AppContext'
import { ROLE_META } from './data/mock'
import { AiPage } from './pages/AiPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { MessagesPage } from './pages/MessagesPage'
import { ReturnReviewPage } from './pages/ReturnReviewPage'
import { StatusPage } from './pages/StatusPage'

function crumbsFor(pathname: string) {
  if (pathname === '/') return [{ label: 'Dashboard' }]
  if (pathname === '/home') return [{ label: 'Home' }]
  if (pathname.startsWith('/returns'))
    return [
      { label: 'Dashboard', to: '/' },
      { label: 'Return review' },
    ]
  if (pathname.startsWith('/documents'))
    return [
      { label: 'Home', to: '/home' },
      { label: 'Documents' },
    ]
  if (pathname.startsWith('/messages'))
    return [
      { label: 'Home', to: '/home' },
      { label: 'Messages' },
    ]
  if (pathname.startsWith('/ai'))
    return [
      { label: 'Dashboard', to: '/' },
      { label: 'AI insights' },
    ]
  if (pathname.startsWith('/status'))
    return [
      { label: 'Home', to: '/home' },
      { label: 'Return status' },
    ]
  return [{ label: 'GreenGrowth' }]
}

export default function App() {
  const { user } = useApp()
  const audience = ROLE_META[user.activeRole].audience
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <OnboardingGate />
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar crumbs={crumbsFor(loc.pathname)} onMenu={() => setMenuOpen(true)} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                audience === 'client' ? <Navigate to="/home" replace /> : <DashboardPage />
              }
            />
            <Route
              path="/home"
              element={
                audience === 'client' ? <ClientHomePage /> : <Navigate to="/" replace />
              }
            />
            <Route path="/returns/:returnId" element={<ReturnReviewPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route
              path="/ai"
              element={
                audience === 'client' ? <Navigate to="/home" replace /> : <AiPage />
              }
            />
            <Route path="/status" element={<StatusPage />} />
            <Route path="*" element={<Navigate to={audience === 'client' ? '/home' : '/'} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
