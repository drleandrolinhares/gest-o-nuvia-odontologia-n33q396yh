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
  morning_start?: string
  morning_end?: string
  afternoon_start?: string
  afternoon_end?: string
  morning_snack_start?: string
  morning_snack_end?: string
  afternoon_snack_start?: string
  afternoon_snack_end?: string
  total_daily_hours: number
}
export type Employee = {
  id: string
  user_id: string | null
  name: string
  username?: string
  role: string
  department: string
  status: 'Ativo' | 'Desligado'
  hireDate?: string
  salary?: string
  vacationDaysTaken?: number
  vacationDaysTotal?: number
  vacationDueDate?: string
  email?: string
  phone?: string
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
  pixNumber?: string
  pixType?: string
  bankName?: string
  noSystemAccess?: boolean
}
