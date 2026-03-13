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
}
export type AccessItem = {
  id: string
  platform: string
  url: string
  login: string
  pass: string
  instructions: string
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

interface AppStore {
  isAuthenticated: boolean
  currentUserId: string | null
  departments: string[]
  packageTypes: string[]
  specialties: string[]
  agendaTypes: string[]
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  documents: DocumentItem[]
  agenda: AgendaItem[]
  acessos: AccessItem[]
  suppliers: Supplier[]
  auditLogs: AuditLog[]
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
  deleteInventoryItem: (id: string) => void
  addPurchaseHistory: (i: string, r: Omit<PurchaseRecord, 'id'>) => void
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
  removeAgendaItem: (id: string) => void
  addAccess: (i: Omit<AccessItem, 'id'>) => void
  updateAccess: (id: string, i: Partial<AccessItem>) => void
  removeAccess: (id: string) => void
  addSupplier: (i: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, i: Partial<Supplier>) => void
  removeSupplier: (id: string) => void
}

const mockDepartments = ['Odontologia', 'Operacional', 'Administrativo', 'Recepção', 'RH']
const mockPackageTypes = ['Caixa', 'Unidade', 'Frasco', 'Pacote', 'Seringa']
const mockSpecialties = [
  'Clínica Geral',
  'Ortodontia',
  'Implantodontia',
  'Endodontia',
  'Odontopediatria',
]
const mockAgendaTypes = ['Consulta', 'Reunião', 'Viagem', 'Lembrete', 'Auditoria']

const mEmp = (d: any): Employee => ({
  id: d.id,
  user_id: d.user_id,
  name: d.name,
  username: d.username,
  role: d.role,
  department: d.department,
  status: d.status,
  hireDate: d.hire_date,
  salary: d.salary,
  vacationDaysTaken: d.vacation_days_taken,
  vacationDaysTotal: d.vacation_days_total,
  vacationDueDate: d.vacation_due_date,
  email: d.email,
  phone: d.phone,
  rg: d.rg,
  cpf: d.cpf,
  birthDate: d.birth_date,
  cep: d.cep,
  address: d.address,
  addressNumber: d.address_number,
  addressComplement: d.address_complement,
  city: d.city,
  state: d.state,
  lastAccess: d.last_access,
  teamCategory: Array.isArray(d.team_category)
    ? d.team_category
    : d.team_category
      ? [d.team_category]
      : ['COLABORADOR'],
  contractDetails: d.contract_details || '',
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
})
const mAcc = (d: any): AccessItem => ({
  id: d.id,
  platform: d.platform,
  url: d.url,
  login: d.login,
  pass: d.pass,
  instructions: d.instructions,
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

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [departments, setDepartments] = useState(mockDepartments)
  const [packageTypes, setPackageTypes] = useState(mockPackageTypes)
  const [specialties, setSpecialties] = useState(mockSpecialties)
  const [agendaTypes, setAgendaTypes] = useState(mockAgendaTypes)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [acessos, setAcessos] = useState<AccessItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [alerts] = useState<string[]>([])

  const storeRef = useRef({ user, employees })
  useEffect(() => {
    storeRef.current = { user, employees }
  }, [user, employees])

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      Promise.all([
        supabase
          .from('employees')
          .select('*')
          .then((r) => setEmployees((r.data || []).map(mEmp))),
        supabase
          .from('inventory')
          .select('*')
          .then((r) => setInventory((r.data || []).map(mInv))),
        supabase
          .from('agenda')
          .select('*')
          .then((r) => setAgenda((r.data || []).map(mAg))),
        supabase
          .from('acessos')
          .select('*')
          .then((r) => setAcessos((r.data || []).map(mAcc))),
        supabase
          .from('suppliers')
          .select('*')
          .then((r) => setSuppliers((r.data || []).map(mSup))),
        supabase
          .from('onboarding')
          .select('*')
          .then((r) => setOnboarding((r.data || []).map(mOnb))),
        supabase
          .from('documents')
          .select('*')
          .then((r) => setDocuments((r.data || []).map(mDoc))),
        supabase
          .from('audit_logs')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(50)
          .then((r) =>
            setAuditLogs(
              (r.data || []).map((d) => ({
                id: d.id,
                userName: d.profiles?.name || 'SISTEMA',
                action: d.action,
                timestamp: d.created_at,
              })),
            ),
          ),
      ])
    } else {
      setIsAuthenticated(false)
      setCurrentUserId(null)
      setEmployees([])
      setInventory([])
      setAuditLogs([])
    }
  }, [user])

  useEffect(() => {
    const me = employees.find((e) => e.user_id === user?.id)
    setCurrentUserId(me?.id || null)
  }, [employees, user])

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
  }, [])

  const addDepartment = useCallback(
    (n: string) => {
      setDepartments((p) => [...p, n])
      logAction(`CRIOU DEPARTAMENTO: ${n}`)
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
      setPackageTypes((p) => [...p, n])
      logAction(`CRIOU TIPO DE EMBALAGEM: ${n}`)
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
      setSpecialties((p) => [...p, n])
      logAction(`CRIOU ESPECIALIDADE: ${n}`)
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
      setAgendaTypes((p) => [...p, n])
      logAction(`CRIOU TIPO DE COMPROMISSO: ${n}`)
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
          },
        ])
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setInventory((p) => [...p, mInv(data)])
            logAction(`CRIOU PRODUTO: ${i.name}`)
          }
        })
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
    },
    [logAction],
  )
  const deleteInventoryItem = useCallback(
    (id: string) => {
      supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .then(() => {
          setInventory((p) => p.filter((i) => i.id !== id))
          logAction(`REMOVEU PRODUTO ID: ${id}`)
        })
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
            purchase_history: nh,
            quantity: nq,
            package_cost: r.price,
            expiration_date: r.expirationDate || item.expirationDate,
          })
          .eq('id', itemId)
          .then(() => logAction(`NOVA COMPRA PARA PRODUTO ID: ${itemId}`))
        return prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                purchaseHistory: nh,
                quantity: nq,
                packageCost: r.price,
                expirationDate: r.expirationDate || item.expirationDate,
              }
            : i,
        )
      })
    },
    [logAction],
  )

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
            username: e.username,
            role: e.role,
            department: e.department,
            status: e.status,
            hire_date: e.hireDate,
            salary: e.salary,
            vacation_days_taken: e.vacationDaysTaken,
            vacation_days_total: e.vacationDaysTotal,
            vacation_due_date: e.vacationDueDate,
            email: e.email,
            phone: e.phone,
            rg: e.rg,
            cpf: e.cpf,
            birth_date: e.birthDate,
            cep: e.cep,
            address: e.address,
            address_number: e.addressNumber,
            address_complement: e.addressComplement,
            city: e.city,
            state: e.state,
            team_category: e.teamCategory || ['COLABORADOR'],
            contract_details: e.contractDetails || '',
            user_id: userId,
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
      if (e.hireDate !== undefined) payload.hire_date = e.hireDate
      if (e.salary !== undefined) payload.salary = e.salary
      if (e.email !== undefined) payload.email = e.email
      if (e.phone !== undefined) payload.phone = e.phone
      if (e.rg !== undefined) payload.rg = e.rg
      if (e.cpf !== undefined) payload.cpf = e.cpf
      if (e.birthDate !== undefined) payload.birth_date = e.birthDate
      if (e.cep !== undefined) payload.cep = e.cep
      if (e.address !== undefined) payload.address = e.address
      if (e.addressNumber !== undefined) payload.address_number = e.addressNumber
      if (e.addressComplement !== undefined) payload.address_complement = e.addressComplement
      if (e.city !== undefined) payload.city = e.city
      if (e.state !== undefined) payload.state = e.state
      if (e.teamCategory !== undefined) payload.team_category = e.teamCategory
      if (e.contractDetails !== undefined) payload.contract_details = e.contractDetails

      const { error } = await supabase.from('employees').update(payload).eq('id', id)

      if (!error) {
        setEmployees((p) => p.map((emp) => (emp.id === id ? { ...emp, ...e } : emp)))
        logAction(`ATUALIZOU DADOS DO COLABORADOR ID: ${id}`)
        return { success: true }
      }
      return { success: false, error }
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
            instructions: i.instructions,
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
        })
        .eq('id', id)
        .then(() => {
          setAcessos((p) => p.map((a) => (a.id === id ? { ...a, ...i } : a)))
          logAction(`ATUALIZOU ACESSO ID: ${id}`)
        })
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
    },
    [logAction],
  )

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUserId,
      departments,
      packageTypes,
      specialties,
      agendaTypes,
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
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
      deleteInventoryItem,
      addPurchaseHistory,
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
      removeAgendaItem,
      addAccess,
      updateAccess,
      removeAccess,
      addSupplier,
      updateSupplier,
      removeSupplier,
    }),
    [
      isAuthenticated,
      currentUserId,
      departments,
      packageTypes,
      specialties,
      agendaTypes,
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      agenda,
      acessos,
      suppliers,
      auditLogs,
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
      deleteInventoryItem,
      addPurchaseHistory,
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
      removeAgendaItem,
      addAccess,
      updateAccess,
      removeAccess,
      addSupplier,
      updateSupplier,
      removeSupplier,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
