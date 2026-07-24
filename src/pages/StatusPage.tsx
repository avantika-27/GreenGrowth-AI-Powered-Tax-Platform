import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RETURNS, ROLE_META } from '../data/mock'
import { StatusTimeline } from '../components/StatusTimeline'

export function StatusPage() {
  const { user } = useApp()
  const audience = ROLE_META[user.activeRole].audience
  const samples = audience === 'client' ? [RETURNS[0]] : RETURNS

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Status everyone reads the same way</h1>
          <p>
            Shared phases, clear ownership, and blockers — with less internal jargon for clients.
            Same underlying model, different labels by audience.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {samples.map((r) => (
          <section key={r.id} className="panel panel-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="panel-title" style={{ marginBottom: 0 }}>
                {r.clientName} · {r.year}
              </h2>
              <Link className="chip-link" to={`/returns/${r.id}`}>
                Open return
              </Link>
            </div>
            <div style={{ marginTop: '0.85rem' }}>
              <StatusTimeline taxReturn={r} audience={audience} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
