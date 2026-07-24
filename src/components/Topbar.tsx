import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROLE_META } from '../data/mock'

export function Topbar({
  crumbs,
  onMenu,
}: {
  crumbs: { label: string; to?: string }[]
  onMenu: () => void
}) {
  const { user } = useApp()

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button type="button" className="btn btn-secondary btn-sm mobile-toggle" onClick={onMenu}>
          Menu
        </button>
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {i > 0 && <span className="sep">/</span>}
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
      </div>
      <div className="context-pill" title="Role-aware shell">
        {user.name.split(' ')[0]} · {ROLE_META[user.activeRole].short}
      </div>
    </header>
  )
}
