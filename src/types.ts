export type RoleId =
  | 'taxpayer'
  | 'business_owner'
  | 'preparer'
  | 'reviewer'
  | 'firm_admin'
  | 'seasonal'

export type FieldState =
  | 'ai'
  | 'verified'
  | 'editable'
  | 'needs_approval'
  | 'locked'
  | 'client_answer'

export type ReturnPhase =
  | 'intake'
  | 'docs_needed'
  | 'in_preparation'
  | 'client_questions'
  | 'under_review'
  | 'ready_to_file'
  | 'filed'

export type Urgency = 'critical' | 'high' | 'medium' | 'low'

export interface User {
  id: string
  name: string
  email: string
  roles: RoleId[]
  activeRole: RoleId
  isFirstRun?: boolean
}

export interface TraceSource {
  documentId: string
  documentName: string
  page: number
  section: string
  excerpt: string
  transformation?: string
}

export interface ReturnField {
  id: string
  form: string
  label: string
  value: string
  state: FieldState
  lockedReason?: string
  confidence?: number
  source?: TraceSource
  aiReason?: string
  evidence?: string[]
}

export interface DocumentItem {
  id: string
  name: string
  type: string
  year: number
  client: string
  returnId: string
  status: 'received' | 'processing' | 'needs_review' | 'linked' | 'missing'
  pages: number
  uploadedAt: string
  tags: string[]
}

export interface Message {
  id: string
  threadId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
  visibility: 'client' | 'internal'
}

export interface Thread {
  id: string
  subject: string
  linkedDocumentId?: string
  linkedIssue?: string
  linkedTaskId?: string
  returnId: string
  nextOwner: 'client' | 'cpa' | 'resolved'
  outstandingRequest?: string
  messages: Message[]
}

export interface TaskItem {
  id: string
  title: string
  owner: 'client' | 'preparer' | 'reviewer'
  status: 'todo' | 'waiting' | 'done'
  urgency: Urgency
  returnId: string
  linkedDocumentId?: string
  linkedThreadId?: string
  dueDate: string
}

export interface TaxReturn {
  id: string
  clientName: string
  clientType: 'individual' | 'business'
  year: number
  phase: ReturnPhase
  preparer: string
  reviewer?: string
  lastActivity: string
  blockers: string[]
  nextAction: string
  nextOwner: 'client' | 'preparer' | 'reviewer' | 'none'
  progress: number
  timeline: { label: string; at: string; done: boolean; detail?: string }[]
  fields: ReturnField[]
}

export interface AiRecommendation {
  id: string
  returnId: string
  title: string
  summary: string
  confidence: number
  why: string
  evidence: string[]
  uncertainty: string
  suggestedAction: string
  fieldId?: string
}
