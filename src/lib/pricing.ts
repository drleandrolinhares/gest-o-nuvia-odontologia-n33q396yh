import { AppSettings, PriceItem } from '@/stores/main'

export function getCostPerMinute(settings: AppSettings | null): number {
  if (!settings) return 0
  const totalFixed = (settings.hourly_cost_fixed_items || []).reduce(
    (acc, item) => acc + (Number(item.value) || 0),
    0,
  )
  const hours = Number(settings.hourly_cost_monthly_hours) || 160
  if (hours === 0) return 0
  return totalFixed / (hours * 60)
}

export function calculateProfitability(item: Partial<PriceItem>, settings: AppSettings | null) {
  const costPerMinute = getCostPerMinute(settings)
  const price = Number(item.price) || 0
  const execTime = Number(item.execution_time) || 0
  const fixedCost = execTime * costPerMinute
  const materialCost = Number(item.material_cost) || 0
  const cadistaCost = Number(item.cadista_cost) || 0

  const feePct = settings
    ? (Number(settings.global_card_fee || 0) +
        Number(settings.global_commission || 0) +
        Number(settings.global_inadimplency || 0) +
        Number(settings.global_taxes || 0)) /
      100
    : 0

  const taxesAndFees = price * feePct

  const netProfit = price - (fixedCost + materialCost + cadistaCost + taxesAndFees)
  const marginPct = price > 0 ? (netProfit / price) * 100 : 0

  return { fixedCost, taxesAndFees, netProfit, marginPct, costPerMinute }
}

export function getMarginColor(marginPct: number) {
  if (marginPct >= 20)
    return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
  if (marginPct >= 10)
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' }
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
}
