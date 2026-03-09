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

interface AppStore {
  employees: Employee[]
  alerts: string[]
  onboarding: OnboardingCandidate[]
  toggleTask: (candidateId: string, taskId: string) => void
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Dentista Clínica',
    department: 'Operacional',
    status: 'Ativo',
    hireDate: '2023-01-15',
    salary: 'R$ 8.500',
    vacationDaysTaken: 10,
    vacationDaysTotal: 30,
  },
  {
    id: '2',
    name: 'Carlos Santos',
    role: 'Ortodontista',
    department: 'Operacional',
    status: 'Férias',
    hireDate: '2022-06-10',
    salary: 'R$ 12.000',
    vacationDaysTaken: 30,
    vacationDaysTotal: 30,
  },
  {
    id: '3',
    name: 'Mariana Costa',
    role: 'Recepcionista',
    department: 'Administrativo',
    status: 'Ativo',
    hireDate: '2024-02-01',
    salary: 'R$ 2.500',
    vacationDaysTaken: 0,
    vacationDaysTotal: 30,
  },
  {
    id: '4',
    name: 'João Mendes',
    role: 'Gerente Financeiro',
    department: 'Financeiro',
    status: 'Ativo',
    hireDate: '2021-11-20',
    salary: 'R$ 9.000',
    vacationDaysTaken: 15,
    vacationDaysTotal: 30,
  },
  {
    id: '5',
    name: 'Patricia Leme',
    role: 'Diretora Estratégica',
    department: 'Estratégico',
    status: 'Ativo',
    hireDate: '2020-03-05',
    salary: 'R$ 18.000',
    vacationDaysTaken: 25,
    vacationDaysTotal: 30,
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

const StoreContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees] = useState<Employee[]>(mockEmployees)
  const [alerts] = useState<string[]>([
    'Carlos Santos: Retorna de férias em 2 dias.',
    'Mariana Costa: Vencimento do período aquisitivo de férias no próximo mês.',
    'Novo colaborador: Fernanda Lima inicia o onboarding na próxima segunda.',
  ])
  const [onboarding, setOnboarding] = useState<OnboardingCandidate[]>(mockOnboarding)

  const toggleTask = (candidateId: string, taskId: string) => {
    setOnboarding((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          }
        }
        return c
      }),
    )
  }

  return React.createElement(
    StoreContext.Provider,
    {
      value: { employees, alerts, onboarding, toggleTask },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
