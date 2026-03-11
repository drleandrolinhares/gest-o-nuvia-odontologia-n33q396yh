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

export type AgendaAccess = 'VIEW_ONLY' | 'ADD_EDIT'

export type Employee = {
  id: string
  name: string
  role: string
  department: string
  status: 'Ativo' | 'Férias' | 'Aviso Prévio' | 'Desligado'
  hireDate: string
  salary: string
  vacationDaysTaken: number
  vacationDaysTotal: number
  vacationDueDate: string
  email: string
  phone: string
  agendaAccess: AgendaAccess
  password?: string
  permissions?: string[]
  accessLevel?: 'OPERACIONAL' | 'ADMINISTRATIVO'
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
  accessLevel?: 'OPERACIONAL' | 'ADMINISTRATIVO'
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

export type AuditLog = {
  id: string
  userName: string
  action: string
  timestamp: string
}

interface AppStore {
  isAuthenticated: boolean
  isAdmin: boolean
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
  levelPermissions: Record<string, string[]>
  auditLogs: AuditLog[]
  login: (email: string, pass: string) => boolean
  logout: () => void
  toggleAdmin: () => void
  setCurrentUser: (id: string | null) => void
  addDepartment: (name: string) => void
  removeDepartment: (name: string) => void
  addPackageType: (name: string) => void
  removePackageType: (name: string) => void
  addSpecialty: (name: string) => void
  removeSpecialty: (name: string) => void
  addAgendaType: (name: string) => void
  removeAgendaType: (name: string) => void
  toggleTask: (candidateId: string, taskId: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, newQuantity: number) => void
  addPurchaseHistory: (itemId: string, record: Omit<PurchaseRecord, 'id'>) => void
  addEmployee: (emp: Omit<Employee, 'id'>) => void
  deleteEmployee: (id: string) => void
  updateEmployeeStatus: (id: string, status: Employee['status']) => void
  updateEmployeeLevel: (id: string, level: Employee['accessLevel']) => void
  updateEmployeeAgendaAccess: (id: string, access: AgendaAccess) => void
  updateEmployeePermissions: (id: string, permissions: string[]) => void
  updateLevelPermissions: (level: string, perms: string[]) => void
  addOnboardingTask: (candidateId: string, title: string) => void
  removeOnboardingTask: (candidateId: string, taskId: string) => void
  addDocument: (name: string) => void
  removeDocument: (id: string) => void
  addAgendaItem: (item: Omit<AgendaItem, 'id'>) => void
  removeAgendaItem: (id: string) => void
  addAccess: (item: Omit<AccessItem, 'id'>) => void
  updateAccess: (id: string, item: Partial<AccessItem>) => void
  removeAccess: (id: string) => void
  addSupplier: (item: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, item: Partial<Supplier>) => void
  removeSupplier: (id: string) => void
}

const mockDepartments = ['Odontologia', 'Operacional', 'Administrativo', 'Recepção']
const mockPackageTypes = ['Caixa', 'Unidade', 'Frasco', 'Pacote', 'Seringa']
const mockSpecialties = [
  'Clínica Geral',
  'Ortodontia',
  'Implantodontia',
  'Endodontia',
  'Odontopediatria',
]
const mockAgendaTypes = ['Consulta', 'Reunião', 'Viagem', 'Lembrete', 'Auditoria']

const mockEmployees: Employee[] = []
const mockOnboarding: OnboardingCandidate[] = []
const mockAgenda: AgendaItem[] = []

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Resina Composta A2',
    packageCost: 85.5,
    storageLocation: 'SALA 1 - ARMÁRIO A',
    packageType: 'Seringa',
    itemsPerBox: 1,
    minStock: 5,
    quantity: 12,
    specialty: 'Clínica Geral',
    brand: '3M',
    entryDate: '2023-10-01T12:00:00.000Z',
    expirationDate: '2026-10-01T12:00:00.000Z',
    barcode: '7891234567890',
    purchaseHistory: [
      { id: 'h1', date: '2023-09-15T10:00:00.000Z', price: 80.0, quantity: 5 },
      { id: 'h2', date: '2023-10-01T12:00:00.000Z', price: 85.5, quantity: 7 },
    ],
  },
]

