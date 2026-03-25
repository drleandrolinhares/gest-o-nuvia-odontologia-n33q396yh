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
import { checkAuthError } from '@/lib/supabase/authHelpers'
import { inventoryService } from '@/services/inventoryService'
import { employeeService } from '@/services/employeeService'
import { financeService } from '@/services/financeService'
import { agendaService } from '@/services/agendaService'
import { accessService } from '@/services/accessService'
import { settingsService } from '@/services/settingsService'
import { sacService } from '@/services/sacService'
import { clinicService } from '@/services/clinicService'
import type { Database } from '@/lib/supabase/types'
import type {
  Employee,
  OnboardingTask,
  OnboardingCandidate,
  EmployeeDocument,
  WorkSchedule,
} from '@/types/employee'
import type {
  PurchaseRecord,
  InventoryItem,
  TemporaryOutflow,
  InventoryMovement,
  InventoryOption,
} from '@/types/inventory'
import type { AgendaItem, AgendaSegmentation } from '@/types/agenda'
import type { ManualStep, TroubleshootingFaq, AccessItem } from '@/types/access'
import type {
  FixedExpenseDetail,
  FixedExpense,
  NegotiationSettings,
  AppSettings,
  PriceItem,
} from '@/types/pricing'
import type { SacRecord, SacActionHistory } from '@/types/sac'
import type { Supplier, BonusSetting, SystemRole, RolePermission } from '@/types/settings'
import type { Consultorio, ConsultorioWeeklySchedule, SpecialtyConfig } from '@/types/clinic'
import type { AuditLog, DocumentItem } from '@/types/common'

// DB row type aliases for typed mappers
type DbEmployee = Database['public']['Tables']['employees']['Row']
type DbInventory = Database['public']['Tables']['inventory']['Row']
type DbAgenda = Database['public']['Tables']['agenda']['Row']
type DbAcesso = Database['public']['Tables']['acessos']['Row']
type DbDocument = Database['public']['Tables']['documents']['Row']
type DbInventoryOption = Database['public']['Tables']['inventory_settings']['Row']
type DbAppSettings = Database['public']['Tables']['app_settings']['Row']

// Domain types are in src/types/ — re-exported here for backwards compatibility.
// In new code, import directly from '@/types'.
export type {
  Employee,
  OnboardingTask,
  OnboardingCandidate,
  EmployeeDocument,
  WorkSchedule,
} from '@/types/employee'
export type {
  PurchaseRecord,
  InventoryItem,
  TemporaryOutflow,
  InventoryMovement,
  InventoryOption,
} from '@/types/inventory'
export type { AgendaItem, AgendaSegmentation } from '@/types/agenda'
export type { ManualStep, TroubleshootingFaq, AccessItem } from '@/types/access'
export type {
  FixedExpenseDetail,
  FixedExpense,
  NegotiationSettings,
  AppSettings,
  PriceItem,
} from '@/types/pricing'
export type { SacRecord, SacActionHistory } from '@/types/sac'
export type { Supplier, BonusSetting, SystemRole, RolePermission } from '@/types/settings'
export type { Consultorio, ConsultorioWeeklySchedule, SpecialtyConfig } from '@/types/clinic'
export type { AuditLog, DocumentItem } from '@/types/common'

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
  specialtyConfigs: SpecialtyConfig[]
  agendaSegmentation: AgendaSegmentation[]
  addDepartment: (n: string) => void
  removeDepartment: (n: string) => void
  addPackageType: (n: string) => void
  removePackageType: (n: string) => void
  addSpecialty: (n: string) => Promise<{ success: boolean; error?: any }>
  removeSpecialty: (n: string) => Promise<{ success: boolean; error?: any }>
  addAgendaType: (n: string) => void
  removeAgendaType: (n: string) => void
  toggleTask: (c: string, t: string) => void
  addInventoryItem: (i: Omit<InventoryItem, 'id'> & { initialPackages?: number }) => void
  updateInventoryQuantity: (id: string, q: number) => void
  updateInventoryItemDetails: (
    id: string,
    data: Partial<InventoryItem>,
  ) => Promise<{ success: boolean; error?: any }>
  deleteInventoryItem: (id: string) => Promise<{ success: boolean; error?: any }>
  addPurchaseHistory: (i: string, r: Omit<PurchaseRecord, 'id'>) => void
  removePurchaseHistory: (
    itemId: string,
    purchaseId: string,
  ) => Promise<{ success: boolean; error?: any }>
  updatePurchaseHistory: (
    itemId: string,
    purchaseId: string,
    data: Partial<PurchaseRecord>,
  ) => Promise<{ success: boolean; error?: any }>
  addInventoryOption: (category: string, value: string, label?: string) => void
  updateInventoryOption: (id: string, label: string) => Promise<{ success: boolean; error?: any }>
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
  addSpecialtyConfig: (
    name: string,
    color_hex: string,
  ) => Promise<{ success: boolean; error?: any }>
  deleteSpecialtyConfig: (id: string) => Promise<{ success: boolean; error?: any }>
  upsertAgendaSegmentation: (
    data: Omit<AgendaSegmentation, 'id'>,
  ) => Promise<{ success: boolean; error?: any }>
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
const mockAgendaTypes = [
  'CONSULTA',
  'REUNIÃO',
  'VIAGEM',
  'CURSO',
  'AUSÊNCIA',
  'LEMBRETE',
  'AUDITORIA',
  'COMISSÃO',
  'BÔNUS',
  'FÉRIAS',
  'PEDIDO',
  'SAC',
  'COMPROMISSO DENTISTA',
]

