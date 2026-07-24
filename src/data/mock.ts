import type {
  AiRecommendation,
  DocumentItem,
  RoleId,
  TaxReturn,
  TaskItem,
  Thread,
  User,
} from '../types'

export const ROLE_META: Record<
  RoleId,
  { label: string; short: string; audience: 'client' | 'firm' }
> = {
  taxpayer: { label: 'Individual taxpayer', short: 'Taxpayer', audience: 'client' },
  business_owner: { label: 'Business owner', short: 'Business', audience: 'client' },
  preparer: { label: 'Tax preparer', short: 'Preparer', audience: 'firm' },
  reviewer: { label: 'Reviewer', short: 'Reviewer', audience: 'firm' },
  firm_admin: { label: 'Firm administrator', short: 'Admin', audience: 'firm' },
  seasonal: { label: 'Seasonal staff', short: 'Seasonal', audience: 'firm' },
}

export const USERS: User[] = [
  {
    id: 'u-maya',
    name: 'Maya Chen',
    email: 'maya@chenfamily.example',
    roles: ['taxpayer'],
    activeRole: 'taxpayer',
    isFirstRun: true,
  },
  {
    id: 'u-jordan',
    name: 'Jordan Ellis',
    email: 'jordan@ellis.co',
    roles: ['business_owner', 'taxpayer'],
    activeRole: 'business_owner',
  },
  {
    id: 'u-sam',
    name: 'Sam Okonkwo',
    email: 'sam@greengrowth.tax',
    roles: ['preparer', 'taxpayer'],
    activeRole: 'preparer',
  },
  {
    id: 'u-priya',
    name: 'Priya Nair',
    email: 'priya@greengrowth.tax',
    roles: ['reviewer'],
    activeRole: 'reviewer',
  },
  {
    id: 'u-alex',
    name: 'Alex Rivera',
    email: 'alex@greengrowth.tax',
    roles: ['firm_admin', 'preparer'],
    activeRole: 'firm_admin',
  },
  {
    id: 'u-lee',
    name: 'Lee Park',
    email: 'lee@greengrowth.tax',
    roles: ['seasonal'],
    activeRole: 'seasonal',
  },
]

const mayaFields = [
  {
    id: 'f-wages',
    form: 'Form 1040',
    label: 'Wages, salaries, tips',
    value: '94,280',
    state: 'verified' as const,
    confidence: 0.98,
    source: {
      documentId: 'doc-w2',
      documentName: 'W-2 — Northwind Labs',
      page: 1,
      section: 'Box 1 — Wages, tips, other compensation',
      excerpt: '94280.00',
      transformation: 'Parsed Box 1; formatted with thousands separator',
    },
    aiReason: 'Exact match to W-2 Box 1 with high OCR confidence.',
    evidence: ['W-2 Box 1 = 94280.00', 'Employer EIN matches prior year'],
  },
  {
    id: 'f-federal-withheld',
    form: 'Form 1040',
    label: 'Federal income tax withheld',
    value: '14,120',
    state: 'ai' as const,
    confidence: 0.91,
    source: {
      documentId: 'doc-w2',
      documentName: 'W-2 — Northwind Labs',
      page: 1,
      section: 'Box 2 — Federal income tax withheld',
      excerpt: '14120.00',
    },
    aiReason: 'Extracted from W-2 Box 2. Awaiting preparer verification.',
    evidence: ['W-2 Box 2 = 14120.00'],
  },
  {
    id: 'f-interest',
    form: 'Schedule B',
    label: 'Taxable interest',
    value: '1,842',
    state: 'needs_approval' as const,
    confidence: 0.74,
    source: {
      documentId: 'doc-1099int',
      documentName: '1099-INT — Cascade Credit Union',
      page: 1,
      section: 'Box 1 — Interest income',
      excerpt: '1,842.17',
      transformation: 'Rounded to nearest dollar per IRS rules',
    },
    aiReason: 'Rounded 1,842.17 → 1,842. Low confidence because a second 1099-INT may be missing.',
    evidence: [
      '1099-INT Box 1 = 1,842.17',
      'Prior year had 2 payers; only 1 received this year',
    ],
  },
  {
    id: 'f-charitable',
    form: 'Schedule A',
    label: 'Charitable contributions',
    value: '2,400',
    state: 'client_answer' as const,
    confidence: 0.66,
    source: {
      documentId: 'doc-receipts',
      documentName: 'Donation receipts (packet)',
      page: 2,
      section: 'Summary of cash gifts',
      excerpt: 'City Food Bank $1,200 · Habitat $1,200',
      transformation: 'Summed client-provided receipts; no Form 8283 required under $5,000',
    },
    aiReason: 'Client entered total; AI cross-checked receipt packet sum.',
    evidence: ['Receipt sum = $2,400', 'No noncash gifts above threshold'],
  },
  {
    id: 'f-agi',
    form: 'Form 1040',
    label: 'Adjusted gross income',
    value: '96,122',
    state: 'locked' as const,
    lockedReason: 'Calculated field — edit source lines to change AGI',
    source: {
      documentId: 'doc-w2',
      documentName: 'Multiple sources',
      page: 1,
      section: 'Computed from wages + interest − adjustments',
      excerpt: '94,280 + 1,842 = 96,122',
      transformation: 'Sum of Line 1z + Schedule B interest',
    },
    aiReason: 'Derived from verified and pending inputs.',
    evidence: ['Wages 94,280', 'Interest 1,842'],
  },
  {
    id: 'f-se-income',
    form: 'Schedule C',
    label: 'Business gross receipts',
    value: '12,500',
    state: 'editable' as const,
    confidence: 0.55,
    source: {
      documentId: 'doc-bank',
      documentName: 'Q4 business deposits summary',
      page: 1,
      section: 'Transfer & deposit total',
      excerpt: 'Deposits totaling 12,500 tagged “consulting”',
      transformation: 'AI suggested amount from categorized deposits — not from a 1099-NEC',
    },
    aiReason: 'No 1099-NEC on file. Suggested from bank tags; needs client confirmation.',
    evidence: ['Bank tags sum = 12,500', 'Missing 1099-NEC for payer Acme Studio'],
  },
]

