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
  bonusType?: string
  bonusRules?: string
  bonusDueDate?: string
  pix_number?: string
  pix_type?: string
  bank_name?: string
  noSystemAccess?: boolean
}

export type OnboardingTask = { id: string; title: string; completed: boolean }

export type OnboardingCandidate = {
  id: string
  name: string
  role: string
  department: string
  tasks: OnboardingTask[]
}

export type EmployeeDocument = {
  id: string
  employee_id: string
  file_name: string
  file_path: string
  created_at: string
}

export type WorkSchedule = {
  id: string
  employee_id: string
  work_date: string
  morning_start: string | null
  morning_end: string | null
  afternoon_start: string | null
  afternoon_end: string | null
  morning_snack_start: string | null
  morning_snack_end: string | null
  afternoon_snack_start: string | null
  afternoon_snack_end: string | null
  total_daily_hours: number | null
}
