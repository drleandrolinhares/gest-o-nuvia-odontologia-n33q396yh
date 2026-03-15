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
  pixNumber?: string
  pixType?: string
  bankName?: string
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
  requester_id?: string
  received_at?: string
  completed_at?: string
  created_at?: string
  sac_record_id?: string
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

export type FixedExpenseDetail = {
  id: string
  description: string
  amount: number
  is_annual?: boolean
}
export type FixedExpense = {
  id: string
  label: string
  value: number
  details?: FixedExpenseDetail[]
}
export type AppSettings = {
  id: string
  global_card_fee: number
  global_commission: number
  global_inadimplency: number
  global_taxes: number
  hourly_cost_fixed_items: FixedExpense[]
  hourly_cost_monthly_hours: number
  predicted_loss_percentage: number
  evaluation_factor_percentage: number
}
export type PriceItem = {
  id: string
  work_type: string
  category: string
  material: string | null
  price: number
  sector: string | null
  execution_time: number
  cadista_cost: number
  material_cost: number
  fixed_cost: number
}

export type ConsultorioWeeklySchedule = {
  id?: string
  consultorio_id?: string
  day_of_week: number
  morning_start: string | null
  morning_end: string | null
  afternoon_start: string | null
  afternoon_end: string | null
  is_closed: boolean
}

export type Consultorio = {
  id: string
  name: string
  morning_start?: string | null
  morning_end?: string | null
  afternoon_start?: string | null
  afternoon_end?: string | null
  schedules?: ConsultorioWeeklySchedule[]
}

export type RolePermission = {
  id?: string
  role: string
  module: string
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  updated_at?: string
}

export type SystemRole = {
  id: string
  name: string
  created_at?: string
}