export const RETURNS: TaxReturn[] = [
  {
    id: 'ret-maya-2025',
    clientName: 'Maya Chen',
    clientType: 'individual',
    year: 2025,
    phase: 'client_questions',
    preparer: 'Sam Okonkwo',
    reviewer: 'Priya Nair',
    lastActivity: '2026-07-23T16:40:00Z',
    blockers: ['Missing 1099-INT from Harbor Bank', 'Confirm Schedule C receipts'],
    nextAction: 'Answer 2 open client questions',
    nextOwner: 'client',
    progress: 62,
    timeline: [
      { label: 'Intake started', at: '2026-02-12', done: true },
      { label: 'Documents uploaded', at: '2026-03-01', done: true },
      { label: 'Preparation', at: '2026-03-18', done: true, detail: 'Sam preparing' },
      { label: 'Client questions', at: '2026-07-20', done: false, detail: 'Waiting on Maya' },
      { label: 'Review', at: '', done: false },
      { label: 'Ready to file', at: '', done: false },
      { label: 'Filed', at: '', done: false },
    ],
    fields: mayaFields,
  },
  {
    id: 'ret-jordan-2025',
    clientName: 'Jordan Ellis / Ellis Co.',
    clientType: 'business',
    year: 2025,
    phase: 'under_review',
    preparer: 'Sam Okonkwo',
    reviewer: 'Priya Nair',
    lastActivity: '2026-07-24T09:10:00Z',
    blockers: [],
    nextAction: 'Complete reviewer checklist',
    nextOwner: 'reviewer',
    progress: 84,
    timeline: [
      { label: 'Intake started', at: '2026-01-20', done: true },
      { label: 'Documents uploaded', at: '2026-02-04', done: true },
      { label: 'Preparation', at: '2026-04-02', done: true },
      { label: 'Client questions', at: '2026-05-11', done: true },
      { label: 'Review', at: '2026-07-22', done: false, detail: 'Priya reviewing' },
      { label: 'Ready to file', at: '', done: false },
      { label: 'Filed', at: '', done: false },
    ],
    fields: [],
  },
  {
    id: 'ret-kim-2025',
    clientName: 'Kim Alvarez',
    clientType: 'individual',
    year: 2025,
    phase: 'docs_needed',
    preparer: 'Lee Park',
    lastActivity: '2026-07-21T11:00:00Z',
    blockers: ['W-2 not received', 'ID verification pending'],
    nextAction: 'Request outstanding documents',
    nextOwner: 'preparer',
    progress: 18,
    timeline: [
      { label: 'Intake started', at: '2026-07-10', done: true },
      { label: 'Documents uploaded', at: '', done: false },
      { label: 'Preparation', at: '', done: false },
      { label: 'Client questions', at: '', done: false },
      { label: 'Review', at: '', done: false },
      { label: 'Ready to file', at: '', done: false },
      { label: 'Filed', at: '', done: false },
    ],
    fields: [],
  },
  {
    id: 'ret-patel-2025',
    clientName: 'Ravi Patel',
    clientType: 'individual',
    year: 2025,
    phase: 'ready_to_file',
    preparer: 'Sam Okonkwo',
    reviewer: 'Priya Nair',
    lastActivity: '2026-07-19T14:00:00Z',
    blockers: [],
    nextAction: 'Obtain e-file authorization',
    nextOwner: 'client',
    progress: 95,
    timeline: [
      { label: 'Intake started', at: '2026-01-08', done: true },
      { label: 'Documents uploaded', at: '2026-01-22', done: true },
      { label: 'Preparation', at: '2026-02-15', done: true },
      { label: 'Client questions', at: '2026-03-01', done: true },
      { label: 'Review', at: '2026-07-12', done: true },
      { label: 'Ready to file', at: '2026-07-19', done: false, detail: 'Awaiting 8879' },
      { label: 'Filed', at: '', done: false },
    ],
    fields: [],
  },
  {
    id: 'ret-nova-2025',
    clientName: 'Nova Retail LLC',
    clientType: 'business',
    year: 2025,
    phase: 'in_preparation',
    preparer: 'Sam Okonkwo',
    lastActivity: '2026-07-24T08:00:00Z',
    blockers: ['Depreciation worksheet incomplete'],
    nextAction: 'Finish Schedule depreciation',
    nextOwner: 'preparer',
    progress: 41,
    timeline: [
      { label: 'Intake started', at: '2026-03-01', done: true },
      { label: 'Documents uploaded', at: '2026-03-20', done: true },
      { label: 'Preparation', at: '2026-07-01', done: false, detail: 'In progress' },
      { label: 'Client questions', at: '', done: false },
      { label: 'Review', at: '', done: false },
      { label: 'Ready to file', at: '', done: false },
      { label: 'Filed', at: '', done: false },
    ],
    fields: [],
  },
]

