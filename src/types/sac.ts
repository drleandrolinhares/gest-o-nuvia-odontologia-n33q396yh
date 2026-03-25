export type SacActionHistory = {
  action: string
  user_name?: string
  user_id?: string
  employeeName?: string
  timestamp: string
}

export type SacRecord = {
  id: string
  type: 'RECLAMAÇÃO' | 'SUGESTÃO'
  patient_name: string
  receiving_employee_id?: string
  responsible_employee_id?: string
  status: 'OPORTUNIDADE DE SOLUÇÃO' | 'RECEBIDO' | 'SENDO TRATADO' | 'RESOLVIDO'
  sector: string
  description: string
  solution_details?: string
  received_at: string
  limit_at: string
  solved_at?: string
  created_at: string
  action_history?: SacActionHistory[]
}