export type SacRecord = {
  id: string
  type: 'RECLAMAÇÃO' | 'SUGESTÃO'
  patient_name: string
  receiving_employee_id?: string
  responsible_employee_id?: string
  status: 'OPORTUNIDADE DE SOLUÇÃO' | 'RECEBIDO' | 'SENDO TRATADO' | 'RESOLVIDO'
  sector: string
  description: string
  solution_details?: string
  received_at: string
  limit_at: string
  solved_at?: string
  created_at: string
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
  appSettings: AppSettings | null
  priceList: PriceItem[]
  rolePermissions: RolePermission[]
  roles: SystemRole[]
  consultorios: Consultorio[]
  sacRecords: SacRecord[]
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
  forceResetPassword: (userId: string) => Promise<{ success: boolean; error?: any }>
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
  updateAppSettings: (data: Partial<AppSettings>) => Promise<{ success: boolean; error?: any }>
  addPriceItem: (
    p: Omit<PriceItem, 'id'>,
  ) => Promise<{ success: boolean; id?: string; error?: any }>
  updatePriceItem: (id: string, p: Partial<PriceItem>) => Promise<{ success: boolean; error?: any }>
  removePriceItem: (id: string) => Promise<{ success: boolean; error?: any }>
  updateRolePermissions: (
    permissions: RolePermission[],
  ) => Promise<{ success: boolean; error?: any }>
  addRole: (name: string) => Promise<{ success: boolean; error?: any }>
  updateRole: (id: string, name: string) => Promise<{ success: boolean; error?: any }>
  deleteRole: (id: string) => Promise<{ success: boolean; error?: any }>
  syncConsultorios: (
    items: Consultorio[],
    newMonthlyHours: number,
  ) => Promise<{ success: boolean; error?: any }>
  addSacRecord: (
    r: Omit<SacRecord, 'id' | 'created_at' | 'received_at' | 'limit_at'>,
  ) => Promise<{ success: boolean; error?: any }>
  updateSacRecord: (id: string, r: Partial<SacRecord>) => Promise<{ success: boolean; error?: any }>
  deleteSacRecord: (id: string) => Promise<{ success: boolean; error?: any }>
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
  'PEDIDO',
  'SAC',
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
  pixNumber: d.pix_number || d.pix_key || '',
  pixType: d.pix_type || '',
  bankName: d.bank_name || '',
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
  requester_id: d.requester_id,
  received_at: d.received_at,
  completed_at: d.completed_at,
  created_at: d.created_at,
  sac_record_id: d.sac_record_id,
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

const mAppSet = (d: any): AppSettings => ({
  id: d.id,
  global_card_fee: Number(d.global_card_fee) || 0,
  global_commission: Number(d.global_commission) || 0,
  global_inadimplency: Number(d.global_inadimplency) || 0,
  global_taxes: Number(d.global_taxes) || 0,
  predicted_loss_percentage: Number(d.predicted_loss_percentage ?? 20),
  evaluation_factor_percentage: Number(d.evaluation_factor_percentage ?? 15),
  hourly_cost_fixed_items: Array.isArray(d.hourly_cost_fixed_items)
    ? d.hourly_cost_fixed_items.map((i: any) => ({
        id: i.id || crypto.randomUUID(),
        label: i.label || i.name || '',
        value: Number(i.value) || 0,
        details: Array.isArray(i.details)
          ? i.details.map((det: any) => ({
              id: det.id || crypto.randomUUID(),
              description: det.description || '',
              amount: Number(det.amount) || 0,
              is_annual: Boolean(det.is_annual) || false,
            }))
          : [],
      }))
    : [],
  hourly_cost_monthly_hours: Number(d.hourly_cost_monthly_hours) || 160,
})

const mPrice = (d: any): PriceItem => ({
  id: d.id,
  work_type: d.work_type,
  category: d.category,
  material: d.material,
  price: Number(d.price) || 0,
  sector: d.sector,
  execution_time: Number(d.execution_time) || 0,
  cadista_cost: Number(d.cadista_cost) || 0,
  material_cost: Number(d.material_cost) || 0,
  fixed_cost: Number(d.fixed_cost) || 0,
})

const mSac = (d: any): SacRecord => ({
  id: d.id,
  type: d.type,
  patient_name: d.patient_name,
  receiving_employee_id: d.receiving_employee_id || undefined,
  responsible_employee_id: d.responsible_employee_id || undefined,
  status: d.status,
  sector: d.sector,
  description: d.description,
  solution_details: d.solution_details || undefined,
  received_at: d.received_at,
  limit_at: d.limit_at,
  solved_at: d.solved_at || undefined,
  created_at: d.created_at,
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
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [priceList, setPriceList] = useState<PriceItem[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [roles, setRoles] = useState<SystemRole[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])
  const [sacRecords, setSacRecords] = useState<SacRecord[]>([])
  const [alerts] = useState<string[]>([])

  const storeRef = useRef({ user, employees, inventory, roles, consultorios, agenda })
  useEffect(() => {
    storeRef.current = { user, employees, inventory, roles, consultorios, agenda }
  }, [user, employees, inventory, roles, consultorios, agenda])

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
          .from('roles' as any)
          .select('*')
          .order('name', { ascending: true })
          .then((r) => setRoles(handleResponse(r))),
        supabase
          .from('clinica_consultorios' as any)
          .select('*, schedules:consultorio_weekly_schedules(*)')
          .order('created_at', { ascending: true })
          .then((r) => {
            if (!r.error) setConsultorios(r.data || [])
          }),
        supabase
          .from('sac_records' as any)
          .select('*')
          .order('created_at', { ascending: false })
          .then((r) => setSacRecords(handleResponse(r, mSac))),
        supabase
          .from('app_settings' as any)
          .select('*')
          .limit(1)
          .maybeSingle()
          .then(async (r) => {
            if (r.data) {
              setAppSettings(mAppSet(r.data))
            } else if (!r.error) {
              const { data: newData } = await supabase
                .from('app_settings' as any)
                .insert([{}])
                .select()
                .single()
              if (newData) setAppSettings(mAppSet(newData))
            }
          }),
        supabase
          .from('price_list' as any)
          .select('*')
          .then((r) => {
            if (r.data) setPriceList(r.data.map(mPrice))
          }),
        supabase
          .from('role_permissions' as any)
          .select('*')
          .then((r) => {
            if (!r.error) setRolePermissions(r.data || [])
          }),
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
      setAppSettings(null)
      setPriceList([])
      setRolePermissions([])
      setRoles([])
      setConsultorios([])
      setSacRecords([])
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

  const addRole = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await supabase
          .from('roles' as any)
          .insert([{ name }])
          .select()
          .single()
        if (error) throw error
        if (data) {
          setRoles((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
          logAction(`CRIOU CARGO: ${name}`)
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        return { success: false, error }
      }
    },
    [logAction],
  )

  const updateRole = useCallback(
    async (id: string, name: string) => {
      const oldRole = storeRef.current.roles.find((r) => r.id === id)?.name
      try {
        const { error } = await supabase
          .from('roles' as any)
          .update({ name })
          .eq('id', id)
        if (error) throw error

        setRoles((p) =>
          p
            .map((r) => (r.id === id ? { ...r, name } : r))
            .sort((a, b) => a.name.localeCompare(b.name)),
        )
        logAction(`ATUALIZOU CARGO: ${oldRole} PARA ${name}`)

        if (oldRole) {
          setRolePermissions((p) =>
            p.map((rp) => (rp.role === oldRole ? { ...rp, role: name } : rp)),
          )
          setEmployees((p) => p.map((emp) => (emp.role === oldRole ? { ...emp, role: name } : emp)))
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, error }
      }
    },
    [logAction],
  )

  const deleteRole = useCallback(
    async (id: string) => {
      const roleName = storeRef.current.roles.find((r) => r.id === id)?.name
      try {
        const { error } = await supabase
          .from('roles' as any)
          .delete()
          .eq('id', id)
        if (error) throw error

        setRoles((p) => p.filter((r) => r.id !== id))
        logAction(`REMOVEU CARGO: ${roleName}`)

        if (roleName) {
          setRolePermissions((p) => p.filter((rp) => rp.role !== roleName))
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, error }
      }
    },
    [logAction],
  )

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
      if (data.minStock !== undefined) payload.minStock = data.minStock
      if (data.entryDate !== undefined) payload.entryDate = data.entryDate
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
            pix_number: e.pixNumber || null,
            pix_type: e.pixType || null,
            bank_name: e.bankName || null,
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
      if (e.pixNumber !== undefined) payload.pix_number = e.pixNumber || null
      if (e.pixType !== undefined) payload.pix_type = e.pixType || null
      if (e.bankName !== undefined) payload.bankName = e.bankName || null

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
        const { error } = await supabase.functions.invoke('update-user-password', {
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

  const forceResetPassword = useCallback(
    async (userId: string) => {
      try {
        const { error: fnError } = await supabase.functions.invoke('update-user-password', {
          body: { userId, password: '123456' },
        })
        if (fnError) throw fnError

        const { error: dbError } = await supabase
          .from('profiles')
          .update({ must_change_password: true })
          .eq('id', userId)

        if (dbError) throw dbError

        logAction(`FORÇOU RESET DE SENHA PARA O USUÁRIO ID: ${userId}`)
        return { success: true }
      } catch (error: any) {
        console.warn('Erro no reset forçado de senha', error)
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
            requester_id: i.requester_id || null,
            received_at: i.received_at || null,
            completed_at: i.completed_at || null,
            sac_record_id: i.sac_record_id || null,
          } as any,
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
      if (i.requester_id !== undefined) payload.requester_id = i.requester_id
      if (i.received_at !== undefined) payload.received_at = i.received_at
      if (i.completed_at !== undefined) payload.completed_at = i.completed_at
      if (i.sac_record_id !== undefined) payload.sac_record_id = i.sac_record_id

      supabase
        .from('agenda')
        .update(payload)
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            setAgenda((p) => p.map((a) => (a.id === id ? { ...a, ...i } : a)))
            logAction(`ATUALIZOU AGENDA ID: ${id}`)

            if (payload.is_completed) {
              const aItem = storeRef.current.agenda.find((x) => x.id === id)
              const targetId = aItem?.sac_record_id
              if (targetId) {
                setSacRecords((prev) =>
                  prev.map((s) =>
                    s.id === targetId
                      ? { ...s, status: 'RESOLVIDO', solved_at: new Date().toISOString() }
                      : s,
                  ),
                )
              }
            }
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

  const updateAppSettings = useCallback(
    async (data: Partial<AppSettings>) => {
      if (!storeRef.current.user) return { success: false }
      const payload: any = {}
      if (data.global_card_fee !== undefined) payload.global_card_fee = data.global_card_fee
      if (data.global_commission !== undefined) payload.global_commission = data.global_commission
      if (data.global_inadimplency !== undefined)
        payload.global_inadimplency = data.global_inadimplency
      if (data.global_taxes !== undefined) payload.global_taxes = data.global_taxes
      if (data.hourly_cost_fixed_items !== undefined)
        payload.hourly_cost_fixed_items = data.hourly_cost_fixed_items
      if (data.hourly_cost_monthly_hours !== undefined)
        payload.hourly_cost_monthly_hours = data.hourly_cost_monthly_hours
      if (data.predicted_loss_percentage !== undefined)
        payload.predicted_loss_percentage = data.predicted_loss_percentage
      if (data.evaluation_factor_percentage !== undefined)
        payload.evaluation_factor_percentage = data.evaluation_factor_percentage

      try {
        const currentId = appSettings?.id
        if (!currentId) {
          const { data: newData, error: insertErr } = await supabase
            .from('app_settings' as any)
            .insert([payload])
            .select()
            .single()
          if (insertErr) throw insertErr
          if (newData) setAppSettings(mAppSet(newData))
        } else {
          const { error } = await supabase
            .from('app_settings' as any)
            .update(payload)
            .eq('id', currentId)
          if (error) throw error
          setAppSettings((p) => (p ? { ...p, ...data } : null))
        }
        logAction('ATUALIZOU CONFIGURAÇÕES GLOBAIS DE PRECIFICAÇÃO')
        return { success: true }
      } catch (error: any) {
        console.warn('Erro ao atualizar app_settings', error)
        return { success: false, error }
      }
    },
    [appSettings, logAction],
  )

  const addPriceItem = useCallback(
    async (p: Omit<PriceItem, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('price_list' as any)
          .insert([
            {
              work_type: p.work_type,
              category: p.category,
              material: p.material,
              price: p.price,
              sector: p.sector,
              execution_time: p.execution_time,
              cadista_cost: p.cadista_cost,
              material_cost: p.material_cost,
              fixed_cost: p.fixed_cost,
            },
          ])
          .select()
          .single()
        if (error) throw error
        if (data) {
          setPriceList((prev) => [...prev, mPrice(data)])
          logAction(`ADICIONOU ITEM DE PRECIFICAÇÃO: ${p.work_type}`)
          return { success: true, id: data.id }
        }
        return { success: false }
      } catch (error: any) {
        console.warn('Erro ao adicionar price_list', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const updatePriceItem = useCallback(
    async (id: string, p: Partial<PriceItem>) => {
      const payload: any = {}
      if (p.work_type !== undefined) payload.work_type = p.work_type
      if (p.category !== undefined) payload.category = p.category
      if (p.material !== undefined) payload.material = p.material
      if (p.price !== undefined) payload.price = p.price
      if (p.sector !== undefined) payload.sector = p.sector
      if (p.execution_time !== undefined) payload.execution_time = p.execution_time
      if (p.cadista_cost !== undefined) payload.cadista_cost = p.cadista_cost
      if (p.material_cost !== undefined) payload.material_cost = p.material_cost
      if (p.fixed_cost !== undefined) payload.fixed_cost = p.fixed_cost

      try {
        const { error } = await supabase
          .from('price_list' as any)
          .update(payload)
          .eq('id', id)
        if (error) throw error
        setPriceList((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)))
        logAction(`ATUALIZOU ITEM DE PRECIFICAÇÃO ID: ${id}`)
        return { success: true }
      } catch (error: any) {
        console.warn('Erro ao atualizar price_list', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const removePriceItem = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from('price_list' as any)
          .delete()
          .eq('id', id)
        if (error) throw error
        setPriceList((prev) => prev.filter((item) => item.id !== id))
        logAction(`REMOVEU ITEM DE PRECIFICAÇÃO ID: ${id}`)
        return { success: true }
      } catch (error: any) {
        console.warn('Erro ao remover price_list', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const updateRolePermissions = useCallback(
    async (permissions: RolePermission[]) => {
      try {
        const { error } = await supabase
          .from('role_permissions' as any)
          .upsert(permissions, { onConflict: 'role, module' })
        if (error) throw error
        setRolePermissions((prev) => {
          const newState = [...prev]
          permissions.forEach((p) => {
            const idx = newState.findIndex((x) => x.role === p.role && x.module === p.module)
            if (idx >= 0) newState[idx] = { ...newState[idx], ...p }
            else newState.push(p)
          })
          return newState
        })
        logAction(`ATUALIZOU PERMISSÕES DO CARGO: ${permissions[0]?.role || ''}`)
        return { success: true }
      } catch (error: any) {
        console.warn('Erro ao atualizar permissões', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const syncConsultorios = useCallback(
    async (items: Consultorio[], newMonthlyHours: number) => {
      try {
        const currentIds = storeRef.current.consultorios.map((c) => c.id)
        const newIds = items.filter((i) => !i.id.startsWith('new-')).map((i) => i.id)
        const toDelete = currentIds.filter((id) => !newIds.includes(id))

        if (toDelete.length > 0) {
          await supabase
            .from('clinica_consultorios' as any)
            .delete()
            .in('id', toDelete)
        }

        for (let i = 0; i < items.length; i++) {
          const c = items[i]
          let cid = c.id
          if (cid.startsWith('new-')) {
            const { data, error } = await supabase
              .from('clinica_consultorios' as any)
              .insert([{ name: c.name || 'Novo Consultório' }])
              .select()
              .single()
            if (error) throw error
            cid = data.id
            items[i].id = cid
          } else {
            await supabase
              .from('clinica_consultorios' as any)
              .update({ name: c.name || 'Novo Consultório' })
              .eq('id', cid)
          }

          if (c.schedules && c.schedules.length > 0) {
            const schedulesToUpsert = c.schedules.map((s) => ({
              consultorio_id: cid,
              day_of_week: s.day_of_week,
              morning_start: s.morning_start || null,
              morning_end: s.morning_end || null,
              afternoon_start: s.afternoon_start || null,
              afternoon_end: s.afternoon_end || null,
              is_closed: s.is_closed,
            }))
            await supabase
              .from('consultorio_weekly_schedules' as any)
              .upsert(schedulesToUpsert, { onConflict: 'consultorio_id, day_of_week' })
          }
        }

        const { data: finalData } = await supabase
          .from('clinica_consultorios' as any)
          .select('*, schedules:consultorio_weekly_schedules(*)')
          .order('created_at', { ascending: true })
        if (finalData) setConsultorios(finalData)

        await updateAppSettings({ hourly_cost_monthly_hours: newMonthlyHours })
        logAction('ATUALIZOU CONSULTÓRIOS E HORAS MENSAIS')
        return { success: true }
      } catch (error: any) {
        console.warn('Erro ao sincronizar consultórios', error)
        return { success: false, error }
      }
    },
    [updateAppSettings, logAction],
  )

  const addSacRecord = useCallback(
    async (r: Omit<SacRecord, 'id' | 'created_at' | 'received_at' | 'limit_at'>) => {
      const limitHours = r.type === 'RECLAMAÇÃO' ? 24 : 48
      const limit_at = new Date(Date.now() + limitHours * 60 * 60 * 1000).toISOString()

      try {
        const { data, error } = await supabase
          .from('sac_records' as any)
          .insert([
            {
              type: r.type,
              patient_name: r.patient_name,
              receiving_employee_id: r.receiving_employee_id || null,
              responsible_employee_id: r.responsible_employee_id || null,
              status: r.status || 'OPORTUNIDADE DE SOLUÇÃO',
              sector: r.sector,
              description: r.description,
              limit_at: limit_at,
            },
          ])
          .select()
          .single()

        if (error) throw error
        if (data) {
          setSacRecords((prev) => [mSac(data), ...prev])
          logAction(`REGISTROU OPORTUNIDADE (SAC): ${r.type} - ${r.patient_name}`)

          if (r.responsible_employee_id) {
            const today = new Date()
            const localDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

            addAgendaItem({
              title: `SAC: ${r.type} - ${r.patient_name}`,
              date: localDate,
              time: today.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              location: r.sector || 'SISTEMA',
              type: 'SAC',
              assignedTo: r.responsible_employee_id,
              requester_id: r.receiving_employee_id || currentUserId || undefined,
              sac_record_id: data.id,
            })

            const currentUser = storeRef.current.user
            const respEmp = storeRef.current.employees.find(
              (e) => e.id === r.responsible_employee_id,
            )
            if (currentUser && respEmp && respEmp.user_id) {
              const { data: roomId } = await supabase.rpc('get_or_create_individual_room', {
                user1: currentUser.id,
                user2: respEmp.user_id,
              })
              if (roomId) {
                await supabase.from('chat_messages').insert({
                  room_id: roomId,
                  sender_id: currentUser.id,
                  content: `ATENÇÃO: OPORTUNIDADE DE SOLUCAO VIA SAC para você.`,
                })
              }
            }
          }
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        console.warn('Erro ao criar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction, addAgendaItem, currentUserId],
  )

  const updateSacRecord = useCallback(
    async (id: string, r: Partial<SacRecord>) => {
      const payload: any = { ...r }
      if (r.status === 'RESOLVIDO' && !r.solved_at) {
        payload.solved_at = new Date().toISOString()
      }

      // Prevent overriding with undefined on update
      Object.keys(payload).forEach((key) => (payload[key] === undefined ? delete payload[key] : {}))

      try {
        const { error } = await supabase
          .from('sac_records' as any)
          .update(payload)
          .eq('id', id)
        if (error) throw error

        setSacRecords((prev) => prev.map((s) => (s.id === id ? { ...s, ...payload } : s)))
        logAction(`ATUALIZOU OPORTUNIDADE (SAC) ID: ${id}`)

        if (payload.status === 'RESOLVIDO') {
          setAgenda((prev) =>
            prev.map((a) =>
              a.sac_record_id === id
                ? { ...a, is_completed: true, completed_at: new Date().toISOString() }
                : a,
            ),
          )
        }

        return { success: true }
      } catch (err) {
        console.warn('Erro ao atualizar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const deleteSacRecord = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from('sac_records' as any)
          .delete()
          .eq('id', id)
        if (error) throw error

        setSacRecords((prev) => prev.filter((s) => s.id !== id))
        logAction(`REMOVEU OPORTUNIDADE (SAC) ID: ${id}`)
        return { success: true }
      } catch (err) {
        console.warn('Erro ao deletar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction],
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
      appSettings,
      priceList,
      rolePermissions,
      roles,
      consultorios,
      sacRecords,
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
      forceResetPassword,
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
      updateAppSettings,
      addPriceItem,
      updatePriceItem,
      removePriceItem,
      updateRolePermissions,
      addRole,
      updateRole,
      deleteRole,
      syncConsultorios,
      addSacRecord,
      updateSacRecord,
      deleteSacRecord,
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
      appSettings,
      priceList,
      rolePermissions,
      roles,
      consultorios,
      sacRecords,
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
      forceResetPassword,
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
      updateAppSettings,
      addPriceItem,
      updatePriceItem,
      removePriceItem,
      updateRolePermissions,
      addRole,
      updateRole,
      deleteRole,
      syncConsultorios,
      addSacRecord,
      updateSacRecord,
      deleteSacRecord,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
