import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export type Employee = {
  id: string
  user_id?: string
  name: string
  username?: string
  role: string
  department: string
  status: 'Ativo' | 'Férias' | 'Aviso Prévio' | 'Desligado' | 'Inativo'
  hireDate: string
  salary: string
  vacationDaysTaken: number
  vacationDaysTotal: number
  vacationDueDate: string
  email: string
  phone: string
  rg?: string
  cpf?: string
  birthDate?: string
  cep?: string
  address?: string
  addressNumber?: string
  addressComplement?: string
  city?: string
  state?: string
  lastAccess?: string
  teamCategory?: string[]
  contractDetails?: string
  bonusType?: string
  bonusRules?: string
  bonusDueDate?: string
}
export type OnboardingTask = { id: string; title: string; completed: boolean }
export type OnboardingCandidate = {
  id: string
  name: string
  role: string
  department: string
  tasks: OnboardingTask[]
}
export type PurchaseRecord = {
  id: string
  date: string
  price: number
  quantity: number
  expirationDate?: string
  lot?: string
  supplierId?: string
  nfeNumber?: string
}
export type InventoryItem = {
  id: string
  name: string
  packageCost: number
  storageLocation: string
  packageType: string
  itemsPerBox: number
  minStock: number
  quantity: number
  specialty?: string
  entryDate?: string
  expirationDate?: string
  brand?: string
  lastBrand?: string
  lastValue?: number
  notes?: string
  barcode?: string
  purchaseHistory?: PurchaseRecord[]
  specialtyDetails?: any
  nfeNumber?: string
  storageRoom?: string
  cabinetNumber?: string
  criticalObservations?: string
}
export type TemporaryOutflow = {
  id: string
  inventory_id: string
  employee_id: string
  quantity: number
  status: 'PENDING' | 'FINALIZED' | 'RETURNED'
  created_at: string
  employees?: { name: string }
}
export type InventoryMovement = {
  id: string
  inventory_id: string
  user_id: string
  type: string
  quantity: number
  recipient: string
  created_at: string
  profiles?: { name: string }
}
export type DocumentItem = { id: string; name: string; date: string }
export type AgendaItem = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  assignedTo?: string
  involvesThirdParty?: boolean
  thirdPartyDetails?: string
  createdBy?: string
  is_completed?: boolean
}

export type ManualStep = { id: string; text: string; completed?: boolean }
export type TroubleshootingFaq = { id: string; question: string; answer: string }

export type AccessItem = {
  id: string
  platform: string
  url: string
  login: string
  pass: string
  instructions: string
  sector?: string
  access_level?: string
  logo_url?: string
  description?: string
  target_users?: string
  frequency?: string
  video_url?: string
  manual_steps?: ManualStep[]
  troubleshooting?: TroubleshootingFaq[]
  security_note?: string
}

export type Supplier = {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  cnpj: string
  website?: string
  hasSpecialNegotiation?: boolean
  negotiationNotes?: string
}
export type AuditLog = { id: string; userName: string; action: string; timestamp: string }
export type BonusSetting = { id: string; name: string }
export type EmployeeDocument = {
  id: string
  employee_id: string
  file_name: string
  file_path: string
  created_at: string
}
export type WorkSchedule = {
  id: string
  employee_id: string
  work_date: string
  morning_start: string | null
  morning_end: string | null
  afternoon_start: string | null
  afternoon_end: string | null
  morning_snack_start: string | null
  morning_snack_end: string | null
  afternoon_snack_start: string | null
  afternoon_snack_end: string | null
  total_daily_hours: number | null
}
export type InventoryOption = {
  id: string
  category: string
  label?: string
  value: string
}

interface AppStore {
  isAuthenticated: boolean
  isDataLoading: boolean
  fetchError: string | null
  currentUserId: string | null
  isAdmin: boolean
  isMaster: boolean
  can: (module: string, action: string) => boolean
  departments: string[]
  packageTypes: string[]
  specialties: string[]
  agendaTypes: string[]
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  inventoryOptions: InventoryOption[]
  temporaryOutflows: TemporaryOutflow[]
  documents: DocumentItem[]
  agenda: AgendaItem[]
  acessos: AccessItem[]
  suppliers: Supplier[]
  auditLogs: AuditLog[]
  bonusTypes: BonusSetting[]
  employeeDocuments: EmployeeDocument[]
  workSchedules: WorkSchedule[]
  addDepartment: (n: string) => void
  removeDepartment: (n: string) => void
  addPackageType: (n: string) => void
  removePackageType: (n: string) => void
  addSpecialty: (n: string) => void
  removeSpecialty: (n: string) => void
  addAgendaType: (n: string) => void
  removeAgendaType: (n: string) => void
  toggleTask: (c: string, t: string) => void
  addInventoryItem: (i: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, q: number) => void
  updateInventoryItemDetails: (
    id: string,
    data: Partial<InventoryItem>,
  ) => Promise<{ success: boolean; error?: any }>
  deleteInventoryItem: (id: string) => Promise<{ success: boolean; error?: any }>
  addPurchaseHistory: (i: string, r: Omit<PurchaseRecord, 'id'>) => void
  addInventoryOption: (category: string, value: string, label?: string) => void
  removeInventoryOption: (id: string) => void
  addTemporaryOutflow: (
    inventory_id: string,
    employee_id: string,
    quantity: number,
    destination: string,
  ) => Promise<{ success: boolean; error?: any }>
  finalizeTemporaryOutflow: (
    id: string,
    usedQty: number,
    returnedQty: number,
  ) => Promise<{ success: boolean; error?: any }>
  registerDefinitiveOutflow: (
    inventory_id: string,
    quantity: number,
    recipient: string,
  ) => Promise<{ success: boolean; error?: any }>
  getInventoryMovements: (inventory_id: string) => Promise<InventoryMovement[]>
  addEmployee: (
    e: Omit<Employee, 'id'> & { password?: string },
  ) => Promise<{ success: boolean; error?: any }>
  updateEmployee: (id: string, e: Partial<Employee>) => Promise<{ success: boolean; error?: any }>
  updateEmployeePassword: (
    userId: string,
    newPass: string,
  ) => Promise<{ success: boolean; error?: any }>
  deleteEmployee: (id: string) => void
  updateEmployeeStatus: (id: string, s: Employee['status']) => void
  generateEmployeeAccess: (
    id: string,
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: any }>
  addOnboardingTask: (c: string, t: string) => void
  removeOnboardingTask: (c: string, t: string) => void
  addDocument: (n: string) => void
  removeDocument: (id: string) => void
  addAgendaItem: (i: Omit<AgendaItem, 'id'>) => void
  updateAgendaItem: (id: string, i: Partial<AgendaItem>) => void
  removeAgendaItem: (id: string) => void
  addAccess: (i: Omit<AccessItem, 'id'>) => void
  updateAccess: (id: string, i: Partial<AccessItem>) => void
  removeAccess: (id: string) => void
  addSupplier: (i: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, i: Partial<Supplier>) => void
  removeSupplier: (id: string) => void
  addBonusType: (name: string) => void
  removeBonusType: (id: string) => void
  addEmployeeDocument: (employeeId: string, fileName: string, file: File) => Promise<void>
  removeEmployeeDocument: (id: string) => Promise<void>
  fetchWorkSchedules: (start: string, end: string) => Promise<void>
  upsertWorkSchedule: (
    schedule: Partial<WorkSchedule> & { employee_id: string; work_date: string },
  ) => Promise<void>
}

