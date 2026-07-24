import { clientPhaseLabel, phaseLabel } from '../data/mock'
import type { TaxReturn } from '../types'

export function StatusTimeline({
  taxReturn,
  audience,
}: {
  taxReturn: TaxReturn
  audience: 'client' | 'firm'
}) {
  const steps =
    taxReturn.timeline.length > 0
      ? taxReturn.timeline
      : [
          { label: 'Intake', at: '', done: taxReturn.progress > 5 },
          { label: 'Documents', at: '', done: taxReturn.progress > 20 },
          { label: 'Preparation', at: '', done: taxReturn.progress > 40 },
          { label: 'Questions', at: '', done: taxReturn.progress > 55 },
          { label: 'Review', at: '', done: taxReturn.progress > 75 },
          { label: 'Ready', at: '', done: taxReturn.progress > 90 },
          { label: 'Filed', at: '', done: taxReturn.progress >= 100 },
        ]

  const currentIdx = steps.findIndex((s) => !s.done)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current status
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>
            {audience === 'client' ? clientPhaseLabel(taxReturn.phase) : phaseLabel(taxReturn.phase)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>Progress</div>
          <div style={{ fontWeight: 700 }}>{taxReturn.progress}%</div>
        </div>
      </div>

      <div className="status-rail" role="list">
        {steps.map((step, i) => {
          const isCurrent = i === currentIdx || (currentIdx === -1 && i === steps.length - 1)
          return (
            <div
              key={`${step.label}-${i}`}
              className={`status-step ${step.done ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              role="listitem"
            >
              <div className="node" />
              <div className="label">{step.label}</div>
              {step.detail && audience === 'firm' && <div className="detail">{step.detail}</div>}
              {step.at && <div className="detail">{step.at}</div>}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
        <strong>Next:</strong> {taxReturn.nextAction}
        {taxReturn.nextOwner !== 'none' && (
          <span style={{ color: 'var(--ink-faint)' }}> · owned by {taxReturn.nextOwner}</span>
        )}
      </div>

      {taxReturn.blockers.length > 0 && (
        <div style={{ marginTop: '0.65rem', fontSize: '0.85rem', color: 'var(--rose)' }}>
          Blocking: {taxReturn.blockers.join(' · ')}
        </div>
      )}
    </div>
  )
}
