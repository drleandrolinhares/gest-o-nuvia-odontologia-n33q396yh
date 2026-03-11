import React, { createContext, useContext, useState, ReactNode } from 'react'

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
  category: string
  quantity: number
  unit: string
  threshold: number
  lastRestocked: string
}

export type DocumentItem = {
  id: string
  name: string
  date: string
}

interface AppStore {
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  documents: DocumentItem[]
  toggleTask: (candidateId: string, taskId: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, newQuantity: number) => void
  addEmployee: (emp: Omit<Employee, 'id'>) => void
  addOnboardingTask: (candidateId: string, title: string) => void
  removeOnboardingTask: (candidateId: string, taskId: string) => void
  addDocument: (name: string) => void
  removeDocument: (id: string) => void
}

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
    name: 'Resina Composta',
    category: 'Materiais Clínicos',
    quantity: 15,
    unit: 'Seringas',
    threshold: 10,
    lastRestocked: '2026-02-20',
  },
  {
    id: '2',
    name: 'Luvas de Procedimento (M)',
    category: 'EPIs',
    quantity: 5,
    unit: 'Caixas',
    threshold: 20,
    lastRestocked: '2026-03-01',
  },
]

const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'POP - Onboarding e Admissão v2.pdf', date: '10/01/2026' },
  { id: '2', name: 'Manual de Conduta Nuvia.pdf', date: '15/02/2026' },
]

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>(['Carlos Santos: Retorna de férias em 2 dias.'])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)

  const toggleTask = (candidateId: string, taskId: string) => {
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
  }

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventory((prev) => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateInventoryQuantity = (id: string, newQuantity: number) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)))
  }

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setEmployees((prev) => [...prev, { ...emp, id }])

    // Auto-create onboarding process
    setOnboarding((prev) => [
      ...prev,
      {
        id: `o_${id}`,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        tasks: [
          {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Assinatura de Contrato',
            completed: false,
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Entrega de EPIs',
            completed: false,
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Acesso ao Sistema Nuvia',
            completed: false,
          },
        ],
      },
    ])
  }

  const addOnboardingTask = (candidateId: string, title: string) => {
    setOnboarding((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              tasks: [
                ...c.tasks,
                { id: Math.random().toString(36).substr(2, 9), title, completed: false },
              ],
            }
          : c,
      ),
    )
  }

  const removeOnboardingTask = (candidateId: string, taskId: string) => {
    setOnboarding((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c,
      ),
    )
  }

  const addDocument = (name: string) => {
    setDocuments((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        date: new Date().toLocaleDateString('pt-BR'),
      },
    ])
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  return React.createElement(
    StoreContext.Provider,
    {
      value: {
        employees,
        alerts,
        onboarding,
        inventory,
        documents,
        toggleTask,
        addInventoryItem,
        updateInventoryQuantity,
        addEmployee,
        addOnboardingTask,
        removeOnboardingTask,
        addDocument,
        removeDocument,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
