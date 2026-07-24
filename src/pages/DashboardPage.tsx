import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  ALL_RETURNS,
  ROLE_META,
  TASKS,
  phaseLabel,
  prioritizeTasks,
} from '../data/mock'

export function DashboardPage() {
  const { user } = useApp()
  const role = user.activeRole
  const isManager = role === 'firm_admin' || role === 'reviewer'

  const myTasks = prioritizeTasks(
    TASKS.filter((t) => {
      if (role === 'reviewer') return t.owner === 'reviewer'
      if (role === 'seasonal' || role === 'preparer') return t.owner === 'preparer'
      if (role === 'firm_admin') return t.owner !== 'client'
      return t.owner === 'preparer'
    }),
  )

  const blocked = ALL_RETURNS.filter((r) => r.blockers.length > 0 && r.phase !== 'filed')
  const waitingClient = ALL_RETURNS.filter((r) => r.phase === 'client_questions')
  const inReview = ALL_RETURNS.filter((r) => r.phase === 'under_review')

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>What to work on now</h1>
          <p>
            Prioritized for {ROLE_META[role].label.toLowerCase()} — urgency first, then due date.
            Not a reporting wall.
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="panel panel-pad stat">
          <div className="n">{myTasks.length}</div>
          <div className="l">Open actions for you</div>
        </div>
        <div className="panel panel-pad stat">
          <div className="n">{blocked.length}</div>
          <div className="l">Returns with blockers</div>
        </div>
        <div className="panel panel-pad stat">
          <div className="n">{isManager ? inReview.length : waitingClient.length}</div>
          <div className="l">{isManager ? 'In review queue' : 'Waiting on clients'}</div>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Your next actions</h2>
          <ul className="list-reset">
            {myTasks.slice(0, 8).map((t) => (
              <li key={t.id} className="action-row">
                <div>
                  <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className={`urgency ${t.urgency}`}>{t.urgency}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>due {t.dueDate}</span>
                  </div>
                  <div style={{ fontWeight: 650 }}>{t.title}</div>
                  <div className="related">
                    <Link to={`/returns/${t.returnId}`}>Open return</Link>
                    {t.linkedDocumentId && (
                      <Link to={`/documents?focus=${t.linkedDocumentId}`}>Document</Link>
                    )}
                    {t.linkedThreadId && (
                      <Link to={`/messages?thread=${t.linkedThreadId}`}>Thread</Link>
                    )}
                  </div>
                </div>
                <Link className="btn btn-primary btn-sm" to={`/returns/${t.returnId}`}>
                  Go
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel-pad">
          <h2 className="panel-title">{isManager ? 'Needs attention across the firm' : 'Blocked returns'}</h2>
          <ul className="list-reset">
            {(isManager ? [...blocked, ...inReview] : blocked)
              .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
              .slice(0, 8)
              .map((r) => (
                <li key={r.id} className="action-row">
                  <div>
                    <div style={{ fontWeight: 650 }}>{r.clientName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                      {phaseLabel(r.phase)} · {r.nextAction}
                    </div>
                    {r.blockers[0] && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--rose)', marginTop: '0.25rem' }}>
                        {r.blockers[0]}
                      </div>
                    )}
                  </div>
                  <Link className="btn btn-secondary btn-sm" to={`/returns/${r.id}`}>
                    Open
                  </Link>
                </li>
              ))}
          </ul>
          <div style={{ marginTop: '0.75rem' }}>
            <Link className="chip-link" to="/documents">
              Browse {ALL_RETURNS.length}+ returns via document library →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
