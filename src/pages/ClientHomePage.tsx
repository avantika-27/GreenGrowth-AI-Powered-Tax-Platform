import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RETURNS, TASKS, clientPhaseLabel } from '../data/mock'
import { StatusTimeline } from '../components/StatusTimeline'

export function ClientHomePage() {
  const { user } = useApp()
  const ret = RETURNS[0]
  const openTasks = TASKS.filter(
    (t) => t.owner === 'client' && t.status !== 'done' && t.returnId === ret.id,
  )

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Hi {user.name.split(' ')[0]} — here’s your next step</h1>
          <p>
            Status: <strong>{clientPhaseLabel(ret.phase)}</strong>. Focus on what’s waiting on you;
            firm-side work stays out of the way.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Do these next</h2>
          <ul className="list-reset">
            {openTasks.map((t, i) => (
              <li key={t.id} className="action-row">
                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className={`urgency ${t.urgency}`}>{i === 0 ? 'Start here' : t.urgency}</span>
                  </div>
                  <div style={{ fontWeight: 700, marginTop: '0.3rem' }}>{t.title}</div>
                  <div className="related">
                    {t.linkedThreadId && (
                      <Link to={`/messages?thread=${t.linkedThreadId}`}>Related message</Link>
                    )}
                    {t.linkedDocumentId && (
                      <Link to={`/documents?focus=${t.linkedDocumentId}`}>Related document</Link>
                    )}
                  </div>
                </div>
                <Link
                  className={`btn btn-sm ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
                  to={t.linkedThreadId ? `/messages?thread=${t.linkedThreadId}` : '/documents'}
                >
                  Continue
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel-pad">
          <h2 className="panel-title">Your 2025 return</h2>
          <StatusTimeline taxReturn={ret} audience="client" />
          <div style={{ marginTop: '1rem' }}>
            <Link className="btn btn-secondary" to="/status">
              See full progress
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
