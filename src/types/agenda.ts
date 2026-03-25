export type AgendaItem = {
  id: string
  title: string
  date: string
  end_date?: string
  time: string
  location: string
  type: string
  assignedTo?: string
  involvesThirdParty?: boolean
  thirdPartyDetails?: string
  createdBy?: string
  is_completed?: boolean
  requester_id?: string
  received_at?: string
  completed_at?: string
  created_at?: string
  sac_record_id?: string
  periodicity?: string
}

export type AgendaSegmentation = {
  id: string
  consultorio_id: string
  day_of_week: number
  shift: 'MANHÃ' | 'TARDE'
  specialty_id?: string
  dentist_id?: string
}
