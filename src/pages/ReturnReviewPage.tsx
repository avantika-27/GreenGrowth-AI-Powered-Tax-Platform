import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AffordanceBadge, AffordanceLegend } from '../components/Affordance'
import { StatusTimeline } from '../components/StatusTimeline'
import { useApp } from '../context/AppContext'
import { AI_RECS, ALL_RETURNS, ROLE_META } from '../data/mock'
import type { ReturnField } from '../types'

export function ReturnReviewPage() {
  const { returnId = 'ret-maya-2025' } = useParams()
  const [params] = useSearchParams()
  const { user, correctedFields, correctField, verifiedFields, verifyField } = useApp()
  const audience = ROLE_META[user.activeRole].audience

  const taxReturn = ALL_RETURNS.find((r) => r.id === returnId) ?? ALL_RETURNS[0]
  const fields = taxReturn.fields.length
    ? taxReturn.fields
    : ALL_RETURNS.find((r) => r.id === 'ret-maya-2025')!.fields

  const initialField =
    params.get('field') || fields.find((f) => f.state === 'needs_approval')?.id || fields[0]?.id

  const [selectedId, setSelectedId] = useState(initialField)
  const [editValue, setEditValue] = useState('')

  const selected = useMemo(
    () => fields.find((f) => f.id === selectedId) ?? fields[0],
    [fields, selectedId],
  )

  const displayValue = (f: ReturnField) => correctedFields[f.id] ?? f.value
  const displayState = (f: ReturnField) =>
    verifiedFields.has(f.id) && f.state !== 'locked' ? 'verified' : f.state

  const relatedAi = AI_RECS.filter((a) => a.fieldId === selected?.id)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            {taxReturn.clientName} · {taxReturn.year}
          </h1>
          <p>
            Click any figure to see where it came from — document, page, transformation, and AI
            confidence. Affordance colors stay consistent across the product.
          </p>
          <AffordanceLegend />
        </div>
      </div>

      <div className="panel panel-pad" style={{ marginBottom: '1rem' }}>
        <StatusTimeline taxReturn={taxReturn} audience={audience} />
      </div>

      <div className="grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Return fields</h2>
          {fields.map((f) => {
            const state = displayState(f)
            const active = f.id === selected.id
            return (
              <button
                key={f.id}
                type="button"
                className="field-row"
                onClick={() => {
                  setSelectedId(f.id)
                  setEditValue(displayValue(f))
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: active ? 'rgba(47, 122, 88, 0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--line)',
                  borderRadius: active ? 10 : 0,
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div className="field-label">{f.label}</div>
                  <div className="field-meta">
                    {f.form}
                    {typeof f.confidence === 'number' && ` · ${Math.round(f.confidence * 100)}% confidence`}
                  </div>
                </div>
                <div>
                  <AffordanceBadge state={state} />
                </div>
                <div className={`value-chip ${state}`}>${displayValue(f)}</div>
              </button>
            )
          })}
        </section>

        <aside className="source-pane panel panel-pad">
          <h2 className="panel-title">Source trace</h2>
          {!selected?.source ? (
            <div className="empty">Select a field to inspect its source.</div>
          ) : (
            <>
              <div className="trace-steps">
                <div className="trace-step">
                  <div className="n">1</div>
                  <div>
                    <strong>Field</strong>
                    <div style={{ color: 'var(--ink-soft)' }}>
                      {selected.form} · {selected.label} = ${displayValue(selected)}
                    </div>
                  </div>
                </div>
                <div className="trace-step">
                  <div className="n">2</div>
                  <div>
                    <strong>Source document</strong>
                    <div style={{ color: 'var(--ink-soft)' }}>
                      <Link to={`/documents?focus=${selected.source.documentId}`}>
                        {selected.source.documentName}
                      </Link>{' '}
                      · page {selected.source.page} · {selected.source.section}
                    </div>
                  </div>
                </div>
                <div className="trace-step">
                  <div className="n">3</div>
                  <div>
                    <strong>Extracted value</strong>
                    <div style={{ color: 'var(--ink-soft)' }}>{selected.source.excerpt}</div>
                  </div>
                </div>
                {selected.source.transformation && (
                  <div className="trace-step">
                    <div className="n">4</div>
                    <div>
                      <strong>Transformation</strong>
                      <div style={{ color: 'var(--ink-soft)' }}>{selected.source.transformation}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="doc-mock" style={{ marginTop: '1rem' }}>
                <div className="doc-mock-header">
                  Preview · {selected.source.documentName} · p.{selected.source.page}
                </div>
                <div className="doc-mock-body">
                  <div style={{ marginBottom: '0.75rem', opacity: 0.65 }}>
                    {selected.source.documentName}
                    <br />
                    Tax Year 2025
                  </div>
                  <div>
                    {selected.source.section}
                    <br />
                    <span className="doc-highlight">{selected.source.excerpt}</span>
                  </div>
                  <div style={{ marginTop: '1.5rem', opacity: 0.5 }}>
                    …remaining document content simulated…
                  </div>
                </div>
              </div>

              {selected.aiReason && (
                <div className="ai-card" style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ai)' }}>
                    Why the AI filled this
                  </div>
                  <p style={{ margin: '0.35rem 0', fontSize: '0.9rem' }}>{selected.aiReason}</p>
                  {selected.evidence && (
                    <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem' }}>
                      {selected.evidence.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                  {selected.lockedReason && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--ink-faint)' }}>
                      {selected.lockedReason}
                    </p>
                  )}
                </div>
              )}

              {audience === 'firm' && selected.state !== 'locked' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem' }}>
                  {(selected.state === 'editable' || selected.state === 'needs_approval' || selected.state === 'ai') && (
                    <>
                      <input
                        value={editValue || displayValue(selected)}
                        onChange={(e) => setEditValue(e.target.value)}
                        aria-label="Correct field value"
                        style={{
                          flex: 1,
                          minWidth: 120,
                          border: '1px solid var(--line-strong)',
                          borderRadius: 10,
                          padding: '0.45rem 0.65rem',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => correctField(selected.id, editValue || displayValue(selected))}
                      >
                        Correct AI
                      </button>
                    </>
                  )}
                  {!verifiedFields.has(selected.id) && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => verifyField(selected.id)}
                    >
                      Mark verified
                    </button>
                  )}
                  <Link className="btn btn-ghost btn-sm" to={`/ai?focus=${relatedAi[0]?.id ?? 'ai-1'}`}>
                    Open AI insight
                  </Link>
                </div>
              )}

              <div className="related" style={{ marginTop: '0.85rem' }}>
                <Link to={`/messages?doc=${selected.source.documentId}`}>Messages about this doc</Link>
                <Link to={`/documents?focus=${selected.source.documentId}`}>Document library</Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