function seedExtraReturns(): TaxReturn[] {
  const phases = [
    'intake',
    'docs_needed',
    'in_preparation',
    'client_questions',
    'under_review',
    'ready_to_file',
    'filed',
  ] as const
  const names = [
    'Avery Brooks',
    'Casey Morgan',
    'Drew Santos',
    'Emery Quinn',
    'Finley Hart',
    'Harper Diaz',
    'Indigo Shaw',
    'Jules Vega',
    'Kai Benton',
    'Logan Pierce',
    'Morgan Blake',
    'Noor Haddad',
    'Owen Frost',
    'Parker Reed',
    'Quinn Adler',
    'Reese Nolan',
    'Sasha Kim',
    'Taylor Brooks',
    'Uma Solis',
    'Val Ortega',
  ]
  return names.flatMap((name, i) => {
    const phase = phases[i % phases.length]
    const progressMap: Record<string, number> = {
      intake: 8,
      docs_needed: 22,
      in_preparation: 45,
      client_questions: 58,
      under_review: 78,
      ready_to_file: 92,
      filed: 100,
    }
    return {
      id: `ret-bulk-${i}`,
      clientName: name,
      clientType: i % 3 === 0 ? ('business' as const) : ('individual' as const),
      year: 2025,
      phase,
      preparer: i % 2 === 0 ? 'Sam Okonkwo' : 'Lee Park',
      reviewer: i % 4 === 0 ? 'Priya Nair' : undefined,
      lastActivity: `2026-07-${String(10 + (i % 14)).padStart(2, '0')}T10:00:00Z`,
      blockers: i % 5 === 0 ? ['Missing K-1'] : [],
      nextAction:
        phase === 'filed'
          ? 'None'
          : phase === 'under_review'
            ? 'Review open items'
            : 'Continue preparation',
      nextOwner:
        phase === 'client_questions'
          ? ('client' as const)
          : phase === 'under_review'
            ? ('reviewer' as const)
            : phase === 'filed'
              ? ('none' as const)
              : ('preparer' as const),
      progress: progressMap[phase],
      timeline: [],
      fields: [],
    }
  })
}

