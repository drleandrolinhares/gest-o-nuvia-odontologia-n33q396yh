export type KpiFormat = 'currency' | 'number' | 'percentage'

export interface KpiHistory {
  period: string
  value: number
}

export interface KpiData {
  id: string
  name: string
  target: number
  current: number
  format: KpiFormat
  invert?: boolean
  date?: string
  history?: KpiHistory[]
}
