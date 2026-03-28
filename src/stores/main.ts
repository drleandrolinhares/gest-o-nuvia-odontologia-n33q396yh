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
import { financeService } from '@/services/financeService'
import { agendaService } from '@/services/agendaService'
import { accessService } from '@/services/accessService'
import { settingsService } from '@/services/settingsService'
import { sacService } from '@/services/sacService'
import { clinicService } from '@/services/clinicService'
import { permissionsService } from '@/services/permissionsService'
import type { Database } from '@/lib/supabase/types'
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

type DbInventory = Database['public']['Tables']['inventory']['Row']
type DbAgenda = Database['public']['Tables']['agenda']['Row']
type DbAcesso = Database['public']['Tables']['acessos']['Row']
type DbDocument = Database['public']['Tables']['documents']['Row']
type DbInventoryOption = Database['public']['Tables']['inventory_settings']['Row']
type DbAppSettings = Database['public']['Tables']['app_settings']['Row']

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
  userPermissions: any[]
  fetchPermissions: (forceRefresh?: boolean) => Promise<void>
  can: (module: string, action?: string) => boolean
  packageTypes: string[]
  specialties: string[]
  agendaTypes: string[]
  alerts: string[]
  inventory: InventoryItem[]
  inventoryOptions: InventoryOption[]
  temporaryOutflows: TemporaryOutflow[]
  documents: DocumentItem[]
  agenda: AgendaItem[]
  acessos: AccessItem[]
  suppliers: Supplier[]
  auditLogs: AuditLog[]
  appSettings: AppSettings | null
  priceList: PriceItem[]
  rolePermissions: RolePermission[]
  roles: SystemRole[]
  consultorios: Consultorio[]
  sacRecords: SacRecord[]
  specialtyConfigs: SpecialtyConfig[]
  agendaSegmentation: AgendaSegmentation[]

  // Stubs for removed employee types to prevent TypeScript errors in untouched files
  employees: any[]
  workSchedules: any[]
  onboarding: any[]
  employeeDocuments: any[]
  bonusTypes: any[]
  departments: string[]

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
  addEmployee: (e: any) => Promise<{ success: boolean; error?: any }>
  updateEmployee: (id: string, e: any) => Promise<{ success: boolean; error?: any }>
  updateEmployeePassword: (
    userId: string,
    newPass: string,
  ) => Promise<{ success: boolean; error?: any }>
  forceResetPassword: (userId: string) => Promise<{ success: boolean; error?: any }>
  deleteEmployee: (id: string) => void
  updateEmployeeStatus: (id: string, s: any) => void
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
  upsertWorkSchedule: (schedule: any) => Promise<void>
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