export const ALL_RETURNS: TaxReturn[] = [...RETURNS, ...seedExtraReturns()]

const DOC_TYPES = [
  'W-2',
  '1099-INT',
  '1099-NEC',
  '1099-DIV',
  'K-1',
  'Bank statement',
  'Donation receipt',
  'Brokerage 1099-B',
  'Property tax bill',
  'Health insurance 1095-A',
]

function seedDocuments(): DocumentItem[] {
  const base: DocumentItem[] = [
    {
      id: 'doc-w2',
      name: 'W-2 — Northwind Labs',
      type: 'W-2',
      year: 2025,
      client: 'Maya Chen',
      returnId: 'ret-maya-2025',
      status: 'linked',
      pages: 1,
      uploadedAt: '2026-03-01',
      tags: ['employment', 'primary'],
    },
    {
      id: 'doc-1099int',
      name: '1099-INT — Cascade Credit Union',
      type: '1099-INT',
      year: 2025,
      client: 'Maya Chen',
      returnId: 'ret-maya-2025',
      status: 'linked',
      pages: 1,
      uploadedAt: '2026-03-02',
      tags: ['interest'],
    },
    {
      id: 'doc-receipts',
      name: 'Donation receipts (packet)',
      type: 'Donation receipt',
      year: 2025,
      client: 'Maya Chen',
      returnId: 'ret-maya-2025',
      status: 'needs_review',
      pages: 4,
      uploadedAt: '2026-03-05',
      tags: ['charitable'],
    },
    {
      id: 'doc-bank',
      name: 'Q4 business deposits summary',
      type: 'Bank statement',
      year: 2025,
      client: 'Maya Chen',
      returnId: 'ret-maya-2025',
      status: 'needs_review',
      pages: 3,
      uploadedAt: '2026-03-08',
      tags: ['self-employment'],
    },
    {
      id: 'doc-missing-int',
      name: '1099-INT — Harbor Bank',
      type: '1099-INT',
      year: 2025,
      client: 'Maya Chen',
      returnId: 'ret-maya-2025',
      status: 'missing',
      pages: 0,
      uploadedAt: '',
      tags: ['interest', 'requested'],
    },
  ]

  const bulk: DocumentItem[] = Array.from({ length: 220 }, (_, i) => {
    const type = DOC_TYPES[i % DOC_TYPES.length]
    const ret = ALL_RETURNS[i % ALL_RETURNS.length]
    const statuses = ['received', 'processing', 'needs_review', 'linked', 'missing'] as const
    return {
      id: `doc-bulk-${i}`,
      name: `${type} — ${ret.clientName.split(' ')[0]} #${i + 1}`,
      type,
      year: 2024 + (i % 2),
      client: ret.clientName,
      returnId: ret.id,
      status: statuses[i % statuses.length],
      pages: (i % 8) + 1,
      uploadedAt: i % 5 === 0 ? '' : `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
      tags: i % 3 === 0 ? ['priority'] : i % 4 === 0 ? ['ai-flagged'] : ['standard'],
    }
  })

  return [...base, ...bulk]
}

export const DOCUMENTS = seedDocuments()

export const THREADS: Thread[] = [
  {
    id: 'th-1',
    subject: 'Harbor Bank 1099-INT still missing',
    linkedDocumentId: 'doc-missing-int',
    linkedIssue: 'Interest income incomplete',
    linkedTaskId: 'task-1',
    returnId: 'ret-maya-2025',
    nextOwner: 'client',
    outstandingRequest: 'Upload Harbor Bank 1099-INT or confirm none issued',
    messages: [
      {
        id: 'm1',
        threadId: 'th-1',
        authorId: 'u-sam',
        authorName: 'Sam Okonkwo',
        body: 'Maya — prior year had interest from Harbor Bank. We don’t see a 2025 1099-INT yet. Can you check your portal or upload it here?',
        createdAt: '2026-07-20T15:00:00Z',
        visibility: 'client',
      },
      {
        id: 'm2',
        threadId: 'th-1',
        authorId: 'u-sam',
        authorName: 'Sam Okonkwo',
        body: 'Internal: if she confirms none, zero out the expected Harbor interest and document in workpapers.',
        createdAt: '2026-07-20T15:02:00Z',
        visibility: 'internal',
      },
      {
        id: 'm3',
        threadId: 'th-1',
        authorId: 'u-maya',
        authorName: 'Maya Chen',
        body: 'I’ll check this weekend — I think I closed that account mid-year.',
        createdAt: '2026-07-21T19:30:00Z',
        visibility: 'client',
      },
    ],
  },
  {
    id: 'th-2',
    subject: 'Schedule C consulting deposits',
    linkedDocumentId: 'doc-bank',
    linkedIssue: 'Self-employment income',
    linkedTaskId: 'task-2',
    returnId: 'ret-maya-2025',
    nextOwner: 'client',
    outstandingRequest: 'Confirm $12,500 consulting total or upload 1099-NEC',
    messages: [
      {
        id: 'm4',
        threadId: 'th-2',
        authorId: 'u-sam',
        authorName: 'Sam Okonkwo',
        body: 'We pulled ~$12,500 in deposits tagged consulting. Is that complete, or should we expect a 1099-NEC from Acme Studio?',
        createdAt: '2026-07-22T11:00:00Z',
        visibility: 'client',
      },
    ],
  },
  {
    id: 'th-3',
    subject: 'Reviewer note: charitable substantiation',
    linkedDocumentId: 'doc-receipts',
    linkedIssue: 'Schedule A contributions',
    returnId: 'ret-maya-2025',
    nextOwner: 'cpa',
    messages: [
      {
        id: 'm5',
        threadId: 'th-3',
        authorId: 'u-priya',
        authorName: 'Priya Nair',
        body: 'Receipts look fine under $5k. Flag for Sam: keep workpaper note that no 8283 needed.',
        createdAt: '2026-07-23T09:00:00Z',
        visibility: 'internal',
      },
    ],
  },
]

export const TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Upload Harbor Bank 1099-INT',
    owner: 'client',
    status: 'waiting',
    urgency: 'high',
    returnId: 'ret-maya-2025',
    linkedDocumentId: 'doc-missing-int',
    linkedThreadId: 'th-1',
    dueDate: '2026-07-28',
  },
  {
    id: 'task-2',
    title: 'Confirm consulting income total',
    owner: 'client',
    status: 'todo',
    urgency: 'critical',
    returnId: 'ret-maya-2025',
    linkedDocumentId: 'doc-bank',
    linkedThreadId: 'th-2',
    dueDate: '2026-07-26',
  },
  {
    id: 'task-3',
    title: 'Verify W-2 withholding',
    owner: 'preparer',
    status: 'todo',
    urgency: 'medium',
    returnId: 'ret-maya-2025',
    linkedDocumentId: 'doc-w2',
    dueDate: '2026-07-25',
  },
  {
    id: 'task-4',
    title: 'Reviewer checklist — Ellis Co.',
    owner: 'reviewer',
    status: 'todo',
    urgency: 'high',
    returnId: 'ret-jordan-2025',
    dueDate: '2026-07-25',
  },
  {
    id: 'task-5',
    title: 'Request Kim Alvarez W-2',
    owner: 'preparer',
    status: 'todo',
    urgency: 'critical',
    returnId: 'ret-kim-2025',
    dueDate: '2026-07-24',
  },
  {
    id: 'task-6',
    title: 'Send e-file authorization to Ravi Patel',
    owner: 'preparer',
    status: 'todo',
    urgency: 'high',
    returnId: 'ret-patel-2025',
    dueDate: '2026-07-27',
  },
  {
    id: 'task-7',
    title: 'Complete Nova Retail depreciation',
    owner: 'preparer',
    status: 'todo',
    urgency: 'medium',
    returnId: 'ret-nova-2025',
    dueDate: '2026-07-30',
  },
  {
    id: 'task-onboard-1',
    title: 'Verify your identity',
    owner: 'client',
    status: 'todo',
    urgency: 'critical',
    returnId: 'ret-maya-2025',
    dueDate: '2026-07-25',
  },
  {
    id: 'task-onboard-2',
    title: 'Upload your W-2',
    owner: 'client',
    status: 'done',
    urgency: 'high',
    returnId: 'ret-maya-2025',
    linkedDocumentId: 'doc-w2',
    dueDate: '2026-03-01',
  },
  {
    id: 'task-onboard-3',
    title: 'Answer income questionnaire',
    owner: 'client',
    status: 'todo',
    urgency: 'high',
    returnId: 'ret-maya-2025',
    dueDate: '2026-07-26',
  },
]

export const AI_RECS: AiRecommendation[] = [
  {
    id: 'ai-1',
    returnId: 'ret-maya-2025',
    title: 'Possible missing interest form',
    summary: 'Prior-year Harbor Bank interest has no matching 2025 1099-INT.',
    confidence: 0.82,
    why: 'YoY payer comparison found Harbor Bank in 2024 with $640 interest and no 2025 document.',
    evidence: [
      '2024 1099-INT Harbor Bank on file',
      'No 2025 Harbor document uploaded',
      'Cascade Credit Union 1099-INT present',
    ],
    uncertainty: 'Account may have been closed; client may have received a final statement instead of 1099.',
    suggestedAction: 'Ask client to upload or confirm zero Harbor interest',
    fieldId: 'f-interest',
  },
  {
    id: 'ai-2',
    returnId: 'ret-maya-2025',
    title: 'Schedule C income needs source document',
    summary: 'Bank-tagged consulting deposits used as a stand-in for gross receipts.',
    confidence: 0.55,
    why: 'No 1099-NEC matched; AI inferred from deposit categories.',
    evidence: [
      'Deposits tagged consulting = $12,500',
      'Payer mention: Acme Studio in memo fields',
    ],
    uncertainty: 'Transfers between personal accounts may be mis-tagged.',
    suggestedAction: 'Request 1099-NEC or client confirmation before filing',
    fieldId: 'f-se-income',
  },
  {
    id: 'ai-3',
    returnId: 'ret-maya-2025',
    title: 'Withholding looks consistent',
    summary: 'Federal withholding rate aligns with prior year and W-2 Box 2.',
    confidence: 0.94,
    why: 'Box 2 / Box 1 ratio within 1.2pp of 2024 return.',
    evidence: ['2025 rate 15.0%', '2024 rate 14.1%'],
    uncertainty: 'Does not detect mid-year filing status changes.',
    suggestedAction: 'Mark verified after spot-check',
    fieldId: 'f-federal-withheld',
  },
]

/** Simple ranking used by the actionable dashboard */
export function prioritizeTasks(tasks: TaskItem[]): TaskItem[] {
  const urgencyScore = { critical: 4, high: 3, medium: 2, low: 1 }
  return [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const u = urgencyScore[b.urgency] - urgencyScore[a.urgency]
      if (u !== 0) return u
      return a.dueDate.localeCompare(b.dueDate)
    })
}

export function phaseLabel(phase: TaxReturn['phase']): string {
  const map: Record<TaxReturn['phase'], string> = {
    intake: 'Intake',
    docs_needed: 'Documents needed',
    in_preparation: 'In preparation',
    client_questions: 'Waiting on client',
    under_review: 'Under review',
    ready_to_file: 'Ready to file',
    filed: 'Filed',
  }
  return map[phase]
}

/** Client-facing status — hides internal nuance */
export function clientPhaseLabel(phase: TaxReturn['phase']): string {
  const map: Record<TaxReturn['phase'], string> = {
    intake: 'Getting started',
    docs_needed: 'We need documents from you',
    in_preparation: 'Your CPA is preparing',
    client_questions: 'We need your answers',
    under_review: 'Quality review in progress',
    ready_to_file: 'Ready for your approval',
    filed: 'Filed with the IRS',
  }
  return map[phase]
}
