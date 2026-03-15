import { AppSettings, PriceList } from '@/stores/main'

export function calculateProfitability(item: Partial<PriceList>, appSettings: AppSettings | null) {
  const price = Number(item.price) || 0
  const execTime = Number(item.execution_time) || 0
  const cadista = Number(item.cadista_cost) || 0
  const material = Number(item.material_cost) || 0

  let costPerMin = 0
  if (appSettings && appSettings.hourly_cost_monthly_hours > 0) {
    const totalFixed = appSettings.hourly_cost_fixed_items.reduce(
      (acc, f) => acc + Number(f.value),
      0,
    )
    costPerMin = totalFixed / (appSettings.hourly_cost_monthly_hours * 60)
  }

  const fixedCost = execTime * costPerMin

  let globalFeesPerc = 0
  if (appSettings) {
    globalFeesPerc =
      Number(appSettings.global_card_fee || 0) +
      Number(appSettings.global_commission || 0) +
      Number(appSettings.global_inadimplency || 0) +
      Number(appSettings.global_taxes || 0)
  }

  const globalFeesVal = price * (globalFeesPerc / 100)
  const totalCost = fixedCost + cadista + material + globalFeesVal
  const netProfit = price - totalCost
  const margin = price > 0 ? (netProfit / price) * 100 : 0

  return {
    costPerMin,
    fixedCost,
    globalFeesPerc,
    globalFeesVal,
    totalCost,
    netProfit,
    margin,
  }
}

export function getMarginColor(margin: number) {
  if (margin > 20) return 'text-emerald-600 bg-emerald-100 border-emerald-200'
  if (margin >= 10) return 'text-amber-600 bg-amber-100 border-amber-200'
  return 'text-red-600 bg-red-100 border-red-200'
}

export function getMarginColorHex(margin: number) {
  if (margin > 20) return '#059669'
  if (margin >= 10) return '#d97706'
  return '#dc2626'
}