const mockPackageTypes = ['CAIXA', 'UNIDADE', 'FRASCO', 'PACOTE', 'SERINGA']
const mockAgendaTypes = [
  'CONSULTA',
  'REUNIÃO',
  'VIAGEM',
  'CURSO',
  'LEMBRETE',
  'AUDITORIA',
  'PEDIDO',
  'SAC',
]

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
  hasSpecialNegotiation: d.hasSpecialNegotiation,
  negotiationNotes: d.negotiation_notes,
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

  const [packageTypes, setPackageTypes] = useState(mockPackageTypes)
  const [agendaTypes, setAgendaTypes] = useState(mockAgendaTypes)

  const [userPermissions, setUserPermissions] = useState<any[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([])
  const [temporaryOutflows, setTemporaryOutflows] = useState<TemporaryOutflow[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [acessos, setAcessos] = useState<AccessItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
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
    userPermissions,
    inventory,
    roles,
    rolePermissions,
    consultorios,
    agenda,
    sacRecords,
    inventoryOptions,
    specialtyConfigs,
    agendaSegmentation,
  })

  useEffect(() => {
    storeRef.current = {
      user,
      userPermissions,
      inventory,
      roles,
      rolePermissions,
      consultorios,
      agenda,
      sacRecords,
      inventoryOptions,
      specialtyConfigs,
      agendaSegmentation,
    }
  }, [
    user,
    userPermissions,
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

  const fetchPermissions = useCallback(
    (forceRefresh: boolean = false) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          if (!user) {
            resolve()
            return
          }
          try {
            const perms = await permissionsService.getUserPermissions(user.id, forceRefresh)
            setUserPermissions(perms || [])
          } catch (err) {
            console.warn('Erro ao atualizar permissoes', err)
            setUserPermissions([])
          } finally {
            resolve()
          }
        }, 0)
      })
    },
    [user],
  )

  useEffect(() => {
    let isMounted = true
    let permsChannel: any = null

    if (user) {
      setIsAuthenticated(true)
      setIsDataLoading(true)
      setFetchError(null)

      const timeoutId = setTimeout(() => {
        if (isMounted && isDataLoading) {
          console.warn('Timeout na carga de dados principal. Forçando liberação da UI.')
          setIsDataLoading(false)
        }
      }, 10000)

      const handleResponse = <T = any>(r: any, mapper?: (d: any) => T): T[] => {
        if (r?.error) {
          console.warn('Silent fallback for missing relation or data error', r.error)
          return []
        }
        const data = Array.isArray(r?.data) ? r.data : []
        return mapper ? data.map(mapper) : (data as unknown as T[])
      }

      const safeFetch = async (promise: Promise<any>) => {
        try {
          return await promise
        } catch (err) {
          console.warn('SafeFetch swallowed error:', err)
          return null
        }
      }

      Promise.all([
        safeFetch(fetchPermissions()),
        safeFetch(
          inventoryService.fetchAll().then((r) => {
            if (isMounted) setInventory(handleResponse(r, mInv))
          }),
        ),
        safeFetch(
          inventoryService.fetchOptions().then((r) => {
            if (isMounted) setInventoryOptions(handleResponse(r, mOpt))
          }),
        ),
        safeFetch(
          inventoryService.fetchPendingOutflows().then((r) => {
            if (isMounted && !r?.error) setTemporaryOutflows((r?.data || []) as any)
          }),
        ),
        safeFetch(
          agendaService.fetchAll().then((r) => {
            if (isMounted) setAgenda(handleResponse(r, mAg))
          }),
        ),
        safeFetch(
          accessService.fetchAll().then((r) => {
            if (isMounted) setAcessos(handleResponse(r, mAcc))
          }),
        ),
        safeFetch(
          (async () => {
            try {
              const r = await settingsService.fetchSuppliers()
              if (isMounted) setSuppliers(handleResponse(r, mSup))
            } catch (err) {
              console.warn('Suppliers fetch failed gracefully:', err)
              if (isMounted) setSuppliers([])
            }
          })(),
        ),
        safeFetch(
          settingsService.fetchDocuments().then((r) => {
            if (isMounted) setDocuments(handleResponse(r, mDoc))
          }),
        ),
        safeFetch(
          clinicService.fetchConsultorios().then((r) => {
            if (isMounted && !r?.error) setConsultorios((r?.data || []) as any)
          }),
        ),
        safeFetch(
          sacService.fetchAll().then((r) => {
            if (isMounted) setSacRecords(handleResponse(r, mSac))
          }),
        ),
        safeFetch(
          financeService.fetchSettings().then(async (r) => {
            if (!isMounted) return
            if (r?.data) {
              setAppSettings(mAppSet(r.data as any))
            } else if (!r?.error) {
              const { data: newData } = await financeService.createSettings({})
              if (isMounted && newData) setAppSettings(mAppSet(newData as any))
            }
          }),
        ),
        safeFetch(
          financeService.fetchPriceList().then((r) => {
            if (isMounted && r?.data) setPriceList(r.data.map(mPrice))
          }),
        ),
        safeFetch(
          clinicService.fetchSpecialtyConfigs().then((r) => {
            if (isMounted) setSpecialtyConfigs(handleResponse(r, mSpecConfig))
          }),
        ),
        safeFetch(
          agendaService.fetchSegmentation().then((r) => {
            if (isMounted) setAgendaSegmentation(handleResponse(r, mSeg))
          }),
        ),
      ])
        .catch((err) => {
          if (!checkAuthError(err)) {
            console.error('Initial data fetch error:', err)
            if (isMounted)
              setFetchError(
                'Falha ao sincronizar dados do sistema. Verifique sua conexão e tente novamente.',
              )
          }
        })
        .finally(() => {
          clearTimeout(timeoutId)
          if (isMounted) setIsDataLoading(false)
        })

      permsChannel = supabase
        .channel('permissions_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'permissoes_cargo' }, () => {
          permissionsService.clearCache()
          fetchPermissions(true)
        })
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'permissoes_usuario' },
          () => {
            permissionsService.clearCache(user.id)
            fetchPermissions(true)
          },
        )
        .subscribe()
    } else {
      setIsAuthenticated(false)
      setUserPermissions([])
      setInventory([])
      setInventoryOptions([])
      setTemporaryOutflows([])
      setAuditLogs([])
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

    return () => {
      isMounted = false
      if (permsChannel) {
        supabase.removeChannel(permsChannel)
      }
    }
  }, [user, fetchPermissions])

  const isAdmin = useMemo(() => !!user, [user])
  const isMaster = useMemo(() => !!user, [user])
  const currentUserId = useMemo(() => user?.id || null, [user])

  const can = useCallback((moduleName: string, action: string = 'view') => {
    if (!moduleName) return true

    const email = storeRef.current.user?.email
    if (email === 'master@nuvia.com.br' || email === 'drleandrolinhares@gmail.com') return true

    const perm = storeRef.current.userPermissions?.find(
      (p: any) => p.nome.toUpperCase() === moduleName.toUpperCase(),
    )

    if (!perm) return false

    if (action === 'view' || action === 'pode_ver' || action === 'pode_visualizar') {
      return perm.pode_visualizar ?? perm.pode_ver
    }
    if (action === 'create' || action === 'pode_criar') return perm.pode_criar
    if (action === 'edit' || action === 'pode_editar') return perm.pode_editar
    if (action === 'delete' || action === 'pode_deletar') return perm.pode_deletar

    return false
  }, [])

  const logAction = useCallback((action: string) => {
    if (!storeRef.current.user) return
    const u = storeRef.current.user
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
            { id: data.id, userName: 'SISTEMA', action: data.action, timestamp: data.created_at },
            ...p,
          ])
        }
      } catch (err) {
        console.warn('Falha ao registrar log de auditoria', err)
      }
    }
    runLog()
  }, [])

  // Dummy functions to prevent TS errors for removed modules
  const addRole = useCallback(async () => ({ success: false }), [])
  const updateRole = useCallback(async () => ({ success: false }), [])
  const deleteRole = useCallback(async () => ({ success: false }), [])
  const addDepartment = useCallback(() => {}, [])
  const removeDepartment = useCallback(() => {}, [])
  const toggleTask = useCallback(() => {}, [])
  const addOnboardingTask = useCallback(() => {}, [])
  const removeOnboardingTask = useCallback(() => {}, [])
  const addEmployee = useCallback(async () => ({ success: false }), [])
  const updateEmployee = useCallback(async () => ({ success: false }), [])
  const updateEmployeePassword = useCallback(async () => ({ success: false }), [])
  const forceResetPassword = useCallback(async () => ({ success: false }), [])
  const deleteEmployee = useCallback(() => {}, [])
  const updateEmployeeStatus = useCallback(() => {}, [])
  const generateEmployeeAccess = useCallback(async () => ({ success: false }), [])
  const addBonusType = useCallback(async () => {}, [])
  const removeBonusType = useCallback(async () => {}, [])
  const addEmployeeDocument = useCallback(async () => {}, [])
  const removeEmployeeDocument = useCallback(async () => {}, [])
  const fetchWorkSchedules = useCallback(async () => {}, [])
  const upsertWorkSchedule = useCallback(async () => {}, [])
  const updateRolePermissions = useCallback(async () => ({ success: false }), [])

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
    async (inventory_id: string, _employee_id: string, quantity: number, destination: string) => {
      const actualUserId = storeRef.current.user?.id || crypto.randomUUID() // fallback for employee_id
      const { data, error } = await inventoryService.addTemporaryOutflow(
        inventory_id,
        actualUserId,
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
        const recipientStr = `SISTEMA - ${destination}`

        if (user) {
          await inventoryService.addMovement(
            inventory_id,
            user.id,
            'BAIXA TEMPORÁRIA',
            quantity,
            recipientStr,
          )
        }

        logAction(`BAIXA TEMPORÁRIA: ${quantity} UN`)
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
      const empName = currentUser?.user_metadata?.name || 'SISTEMA'

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
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        checkAuthError(err)
        console.warn('Erro ao criar SAC:', err)
        return { success: false, error: err }
      }
    },
    [logAction],
  )

  const updateSacRecord = useCallback(
    async (id: string, r: Partial<SacRecord>) => {
      const payload: any = { ...r }
      if (r.status === 'RESOLVIDO' && !r.solved_at) {
        payload.solved_at = new Date().toISOString()
      }

      const oldRecord = storeRef.current.sacRecords.find((s) => s.id === id)
      const currentUser = storeRef.current.user
      const empName = currentUser?.user_metadata?.name || 'SISTEMA'
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
      userPermissions,
      fetchPermissions,
      can,
      packageTypes,
      specialties,
      agendaTypes,
      alerts,
      inventory,
      inventoryOptions,
      temporaryOutflows,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
      appSettings,
      priceList,
      rolePermissions,
      roles,
      consultorios,
      sacRecords,
      specialtyConfigs,
      agendaSegmentation,
      employees: [],
      workSchedules: [],
      onboarding: [],
      employeeDocuments: [],
      bonusTypes: [],
      departments: [],
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
      userPermissions,
      fetchPermissions,
      can,
      packageTypes,
      specialties,
      agendaTypes,
      alerts,
      inventory,
      inventoryOptions,
      temporaryOutflows,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
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
