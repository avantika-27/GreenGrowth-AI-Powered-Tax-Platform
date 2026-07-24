import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DOCUMENTS } from '../data/mock'

export function DocumentsPage() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(focus)

  const types = useMemo(
    () => ['all', ...Array.from(new Set(DOCUMENTS.map((d) => d.type))).sort()],
    [],
  )

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return DOCUMENTS.filter((d) => {
      if (type !== 'all' && d.type !== type) return false
      if (status !== 'all' && d.status !== status) return false
      if (!query) return true
      return (
        d.name.toLowerCase().includes(query) ||
        d.client.toLowerCase().includes(query) ||
        d.tags.some((t) => t.includes(query))
      )
    })
  }, [q, type, status])

  const active = DOCUMENTS.find((d) => d.id === (selected || focus)) ?? filtered[0]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Documents without the overwhelm</h1>
          <p>
            {DOCUMENTS.length} items in this demo dataset. Search and filter first; open detail only
            when you need it. Context links keep you oriented to the return and messages.
          </p>
        </div>
      </div>

      <div className="filters">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, client, or tag…"
          aria-label="Search documents"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All types' : t}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          {['all', 'received', 'processing', 'needs_review', 'linked', 'missing'].map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-2">
        <section className="panel panel-pad" style={{ overflow: 'auto', maxHeight: '70vh' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginBottom: '0.5rem' }}>
            Showing {filtered.length} of {DOCUMENTS.length}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Status</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 80).map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  style={{
                    cursor: 'pointer',
                    background:
                      d.id === active?.id ? 'rgba(47,122,88,0.1)' : undefined,
                  }}
                >
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>{d.client}</div>
                  </td>
                  <td>{d.type}</td>
                  <td>
                    <span className="badge">{d.status.replace('_', ' ')}</span>
                  </td>
                  <td>{d.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 80 && (
            <div className="empty">Refining further… showing first 80 matches for snappy UI.</div>
          )}
        </section>

        <aside className="panel panel-pad source-pane">
          {active ? (
            <>
              <h2 className="panel-title">{active.name}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                <div>
                  <strong>Client:</strong> {active.client}
                </div>
                <div>
                  <strong>Status:</strong> {active.status.replace('_', ' ')}
                </div>
                <div>
                  <strong>Pages:</strong> {active.pages || '—'}
                </div>
                <div>
                  <strong>Uploaded:</strong> {active.uploadedAt || 'Not received'}
                </div>
                <div>
                  <strong>Tags:</strong> {active.tags.join(', ')}
                </div>
              </div>

              <div className="related" style={{ marginTop: '1rem' }}>
                <Link to={`/returns/${active.returnId}`}>Open return</Link>
                <Link to={`/messages?doc=${active.id}`}>Messages</Link>
                {active.id === 'doc-w2' && (
                  <Link to="/returns/ret-maya-2025?field=f-wages">Trace wages field</Link>
                )}
              </div>

              <div className="doc-mock" style={{ marginTop: '1rem' }}>
                <div className="doc-mock-header">Summary view</div>
                <div className="doc-mock-body">
                  {active.status === 'missing' ? (
                    <div>
                      This document was requested but not uploaded yet. Context is preserved so you
                      can jump to the related message or task without losing your place.
                    </div>
                  ) : (
                    <div>
                      Simulated preview for <strong>{active.type}</strong>.
                      <br />
                      Progressive disclosure: list → summary → (in return review) page-level
                      highlight.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty">No documents match.</div>
          )}
        </aside>
      </div>
    </div>
  )
}
