import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TASKS } from '../data/mock'

export function OnboardingGate() {
  const { user, completeFirstRun } = useApp()
  if (!user.isFirstRun || user.activeRole !== 'taxpayer') return null

  const next = TASKS.filter(
    (t) => t.owner === 'client' && t.status !== 'done' && t.returnId === 'ret-maya-2025',
  ).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <div className="onboarding-card">
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--moss)', marginBottom: '0.5rem' }}>
          GreenGrowth
        </div>
        <h1 id="ob-title">Welcome, Maya</h1>
        <p>
          Your 2025 return is open. Do this one thing next — everything else can wait until
          you need it.
        </p>
        <div className="onboarding-steps">
          <div className="onboarding-step primary">
            <div style={{ fontWeight: 800, color: 'var(--forest)' }}>1</div>
            <div>
              <div style={{ fontWeight: 700 }}>{next?.title ?? 'Verify your identity'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>
                Takes about 2 minutes. This unlocks document upload and messages with your CPA.
              </div>
            </div>
          </div>
          <div className="onboarding-step">
            <div style={{ fontWeight: 800, color: 'var(--ink-faint)' }}>2</div>
            <div style={{ color: 'var(--ink-soft)' }}>
              Answer open questions from your preparer (shown after step 1)
            </div>
          </div>
          <div className="onboarding-step">
            <div style={{ fontWeight: 800, color: 'var(--ink-faint)' }}>3</div>
            <div style={{ color: 'var(--ink-soft)' }}>
              Review & approve when your return is ready to file
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link to="/home" className="btn btn-primary" onClick={completeFirstRun}>
            Start: verify identity
          </Link>
          <button type="button" className="btn btn-secondary" onClick={completeFirstRun}>
            Skip intro
          </button>
        </div>
      </div>
    </div>
  )
}
