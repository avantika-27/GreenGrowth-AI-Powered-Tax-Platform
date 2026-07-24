import { Link, useLocation } from 'react-router-dom'
import { ROLE_META, USERS } from '../data/mock'
import { useApp } from '../context/AppContext'
import type { RoleId } from '../types'

const FIRM_NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/returns/ret-maya-2025', label: 'Return review' },
  { to: '/documents', label: 'Documents' },
  { to: '/messages', label: 'Messages' },
  { to: '/ai', label: 'AI insights' },
]

const CLIENT_NAV = [
  { to: '/home', label: 'Home' },
  { to: '/status', label: 'Return status' },
  { to: '/messages', label: 'Messages' },
  { to: '/documents', label: 'My documents' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, setUserId, setActiveRole } = useApp()
  const loc = useLocation()
  const audience = ROLE_META[user.activeRole].audience
  const nav = audience === 'client' ? CLIENT_NAV : FIRM_NAV

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">GreenGrowth</div>
        <div className="brand-sub">AI tax workspace</div>
      </div>

      <nav className="nav-list" aria-label="Primary">
        {nav.map((item) => {
          const active =
            item.to === '/'
              ? loc.pathname === '/'
              : loc.pathname === item.to || loc.pathname.startsWith(item.to + '/')
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="dot" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="role-panel">
        <label htmlFor="user-switch">Demo user</label>
        <select
          id="user-switch"
          value={user.id}
          onChange={(e) => setUserId(e.target.value)}
        >
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <label htmlFor="role-switch">Active role</label>
        <select
          id="role-switch"
          value={user.activeRole}
          onChange={(e) => setActiveRole(e.target.value as RoleId)}
        >
          {user.roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_META[r].label}
            </option>
          ))}
        </select>
        <div className="role-hint">
          Viewing as {ROLE_META[user.activeRole].short}.{' '}
          {user.roles.length > 1
            ? 'This account has multiple roles — switch above.'
            : 'Single-role account.'}
        </div>
      </div>
    </aside>
  )
}