const mockDepartments = [
  'ODONTOLOGIA',
  'OPERACIONAL',
  'ADMINISTRATIVO',
  'RECEPÇÃO',
  'RH',
  "ASB'S",
  'COMERCIAL/FINANCEIRO',
  'CRC LEAD',
]
const mockPackageTypes = ['CAIXA', 'UNIDADE', 'FRASCO', 'PACOTE', 'SERINGA']
const mockSpecialties = [
  'CLÍNICA GERAL',
  'ORTODONTIA',
  'IMPLANTODONTIA',
  'ENDODONTIA',
  'ODONTOPEDIATRIA',
  'PRÓTESE',
]
const mockAgendaTypes = [
  'CONSULTA',
  'REUNIÃO',
  'VIAGEM',
  'LEMBRETE',
  'AUDITORIA',
  'COMISSÃO',
  'BÔNUS',
  'FÉRIAS',
]

const mEmp = (d: any): Employee => ({
  id: d.id,
  user_id: d.user_id,
  name: d.name,
  username: d.username,
  role: d.role,
  department: d.department,
  status: d.status,
  hireDate: d.hire_date || '',
  salary: d.salary,
  vacationDaysTaken: d.vacation_days_taken,
  vacationDaysTotal: d.vacation_days_total,
  vacationDueDate: d.vacation_due_date || '',
  email: d.email,
  phone: d.phone,
  rg: d.rg,
  cpf: d.cpf,
  birthDate: d.birth_date || '',
  cep: d.cep,
  address: d.address,
  addressNumber: d.address_number,
  addressComplement: d.address_complement,
  city: d.city,
  state: d.state,
  lastAccess: d.last_access || '',
  teamCategory: Array.isArray(d.team_category)
    ? d.team_category
    : d.team_category
      ? [d.team_category]
      : ['COLABORADOR'],
  contractDetails: d.contract_details || '',
  bonusType: d.bonus_type || '',
  bonusRules: d.bonus_rules || '',
  bonusDueDate: d.bonus_due_date || '',
})
const mInv = (d: any): InventoryItem => ({
  id: d.id,
  name: d.name,
  packageCost: d.package_cost,
  storageLocation: d.storage_location,
  packageType: d.package_type,
  itemsPerBox: d.items_per_box,
  minStock: d.min_stock,
  quantity: d.quantity,
  specialty: d.specialty,
  entryDate: d.entry_date,
  expirationDate: d.expiration_date,
  brand: d.brand,
  lastBrand: d.last_brand,
  lastValue: d.last_value,
  notes: d.notes,
  barcode: d.barcode,
  purchaseHistory: d.purchase_history,
  specialtyDetails: d.specialty_details,
  nfeNumber: d.nfe_number,
  storageRoom: d.storage_room,
  cabinetNumber: d.cabinet_number,
  criticalObservations: d.critical_observations,
})
const mAg = (d: any): AgendaItem => ({
  id: d.id,
  title: d.title,
  date: d.date,
  time: d.time,
  location: d.location,
  type: d.type,
  assignedTo: d.assigned_to,
  involvesThirdParty: d.involves_third_party,
  thirdPartyDetails: d.third_party_details,
  createdBy: d.created_by,
  is_completed: d.is_completed,
})
const mAcc = (d: any): AccessItem => ({
  id: d.id,
  platform: d.platform,
  url: d.url,
  login: d.login,
  pass: d.pass,
  instructions: d.instructions,
  sector: d.sector || 'GERAL',
  access_level: d.access_level || 'ACESSO GERAL',
  logo_url: d.logo_url || '',
  description: d.description || '',
  target_users: d.target_users || '',
  frequency: d.frequency || '',
  video_url: d.video_url || '',
  manual_steps: d.manual_steps || [],
  troubleshooting: d.troubleshooting || [],
  security_note: d.security_note || '',
})
const mSup = (d: any): Supplier => ({
  id: d.id,
  name: d.name,
  contact: d.contact,
  phone: d.phone,
  email: d.email,
  cnpj: d.cnpj,
  website: d.website,
  hasSpecialNegotiation: d.has_special_negotiation,
  negotiationNotes: d.negotiation_notes,
})
const mOnb = (d: any): OnboardingCandidate => ({
  id: d.id,
  name: d.name,
  role: d.role,
  department: d.department,
  tasks: d.tasks,
})
const mDoc = (d: any): DocumentItem => ({ id: d.id, name: d.name, date: d.date })
const mOpt = (d: any): InventoryOption => ({
  id: d.id,
  category: d.category,
  label: d.label,
  value: d.value,
})

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [departments, setDepartments] = useState(mockDepartments)
  const [packageTypes, setPackageTypes] = useState(mockPackageTypes)
  const [specialties, setSpecialties] = useState(mockSpecialties)
  const [agendaTypes, setAgendaTypes] = useState(mockAgendaTypes)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([])
  const [temporaryOutflows, setTemporaryOutflows] = useState<TemporaryOutflow[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [acessos, setAcessos] = useState<AccessItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [bonusTypes, setBonusTypes] = useState<BonusSetting[]>([])
  const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>([])
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([])
  const [alerts] = useState<string[]>([])

  const storeRef = useRef({ user, employees, inventory })
  useEffect(() => {
    storeRef.current = { user, employees, inventory }
  }, [user, employees, inventory])

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setIsDataLoading(true)
      setFetchError(null)

      const handleResponse = <T>(r: any, mapper?: (d: any) => T): T[] => {
        if (r.error) throw r.error
        return mapper ? (r.data || []).map(mapper) : r.data || []
      }

      Promise.all([
        supabase
          .from('employees')
          .select('*')
          .then((r) => setEmployees(handleResponse(r, mEmp))),
        supabase
          .from('inventory')
          .select('*')
          .then((r) => setInventory(handleResponse(r, mInv))),
        supabase
          .from('inventory_settings' as any)
          .select('*')
          .then((r) => setInventoryOptions(handleResponse(r, mOpt))),
        supabase
          .from('inventory_temporary_outflows' as any)
          .select('*, employees(name)')
          .eq('status', 'PENDING')
          .then((r) => {
            if (!r.error) setTemporaryOutflows(r.data || [])
          }),
        supabase
          .from('agenda')
          .select('*')
          .then((r) => setAgenda(handleResponse(r, mAg))),
        supabase
          .from('acessos')
          .select('*')
          .then((r) => setAcessos(handleResponse(r, mAcc))),
        supabase
          .from('suppliers')
          .select('*')
          .then((r) => setSuppliers(handleResponse(r, mSup))),
        supabase
          .from('onboarding')
          .select('*')
          .then((r) => setOnboarding(handleResponse(r, mOnb))),
        supabase
          .from('documents')
          .select('*')
          .then((r) => setDocuments(handleResponse(r, mDoc))),
        supabase
          .from('bonus_settings')
          .select('*')
          .then((r) => setBonusTypes(handleResponse(r))),
        supabase
          .from('employee_documents')
          .select('*')
          .then((r) => setEmployeeDocuments(handleResponse(r))),
        supabase
          .from('audit_logs')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(50)
          .then((r) => {
            if (r.error) throw r.error
            setAuditLogs(
              (r.data || []).map((d) => ({
                id: d.id,
                userName: d.profiles?.name || 'SISTEMA',
                action: d.action,
                timestamp: d.created_at,
              })),
            )
          }),
      ])
        .catch((err) => {
          console.error('Initial data fetch error:', err)
          setFetchError(
            'Falha ao sincronizar dados do sistema. Verifique sua conexão e tente novamente.',
          )
        })
        .finally(() => {
          setIsDataLoading(false)
        })
    } else {
      setIsAuthenticated(false)
      setCurrentUserId(null)
      setEmployees([])
      setInventory([])
      setInventoryOptions([])
      setTemporaryOutflows([])
      setAuditLogs([])
      setBonusTypes([])
      setEmployeeDocuments([])
      setWorkSchedules([])
      setFetchError(null)
      setIsDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    const me = employees.find((e) => e.user_id === user?.id)
    setCurrentUserId(me?.id || null)
  }, [employees, user])

  const isAdmin = useMemo(() => {
    if (!user) return false
    const me = employees.find((e) => e.user_id === user.id)
    if (!me) return false
    const role = (me.role || '').toLowerCase()
    const cats = me.teamCategory || []
    return (
      role.includes('admin') ||
      role.includes('diretor') ||
      cats.includes('ADMIN') ||
      cats.includes('DIRETORIA') ||
      cats.includes('MASTER')
    )
  }, [employees, user])

  const isMaster = useMemo(() => {
    if (!user) return false
    const me = employees.find((e) => e.user_id === user.id)
    if (!me) return false
    const cats = me.teamCategory || []
    return cats.includes('MASTER')
  }, [employees, user])

  const can = useCallback(
    (module: string, action: string) => {
      if (isAdmin) return true
      return false
    },
    [isAdmin],
  )

  const logAction = useCallback((action: string) => {
    if (!storeRef.current.user) return
    const u = storeRef.current.user
    const n = storeRef.current.employees.find((e) => e.user_id === u.id)?.name || 'SISTEMA'
    supabase
      .from('audit_logs')
      .insert([{ user_id: u.id, action: action.toUpperCase() }])
      .select()
      .single()
      .then(({ data }) => {
        if (data)
          setAuditLogs((p) => [
            { id: data.id, userName: n, action: data.action, timestamp: data.created_at },
            ...p,
          ])
      })
      .catch((err) => console.warn('Falha ao registrar log de auditoria', err))
  }, [])

  const addDepartment = useCallback(
    (n: string) => {
      setDepartments((p) => [...p, n.toUpperCase()])
      logAction(`CRIOU DEPARTAMENTO: ${n.toUpperCase()}`)
    },
    [logAction],
  )
  const removeDepartment = useCallback(
    (n: string) => {
      setDepartments((p) => p.filter((d) => d !== n))
      logAction(`REMOVEU DEPARTAMENTO: ${n}`)
    },
    [logAction],
  )
  const addPackageType = useCallback(
    (n: string) => {
      setPackageTypes((p) => [...p, n.toUpperCase()])
      logAction(`CRIOU TIPO DE EMBALAGEM: ${n.toUpperCase()}`)
    },
    [logAction],
  )
  const removePackageType = useCallback(
    (n: string) => {
      setPackageTypes((p) => p.filter((pt) => pt !== n))
      logAction(`REMOVEU TIPO DE EMBALAGEM: ${n}`)
    },
    [logAction],
  )
  const addSpecialty = useCallback(
    (n: string) => {
      setSpecialties((p) => [...p, n.toUpperCase()])
      logAction(`CRIOU ESPECIALIDADE: ${n.toUpperCase()}`)
    },
    [logAction],
  )
  const removeSpecialty = useCallback(
    (n: string) => {
      setSpecialties((p) => p.filter((s) => s !== n))
      logAction(`REMOVEU ESPECIALIDADE: ${n}`)
    },
    [logAction],
  )
  const addAgendaType = useCallback(
    (n: string) => {
      setAgendaTypes((p) => [...p, n.toUpperCase()])
      logAction(`CRIOU TIPO DE COMPROMISSO: ${n.toUpperCase()}`)
    },
    [logAction],
  )
  const removeAgendaType = useCallback(
    (n: string) => {
      setAgendaTypes((p) => p.filter((t) => t !== n))
      logAction(`REMOVEU TIPO DE COMPROMISSO: ${n}`)
    },
    [logAction],
  )

  const toggleTask = useCallback(
    (cId: string, tId: string) => {
      setOnboarding((p) =>
        p.map((c) =>
          c.id === cId
            ? {
                ...c,
                tasks: c.tasks.map((t) => (t.id === tId ? { ...t, completed: !t.completed } : t)),
              }
            : c,
        ),
      )
      logAction(`ALTEROU TAREFA DE ONBOARDING DO CANDIDATO ID: ${cId}`)
    },
    [logAction],
  )
  const addOnboardingTask = useCallback(
    (cId: string, t: string) => {
      setOnboarding((p) =>
        p.map((c) =>
          c.id === cId
            ? { ...c, tasks: [...c.tasks, { id: crypto.randomUUID(), title: t, completed: false }] }
            : c,
        ),
      )
      logAction(`CRIOU TAREFA ONBOARDING: ${t}`)
    },
    [logAction],
  )
  const removeOnboardingTask = useCallback(
    (cId: string, tId: string) => {
      setOnboarding((p) =>
        p.map((c) => (c.id === cId ? { ...c, tasks: c.tasks.filter((t) => t.id !== tId) } : c)),
      )
      logAction('REMOVEU TAREFA ONBOARDING')
    },
    [logAction],
  )

  const addInventoryItem = useCallback(
    (i: Omit<InventoryItem, 'id'>) => {
      const ph =
        i.quantity > 0
          ? [
              {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                price: i.packageCost,
                quantity: i.quantity,
                expirationDate: i.expirationDate,
                nfeNumber: i.nfeNumber,
              },
            ]
          : []
      supabase
        .from('inventory')
        .insert([
          {
            name: i.name,
            package_cost: i.packageCost,
            storage_location: i.storageLocation,
            package_type: i.packageType,
            items_per_box: i.itemsPerBox,
            min_stock: i.minStock,
            quantity: i.quantity,
            specialty: i.specialty,
            entry_date: i.entryDate,
            expiration_date: i.expirationDate,
            brand: i.brand,
            last_brand: i.lastBrand,
            last_value: i.lastValue,
            notes: i.notes,
            barcode: i.barcode,
            purchase_history: ph,
            specialty_details: i.specialtyDetails || {},
            nfe_number: i.nfeNumber || null,
            storage_room: i.storageRoom || null,
            cabinet_number: i.cabinetNumber || null,
            critical_observations: i.criticalObservations || null,
          } as any,
        ])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setInventory((p) => [...p, mInv(data)])
            logAction(`CRIOU PRODUTO: ${i.name}`)
          }
        })
        .catch((err) => console.warn('Erro ao adicionar produto no inventário', err))
    },
    [logAction],
  )

  const updateInventoryQuantity = useCallback(
    (id: string, q: number) => {
      supabase
        .from('inventory')
        .update({ quantity: q })
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            setInventory((p) => p.map((i) => (i.id === id ? { ...i, quantity: q } : i)))
            logAction(`ATUALIZOU ESTOQUE ID: ${id} PARA ${q}`)
          }
        })
        .catch((err) => console.warn('Erro ao atualizar quantidade no inventário', err))
    },
    [logAction],
  )

  const updateInventoryItemDetails = useCallback(
    async (id: string, data: Partial<InventoryItem>) => {
      const payload: any = {}
      if (data.name !== undefined) payload.name = data.name
      if (data.barcode !== undefined) payload.barcode = data.barcode
      if (data.brand !== undefined) payload.brand = data.brand
      if (data.specialty !== undefined) payload.specialty = data.specialty
      if (data.packageCost !== undefined) payload.package_cost = data.packageCost
      if (data.packageType !== undefined) payload.package_type = data.packageType
      if (data.itemsPerBox !== undefined) payload.items_per_box = data.itemsPerBox
      if (data.quantity !== undefined) payload.quantity = data.quantity
      if (data.storageRoom !== undefined) payload.storage_room = data.storageRoom || null
      if (data.cabinetNumber !== undefined) payload.cabinet_number = data.cabinetNumber || null
      if (data.nfeNumber !== undefined) payload.nfe_number = data.nfeNumber || null
      if (data.minStock !== undefined) payload.min_stock = data.minStock
      if (data.entryDate !== undefined) payload.entry_date = data.entryDate
      if (data.expirationDate !== undefined) payload.expiration_date = data.expirationDate
      if (data.lastBrand !== undefined) payload.last_brand = data.lastBrand
      if (data.lastValue !== undefined) payload.last_value = data.lastValue
      if (data.notes !== undefined) payload.notes = data.notes
      if (data.criticalObservations !== undefined)
        payload.critical_observations = data.criticalObservations || null
      if (data.specialtyDetails !== undefined) payload.specialty_details = data.specialtyDetails
      if (data.storageLocation !== undefined) payload.storage_location = data.storageLocation

      try {
        const { error } = await supabase.from('inventory').update(payload).eq('id', id)
        if (error) throw error

        setInventory((p) => p.map((i) => (i.id === id ? { ...i, ...data } : i)))
        logAction(`ATUALIZOU DADOS DO PRODUTO ID: ${id}`)
        return { success: true }
      } catch (err: any) {
        console.warn('Erro ao atualizar dados do produto no inventário', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const deleteInventoryItem = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('inventory').delete().eq('id', id)
        if (error) throw error
        setInventory((p) => p.filter((i) => i.id !== id))
        logAction(`REMOVEU PRODUTO ID: ${id}`)
        return { success: true }
      } catch (err: any) {
        console.warn('Erro ao deletar produto no inventário', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const addPurchaseHistory = useCallback(
    (itemId: string, r: Omit<PurchaseRecord, 'id'>) => {
      setInventory((prev) => {
        const item = prev.find((i) => i.id === itemId)
        if (!item) return prev
        const nh = [{ ...r, id: crypto.randomUUID() }, ...(item.purchaseHistory || [])]
        const nq = item.quantity + r.quantity
        supabase
          .from('inventory')
          .update({
            purchase_history: nh as any,
            quantity: nq,
            package_cost: r.price,
            expiration_date: r.expirationDate || item.expirationDate,
            ...(r.nfeNumber ? { nfe_number: r.nfeNumber } : {}),
          })
          .eq('id', itemId)
          .then(() => logAction(`NOVA COMPRA PARA PRODUTO ID: ${itemId}`))
          .catch((err) => console.warn('Erro ao adicionar histórico de compra', err))
        return prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                purchaseHistory: nh,
                quantity: nq,
                packageCost: r.price,
                expirationDate: r.expirationDate || item.expirationDate,
                nfeNumber: r.nfeNumber || i.nfeNumber,
              }
            : i,
        )
      })
    },
    [logAction],
  )

  const addInventoryOption = useCallback(
    (category: string, value: string, label?: string) => {
      supabase
        .from('inventory_settings' as any)
        .insert([{ category, value, label }])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setInventoryOptions((p) => [...p, mOpt(data)])
            logAction(`CRIOU OPÇÃO DE ESTOQUE: ${category} - ${value}`)
          }
        })
        .catch((err) => console.warn('Erro ao criar opção', err))
    },
    [logAction],
  )

  const removeInventoryOption = useCallback(
    (id: string) => {
      supabase
        .from('inventory_settings' as any)
        .delete()
        .eq('id', id)
        .then(() => {
          setInventoryOptions((p) => p.filter((o) => o.id !== id))
          logAction(`REMOVEU OPÇÃO DE ESTOQUE ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover opção', err))
    },
    [logAction],
  )

  const registerDefinitiveOutflow = useCallback(
    async (inventory_id: string, quantity: number, recipient: string) => {
      const item = storeRef.current.inventory.find((i) => i.id === inventory_id)
      if (!item) return { success: false }
      const newQty = Math.max(0, item.quantity - quantity)

      const { error: invErr } = await supabase
        .from('inventory')
        .update({ quantity: newQty })
        .eq('id', inventory_id)

      if (invErr) return { success: false, error: invErr }

      setInventory((p) => p.map((i) => (i.id === inventory_id ? { ...i, quantity: newQty } : i)))

      const user = storeRef.current.user
      if (user) {
        await supabase.from('inventory_movements' as any).insert([
          {
            inventory_id,
            user_id: user.id,
            type: 'SAÍDA',
            quantity,
            recipient,
          },
        ])
      }

      logAction(`BAIXA DEFINITIVA: ${quantity} UN DO PRODUTO ID: ${inventory_id}`)
      return { success: true }
    },
    [logAction],
  )

  const addTemporaryOutflow = useCallback(
    async (inventory_id: string, employee_id: string, quantity: number, destination: string) => {
      const { data, error } = await supabase
        .from('inventory_temporary_outflows' as any)
        .insert([{ inventory_id, employee_id, quantity, status: 'PENDING' }])
        .select('*, employees(name)')
        .single()

      if (error) return { success: false, error }
      if (data) {
        setTemporaryOutflows((p) => [data, ...p])

        const user = storeRef.current.user
        const emp = storeRef.current.employees.find((e) => e.id === employee_id)
        const recipientStr = `Colab: ${emp?.name || 'Desconhecido'} - ${destination}`

        if (user) {
          await supabase.from('inventory_movements' as any).insert([
            {
              inventory_id,
              user_id: user.id,
              type: 'BAIXA TEMPORÁRIA',
              quantity,
              recipient: recipientStr,
            },
          ])
        }

        logAction(`BAIXA TEMPORÁRIA: ${quantity} UN PARA COLAB ID: ${employee_id}`)
        return { success: true }
      }
      return { success: false }
    },
    [logAction],
  )

  const finalizeTemporaryOutflow = useCallback(
    async (id: string, usedQty: number, returnedQty: number) => {
      const { data, error } = await supabase
        .from('inventory_temporary_outflows' as any)
        .update({ status: 'FINALIZED' })
        .eq('id', id)
        .select()
        .single()

      if (error) return { success: false, error }

      if (data) {
        setTemporaryOutflows((p) => p.filter((t) => t.id !== id))

        if (usedQty > 0) {
          const invItem = storeRef.current.inventory?.find((i) => i.id === data.inventory_id)
          if (invItem) {
            updateInventoryQuantity(invItem.id, Math.max(0, invItem.quantity - usedQty))
          }
        }

        const user = storeRef.current.user
        const movements = []
        if (usedQty > 0) {
          movements.push({
            inventory_id: data.inventory_id,
            user_id: user?.id,
            type: 'SAÍDA',
            quantity: usedQty,
            recipient: 'RECONCILIAÇÃO DE BAIXA TEMPORÁRIA (USO)',
          })
        }
        if (returnedQty > 0) {
          movements.push({
            inventory_id: data.inventory_id,
            user_id: user?.id,
            type: 'RETORNO',
            quantity: returnedQty,
            recipient: 'RECONCILIAÇÃO DE BAIXA TEMPORÁRIA (RETORNO)',
          })
        }

        if (movements.length > 0 && user) {
          await supabase.from('inventory_movements' as any).insert(movements)
        }

        logAction(
          `RECONCILIADA BAIXA TEMPORÁRIA ID: ${id} (USOU: ${usedQty}, DEVOLVEU: ${returnedQty})`,
        )
        return { success: true }
      }
      return { success: false }
    },
    [logAction, updateInventoryQuantity],
  )

  const getInventoryMovements = useCallback(async (inventory_id: string) => {
    try {
      const { data, error } = await supabase
        .from('inventory_movements' as any)
        .select('*, profiles(name)')
        .eq('inventory_id', inventory_id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching inventory movements:', err)
      return []
    }
  }, [])

  const addEmployee = useCallback(
    async (e: Omit<Employee, 'id'> & { password?: string }) => {
      let userId = undefined

      if (e.password && e.email) {
        const formattedEmail = e.email.trim().toLowerCase()
        const res = await supabase.functions.invoke('admin-create-user', {
          body: { email: formattedEmail, password: e.password, name: e.name },
        })

        if (res.error) {
          return { success: false, error: res.error }
        }
        if (res.data?.error) {
          return { success: false, error: new Error(res.data.error) }
        }
        if (!res.data?.id) {
          return {
            success: false,
            error: new Error(
              'Erro ao criar usuário na autenticação. Verifique se o e-mail já está em uso.',
            ),
          }
        }
        userId = res.data.id
        e.email = formattedEmail
      }

      const { data: empData, error: empError } = await supabase
        .from('employees')
        .insert([
          {
            name: e.name,
            username: e.username || null,
            role: e.role,
            department: e.department,
            status: e.status,
            hire_date: e.hireDate || null,
            salary: e.salary,
            vacation_days_taken: e.vacationDaysTaken,
            vacation_days_total: e.vacationDaysTotal,
            vacation_due_date: e.vacationDueDate || null,
            email: e.email || null,
            phone: e.phone || null,
            rg: e.rg || null,
            cpf: e.cpf || null,
            birth_date: e.birthDate || null,
            cep: e.cep || null,
            address: e.address || null,
            address_number: e.addressNumber || null,
            address_complement: e.addressComplement || null,
            city: e.city || null,
            state: e.state || null,
            team_category: e.teamCategory || ['COLABORADOR'],
            contract_details: e.contractDetails || '',
            bonus_type: e.bonusType || '',
            bonus_rules: e.bonusRules || '',
            bonus_due_date: e.bonusDueDate || null,
            user_id: userId || null,
          },
        ])
        .select()
        .single()

      if (empError) {
        return { success: false, error: empError }
      }

      if (empData) {
        setEmployees((p) => [...p, mEmp(empData)])
        logAction(`CRIOU COLABORADOR: ${e.name}`)
        return { success: true }
      }

      return { success: false, error: new Error('Unknown error') }
    },
    [logAction],
  )

  const generateEmployeeAccess = useCallback(
    async (id: string, email: string, password: string, name: string) => {
      const formattedEmail = email.trim().toLowerCase()
      const res = await supabase.functions.invoke('admin-create-user', {
        body: { email: formattedEmail, password, name },
      })

      if (res.error) {
        return { success: false, error: res.error }
      }
      if (res.data?.error) {
        return { success: false, error: new Error(res.data.error) }
      }
      if (!res.data?.id) {
        return {
          success: false,
          error: new Error(
            'Erro ao criar usuário na autenticação. Verifique se o e-mail já existe.',
          ),
        }
      }

      const userId = res.data.id

      const { error: updateError } = await supabase
        .from('employees')
        .update({ user_id: userId, email: formattedEmail })
        .eq('id', id)

      if (updateError) {
        return { success: false, error: updateError }
      }

      setEmployees((p) =>
        p.map((e) => (e.id === id ? { ...e, user_id: userId, email: formattedEmail } : e)),
      )
      logAction(`GEROU ACESSO PARA COLABORADOR ID: ${id}`)

      return { success: true }
    },
    [logAction],
  )

  const updateEmployee = useCallback(
    async (id: string, e: Partial<Employee>) => {
      const payload: any = {}
      if (e.name !== undefined) payload.name = e.name
      if (e.username !== undefined) payload.username = e.username
      if (e.role !== undefined) payload.role = e.role
      if (e.department !== undefined) payload.department = e.department
      if (e.status !== undefined) payload.status = e.status
      if (e.hireDate !== undefined) payload.hire_date = e.hireDate || null
      if (e.salary !== undefined) payload.salary = e.salary
      if (e.email !== undefined) payload.email = e.email
      if (e.phone !== undefined) payload.phone = e.phone
      if (e.rg !== undefined) payload.rg = e.rg
      if (e.cpf !== undefined) payload.cpf = e.cpf
      if (e.birthDate !== undefined) payload.birth_date = e.birthDate || null
      if (e.cep !== undefined) payload.cep = e.cep
      if (e.address !== undefined) payload.address = e.address
      if (e.addressNumber !== undefined) payload.address_number = e.addressNumber
      if (e.addressComplement !== undefined) payload.address_complement = e.addressComplement
      if (e.city !== undefined) payload.city = e.city
      if (e.state !== undefined) payload.state = e.state
      if (e.teamCategory !== undefined) payload.team_category = e.teamCategory
      if (e.contractDetails !== undefined) payload.contract_details = e.contractDetails
      if (e.bonusType !== undefined) payload.bonus_type = e.bonusType
      if (e.bonusRules !== undefined) payload.bonus_rules = e.bonusRules
      if (e.bonusDueDate !== undefined) payload.bonus_due_date = e.bonusDueDate || null

      if (e.vacationDaysTaken !== undefined) payload.vacation_days_taken = e.vacationDaysTaken
      if (e.vacationDaysTotal !== undefined) payload.vacation_days_total = e.vacationDaysTotal
      if (e.vacationDueDate !== undefined) payload.vacation_due_date = e.vacationDueDate || null

      try {
        const { error } = await supabase.from('employees').update(payload).eq('id', id)
        if (!error) {
          setEmployees((p) => p.map((emp) => (emp.id === id ? { ...emp, ...e } : emp)))
          logAction(`ATUALIZOU DADOS DO COLABORADOR ID: ${id}`)
          return { success: true }
        }
        return { success: false, error }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const updateEmployeePassword = useCallback(
    async (userId: string, newPass: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('update-user-password', {
          body: { userId, password: newPass },
        })
        if (error) throw error
        logAction(`ALTEROU SENHA DE ACESSO DO USUÁRIO ID: ${userId}`)
        return { success: true }
      } catch (error: any) {
        return { success: false, error }
      }
    },
    [logAction],
  )

  const deleteEmployee = useCallback(
    (id: string) => {
      supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .then(() => {
          setEmployees((p) => p.filter((e) => e.id !== id))
          logAction(`REMOVEU COLABORADOR: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover colaborador', err))
    },
    [logAction],
  )
  const updateEmployeeStatus = useCallback(
    (id: string, s: string) => {
      supabase
        .from('employees')
        .update({ status: s })
        .eq('id', id)
        .then(() => {
          setEmployees((p) => p.map((e) => (e.id === id ? { ...e, status: s as any } : e)))
          logAction(`ALTEROU STATUS COLAB ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao atualizar status do colaborador', err))
    },
    [logAction],
  )

  const addDocument = useCallback(
    (n: string) => {
      supabase
        .from('documents')
        .insert([{ name: n, date: new Date().toLocaleDateString('pt-BR') }])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setDocuments((p) => [...p, mDoc(data)])
            logAction(`ADICIONOU DOC: ${n}`)
          }
        })
        .catch((err) => console.warn('Erro ao adicionar documento', err))
    },
    [logAction],
  )
  const removeDocument = useCallback(
    (id: string) => {
      supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .then(() => {
          setDocuments((p) => p.filter((d) => d.id !== id))
          logAction(`REMOVEU DOC ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover documento', err))
    },
    [logAction],
  )

  const addAgendaItem = useCallback(
    (i: Omit<AgendaItem, 'id'>) => {
      supabase
        .from('agenda')
        .insert([
          {
            title: i.title,
            date: i.date,
            time: i.time,
            location: i.location,
            type: i.type,
            assigned_to: i.assignedTo,
            involves_third_party: i.involvesThirdParty,
            third_party_details: i.thirdPartyDetails,
            created_by: i.createdBy,
            is_completed: i.is_completed || false,
          },
        ])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setAgenda((p) => [...p, mAg(data)])
            logAction(`CRIOU AGENDA: ${i.title}`)
          }
        })
        .catch((err) => console.warn('Erro ao adicionar item na agenda', err))
    },
    [logAction],
  )

  const updateAgendaItem = useCallback(
    (id: string, i: Partial<AgendaItem>) => {
      const payload: any = {}
      if (i.title !== undefined) payload.title = i.title
      if (i.date !== undefined) payload.date = i.date
      if (i.time !== undefined) payload.time = i.time
      if (i.location !== undefined) payload.location = i.location
      if (i.type !== undefined) payload.type = i.type
      if (i.assignedTo !== undefined) payload.assigned_to = i.assignedTo
      if (i.involvesThirdParty !== undefined) payload.involves_third_party = i.involvesThirdParty
      if (i.thirdPartyDetails !== undefined) payload.thirdPartyDetails = i.thirdPartyDetails
      if (i.createdBy !== undefined) payload.created_by = i.createdBy
      if (i.is_completed !== undefined) payload.is_completed = i.is_completed

      supabase
        .from('agenda')
        .update(payload)
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            setAgenda((p) => p.map((a) => (a.id === id ? { ...a, ...i } : a)))
            logAction(`ATUALIZOU AGENDA ID: ${id}`)
          }
        })
        .catch((err) => console.warn('Erro ao atualizar item na agenda', err))
    },
    [logAction],
  )

  const removeAgendaItem = useCallback(
    (id: string) => {
      supabase
        .from('agenda')
        .delete()
        .eq('id', id)
        .then(() => {
          setAgenda((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU AGENDA ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover item na agenda', err))
    },
    [logAction],
  )

  const addAccess = useCallback(
    (i: Omit<AccessItem, 'id'>) => {
      supabase
        .from('acessos')
        .insert([
          {
            platform: i.platform,
            url: i.url,
            login: i.login,
            pass: i.pass,
            instructions: i.instructions || '',
            sector: i.sector || 'GERAL',
            access_level: i.access_level || 'ACESSO GERAL',
            logo_url: i.logo_url || '',
            description: i.description || '',
            target_users: i.target_users || '',
            frequency: i.frequency || '',
            video_url: i.video_url || '',
            manual_steps: (i.manual_steps as any) || [],
            troubleshooting: (i.troubleshooting as any) || [],
            security_note: i.security_note || '',
          },
        ])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setAcessos((p) => [...p, mAcc(data)])
            logAction(`CRIOU ACESSO: ${i.platform}`)
          }
        })
        .catch((err) => console.warn('Erro ao criar acesso', err))
    },
    [logAction],
  )
  const updateAccess = useCallback(
    (id: string, i: Partial<AccessItem>) => {
      supabase
        .from('acessos')
        .update({
          platform: i.platform,
          url: i.url,
          login: i.login,
          pass: i.pass,
          instructions: i.instructions,
          sector: i.sector,
          access_level: i.access_level,
          logo_url: i.logo_url,
          description: i.description,
          target_users: i.target_users,
          frequency: i.frequency,
          video_url: i.video_url,
          manual_steps: i.manual_steps as any,
          troubleshooting: i.troubleshooting as any,
          security_note: i.security_note,
        })
        .eq('id', id)
        .then(() => {
          setAcessos((p) => p.map((a) => (a.id === id ? { ...a, ...i } : a)))
          logAction(`ATUALIZOU ACESSO ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao atualizar acesso', err))
    },
    [logAction],
  )
  const removeAccess = useCallback(
    (id: string) => {
      supabase
        .from('acessos')
        .delete()
        .eq('id', id)
        .then(() => {
          setAcessos((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU ACESSO ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover acesso', err))
    },
    [logAction],
  )

  const addSupplier = useCallback(
    (i: Omit<Supplier, 'id'>) => {
      supabase
        .from('suppliers')
        .insert([
          {
            name: i.name,
            contact: i.contact,
            phone: i.phone,
            email: i.email,
            cnpj: i.cnpj,
            website: i.website,
            has_special_negotiation: i.hasSpecialNegotiation,
            negotiation_notes: i.negotiationNotes,
          },
        ])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setSuppliers((p) => [...p, mSup(data)])
            logAction(`CRIOU FORNECEDOR: ${i.name}`)
          }
        })
        .catch((err) => console.warn('Erro ao criar fornecedor', err))
    },
    [logAction],
  )
  const updateSupplier = useCallback(
    (id: string, i: Partial<Supplier>) => {
      supabase
        .from('suppliers')
        .update({
          name: i.name,
          contact: i.contact,
          phone: i.phone,
          email: i.email,
          cnpj: i.cnpj,
          website: i.website,
          has_special_negotiation: i.hasSpecialNegotiation,
          negotiation_notes: i.negotiationNotes,
        })
        .eq('id', id)
        .then(() => {
          setSuppliers((p) => p.map((s) => (s.id === id ? { ...s, ...i } : s)))
          logAction(`ATUALIZOU FORNECEDOR ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao atualizar fornecedor', err))
    },
    [logAction],
  )
  const removeSupplier = useCallback(
    (id: string) => {
      supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
        .then(() => {
          setSuppliers((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU FORNECEDOR ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover fornecedor', err))
    },
    [logAction],
  )

  const addBonusType = useCallback(
    (name: string) => {
      supabase
        .from('bonus_settings')
        .insert([{ name }])
        .select()
        .single()
        .then(({ data }) => {
          if (data) setBonusTypes((p) => [...p, data])
          logAction(`ADICIONOU TIPO DE BONIFICAÇÃO: ${name}`)
        })
        .catch((err) => console.warn('Erro ao adicionar tipo de bonificação', err))
    },
    [logAction],
  )

  const removeBonusType = useCallback(
    (id: string) => {
      supabase
        .from('bonus_settings')
        .delete()
        .eq('id', id)
        .then(() => {
          setBonusTypes((p) => p.filter((b) => b.id !== id))
          logAction(`REMOVEU TIPO DE BONIFICAÇÃO ID: ${id}`)
        })
        .catch((err) => console.warn('Erro ao remover tipo de bonificação', err))
    },
    [logAction],
  )

  const addEmployeeDocument = useCallback(
    async (employeeId: string, fileName: string, file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const base64 = reader.result as string
            const { data, error } = await supabase
              .from('employee_documents')
              .insert([
                {
                  employee_id: employeeId,
                  file_name: fileName,
                  file_path: base64,
                },
              ])
              .select()
              .single()

            if (error) throw error
            if (data) setEmployeeDocuments((p) => [...p, data])
            logAction(`ANEXOU DOCUMENTO: ${fileName}`)
            resolve()
          } catch (err) {
            console.error('Erro ao salvar documento:', err)
            reject(err)
          }
        }
        reader.onerror = (err) => reject(err)
        reader.readAsDataURL(file)
      })
    },
    [logAction],
  )

  const removeEmployeeDocument = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('employee_documents').delete().eq('id', id)
        if (error) throw error
        setEmployeeDocuments((p) => p.filter((d) => d.id !== id))
        logAction(`REMOVEU DOCUMENTO ID: ${id}`)
      } catch (err) {
        console.warn('Erro ao remover documento', err)
      }
    },
    [logAction],
  )

  const fetchWorkSchedules = useCallback(async (start: string, end: string) => {
    try {
      const { data, error } = await supabase
        .from('work_schedules' as any)
        .select('*')
        .gte('work_date', start)
        .lte('work_date', end)

      if (error) throw error
      if (data) {
        setWorkSchedules((prev) => {
          const others = prev.filter((p) => p.work_date < start || p.work_date > end)
          return [...others, ...data]
        })
      }
    } catch (err) {
      console.error('Error fetching work schedules:', err)
    }
  }, [])

  const upsertWorkSchedule = useCallback(
    async (s: Partial<WorkSchedule> & { employee_id: string; work_date: string }) => {
      try {
        const { data, error } = await supabase
          .from('work_schedules' as any)
          .upsert(
            {
              employee_id: s.employee_id,
              work_date: s.work_date,
              morning_start: s.morning_start || null,
              morning_end: s.morning_end || null,
              afternoon_start: s.afternoon_start || null,
              afternoon_end: s.afternoon_end || null,
              morning_snack_start: s.morning_snack_start || null,
              morning_snack_end: s.morning_snack_end || null,
              afternoon_snack_start: s.afternoon_snack_start || null,
              afternoon_snack_end: s.afternoon_snack_end || null,
              total_daily_hours: s.total_daily_hours || 0,
            },
            { onConflict: 'employee_id, work_date' },
          )
          .select()
          .single()

        if (error) throw error
        if (data) {
          setWorkSchedules((prev) => {
            const exists = prev.find(
              (p) =>
                p.id === data.id ||
                (p.employee_id === data.employee_id && p.work_date === data.work_date),
            )
            if (exists) return prev.map((p) => (p.id === exists.id ? data : p))
            return [...prev, data]
          })
        }
      } catch (err) {
        console.error('Error upserting work schedule:', err)
      }
    },
    [],
  )

  const value = useMemo(
    () => ({
      isAuthenticated,
      isDataLoading,
      fetchError,
      currentUserId,
      isAdmin,
      isMaster,
      can,
      departments,
      packageTypes,
      specialties,
      agendaTypes,
      employees,
      alerts,
      onboarding,
      inventory,
      inventoryOptions,
      temporaryOutflows,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
      bonusTypes,
      employeeDocuments,
      workSchedules,
      addDepartment,
      removeDepartment,
      addPackageType,
      removePackageType,
      addSpecialty,
      removeSpecialty,
      addAgendaType,
      removeAgendaType,
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      updateInventoryItemDetails,
      deleteInventoryItem,
      addPurchaseHistory,
      addInventoryOption,
      removeInventoryOption,
      addTemporaryOutflow,
      finalizeTemporaryOutflow,
      registerDefinitiveOutflow,
      getInventoryMovements,
      addEmployee,
      updateEmployee,
      updateEmployeePassword,
      deleteEmployee,
      updateEmployeeStatus,
      generateEmployeeAccess,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
      addAgendaItem,
      updateAgendaItem,
      removeAgendaItem,
      addAccess,
      updateAccess,
      removeAccess,
      addSupplier,
      updateSupplier,
      removeSupplier,
      addBonusType,
      removeBonusType,
      addEmployeeDocument,
      removeEmployeeDocument,
      fetchWorkSchedules,
      upsertWorkSchedule,
    }),
    [
      isAuthenticated,
      isDataLoading,
      fetchError,
      currentUserId,
      isAdmin,
      isMaster,
      can,
      departments,
      packageTypes,
      specialties,
      agendaTypes,
      employees,
      alerts,
      onboarding,
      inventory,
      inventoryOptions,
      temporaryOutflows,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
      bonusTypes,
      employeeDocuments,
      workSchedules,
      addDepartment,
      removeDepartment,
      addPackageType,
      removePackageType,
      addSpecialty,
      removeSpecialty,
      addAgendaType,
      removeAgendaType,
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      updateInventoryItemDetails,
      deleteInventoryItem,
      addPurchaseHistory,
      addInventoryOption,
      removeInventoryOption,
      addTemporaryOutflow,
      finalizeTemporaryOutflow,
      registerDefinitiveOutflow,
      getInventoryMovements,
      addEmployee,
      updateEmployee,
      updateEmployeePassword,
      deleteEmployee,
      updateEmployeeStatus,
      generateEmployeeAccess,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
      addAgendaItem,
      updateAgendaItem,
      removeAgendaItem,
      addAccess,
      updateAccess,
      removeAccess,
      addSupplier,
      updateSupplier,
      removeSupplier,
      addBonusType,
      removeBonusType,
      addEmployeeDocument,
      removeEmployeeDocument,
      fetchWorkSchedules,
      upsertWorkSchedule,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
