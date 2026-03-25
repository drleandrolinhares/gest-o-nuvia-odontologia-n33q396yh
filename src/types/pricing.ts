export type FixedExpenseDetail = {
  id: string
  description: string
  amount: number
  is_annual?: boolean
}

export type FixedExpense = {
  id: string
  label: string
  value: number
  details?: FixedExpenseDetail[]
}

export type NegotiationSettings = {
  ranges: { min: number; max: number; maxInstallments: number }[]
  defaultEntryPercentage: number
  discounts?: {
    level1: number
    level2: number
    level3: number
    level4: number
  }
}

export type AppSettings = {
  id: string
  global_card_fee: number
  global_commission: number
  global_inadimplency: number
  global_taxes: number
  hourly_cost_fixed_items: FixedExpense[]
  hourly_cost_monthly_hours: number
  predicted_loss_percentage: number
  evaluation_factor_percentage: number
  negotiation_settings?: NegotiationSettings
}

export type PriceItem = {
  id: string
  work_type: string
  category: string
  material: string | null
  price: number
  sector: string | null
  execution_time: number
  cadista_cost: number
  material_cost: number
  fixed_cost: number
}
