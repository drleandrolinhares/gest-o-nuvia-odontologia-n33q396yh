import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

export type AgendaAccess = 'VIEW_ONLY' | 'ADD_EDIT'

export type Employee = {
  id: string
  name: string
  role: string
  department: string
  status: 'Ativo' | 'Férias' | 'Aviso Prévio'
  hireDate: string
  salary: string
  vacationDaysTaken: number
  vacationDaysTotal: number
  vacationDueDate: string
  email: string
  phone: string
  agendaAccess: AgendaAccess
  password?: string
}

export type OnboardingTask = { id: string; title: string; completed: boolean }

export type OnboardingCandidate = {
  id: string
  name: string
  role: string
  department: string
  tasks: OnboardingTask[]
}

export type PurchaseRecord = { id: string; date: string; price: number; quantity: number }

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
  purchaseHistory?: PurchaseRecord[]
}

export type DocumentItem = { id: string; name: string; date: string }

export type AgendaItem = {
  id: string
  title: string
  date: string
  type: string
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

interface AppStore {
  isAuthenticated: boolean
  isAdmin: boolean
  currentUserId: string | null
  departments: string[]
  packageTypes: string[]
  specialties: string[]
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  documents: DocumentItem[]
  agenda: AgendaItem[]
  acessos: AccessItem[]
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
  toggleTask: (candidateId: string, taskId: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, newQuantity: number) => void
  addPurchaseHistory: (itemId: string, record: Omit<PurchaseRecord, 'id'>) => void
  addEmployee: (emp: Omit<Employee, 'id'>) => void
  deleteEmployee: (id: string) => void
  updateEmployeeAgendaAccess: (id: string, access: AgendaAccess) => void
  addOnboardingTask: (candidateId: string, title: string) => void
  removeOnboardingTask: (candidateId: string, taskId: string) => void
  addDocument: (name: string) => void
  removeDocument: (id: string) => void
  addAgendaItem: (item: Omit<AgendaItem, 'id'>) => void
  removeAgendaItem: (id: string) => void
  addAccess: (item: Omit<AccessItem, 'id'>) => void
  removeAccess: (id: string) => void
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

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Dentista Clínica',
    department: 'Odontologia',
    status: 'Ativo',
    hireDate: '2023-01-15',
    salary: 'R$ 8.500',
    vacationDaysTaken: 10,
    vacationDaysTotal: 30,
    vacationDueDate: '2024-01-15',
    email: 'ana.silva@nuvia.com',
    phone: '(11) 98765-4321',
    agendaAccess: 'ADD_EDIT',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    role: 'Ortodontista',
    department: 'Odontologia',
    status: 'Férias',
    hireDate: '2022-06-10',
    salary: 'R$ 12.000',
    vacationDaysTaken: 30,
    vacationDaysTotal: 30,
    vacationDueDate: '2023-06-10',
    email: 'carlos.santos@nuvia.com',
    phone: '(11) 99999-8888',
    agendaAccess: 'VIEW_ONLY',
    password: 'password123',
  },
]

const mockOnboarding: OnboardingCandidate[] = [
  {
    id: 'o1',
    name: 'Fernanda Lima',
    role: 'Auxiliar de Saúde Bucal',
    department: 'Operacional',
    tasks: [
      { id: 't1', title: 'Assinatura de Contrato', completed: true },
      { id: 't2', title: 'Entrega de EPIs', completed: false },
    ],
  },
]

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
    expirationDate: '2025-10-01T12:00:00.000Z',
    purchaseHistory: [
      { id: 'h1', date: '2023-09-15T10:00:00.000Z', price: 80.0, quantity: 5 },
      { id: 'h2', date: '2023-10-01T12:00:00.000Z', price: 85.5, quantity: 7 },
    ],
  },
  {
    id: '2',
    name: 'Braquetes Metálicos Roth',
    packageCost: 150.0,
    storageLocation: 'ESTOQUE CENTRAL - PRATELEIRA 3',
    packageType: 'Caixa',
    itemsPerBox: 20,
    minStock: 2,
    quantity: 5,
    specialty: 'Ortodontia',
    brand: 'Morelli',
    entryDate: '2023-11-15T12:00:00.000Z',
    purchaseHistory: [{ id: 'h3', date: '2023-11-15T12:00:00.000Z', price: 150.0, quantity: 5 }],
  },
]

const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'POP - Onboarding e Admissão v2.pdf', date: '10/01/2026' },
  { id: '2', name: 'Manual de Conduta Nuvia.pdf', date: '15/02/2026' },
]

const mockAgenda: AgendaItem[] = [
  {
    id: '1',
    title: 'Reunião de Alinhamento Semanal',
    date: new Date().toISOString(),
    type: 'Reunião',
  },
  {
    id: '2',
    title: 'Auditoria Odontológica',
    date: new Date(Date.now() + 86400000).toISOString(),
    type: 'Consulta',
  },
]

const mockAcessos: AccessItem[] = [
  {
    id: '1',
    platform: 'Portal Nuvia Admin',
    url: 'https://admin.nuvia.com',
    login: 'admin@nuvia.com',
    pass: 'Nuvia@2026!',
    instructions: 'Acesso restrito à diretoria.',
  },
  {
    id: '2',
    platform: 'Fornecedor Dental Cremer',
    url: 'https://dentalcremer.com.br',
    login: 'compras@nuvia.com',
    pass: 'CremerBuy123',
    instructions: 'Usar para reposição de resinas e EPIs.',
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
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>(['Carlos Santos: Retorna de férias em 2 dias.'])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)
  const [agenda, setAgenda] = useState<AgendaItem[]>(mockAgenda)
  const [acessos, setAcessos] = useState<AccessItem[]>(mockAcessos)

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
          }
        }
        return item
      }),
    )
  }, [])

  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11)
    setEmployees((prev) => [...prev, { ...emp, id }])
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
  const updateEmployeeAgendaAccess = useCallback(
    (id: string, access: AgendaAccess) =>
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, agendaAccess: access } : e))),
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
  const removeAccess = useCallback(
    (id: string) => setAcessos((prev) => prev.filter((i) => i.id !== id)),
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
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      agenda,
      acessos,
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
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      addPurchaseHistory,
      addEmployee,
      deleteEmployee,
      updateEmployeeAgendaAccess,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
      addAgendaItem,
      removeAgendaItem,
      addAccess,
      removeAccess,
    }),
    [
      isAuthenticated,
      isAdmin,
      currentUserId,
      departments,
      packageTypes,
      specialties,
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      agenda,
      acessos,
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
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      addPurchaseHistory,
      addEmployee,
      deleteEmployee,
      updateEmployeeAgendaAccess,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
      addAgendaItem,
      removeAgendaItem,
      addAccess,
      removeAccess,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
