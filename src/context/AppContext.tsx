import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { USERS } from '../data/mock'
import type { RoleId, User } from '../types'

interface AppState {
  user: User
  setUserId: (id: string) => void
  setActiveRole: (role: RoleId) => void
  firstRunDone: boolean
  completeFirstRun: () => void
  correctedFields: Record<string, string>
  correctField: (fieldId: string, value: string) => void
  verifiedFields: Set<string>
  verifyField: (fieldId: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('u-sam')
  const [roleOverrides, setRoleOverrides] = useState<Record<string, RoleId>>({})
  const [firstRunDone, setFirstRunDone] = useState(false)
  const [correctedFields, setCorrectedFields] = useState<Record<string, string>>({})
  const [verifiedFields, setVerifiedFields] = useState<Set<string>>(() => new Set(['f-wages']))

  const user = useMemo(() => {
    const base = USERS.find((u) => u.id === userId) ?? USERS[0]
    return {
      ...base,
      activeRole: roleOverrides[userId] ?? base.activeRole,
      isFirstRun: base.isFirstRun && !firstRunDone,
    }
  }, [userId, roleOverrides, firstRunDone])

  const value: AppState = {
    user,
    setUserId,
    setActiveRole: (role) =>
      setRoleOverrides((prev) => ({ ...prev, [userId]: role })),
    firstRunDone,
    completeFirstRun: () => setFirstRunDone(true),
    correctedFields,
    correctField: (fieldId, value) =>
      setCorrectedFields((prev) => ({ ...prev, [fieldId]: value })),
    verifiedFields,
    verifyField: (fieldId) =>
      setVerifiedFields((prev) => new Set(prev).add(fieldId)),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
