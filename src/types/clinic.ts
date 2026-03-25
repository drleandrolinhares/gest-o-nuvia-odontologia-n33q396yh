export type ConsultorioWeeklySchedule = {
  id?: string
  consultorio_id?: string
  day_of_week: number
  morning_start: string | null
  morning_end: string | null
  afternoon_start: string | null
  afternoon_end: string | null
  is_closed: boolean
}

export type Consultorio = {
  id: string
  name: string
  morning_start?: string | null
  morning_end?: string | null
  afternoon_start?: string | null
  afternoon_end?: string | null
  schedules?: ConsultorioWeeklySchedule[]
}

export type SpecialtyConfig = {
  id: string
  name: string
  color_hex: string
  created_at?: string
}
