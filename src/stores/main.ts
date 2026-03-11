import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

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
}

export type OnboardingTask = {
  id: string
  title: string
  completed: boolean
}

export type OnboardingCandidate = {
  id: string
  name: string
  role: string
  department: string
  tasks: OnboardingTask[]
}

export type InventoryItem = {
  id: string
  name: string
  packageCost: number
  storageLocation: string
  packageType: string
  itemsPerBox: number
  productionYield: number
  minStock: number
  unitCost: number
  quantity: number
  lastBrand?: string
  lastValue?: number
  notes?: string
}

export type DocumentItem = {
  id: string
  name: string
  date: string
}

interface AppStore {
  isAdmin: boolean
  departments: string[]
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  documents: DocumentItem[]
  toggleAdmin: () => void
  addDepartment: (name: string) => void
  removeDepartment: (name: string) => void
  toggleTask: (candidateId: string, taskId: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, newQuantity: number) => void
  addEmployee: (emp: Omit<Employee, 'id'>) => void
  deleteEmployee: (id: string) => void
  addOnboardingTask: (candidateId: string, title: string) => void
  removeOnboardingTask: (candidateId: string, taskId: string) => void
  addDocument: (name: string) => void
  removeDocument: (id: string) => void
}

const mockDepartments = ['Odontologia', 'Operacional', 'Administrativo', 'Recepção']

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
    name: 'resina',
    packageCost: 10,
    storageLocation: 'SALA 1 - ARMÁRIO A',
    packageType: 'Caixa',
    itemsPerBox: 1,
    productionYield: 1,
    minStock: 0,
    unitCost: 10,
    quantity: 1,
  },
  {
    id: '2',
    name: 'teste',
    packageCost: 100,
    storageLocation: 'asdasd',
    packageType: 'Caixa',
    itemsPerBox: 1,
    productionYield: 10,
    minStock: 0,
    unitCost: 10,
    quantity: 0,
  },
]

const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'POP - Onboarding e Admissão v2.pdf', date: '10/01/2026' },
  { id: '2', name: 'Manual de Conduta Nuvia.pdf', date: '15/02/2026' },
]

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true)
  const [departments, setDepartments] = useState<string[]>(mockDepartments)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>(['Carlos Santos: Retorna de férias em 2 dias.'])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)

  const toggleAdmin = useCallback(() => setIsAdmin((prev) => !prev), [])

  const addDepartment = useCallback((name: string) => {
    setDepartments((prev) => [...prev, name])
  }, [])

  const removeDepartment = useCallback((name: string) => {
    setDepartments((prev) => prev.filter((d) => d !== name))
  }, [])

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
    setInventory((prev) => [...prev, { ...item, id: Math.random().toString(36).substring(2, 11) }])
  }, [])

  const updateInventoryQuantity = useCallback((id: string, newQuantity: number) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)))
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
          {
            id: Math.random().toString(36).substring(2, 11),
            title: 'Assinatura de Contrato',
            completed: false,
          },
          {
            id: Math.random().toString(36).substring(2, 11),
            title: 'Entrega de EPIs',
            completed: false,
          },
          {
            id: Math.random().toString(36).substring(2, 11),
            title: 'Acesso ao Sistema Nuvia',
            completed: false,
          },
        ],
      },
    ])
  }, [])

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const addOnboardingTask = useCallback((candidateId: string, title: string) => {
    setOnboarding((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              tasks: [
                ...c.tasks,
                { id: Math.random().toString(36).substring(2, 11), title, completed: false },
              ],
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

  const addDocument = useCallback((name: string) => {
    setDocuments((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 11),
        name,
        date: new Date().toLocaleDateString('pt-BR'),
      },
    ])
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      isAdmin,
      departments,
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      toggleAdmin,
      addDepartment,
      removeDepartment,
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      addEmployee,
      deleteEmployee,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
    }),
    [
      isAdmin,
      departments,
      employees,
      alerts,
      onboarding,
      inventory,
      documents,
      toggleAdmin,
      addDepartment,
      removeDepartment,
      toggleTask,
      addInventoryItem,
      updateInventoryQuantity,
      addEmployee,
      deleteEmployee,
      addOnboardingTask,
      removeOnboardingTask,
      addDocument,
      removeDocument,
    ],
  )

  return React.createElement(StoreContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
