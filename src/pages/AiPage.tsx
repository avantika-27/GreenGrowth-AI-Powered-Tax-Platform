import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AI_RECS } from '../data/mock'

/** Stub that “fetches” fake AI JSON — simulates backend */
function getAiBundle(id: string) {
  const rec = AI_RECS.find((r) => r.id === id) ?? AI_RECS[0]
  return {
    model: 'greengrowth-tax-assist-sim-v0',
    generatedAt: '2026-07-24T10:00:00Z',
    recommendation: rec,
  }
}

export function AiPage() {
  const [params] = useSearchParams()
  const focus = params.get('focus') || 'ai-1'
  const [activeId, setActiveId] = useState(focus)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [showRaw, setShowRaw] = useState(false)

  const bundle = getAiBundle(activeId)
  const rec = bundle.recommendation

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Trustworthy AI — clear, not noisy</h1>
          <p>
            See what the model did, why, what it’s unsure about, and the one action to take.
            Technical dump stays optional.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Recommendations</h2>
          {AI_RECS.map((r) => (
            <button
              key={r.id}
              type="button"
              className="ai-card"
              onClick={() => setActiveId(r.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                outline: r.id === activeId ? '2px solid var(--ai)' : undefined,
                opacity: dismissed.has(r.id) ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <strong>{r.title}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--ai)' }}>
                  {Math.round(r.confidence * 100)}%
                </span>
              </div>
              <div className="confidence">
                <span style={{ width: `${r.confidence * 100}%` }} />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>{r.summary}</div>
              {accepted.has(r.id) && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 700 }}>
                  Accepted into workflow
                </div>
              )}
            </button>
          ))}
        </section>

        <aside className="panel panel-pad">
          <h2 className="panel-title">{rec.title}</h2>
          <p style={{ marginTop: 0, color: 'var(--ink-soft)' }}>{rec.summary}</p>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ai)' }}>Confidence</div>
          <div className="confidence">
            <span style={{ width: `${rec.confidence * 100}%` }} />
          </div>
          <div style={{ fontSize: '0.82rem', marginBottom: '0.85rem' }}>
            {Math.round(rec.confidence * 100)}% — treat as a lead, not a final answer
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>What it did / why</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{rec.why}</div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Evidence</div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem' }}>
              {rec.evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginBottom: '0.85rem',
              padding: '0.75rem',
              borderRadius: 10,
              background: 'var(--amber-soft)',
              fontSize: '0.88rem',
            }}
          >
            <strong>Uncertainty:</strong> {rec.uncertainty}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Suggested action</div>
            <div style={{ fontSize: '0.92rem' }}>{rec.suggestedAction}</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setAccepted((s) => new Set(s).add(rec.id))}
            >
              Accept suggestion
            </button>
            <Link
              className="btn btn-secondary btn-sm"
              to={`/returns/ret-maya-2025${rec.fieldId ? `?field=${rec.fieldId}` : ''}`}
            >
              Inspect / correct in return
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setDismissed((s) => new Set(s).add(rec.id))}
            >
              Dismiss
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowRaw((v) => !v)}>
              {showRaw ? 'Hide' : 'Show'} raw (optional)
            </button>
          </div>

          {showRaw && (
            <pre
              style={{
                marginTop: '1rem',
                padding: '0.85rem',
                background: '#14201a',
                color: '#d7ebe0',
                borderRadius: 12,
                fontSize: '0.72rem',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(bundle, null, 2)}
            </pre>
          )}
        </aside>
      </div>
    </div>
  )
}
