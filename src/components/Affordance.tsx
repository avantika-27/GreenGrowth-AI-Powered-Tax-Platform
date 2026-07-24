import type { FieldState } from '../types'

const LABELS: Record<FieldState, string> = {
  ai: 'AI-generated',
  verified: 'Verified',
  editable: 'Editable',
  needs_approval: 'Needs approval',
  locked: 'Locked',
  client_answer: 'Client answer',
}

export function AffordanceBadge({ state }: { state: FieldState }) {
  return <span className={`affordance ${state}`}>{LABELS[state]}</span>
}

export function AffordanceLegend() {
  return (
    <div className="legend" aria-label="Field state legend">
      {(Object.keys(LABELS) as FieldState[]).map((s) => (
        <AffordanceBadge key={s} state={s} />
      ))}
    </div>
  )
}
