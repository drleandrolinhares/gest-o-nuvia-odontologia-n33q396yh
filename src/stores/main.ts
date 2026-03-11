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

interface AppStore {
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  inventory: InventoryItem[]
  toggleTask: (candidateId: string, taskId: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryQuantity: (id: string, newQuantity: number) => void
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
  {
    id: '3',
    name: 'Mariana Costa',
    role: 'Recepcionista',
    department: 'Atendimento',
    status: 'Ativo',
    hireDate: '2024-02-01',
    salary: 'R$ 2.500',
    vacationDaysTaken: 0,
    vacationDaysTotal: 30,
    email: 'mariana.costa@nuvia.com',
    phone: '(11) 97777-6666',
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
      { id: 't3', title: 'Treinamento de Biossegurança', completed: false },
      { id: 't4', title: 'Acesso ao Sistema Nuvia', completed: false },
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
  {
    id: '3',
    name: 'Agulha Gengival',
    category: 'Descartáveis',
    quantity: 150,
    unit: 'Unidades',
    threshold: 100,
    lastRestocked: '2026-02-15',
  },
]

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>([
    'Carlos Santos: Retorna de férias em 2 dias.',
    'Mariana Costa: Vencimento do período aquisitivo de férias no próximo mês.',
  ])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)

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

  return React.createElement(
    StoreContext.Provider,
    {
      value: {
        employees,
        alerts,
        onboarding,
        inventory,
        toggleTask,
        addInventoryItem,
        updateInventoryQuantity,
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