const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'POP - Onboarding e Admissão v2.pdf', date: '10/01/2026' },
]

const mockAcessos: AccessItem[] = [
  {
    id: '1',
    platform: 'Portal Nuvia Admin',
    url: 'https://admin.nuvia.com',
    login: 'admin@nuvia.com',
    pass: 'Nuvia@2026!',
    instructions: 'Acesso restrito à diretoria.',
    accessLevel: 'ADMINISTRATIVO',
  },
]

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'DENTAL CREMER',
    contact: 'MARIA SILVA',
    phone: '(11) 4000-0000',
    email: 'VENDAS@DENTALCREMER.COM.BR',
    cnpj: '11.111.111/0001-11',
    website: 'www.dentalcremer.com.br',
    hasSpecialNegotiation: true,
    negotiationNotes: 'Desconto de 15% em compras acima de R$ 1.000,00',
  },
]

const mockAuditLogs: AuditLog[] = [
  {
    id: 'l1',
    userName: 'DR. SOUZA FILHO (ADMIN)',
    action: 'CRIOU PRODUTO NO ESTOQUE: RESINA COMPOSTA A2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'l2',
    userName: 'DR. SOUZA FILHO (ADMIN)',
    action: 'CRIOU NÍVEL DE PERMISSÃO OPERACIONAL E ADMINISTRATIVO',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
]

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [departments, setDepartments] = useState<string[]>(mockDepartments)
  const [packageTypes, setPackageTypes] = useState<string[]>(mockPackageTypes)
  const [specialties, setSpecialties] = useState<string[]>(mockSpecialties)
  const [agendaTypes, setAgendaTypes] = useState<string[]>(mockAgendaTypes)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>([])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)
  const [agenda, setAgenda] = useState<AgendaItem[]>(mockAgenda)
  const [acessos, setAcessos] = useState<AccessItem[]>(mockAcessos)
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)

  const [levelPermissions, setLevelPermissions] = useState<Record<string, string[]>>({
    OPERACIONAL: ['dashboard', 'agenda'],
    ADMINISTRATIVO: [
      'dashboard',
      'agenda',
      'acessos',
      'rh',
      'estoque',
      'configuracoes',
      'auditoria',
    ],
  })

  const storeRef = useRef({
    currentUserId,
    employees,
    isAdmin,
    inventory,
    agenda,
    acessos,
    suppliers,
  })
  useEffect(() => {
    storeRef.current = { currentUserId, employees, isAdmin, inventory, agenda, acessos, suppliers }
  }, [currentUserId, employees, isAdmin, inventory, agenda, acessos, suppliers])

  const logAction = useCallback((action: string) => {
    const { currentUserId, employees, isAdmin } = storeRef.current
    let userName = 'SISTEMA'
    if (currentUserId) {
      const emp = employees.find((e) => e.id === currentUserId)
      userName = emp ? emp.name : 'DESCONHECIDO'
    } else if (isAdmin) {
      userName = 'DR. SOUZA FILHO (ADMIN)'
    }

    setAuditLogs((prev) => [
      {
        id: Math.random().toString(36).substring(2, 11),
        userName: userName.toUpperCase(),
        action: action.toUpperCase(),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [])

  const login = useCallback(
    (email: string, pass: string) => {
      if (email === 'admin@nuvia.com' && pass === 'admin123') {
        setIsAdmin(true)
        setCurrentUserId(null)
        setIsAuthenticated(true)
        logAction('FEZ LOGIN NO SISTEMA COMO ADMINISTRADOR')
        return true
      }
      const emp = employees.find((e) => e.email === email && e.password === pass)
      if (emp) {
        setIsAdmin(false)
        setCurrentUserId(emp.id)
        setIsAuthenticated(true)
        // Set context immediately in storeRef for correct log
        storeRef.current.currentUserId = emp.id
        logAction('FEZ LOGIN NO SISTEMA')
        return true
      }
      return false
    },
    [employees, logAction],
  )

  const logout = useCallback(() => {
    logAction('FEZ LOGOUT DO SISTEMA')
    setIsAuthenticated(false)
    setCurrentUserId(null)
    setIsAdmin(false)
  }, [logAction])

  const toggleAdmin = useCallback(() => setIsAdmin((prev) => !prev), [])
  const setCurrentUser = useCallback((id: string | null) => setCurrentUserId(id), [])

  const addDepartment = useCallback(
    (name: string) => {
      setDepartments((prev) => [...prev, name])
      logAction(`CRIOU DEPARTAMENTO: ${name}`)
    },
    [logAction],
  )

  const removeDepartment = useCallback(
    (name: string) => {
      setDepartments((prev) => prev.filter((d) => d !== name))
      logAction(`REMOVEU DEPARTAMENTO: ${name}`)
    },
    [logAction],
  )

  const addPackageType = useCallback(
    (name: string) => {
      setPackageTypes((prev) => [...prev, name])
      logAction(`CRIOU TIPO DE EMBALAGEM: ${name}`)
    },
    [logAction],
  )

  const removePackageType = useCallback(
    (name: string) => {
      setPackageTypes((prev) => prev.filter((pt) => pt !== name))
      logAction(`REMOVEU TIPO DE EMBALAGEM: ${name}`)
    },
    [logAction],
  )

  const addSpecialty = useCallback(
    (name: string) => {
      setSpecialties((prev) => [...prev, name])
      logAction(`CRIOU ESPECIALIDADE: ${name}`)
    },
    [logAction],
  )

  const removeSpecialty = useCallback(
    (name: string) => {
      setSpecialties((prev) => prev.filter((s) => s !== name))
      logAction(`REMOVEU ESPECIALIDADE: ${name}`)
    },
    [logAction],
  )

  const addAgendaType = useCallback(
    (name: string) => {
      setAgendaTypes((prev) => [...prev, name])
      logAction(`CRIOU TIPO DE COMPROMISSO: ${name}`)
    },
    [logAction],
  )

  const removeAgendaType = useCallback(
    (name: string) => {
      setAgendaTypes((prev) => prev.filter((t) => t !== name))
      logAction(`REMOVEU TIPO DE COMPROMISSO: ${name}`)
    },
    [logAction],
  )

  const toggleTask = useCallback(
    (candidateId: string, taskId: string) => {
      setOnboarding((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                tasks: c.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: !t.completed } : t,
                ),
              }
            : c,
        ),
      )
      logAction(`ALTEROU TAREFA DE ONBOARDING DO CANDIDATO ID: ${candidateId}`)
    },
    [logAction],
  )

  const addInventoryItem = useCallback(
    (item: Omit<InventoryItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 11)
      const purchaseHistory =
        item.quantity > 0
          ? [
              {
                id: Math.random().toString(36),
                date: new Date().toISOString(),
                price: item.packageCost,
                quantity: item.quantity,
                expirationDate: item.expirationDate,
              },
            ]
          : []
      setInventory((prev) => [...prev, { ...item, id, purchaseHistory }])
      logAction(`CRIOU PRODUTO NO ESTOQUE: ${item.name}`)
    },
    [logAction],
  )

  const updateInventoryQuantity = useCallback(
    (id: string, newQuantity: number) => {
      setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)))
      const item = storeRef.current.inventory.find((i) => i.id === id)
      logAction(`ATUALIZOU ESTOQUE DO PRODUTO: ${item ? item.name : id} PARA ${newQuantity}`)
    },
    [logAction],
  )

  const addPurchaseHistory = useCallback(
    (itemId: string, record: Omit<PurchaseRecord, 'id'>) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const newHistory = [
              { ...record, id: Math.random().toString(36).substring(2, 11) },
              ...(item.purchaseHistory || []),
            ]
            return {
              ...item,
              purchaseHistory: newHistory,
              quantity: item.quantity + record.quantity,
              packageCost: record.price,
              expirationDate: record.expirationDate || item.expirationDate,
            }
          }
          return item
        }),
      )
      const item = storeRef.current.inventory.find((i) => i.id === itemId)
      logAction(`REGISTROU NOVA COMPRA PARA O PRODUTO: ${item ? item.name : itemId}`)
    },
    [logAction],
  )

  const addEmployee = useCallback(
    (emp: Omit<Employee, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 11)
      setEmployees((prev) => [
        ...prev,
        { ...emp, id, permissions: ['dashboard'], accessLevel: 'OPERACIONAL' },
      ])
      setOnboarding((prev) => [
        ...prev,
        {
          id: `o_${id}`,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          tasks: [
            { id: Math.random().toString(36), title: 'Assinatura de Contrato', completed: false },
          ],
        },
      ])
      logAction(`CRIOU CADASTRO DE COLABORADOR: ${emp.name}`)
    },
    [logAction],
  )

  const deleteEmployee = useCallback(
    (id: string) => {
      const emp = storeRef.current.employees.find((e) => e.id === id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      logAction(`REMOVEU COLABORADOR: ${emp ? emp.name : id}`)
    },
    [logAction],
  )

  const updateEmployeeStatus = useCallback(
    (id: string, status: Employee['status']) => {
      const emp = storeRef.current.employees.find((e) => e.id === id)
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
      logAction(`ALTEROU STATUS DO COLABORADOR: ${emp ? emp.name : id} PARA ${status}`)
    },
    [logAction],
  )

  const updateEmployeeLevel = useCallback(
    (id: string, level: Employee['accessLevel']) => {
      const emp = storeRef.current.employees.find((e) => e.id === id)
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, accessLevel: level } : e)))
      logAction(`ALTEROU NÍVEL DE ACESSO DO COLABORADOR: ${emp ? emp.name : id} PARA ${level}`)
    },
    [logAction],
  )

  const updateEmployeeAgendaAccess = useCallback(
    (id: string, access: AgendaAccess) => {
      const emp = storeRef.current.employees.find((e) => e.id === id)
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, agendaAccess: access } : e)))
      logAction(`ALTEROU ACESSO DE AGENDA DO COLABORADOR: ${emp ? emp.name : id}`)
    },
    [logAction],
  )

  const updateEmployeePermissions = useCallback(
    (id: string, permissions: string[]) => {
      const emp = storeRef.current.employees.find((e) => e.id === id)
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, permissions } : e)))
      logAction(`ATUALIZOU PERMISSÕES DO COLABORADOR: ${emp ? emp.name : id}`)
    },
    [logAction],
  )

  const updateLevelPermissions = useCallback(
    (level: string, perms: string[]) => {
      setLevelPermissions((prev) => ({ ...prev, [level]: perms }))
      logAction(`ATUALIZOU PERMISSÕES PADRÃO DO NÍVEL: ${level}`)
    },
    [logAction],
  )

  const addOnboardingTask = useCallback(
    (candidateId: string, title: string) => {
      setOnboarding((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                tasks: [...c.tasks, { id: Math.random().toString(36), title, completed: false }],
              }
            : c,
        ),
      )
      logAction(`CRIOU TAREFA DE ONBOARDING: ${title}`)
    },
    [logAction],
  )

  const removeOnboardingTask = useCallback(
    (candidateId: string, taskId: string) => {
      setOnboarding((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c,
        ),
      )
      logAction(`REMOVEU TAREFA DE ONBOARDING`)
    },
    [logAction],
  )

  const addDocument = useCallback(
    (name: string) => {
      setDocuments((prev) => [
        ...prev,
        { id: Math.random().toString(36), name, date: new Date().toLocaleDateString('pt-BR') },
      ])
      logAction(`ADICIONOU DOCUMENTO: ${name}`)
    },
    [logAction],
  )

  const removeDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      logAction(`REMOVEU DOCUMENTO ID: ${id}`)
    },
    [logAction],
  )

  const addAgendaItem = useCallback(
    (item: Omit<AgendaItem, 'id'>) => {
      setAgenda((prev) => [...prev, { ...item, id: Math.random().toString(36) }])
      logAction(`CRIOU COMPROMISSO NA AGENDA: ${item.title}`)
    },
    [logAction],
  )

  const removeAgendaItem = useCallback(
    (id: string) => {
      const item = storeRef.current.agenda.find((i) => i.id === id)
      setAgenda((prev) => prev.filter((i) => i.id !== id))
      logAction(`REMOVEU COMPROMISSO: ${item ? item.title : id}`)
    },
    [logAction],
  )

  const addAccess = useCallback(
    (item: Omit<AccessItem, 'id'>) => {
      setAcessos((prev) => [...prev, { ...item, id: Math.random().toString(36) }])
      logAction(`CRIOU CREDENCIAL DE ACESSO: ${item.platform}`)
    },
    [logAction],
  )

  const updateAccess = useCallback(
    (id: string, item: Partial<AccessItem>) => {
      const acc = storeRef.current.acessos.find((a) => a.id === id)
      setAcessos((prev) => prev.map((a) => (a.id === id ? { ...a, ...item } : a)))
      logAction(`ATUALIZOU CREDENCIAL DE ACESSO: ${acc ? acc.platform : id}`)
    },
    [logAction],
  )

  const removeAccess = useCallback(
    (id: string) => {
      const acc = storeRef.current.acessos.find((a) => a.id === id)
      setAcessos((prev) => prev.filter((i) => i.id !== id))
      logAction(`REMOVEU CREDENCIAL DE ACESSO: ${acc ? acc.platform : id}`)
    },
    [logAction],
  )

  const addSupplier = useCallback(
    (item: Omit<Supplier, 'id'>) => {
      setSuppliers((prev) => [...prev, { ...item, id: Math.random().toString(36) }])
      logAction(`CRIOU FORNECEDOR: ${item.name}`)
    },
    [logAction],
  )

  const updateSupplier = useCallback(
    (id: string, item: Partial<Supplier>) => {
      const sup = storeRef.current.suppliers.find((s) => s.id === id)
      setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)))
      logAction(`ATUALIZOU FORNECEDOR: ${sup ? sup.name : id}`)
    },
    [logAction],
  )

  const removeSupplier = useCallback(
    (id: string) => {
      const sup = storeRef.current.suppliers.find((s) => s.id === id)
      setSuppliers((prev) => prev.filter((i) => i.id !== id))
      logAction(`REMOVEU FORNECEDOR: ${sup ? sup.name : id}`)
    },
    [logAction],
  )

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
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
      levelPermissions,
      auditLogs,
      login,
      logout,
      toggleAdmin,
      setCurrentUser,
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
      addPurchaseHistory,
      addEmployee,
      deleteEmployee,
      updateEmployeeStatus,
      updateEmployeeLevel,
      updateEmployeeAgendaAccess,
      updateEmployeePermissions,
      updateLevelPermissions,
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
      isAdmin,
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
      levelPermissions,
      auditLogs,
      login,
      logout,
      toggleAdmin,
      setCurrentUser,
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
      addPurchaseHistory,
      addEmployee,
      deleteEmployee,
      updateEmployeeStatus,
      updateEmployeeLevel,
      updateEmployeeAgendaAccess,
      updateEmployeePermissions,
      updateLevelPermissions,
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
