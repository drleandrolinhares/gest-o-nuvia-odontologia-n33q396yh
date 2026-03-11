import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

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
  clearInventory: () => void
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

  const [levelPermissions, setLevelPermissions] = useState<Record<string, string[]>>({
    OPERACIONAL: ['dashboard', 'agenda'],
    ADMINISTRATIVO: ['dashboard', 'agenda', 'acessos', 'rh', 'estoque', 'configuracoes'],
  })

  const login = useCallback(
    (email: string, pass: string) => {
      if (email === 'admin@nuvia.com' && pass === 'admin123') {
        setIsAdmin(true)
        setCurrentUserId(null)
        setIsAuthenticated(true)
        return true
      }
      const emp = employees.find((e) => e.email === email && e.password === pass)
      if (emp) {
        setIsAdmin(false)
        setCurrentUserId(emp.id)
        setIsAuthenticated(true)
        return true
      }
      return false
    },
    [employees],
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUserId(null)
    setIsAdmin(false)
  }, [])

  const toggleAdmin = useCallback(() => setIsAdmin((prev) => !prev), [])
  const setCurrentUser = useCallback((id: string | null) => setCurrentUserId(id), [])

  const addDepartment = useCallback((name: string) => setDepartments((prev) => [...prev, name]), [])
  const removeDepartment = useCallback(
    (name: string) => setDepartments((prev) => prev.filter((d) => d !== name)),
    [],
  )
  const addPackageType = useCallback(
    (name: string) => setPackageTypes((prev) => [...prev, name]),
    [],
  )
  const removePackageType = useCallback(
    (name: string) => setPackageTypes((prev) => prev.filter((pt) => pt !== name)),
    [],
  )
  const addSpecialty = useCallback((name: string) => setSpecialties((prev) => [...prev, name]), [])
  const removeSpecialty = useCallback(
    (name: string) => setSpecialties((prev) => prev.filter((s) => s !== name)),
    [],
  )
  const addAgendaType = useCallback((name: string) => setAgendaTypes((prev) => [...prev, name]), [])
  const removeAgendaType = useCallback(
    (name: string) => setAgendaTypes((prev) => prev.filter((t) => t !== name)),
    [],
  )

  const toggleTask = useCallback((candidateId: string, taskId: string) => {
    setOnboarding((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
            }
          : c,
      ),
    )
  }, [])

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
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
  }, [])

  const updateInventoryQuantity = useCallback((id: string, newQuantity: number) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)))
  }, [])

  const addPurchaseHistory = useCallback((itemId: string, record: Omit<PurchaseRecord, 'id'>) => {
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
  }, [])

  const clearInventory = useCallback(() => setInventory([]), [])

  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
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
  }, [])

  const deleteEmployee = useCallback(
    (id: string) => setEmployees((prev) => prev.filter((e) => e.id !== id)),
    [],
  )

  const updateEmployeeStatus = useCallback(
    (id: string, status: Employee['status']) =>
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e))),
    [],
  )

  const updateEmployeeLevel = useCallback(
    (id: string, level: Employee['accessLevel']) =>
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, accessLevel: level } : e))),
    [],
  )

  const updateEmployeeAgendaAccess = useCallback(
    (id: string, access: AgendaAccess) =>
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, agendaAccess: access } : e))),
    [],
  )
  const updateEmployeePermissions = useCallback(
    (id: string, permissions: string[]) =>
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, permissions } : e))),
    [],
  )

  const updateLevelPermissions = useCallback(
    (level: string, perms: string[]) =>
      setLevelPermissions((prev) => ({ ...prev, [level]: perms })),
    [],
  )

  const addOnboardingTask = useCallback((candidateId: string, title: string) => {
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
  }, [])
  const removeOnboardingTask = useCallback((candidateId: string, taskId: string) => {
    setOnboarding((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c,
      ),
    )
  }, [])

  const addDocument = useCallback(
    (name: string) =>
      setDocuments((prev) => [
        ...prev,
        { id: Math.random().toString(36), name, date: new Date().toLocaleDateString('pt-BR') },
      ]),
    [],
  )
  const removeDocument = useCallback(
    (id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id)),
    [],
  )
  const addAgendaItem = useCallback(
    (item: Omit<AgendaItem, 'id'>) =>
      setAgenda((prev) => [...prev, { ...item, id: Math.random().toString(36) }]),
    [],
  )
  const removeAgendaItem = useCallback(
    (id: string) => setAgenda((prev) => prev.filter((i) => i.id !== id)),
    [],
  )
  const addAccess = useCallback(
    (item: Omit<AccessItem, 'id'>) =>
      setAcessos((prev) => [...prev, { ...item, id: Math.random().toString(36) }]),
    [],
  )
  const updateAccess = useCallback(
    (id: string, item: Partial<AccessItem>) =>
      setAcessos((prev) => prev.map((a) => (a.id === id ? { ...a, ...item } : a))),
    [],
  )
  const removeAccess = useCallback(
    (id: string) => setAcessos((prev) => prev.filter((i) => i.id !== id)),
    [],
  )
  const addSupplier = useCallback(
    (item: Omit<Supplier, 'id'>) =>
      setSuppliers((prev) => [...prev, { ...item, id: Math.random().toString(36) }]),
    [],
  )
  const updateSupplier = useCallback(
    (id: string, item: Partial<Supplier>) =>
      setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s))),
    [],
  )
  const removeSupplier = useCallback(
    (id: string) => setSuppliers((prev) => prev.filter((i) => i.id !== id)),
    [],
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
      clearInventory,
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
      clearInventory,
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
