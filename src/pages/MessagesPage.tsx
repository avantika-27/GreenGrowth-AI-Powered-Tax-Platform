import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROLE_META, THREADS } from '../data/mock'

export function MessagesPage() {
  const { user } = useApp()
  const audience = ROLE_META[user.activeRole].audience
  const [params, setParams] = useSearchParams()
  const focusThread = params.get('thread')
  const focusDoc = params.get('doc')

  const threads = useMemo(() => {
    let list = THREADS
    if (focusDoc) list = list.filter((t) => t.linkedDocumentId === focusDoc)
    return list
  }, [focusDoc])

  const [activeId, setActiveId] = useState(focusThread || threads[0]?.id)
  const active = threads.find((t) => t.id === activeId) ?? threads[0]
  const [draft, setDraft] = useState('')
  const [visibility, setVisibility] = useState<'client' | 'internal'>('client')
  const [localMsgs, setLocalMsgs] = useState<Record<string, typeof THREADS[0]['messages']>>({})

  const messages = [...(active?.messages ?? []), ...(localMsgs[active?.id] ?? [])].filter((m) =>
    audience === 'client' ? m.visibility === 'client' : true,
  )

  function send() {
    if (!draft.trim() || !active) return
    const msg = {
      id: `local-${Date.now()}`,
      threadId: active.id,
      authorId: user.id,
      authorName: user.name,
      body: draft.trim(),
      createdAt: new Date().toISOString(),
      visibility: audience === 'client' ? ('client' as const) : visibility,
    }
    setLocalMsgs((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }))
    setDraft('')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Conversations on work — not another inbox</h1>
          <p>
            Every thread is anchored to a document or tax issue, shows who owns the next step, and
            keeps firm-only notes out of the client view.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Threads</h2>
          {focusDoc && (
            <div style={{ marginBottom: '0.75rem' }}>
              <button
                type="button"
                className="chip-link"
                onClick={() => {
                  params.delete('doc')
                  setParams(params)
                }}
              >
                Clear document filter
              </button>
            </div>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              className="thread"
              onClick={() => setActiveId(t.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: t.id === active?.id ? 'rgba(47,122,88,0.08)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--line)',
                cursor: 'pointer',
                borderRadius: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>{t.subject}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.25rem' }}>
                Next: {t.nextOwner === 'resolved' ? 'Resolved' : t.nextOwner}
                {t.outstandingRequest ? ` · ${t.outstandingRequest}` : ''}
              </div>
              <div className="related">
                {t.linkedIssue && <span className="badge">{t.linkedIssue}</span>}
              </div>
            </button>
          ))}
        </section>

        <section className="panel panel-pad">
          {active ? (
            <>
              <h2 className="panel-title">{active.subject}</h2>
              <div className="related" style={{ marginBottom: '0.85rem' }}>
                <Link to={`/returns/${active.returnId}`}>Return</Link>
                {active.linkedDocumentId && (
                  <Link to={`/documents?focus=${active.linkedDocumentId}`}>Document</Link>
                )}
                {active.linkedTaskId && (
                  <Link to={audience === 'client' ? '/home' : '/'}>Related task</Link>
                )}
              </div>

              {active.outstandingRequest && (
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 10,
                    background: 'var(--amber-soft)',
                    color: 'var(--amber)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '0.85rem',
                  }}
                >
                  Outstanding request · owned by {active.nextOwner}: {active.outstandingRequest}
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.visibility === 'internal' ? 'internal' : ''}`}>
                  <div className="msg-meta">
                    <span>
                      <strong>{m.authorName}</strong>{' '}
                      <span className={`badge ${m.visibility}`}>
                        {m.visibility === 'internal' ? 'Internal only' : 'Visible to client'}
                      </span>
                    </span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <div>{m.body}</div>
                </div>
              ))}

              <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                {audience === 'firm' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${visibility === 'client' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setVisibility('client')}
                    >
                      Client-visible
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${visibility === 'internal' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setVisibility('internal')}
                    >
                      Internal note
                    </button>
                  </div>
                )}
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    audience === 'firm'
                      ? visibility === 'internal'
                        ? 'Internal note — clients will never see this'
                        : 'Message the client…'
                      : 'Reply to your CPA…'
                  }
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    border: '1px solid var(--line-strong)',
                    padding: '0.75rem',
                    resize: 'vertical',
                    background: '#fff',
                  }}
                />
                <div>
                  <button type="button" className="btn btn-primary" onClick={send}>
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">No threads match this filter.</div>
          )}
        </section>
      </div>
    </div>
  )
}