const mEmp = (d: DbEmployee): Employee => ({
  id: d.id,
  user_id: d.user_id,
  name: d.name,
  username: d.username,
  role: d.role,
  department: d.department,
  status: d.status as any,
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
  pix_number: d.pix_number || d.pix_key || '',
  pix_type: d.pix_type || '',
  bank_name: d.bank_name || '',
  noSystemAccess: d.no_system_access || false,
})
const mInv = (d: DbInventory): InventoryItem => ({
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
  purchaseHistory: d.purchase_history as any,
  specialtyDetails: d.specialty_details as any,
  nfeNumber: d.nfe_number,
  storageRoom: d.storage_room,
  cabinetNumber: d.cabinet_number,
  criticalObservations: d.critical_observations,
  consumptionMode: d.consumption_mode,
  consumptionReference: d.consumption_reference,
})
const mAg = (d: DbAgenda): AgendaItem => ({
  id: d.id,
  title: d.title,
  date: d.date,
  end_date: d.end_date || d.date,
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
  periodicity: d.periodicity,
})
const mAcc = (d: DbAcesso): AccessItem => ({
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
  manual_steps: d.manual_steps as any,
  troubleshooting: d.troubleshooting as any,
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
const mDoc = (d: DbDocument): DocumentItem => ({ id: d.id, name: d.name, date: d.date })
const mOpt = (d: DbInventoryOption): InventoryOption => ({
  id: d.id,
  category: d.category,
  label: d.label,
  value: d.value,
})

const defaultNegotiationSettings: NegotiationSettings = {
  ranges: [
    { min: 1000, max: 2999.99, maxInstallments: 4 },
    { min: 3000, max: 4999.99, maxInstallments: 8 },
    { min: 5000, max: 7999.99, maxInstallments: 12 },
    { min: 8000, max: 11999.99, maxInstallments: 20 },
    { min: 12000, max: 9999999, maxInstallments: 24 },
  ],
  defaultEntryPercentage: 30,
  discounts: {
    level1: 15,
    level2: 5,
    level3: 3,
    level4: 0,
  },
}

const mAppSet = (d: DbAppSettings): AppSettings => ({
  id: d.id,
  global_card_fee: Number(d.global_card_fee) || 0,
  global_commission: Number(d.global_commission) || 0,
  global_inadimplency: Number(d.global_inadimplency) || 0,
  global_taxes: Number(d.global_taxes) || 0,
  predicted_loss_percentage: Number(d.predicted_loss_percentage ?? 20),
  evaluation_factor_percentage: Number(d.evaluation_factor_percentage ?? 15),
  hourly_cost_fixed_items: Array.isArray(d.hourly_cost_fixed_items)
    ? (d.hourly_cost_fixed_items as Record<string, unknown>[]).map((i) => ({
        id: (i.id as string) || crypto.randomUUID(),
        label: (i.label as string) || (i.name as string) || '',
        value: Number(i.value) || 0,
        details: Array.isArray(i.details)
          ? (i.details as Record<string, unknown>[]).map((det) => ({
              id: (det.id as string) || crypto.randomUUID(),
              description: (det.description as string) || '',
              amount: Number(det.amount) || 0,
              is_annual: Boolean(det.is_annual) || false,
            }))
          : [],
      }))
    : [],
  hourly_cost_monthly_hours: Number(d.hourly_cost_monthly_hours) || 160,
  negotiation_settings: d.negotiation_settings
    ? {
        ...defaultNegotiationSettings,
        ...(d.negotiation_settings as Record<string, any>),
        discounts:
          (d.negotiation_settings as Record<string, any>)?.discounts ||
          defaultNegotiationSettings.discounts,
      }
    : defaultNegotiationSettings,
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
  action_history: Array.isArray(d.action_history) ? d.action_history : [],
})

const mSpecConfig = (d: any): SpecialtyConfig => ({
  id: d.id,
  name: d.name,
  color_hex: d.color_hex,
  created_at: d.created_at,
})

const mSeg = (d: any): AgendaSegmentation => ({
  id: d.id,
  consultorio_id: d.consultorio_id,
  day_of_week: d.day_of_week,
  shift: d.shift as any,
  specialty_id: d.specialty_id || undefined,
  dentist_id: d.dentist_id || undefined,
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
  const [specialtyConfigs, setSpecialtyConfigs] = useState<SpecialtyConfig[]>([])
  const [agendaSegmentation, setAgendaSegmentation] = useState<AgendaSegmentation[]>([])
  const [alerts] = useState<string[]>([])

  const storeRef = useRef({
    user,
    employees,
    inventory,
    roles,
    rolePermissions,
    consultorios,
    agenda,
    sacRecords,
    inventoryOptions,
    specialtyConfigs,
    agendaSegmentation,
    employeeDocuments,
  })
  useEffect(() => {
    storeRef.current = {
      user,
      employees,
      inventory,
      roles,
      rolePermissions,
      consultorios,
      agenda,
      sacRecords,
      inventoryOptions,
      specialtyConfigs,
      agendaSegmentation,
      employeeDocuments,
    }
  }, [
    user,
    employees,
    inventory,
    roles,
    rolePermissions,
    consultorios,
    agenda,
    sacRecords,
    inventoryOptions,
    specialtyConfigs,
    agendaSegmentation,
  ])

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setIsDataLoading(true)
      setFetchError(null)

      const handleResponse = <T = any>(r: any, mapper?: (d: any) => T): T[] => {
        if (r.error) throw r.error
        const data = Array.isArray(r.data) ? r.data : []
        return mapper ? data.map(mapper) : (data as unknown as T[])
      }

      Promise.all([
        employeeService.fetchAll().then((r) => setEmployees(handleResponse(r, mEmp))),
        inventoryService.fetchAll().then((r) => setInventory(handleResponse(r, mInv))),
        inventoryService.fetchOptions().then((r) => setInventoryOptions(handleResponse(r, mOpt))),
        inventoryService.fetchPendingOutflows().then((r) => {
          if (!r.error) setTemporaryOutflows((r.data || []) as any)
        }),
        agendaService.fetchAll().then((r) => setAgenda(handleResponse(r, mAg))),
        accessService.fetchAll().then((r) => setAcessos(handleResponse(r, mAcc))),
        settingsService.fetchSuppliers().then((r) => setSuppliers(handleResponse(r, mSup))),
        settingsService.fetchOnboarding().then((r) => setOnboarding(handleResponse(r, mOnb))),
        settingsService.fetchDocuments().then((r) => setDocuments(handleResponse(r, mDoc))),
        settingsService.fetchBonusTypes().then((r) => setBonusTypes(handleResponse(r))),
        employeeService.fetchDocuments().then((r) => setEmployeeDocuments(handleResponse(r))),
        settingsService.fetchRoles().then((r) => setRoles(handleResponse(r))),
        clinicService.fetchConsultorios().then((r) => {
          if (!r.error) setConsultorios((r.data || []) as any)
        }),
        sacService.fetchAll().then((r) => setSacRecords(handleResponse(r, mSac))),
        financeService.fetchSettings().then(async (r) => {
          if (r.data) {
            setAppSettings(mAppSet(r.data as any))
          } else if (!r.error) {
            const { data: newData } = await financeService.createSettings({})
            if (newData) setAppSettings(mAppSet(newData as any))
          }
        }),
        financeService.fetchPriceList().then((r) => {
          if (r.data) setPriceList(r.data.map(mPrice))
        }),
        settingsService.fetchRolePermissions().then((r) => {
          if (!r.error) setRolePermissions((r.data || []) as any)
        }),
        clinicService.fetchSpecialtyConfigs().then((r) => setSpecialtyConfigs(handleResponse(r, mSpecConfig))),
        agendaService.fetchSegmentation().then((r) => setAgendaSegmentation(handleResponse(r, mSeg))),
      ])
        .catch((err) => {
          if (!checkAuthError(err)) {
            console.error('Initial data fetch error:', err)
            setFetchError(
              'Falha ao sincronizar dados do sistema. Verifique sua conexão e tente novamente.',
            )
          }
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
      setSpecialtyConfigs([])
      setAgendaSegmentation([])
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
      const me = storeRef.current.employees.find((e) => e.user_id === storeRef.current.user?.id)
      if (!me || me.noSystemAccess) return false
      if (isMaster) return true
      if (isAdmin) return true
      const perm = storeRef.current.rolePermissions.find(
        (p) => p.role === me.role && p.module.toUpperCase() === module.toUpperCase(),
      )
      if (!perm) return false
      if (action === 'view') return perm.can_view
      if (action === 'create') return perm.can_create
      if (action === 'edit') return perm.can_edit
      if (action === 'delete') return perm.can_delete
      return false
    },
    [isMaster, isAdmin],
  )

  const logAction = useCallback((action: string) => {
    if (!storeRef.current.user) return
    const u = storeRef.current.user
    const n = storeRef.current.employees.find((e) => e.user_id === u.id)?.name || 'SISTEMA'
    const runLog = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert([{ user_id: u.id, action: action.toUpperCase() }])
          .select()
          .single()
        if (error) checkAuthError(error)
        if (data) {
          setAuditLogs((p) => [
            { id: data.id, userName: n, action: data.action, timestamp: data.created_at },
            ...p,
          ])
        }
      } catch (err) {
        console.warn('Falha ao registrar log de auditoria', err)
      }
    }
    runLog()
  }, [])

  const addRole = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await settingsService.addRole(name)
        if (error) throw error
        if (data) {
          setRoles((prev) => [...prev, data as any].sort((a, b) => a.name.localeCompare(b.name)))
          logAction(`CRIOU CARGO: ${name}`)
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        checkAuthError(error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const updateRole = useCallback(
    async (id: string, name: string) => {
      const oldRole = storeRef.current.roles.find((r) => r.id === id)?.name
      try {
        const { error } = await settingsService.updateRole(id, name)
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
        checkAuthError(error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const deleteRole = useCallback(
    async (id: string) => {
      const roleName = storeRef.current.roles.find((r) => r.id === id)?.name
      try {
        const { error } = await settingsService.deleteRole(id)
        if (error) throw error
        setRoles((p) => p.filter((r) => r.id !== id))
        logAction(`REMOVEU CARGO: ${roleName || id}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
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

  const specialties = useMemo(() => {
    return inventoryOptions
      .filter(
        (o) =>
          o.category.toLowerCase() === 'specialty' || o.category.toLowerCase() === 'especialidade',
      )
      .map((o) => o.label || o.value)
      .sort()
  }, [inventoryOptions])

  const addSpecialty = useCallback(
    async (n: string) => {
      const label = n.trim().toUpperCase()
      const value = label
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]/g, '')
      const { data, error } = await supabase
        .from('inventory_settings' as any)
        .insert([{ category: 'specialty', label, value }])
        .select()
        .single()

      if (error) {
        checkAuthError(error)
        return { success: false, error }
      }
      if (data) {
        setInventoryOptions((p) => [...p, mOpt(data)])
        logAction(`CRIOU ESPECIALIDADE: ${label}`)
        return { success: true }
      }
      return { success: false }
    },
    [logAction],
  )

  const removeSpecialty = useCallback(
    async (n: string) => {
      const opt = storeRef.current.inventoryOptions.find(
        (o) =>
          (o.category.toLowerCase() === 'specialty' ||
            o.category.toLowerCase() === 'especialidade') &&
          (o.label === n || o.value === n),
      )
      if (!opt) return { success: false, error: new Error('Não encontrado') }

      const { error } = await supabase
        .from('inventory_settings' as any)
        .delete()
        .eq('id', opt.id)
      if (error) {
        checkAuthError(error)
        return { success: false, error }
      }
      setInventoryOptions((p) => p.filter((o) => o.id !== opt.id))
      logAction(`REMOVEU ESPECIALIDADE: ${n}`)
      return { success: true }
    },
    [logAction],
  )

  const addAgendaType = useCallback(
    (n: string) => {
      if (!agendaTypes.includes(n.toUpperCase())) {
        setAgendaTypes((p) => [...p, n.toUpperCase()])
        logAction(`CRIOU TIPO DE COMPROMISSO: ${n.toUpperCase()}`)
      }
    },
    [logAction, agendaTypes],
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
    async (i: Omit<InventoryItem, 'id'> & { initialPackages?: number }) => {
      try {
        const { data, error } = await inventoryService.create(i)
        if (error) checkAuthError(error)
        if (data) {
          setInventory((p) => [...p, mInv(data)])
          logAction(`CRIOU PRODUTO: ${i.name}`)
        }
      } catch (err) {
        console.warn('Erro ao adicionar produto no inventário', err)
      }
    },
    [logAction],
  )

  const updateInventoryQuantity = useCallback(
    (id: string, q: number) => {
      inventoryService
        .updateQuantity(id, q)
        .then(({ error }) => {
          if (error) checkAuthError(error)
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
      if (data.consumptionMode !== undefined)
        payload.consumption_mode = data.consumptionMode || null
      if (data.consumptionReference !== undefined)
        payload.consumption_reference = data.consumptionReference || null

      try {
        const { error } = await inventoryService.update(id, payload)
        if (error) throw error

        setInventory((p) => p.map((i) => (i.id === id ? { ...i, ...data } : i)))
        logAction(`ATUALIZOU DADOS DO PRODUTO ID: ${id}`)
        return { success: true }
      } catch (err: any) {
        checkAuthError(err)
        console.warn('Erro ao atualizar dados do produto no inventário', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const deleteInventoryItem = useCallback(
    async (id: string) => {
      try {
        const { error } = await inventoryService.delete(id)
        if (error) throw error
        setInventory((p) => p.filter((i) => i.id !== id))
        logAction(`REMOVEU PRODUTO ID: ${id}`)
        return { success: true }
      } catch (err: any) {
        checkAuthError(err)
        console.warn('Erro ao deletar produto no inventário', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const addPurchaseHistory = useCallback(
    async (itemId: string, r: Omit<PurchaseRecord, 'id'>) => {
      const item = storeRef.current.inventory.find((i) => i.id === itemId)
      if (!item) return
      const nh = [{ ...r, id: crypto.randomUUID() }, ...(item.purchaseHistory || [])]
      const addedUnits = r.quantity * (item.itemsPerBox || 1)
      const nq = item.quantity + addedUnits

      try {
        const { error } = await inventoryService.update(itemId, {
          purchase_history: nh as any,
          quantity: nq,
          package_cost: r.price,
          expiration_date: r.expirationDate || item.expirationDate,
          ...(r.nfeNumber ? { nfe_number: r.nfeNumber } : {}),
        })
        if (error) checkAuthError(error)
        else {
          logAction(`NOVA COMPRA PARA PRODUTO ID: ${itemId}`)
          setInventory((prev) =>
            prev.map((i) =>
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
            ),
          )
        }
      } catch (err) {
        console.warn('Erro ao adicionar histórico de compra', err)
      }
    },
    [logAction],
  )

  const removePurchaseHistory = useCallback(
    async (itemId: string, purchaseId: string) => {
      const item = storeRef.current.inventory.find((i) => i.id === itemId)
      if (!item || !item.purchaseHistory) return { success: false }
      const newHistory = item.purchaseHistory.filter((ph) => ph.id !== purchaseId)
      try {
        const { error } = await inventoryService.addPurchaseHistory(itemId, newHistory)
        if (error) throw error
        setInventory((p) =>
          p.map((i) => (i.id === itemId ? { ...i, purchaseHistory: newHistory } : i)),
        )
        logAction(`REMOVEU HISTÓRICO DE COMPRA DO ITEM ID: ${itemId}`)
        return { success: true }
      } catch (err) {
        checkAuthError(err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const updatePurchaseHistory = useCallback(
    async (itemId: string, purchaseId: string, data: Partial<PurchaseRecord>) => {
      const item = storeRef.current.inventory.find((i) => i.id === itemId)
      if (!item || !item.purchaseHistory) return { success: false }
      const newHistory = item.purchaseHistory.map((ph) =>
        ph.id === purchaseId ? { ...ph, ...data } : ph,
      )
      try {
        const { error } = await inventoryService.addPurchaseHistory(itemId, newHistory)
        if (error) throw error
        setInventory((p) =>
          p.map((i) => (i.id === itemId ? { ...i, purchaseHistory: newHistory } : i)),
        )
        logAction(`ATUALIZOU HISTÓRICO DE COMPRA DO ITEM ID: ${itemId}`)
        return { success: true }
      } catch (err) {
        checkAuthError(err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const addInventoryOption = useCallback(
    async (category: string, value: string, label?: string) => {
      try {
        const { data, error } = await inventoryService.addOption(category, value, label)
        if (error) checkAuthError(error)
        if (data) {
          setInventoryOptions((p) => [...p, mOpt(data)])
          logAction(`CRIOU OPÇÃO DE ESTOQUE: ${category} - ${value}`)
        }
      } catch (err) {
        console.warn('Erro ao criar opção', err)
      }
    },
    [logAction],
  )

  const updateInventoryOption = useCallback(async (id: string, label: string) => {
    try {
      const { error } = await inventoryService.updateOption(id, label)
      if (error) throw error
      setInventoryOptions((p) => p.map((o) => (o.id === id ? { ...o, label } : o)))
      return { success: true }
    } catch (err: any) {
      checkAuthError(err)
      return { success: false, error: err }
    }
  }, [])

  const removeInventoryOption = useCallback(
    async (id: string) => {
      try {
        const { error } = await inventoryService.removeOption(id)
        if (error) checkAuthError(error)
        else {
          setInventoryOptions((p) => p.filter((o) => o.id !== id))
          logAction(`REMOVEU OPÇÃO DE ESTOQUE ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao remover opção', err)
      }
    },
    [logAction],
  )

  const registerDefinitiveOutflow = useCallback(
    async (inventory_id: string, quantity: number, recipient: string) => {
      const item = storeRef.current.inventory.find((i) => i.id === inventory_id)
      if (!item) return { success: false }
      const newQty = Math.max(0, item.quantity - quantity)

      const { error: invErr } = await inventoryService.updateQuantity(inventory_id, newQty)

      if (invErr) {
        checkAuthError(invErr)
        return { success: false, error: invErr }
      }

      setInventory((p) => p.map((i) => (i.id === inventory_id ? { ...i, quantity: newQty } : i)))

      const user = storeRef.current.user
      if (user) {
        await inventoryService.addMovement(inventory_id, user.id, 'SAÍDA', quantity, recipient)
      }

      logAction(`BAIXA DEFINITIVA: ${quantity} UN DO PRODUTO ID: ${inventory_id}`)
      return { success: true }
    },
    [logAction],
  )

  const addTemporaryOutflow = useCallback(
    async (inventory_id: string, employee_id: string, quantity: number, destination: string) => {
      const { data, error } = await inventoryService.addTemporaryOutflow(
        inventory_id,
        employee_id,
        quantity,
        destination,
      )

      if (error) {
        checkAuthError(error)
        return { success: false, error }
      }
      if (data) {
        setTemporaryOutflows((p) => [data as any, ...p])

        const user = storeRef.current.user
        const emp = storeRef.current.employees.find((e) => e.id === employee_id)
        const recipientStr = `Colab: ${emp?.name || 'Desconhecido'} - ${destination}`

        if (user) {
          await inventoryService.addMovement(
            inventory_id,
            user.id,
            'BAIXA TEMPORÁRIA',
            quantity,
            recipientStr,
          )
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
      try {
        const { data, error } = await inventoryService.finalizeTemporaryOutflow(id)
        if (error) {
          checkAuthError(error)
          return { success: false, error }
        }

        if (data) {
          setTemporaryOutflows((p) => p.filter((t) => t.id !== id))

          if (usedQty > 0) {
            const invItem = storeRef.current.inventory?.find((i: any) => i.id === data.inventory_id)
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
            await inventoryService.addMovements(movements)
          }

          logAction(
            `RECONCILIADA BAIXA TEMPORÁRIA ID: ${id} (USOU: ${usedQty}, DEVOLVEU: ${returnedQty})`,
          )
          return { success: true }
        }
        return { success: false }
      } catch (err: any) {
        checkAuthError(err)
        console.warn('Erro ao finalizar baixa temporária', err)
        return { success: false, error: err }
      }
    },
    [logAction, updateInventoryQuantity],
  )

  const getInventoryMovements = useCallback(async (inventory_id: string) => {
    try {
      const { data, error } = await inventoryService.fetchMovements(inventory_id)
      if (error) throw error
      return data || []
    } catch (err) {
      checkAuthError(err)
      console.error('Error fetching inventory movements:', err)
      return []
    }
  }, [])

  const addEmployee = useCallback(
    async (e: Omit<Employee, 'id'> & { password?: string }) => {
      let userId = undefined

      if (e.password && e.email) {
        const formattedEmail = e.email.trim().toLowerCase()
        const res = await employeeService.createAuthUser(formattedEmail, e.password, e.name)

        if (res.error) {
          checkAuthError(res.error)
          let errMsg =
            'Falha ao criar usuário na autenticação. Verifique se o e-mail já está em uso ou se a senha é válida.'
          try {
            if (res.error.context && typeof res.error.context.json === 'function') {
              const ctx = await res.error.context.json()
              if (ctx.error) errMsg = ctx.error
            }
          } catch (err) {
            console.warn('JSON parsing error:', err)
          }
          return { success: false, error: new Error(errMsg) }
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

      const { data: empData, error: empError } = await employeeService.create({
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
        pix_number: e.pix_number || null,
        pix_type: e.pix_type || null,
        bank_name: e.bank_name || null,
        user_id: userId || null,
        no_system_access: e.noSystemAccess || false,
      } as any)

      if (empError) {
        checkAuthError(empError)
        // Rollback created auth user if employee insertion fails
        if (userId) {
          try {
            await employeeService.deleteAuthUser(userId)
          } catch (rollbackErr) {
            console.warn('Failed to rollback orphaned user during failed creation', rollbackErr)
          }
        }
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
      const res = await employeeService.createAuthUser(formattedEmail, password, name)

      if (res.error) {
        checkAuthError(res.error)
        let errMsg = 'Falha ao criar usuário na autenticação. Verifique se o e-mail já existe.'
        try {
          if (res.error.context && typeof res.error.context.json === 'function') {
            const ctx = await res.error.context.json()
            if (ctx.error) errMsg = ctx.error
          }
        } catch (err) {
          console.warn('JSON parsing error:', err)
        }
        return { success: false, error: new Error(errMsg) }
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

      const { error: updateError } = await employeeService.update(id, {
        user_id: userId,
        email: formattedEmail,
      } as any)

      if (updateError) {
        checkAuthError(updateError)
        // Rollback created auth user if employee update fails
        try {
          await employeeService.deleteAuthUser(userId)
        } catch (rollbackErr) {
          console.warn('Failed to rollback orphaned user during failed generation', rollbackErr)
        }
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
      if (e.pix_number !== undefined) payload.pix_number = e.pix_number || null
      if (e.pix_type !== undefined) payload.pix_type = e.pix_type || null
      if (e.bank_name !== undefined) payload.bank_name = e.bank_name || null
      if (e.noSystemAccess !== undefined) payload.no_system_access = e.noSystemAccess

      if (e.vacationDaysTaken !== undefined) payload.vacation_days_taken = e.vacationDaysTaken
      if (e.vacationDaysTotal !== undefined) payload.vacation_days_total = e.vacationDaysTotal
      if (e.vacationDueDate !== undefined) payload.vacation_due_date = e.vacationDueDate || null

      try {
        const { error } = await employeeService.update(id, payload)
        if (!error) {
          setEmployees((p) => p.map((emp) => (emp.id === id ? { ...emp, ...e } : emp)))
          logAction(`ATUALIZOU DADOS DO COLABORADOR ID: ${id}`)
          return { success: true }
        }
        checkAuthError(error)
        return { success: false, error }
      } catch (err: any) {
        checkAuthError(err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const updateEmployeePassword = useCallback(
    async (userId: string, newPass: string) => {
      try {
        const { error } = await employeeService.updatePassword(userId, newPass)
        if (error) throw error
        logAction(`ALTEROU SENHA DE ACESSO DO USUÁRIO ID: ${userId}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const forceResetPassword = useCallback(
    async (userId: string) => {
      try {
        const { error: fnError } = await employeeService.updatePassword(userId, '123456')
        if (fnError) throw fnError

        const { error: dbError } = await employeeService.requirePasswordChange(userId)

        if (dbError) throw dbError

        logAction(`FORÇOU RESET DE SENHA PARA O USUÁRIO ID: ${userId}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        console.warn('Erro no reset forçado de senha', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        const { error } = await employeeService.delete(id)
        if (error) {
          checkAuthError(error)
          return { success: false, error }
        }
        setEmployees((p) => p.filter((e) => e.id !== id))
        logAction(`REMOVEU COLABORADOR: ${id}`)
        return { success: true }
      } catch (err: any) {
        console.warn('Erro ao remover colaborador', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )
  const updateEmployeeStatus = useCallback(
    async (id: string, s: string) => {
      try {
        const { error } = await employeeService.updateStatus(id, s)
        if (error) {
          checkAuthError(error)
          return { success: false, error }
        }
        setEmployees((p) => p.map((e) => (e.id === id ? { ...e, status: s as any } : e)))
        logAction(`ALTEROU STATUS COLAB ID: ${id}`)
        return { success: true }
      } catch (err: any) {
        console.warn('Erro ao atualizar status do colaborador', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const addDocument = useCallback(
    async (n: string) => {
      try {
        const { data, error } = await settingsService.addDocument(n)
        if (error) checkAuthError(error)
        if (data) {
          setDocuments((p) => [...p, mDoc(data)])
          logAction(`ADICIONOU DOC: ${n}`)
        }
      } catch (err) {
        console.warn('Erro ao adicionar documento', err)
      }
    },
    [logAction],
  )
  const removeDocument = useCallback(
    async (id: string) => {
      try {
        const { error } = await settingsService.removeDocument(id)
        if (error) checkAuthError(error)
        else {
          setDocuments((p) => p.filter((d) => d.id !== id))
          logAction(`REMOVEU DOC ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao remover documento', err)
      }
    },
    [logAction],
  )

  const addAgendaItem = useCallback(
    (i: Omit<AgendaItem, 'id'>) => {
      agendaService
        .create({
          ...i,
          end_date: i.end_date || i.date,
          is_completed: i.is_completed || false,
          requester_id: i.requester_id || null,
          received_at: i.received_at || null,
          completed_at: i.completed_at || null,
          sac_record_id: i.sac_record_id || null,
          periodicity: i.periodicity || null,
        } as any)
        .then(({ data, error }) => {
          if (error) checkAuthError(error)
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
      const payload: any = { ...i }
      if (payload.is_completed !== undefined) payload.is_completed = i.is_completed

      agendaService
        .update(id, i)
        .then(({ error }) => {
          if (error) checkAuthError(error)
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
      agendaService
        .delete(id)
        .then(({ error }) => {
          if (error) checkAuthError(error)
          else {
            setAgenda((p) => p.filter((i) => i.id !== id))
            logAction(`REMOVEU AGENDA ID: ${id}`)
          }
        })
        .catch((err) => console.warn('Erro ao remover item na agenda', err))
    },
    [logAction],
  )

  const addAccess = useCallback(
    async (i: Omit<AccessItem, 'id'>) => {
      try {
        const { data, error } = await accessService.create({
          ...i,
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
        })
        if (error) checkAuthError(error)
        if (data) {
          setAcessos((p) => [...p, mAcc(data)])
          logAction(`CRIOU ACESSO: ${i.platform}`)
        }
      } catch (err) {
        console.warn('Erro ao criar acesso', err)
      }
    },
    [logAction],
  )
  const updateAccess = useCallback(
    async (id: string, i: Partial<AccessItem>) => {
      try {
        const { error } = await accessService.update(id, i)
        if (error) checkAuthError(error)
        else {
          setAcessos((p) => p.map((a) => (a.id === id ? { ...a, ...i } : a)))
          logAction(`ATUALIZOU ACESSO ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao atualizar acesso', err)
      }
    },
    [logAction],
  )
  const removeAccess = useCallback(
    async (id: string) => {
      try {
        const { error } = await accessService.delete(id)
        if (error) checkAuthError(error)
        else {
          setAcessos((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU ACESSO ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao remover acesso', err)
      }
    },
    [logAction],
  )

  const addSupplier = useCallback(
    async (i: Omit<Supplier, 'id'>) => {
      try {
        const { data, error } = await settingsService.addSupplier({
          name: i.name,
          contact: i.contact,
          phone: i.phone,
          email: i.email,
          cnpj: i.cnpj,
          website: i.website,
          hasSpecialNegotiation: i.hasSpecialNegotiation,
          negotiationNotes: i.negotiationNotes,
        })
        if (error) checkAuthError(error)
        if (data) {
          setSuppliers((p) => [...p, mSup(data)])
          logAction(`CRIOU FORNECEDOR: ${i.name}`)
        }
      } catch (err) {
        console.warn('Erro ao criar fornecedor', err)
      }
    },
    [logAction],
  )
  const updateSupplier = useCallback(
    async (id: string, i: Partial<Supplier>) => {
      const payload: any = {
        name: i.name,
        contact: i.contact,
        phone: i.phone,
        email: i.email,
        cnpj: i.cnpj,
        website: i.website,
      }
      if (i.hasSpecialNegotiation !== undefined)
        payload.has_special_negotiation = i.hasSpecialNegotiation
      if (i.negotiationNotes !== undefined) payload.negotiation_notes = i.negotiationNotes

      try {
        const { error } = await settingsService.updateSupplier(id, payload)
        if (error) checkAuthError(error)
        else {
          setSuppliers((p) => p.map((s) => (s.id === id ? { ...s, ...i } : s)))
          logAction(`ATUALIZOU FORNECEDOR ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao atualizar fornecedor', err)
      }
    },
    [logAction],
  )
  const removeSupplier = useCallback(
    async (id: string) => {
      try {
        const { error } = await settingsService.deleteSupplier(id)
        if (error) checkAuthError(error)
        else {
          setSuppliers((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU FORNECEDOR ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao remover fornecedor', err)
      }
    },
    [logAction],
  )

  const addBonusType = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await settingsService.addBonusType(name)
        if (error) checkAuthError(error)
        if (data) setBonusTypes((p) => [...p, data])
        logAction(`ADICIONOU TIPO DE BONIFICAÇÃO: ${name}`)
      } catch (err) {
        console.warn('Erro ao adicionar tipo de bonificação', err)
      }
    },
    [logAction],
  )

  const removeBonusType = useCallback(
    async (id: string) => {
      try {
        const { error } = await settingsService.removeBonusType(id)
        if (error) checkAuthError(error)
        else {
          setBonusTypes((p) => p.filter((b) => b.id !== id))
          logAction(`REMOVEU TIPO DE BONIFICAÇÃO ID: ${id}`)
        }
      } catch (err) {
        console.warn('Erro ao remover tipo de bonificação', err)
      }
    },
    [logAction],
  )

  const addEmployeeDocument = useCallback(
    async (employeeId: string, fileName: string, file: File) => {
      try {
        const { data, error } = await employeeService.uploadDocument(employeeId, fileName, file)
        if (error) throw error
        if (data) setEmployeeDocuments((p) => [...p, data])
        logAction(`ANEXOU DOCUMENTO: ${fileName}`)
      } catch (err) {
        checkAuthError(err)
        console.error('Erro ao salvar documento:', err)
        throw err
      }
    },
    [logAction],
  )

  const removeEmployeeDocument = useCallback(
    async (id: string) => {
      try {
        const doc = storeRef.current.employeeDocuments.find((d) => d.id === id)
        const filePath = doc?.file_path || ''
        const { error } = await employeeService.deleteDocument(id, filePath)
        if (error) throw error
        setEmployeeDocuments((p) => p.filter((d) => d.id !== id))
        logAction(`REMOVEU DOCUMENTO ID: ${id}`)
      } catch (err) {
        checkAuthError(err)
        console.warn('Erro ao remover documento', err)
      }
    },
    [logAction],
  )

  const fetchWorkSchedules = useCallback(async (start: string, end: string) => {
    try {
      const { data, error } = await employeeService.fetchWorkSchedules(start, end)
      if (error) throw error
      if (data) {
        setWorkSchedules((prev) => {
          const others = prev.filter((p) => p.work_date < start || p.work_date > end)
          return [...others, ...data]
        })
      }
    } catch (err) {
      checkAuthError(err)
      console.error('Error fetching work schedules:', err)
    }
  }, [])

  const upsertWorkSchedule = useCallback(
    async (s: Partial<WorkSchedule> & { employee_id: string; work_date: string }) => {
      try {
        const { data, error } = await employeeService.upsertWorkSchedule({
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
        })

        if (error) throw error
        if (data) {
          const res = data as any
          setWorkSchedules((prev) => {
            const exists = prev.find(
              (p) =>
                p.id === res.id ||
                (p.employee_id === res.employee_id && p.work_date === res.work_date),
            )
            if (exists) return prev.map((p) => (p.id === exists.id ? res : p))
            return [...prev, res]
          })
        }
      } catch (err) {
        checkAuthError(err)
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
      if (data.negotiation_settings !== undefined)
        payload.negotiation_settings = data.negotiation_settings

      try {
        const currentId = appSettings?.id
        if (!currentId) {
          const { data: newData, error: insertErr } = await financeService.createSettings(payload)
          if (insertErr) throw insertErr
          if (newData) setAppSettings(mAppSet(newData))
        } else {
          const { error } = await financeService.updateSettings(currentId, payload)
          if (error) throw error
          setAppSettings((p: any) => (p ? { ...p, ...data } : null))
        }
        logAction('ATUALIZOU CONFIGURAÇÕES GLOBAIS DO SISTEMA')
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        console.warn('Erro ao atualizar app_settings', error)
        return { success: false, error }
      }
    },
    [appSettings, logAction],
  )

  const addPriceItem = useCallback(
    async (p: Omit<PriceItem, 'id'>) => {
      try {
        const { data, error } = await financeService.addPriceItem({
          work_type: p.work_type,
          category: p.category,
          material: p.material,
          price: p.price,
          sector: p.sector,
          execution_time: p.execution_time,
          cadista_cost: p.cadista_cost,
          material_cost: p.material_cost,
          fixed_cost: p.fixed_cost,
        })
        if (error) throw error
        if (data) {
          setPriceList((prev) => [...prev, mPrice(data)])
          logAction(`ADICIONOU ITEM DE PRECIFICAÇÃO: ${p.work_type}`)
          return { success: true, id: data.id }
        }
        return { success: false }
      } catch (error: any) {
        checkAuthError(error)
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
        const { error } = await financeService.updatePriceItem(id, payload)
        if (error) throw error
        setPriceList((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)))
        logAction(`ATUALIZOU ITEM DE PRECIFICAÇÃO ID: ${id}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        console.warn('Erro ao atualizar price_list', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const removePriceItem = useCallback(
    async (id: string) => {
      try {
        const { error } = await financeService.deletePriceItem(id)
        if (error) throw error
        setPriceList((prev) => prev.filter((item) => item.id !== id))
        logAction(`REMOVEU ITEM DE PRECIFICAÇÃO ID: ${id}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        console.warn('Erro ao remover price_list', error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const updateRolePermissions = useCallback(
    async (permissions: RolePermission[]) => {
      try {
        const { error } = await settingsService.upsertRolePermissions(permissions)
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
        checkAuthError(error)
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
          await clinicService.deleteConsultoriosIn(toDelete)
        }

        for (let i = 0; i < items.length; i++) {
          const c = items[i]
          let cid = c.id
          if (cid.startsWith('new-')) {
            const { data, error } = await clinicService.upsertConsultorio({
              name: c.name || 'Novo Consultório',
            })
            if (error) throw error
            cid = data.id
            items[i].id = cid
          } else {
            await clinicService.upsertConsultorio({ id: cid, name: c.name || 'Novo Consultório' })
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
            await clinicService.upsertConsultorioSchedules(schedulesToUpsert)
          }
        }

        const { data: finalData, error } = await clinicService.fetchConsultorios()
        if (error) throw error
        if (finalData) setConsultorios(finalData as any)

        await updateAppSettings({ hourly_cost_monthly_hours: newMonthlyHours })
        logAction('ATUALIZOU CONSULTÓRIOS E HORAS MENSAIS')
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
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

      const currentUser = storeRef.current.user
      const currentEmp = storeRef.current.employees.find((e) => e.user_id === currentUser?.id)
      const empName = currentEmp?.name || currentUser?.user_metadata?.name || 'SISTEMA'

      const action_history = [
        {
          action: 'REGISTRO CRIADO',
          user_name: empName,
          user_id: currentUser?.id || 'sistema',
          timestamp: new Date().toISOString(),
        },
      ]

      try {
        const { data, error } = await sacService.create({
          type: r.type,
          patient_name: r.patient_name,
          receiving_employee_id: r.receiving_employee_id || null,
          responsible_employee_id: r.responsible_employee_id || null,
          status: r.status || 'OPORTUNIDADE DE SOLUÇÃO',
          sector: r.sector,
          description: r.description,
          limit_at: limit_at,
          action_history: action_history as any,
        })

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

            const respEmp = storeRef.current.employees.find(
              (e) => e.id === r.responsible_employee_id,
            )
            if (currentUser && respEmp && respEmp.user_id) {
              const { data: roomId } = await supabase.rpc('get_or_create_individual_room', {
                user1: currentUser.id,
                user2: respEmp.user_id,
              })
              if (roomId) {
                // Keep chat insert as inline for now unless there's chatService
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
        checkAuthError(err)
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

      const oldRecord = storeRef.current.sacRecords.find((s) => s.id === id)
      const currentUser = storeRef.current.user
      const currentEmp = storeRef.current.employees.find((e) => e.user_id === currentUser?.id)
      const empName = currentEmp?.name || currentUser?.user_metadata?.name || 'SISTEMA'
      const userId = currentUser?.id || 'sistema'

      let actionStrs: string[] = []
      if (r.status && oldRecord && r.status !== oldRecord.status) {
        actionStrs.push(`STATUS ALTERADO PARA: ${r.status}`)
      }
      if (r.solution_details && oldRecord && r.solution_details !== oldRecord.solution_details) {
        actionStrs.push('DETALHES DA SOLUÇÃO ATUALIZADOS')
      }
      if (
        r.responsible_employee_id &&
        oldRecord &&
        r.responsible_employee_id !== oldRecord.responsible_employee_id
      ) {
        actionStrs.push('RESPONSÁVEL ALTERADO')
      }
      if (r.description && oldRecord && r.description !== oldRecord.description) {
        actionStrs.push('DESCRIÇÃO ATUALIZADA')
      }
      if (
        r.receiving_employee_id &&
        oldRecord &&
        r.receiving_employee_id !== oldRecord.receiving_employee_id
      ) {
        actionStrs.push('RECEPTOR ALTERADO')
      }
      if (r.sector && oldRecord && r.sector !== oldRecord.sector) {
        actionStrs.push('SETOR ALTERADO')
      }
      if (r.patient_name && oldRecord && r.patient_name !== oldRecord.patient_name) {
        actionStrs.push('NOME DO PACIENTE ALTERADO')
      }

      if (actionStrs.length === 0) {
        actionStrs.push('DADOS ATUALIZADOS')
      }

      const newHistoryItems = actionStrs.map((actionStr) => ({
        action: actionStr,
        user_name: empName,
        user_id: userId,
        timestamp: new Date().toISOString(),
      }))

      const existingHistory = oldRecord?.action_history || []
      payload.action_history = [...newHistoryItems, ...existingHistory]

      Object.keys(payload).forEach((key) => (payload[key] === undefined ? delete payload[key] : {}))

      try {
        const { error } = await sacService.update(id, payload)
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
        checkAuthError(err)
        console.warn('Erro ao atualizar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const deleteSacRecord = useCallback(
    async (id: string) => {
      try {
        const { error } = await sacService.delete(id)
        if (error) throw error

        setSacRecords((prev) => prev.filter((s) => s.id !== id))
        logAction(`REMOVEU OPORTUNIDADE (SAC) ID: ${id}`)
        return { success: true }
      } catch (err) {
        checkAuthError(err)
        console.warn('Erro ao deletar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const addSpecialtyConfig = useCallback(
    async (name: string, color_hex: string) => {
      try {
        const { data, error } = await clinicService.addSpecialtyConfig(name, color_hex)
        if (error) throw error
        if (data) {
          setSpecialtyConfigs((prev) => [...prev, mSpecConfig(data)])
          logAction(`CRIOU ESPECIALIDADE DE AGENDA: ${name}`)
          return { success: true }
        }
        return { success: false }
      } catch (error: any) {
        checkAuthError(error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const deleteSpecialtyConfig = useCallback(
    async (id: string) => {
      try {
        const { error } = await clinicService.deleteSpecialtyConfig(id)
        if (error) throw error
        setSpecialtyConfigs((prev) => prev.filter((s) => s.id !== id))
        logAction(`REMOVEU ESPECIALIDADE DE AGENDA ID: ${id}`)
        return { success: true }
      } catch (error: any) {
        checkAuthError(error)
        return { success: false, error }
      }
    },
    [logAction],
  )

  const upsertAgendaSegmentation = useCallback(
    async (data: Omit<AgendaSegmentation, 'id'>) => {
      try {
        const payload = {
          consultorio_id: data.consultorio_id,
          day_of_week: data.day_of_week,
          shift: data.shift,
          specialty_id: data.specialty_id || null,
          dentist_id: data.dentist_id || null,
        }

        const { data: result, error } = await agendaService.upsertSegmentation(payload)

        if (error) throw error
        if (result) {
          setAgendaSegmentation((prev) => {
            const existing = prev.find(
              (p) =>
                p.consultorio_id === data.consultorio_id &&
                p.day_of_week === data.day_of_week &&
                p.shift === data.shift,
            )
            if (existing) return prev.map((p) => (p.id === existing.id ? mSeg(result) : p))
            return [...prev, mSeg(result)]
          })
          logAction(`ATUALIZOU SEGMENTAÇÃO DE AGENDA`)
          return { success: true }
        }
        return { success: false }
      } catch (error: any) {
        checkAuthError(error)
        return { success: false, error }
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
      specialtyConfigs,
      agendaSegmentation,
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
      removePurchaseHistory,
      updatePurchaseHistory,
      addInventoryOption,
      updateInventoryOption,
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
      addSpecialtyConfig,
      deleteSpecialtyConfig,
      upsertAgendaSegmentation,
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
      specialtyConfigs,
      agendaSegmentation,
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
      removePurchaseHistory,
      updatePurchaseHistory,
      addInventoryOption,
      updateInventoryOption,
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
      addSpecialtyConfig,
      deleteSpecialtyConfig,
      upsertAgendaSegmentation,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
