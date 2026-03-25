import { AppSettings, PriceItem } from '@/stores/main'

export function getCostPerMinute(settings: AppSettings | null): number {
  if (!settings) return 0
  const totalFixed = (settings.hourly_cost_fixed_items || []).reduce(
    (acc, item) => acc + (Number(item.value) || 0),
    0,
  )
  const hours = Number(settings.hourly_cost_monthly_hours ?? 160)
  if (hours <= 0) return 0

  const lossPct = Number(settings.predicted_loss_percentage ?? 20)
  const evalPct = Number(settings.evaluation_factor_percentage ?? 15)

  const lossHours = hours * (lossPct / 100)
  const effectiveHours = Math.max(0.1, hours - lossHours)

  const baseHourlyCost = totalFixed / effectiveHours
  const finalHourlyCost = baseHourlyCost * (1 + evalPct / 100)

  return finalHourlyCost / 60
}

export function calculateProfitability(item: Partial<PriceItem>, settings: AppSettings | null) {
  const costPerMinute = getCostPerMinute(settings)
  const price = Number(item.price) || 0
  const execTime = Number(item.execution_time) || 0
  const fixedCost = execTime * costPerMinute
  const materialCost = Number(item.material_cost) || 0
  const cadistaCost = Number(item.cadista_cost) || 0

  const cardFeePct = Number(settings?.global_card_fee || 0)
  const commissionPct = Number(settings?.global_commission || 0)
  const taxesPct = Number(settings?.global_taxes || 0)
  const defaultPct = Number(settings?.global_inadimplency || 0)

  const cardFee = price * (cardFeePct / 100)
  const commission = price * (commissionPct / 100)
  const taxes = price * (taxesPct / 100)
  const defaultFee = price * (defaultPct / 100)

  const taxesAndFees = cardFee + commission + taxes + defaultFee
  const totalCost = fixedCost + materialCost + cadistaCost + taxesAndFees

  const netProfit = price - totalCost
  const marginPct = price > 0 ? (netProfit / price) * 100 : 0

  return {
    fixedCost,
    materialCost,
    cadistaCost,
    cardFee,
    commission,
    taxes,
    defaultFee,
    taxesAndFees,
    totalCost,
    netProfit,
    marginPct,
    costPerMinute,
    cardFeePct,
    commissionPct,
    taxesPct,
    defaultPct,
  }
}

export function getMarginColor(marginPct: number) {
  if (marginPct >= 20)
    return {
      bg: 'bg-emerald-500',
      text: 'text-white',
      border: 'border-emerald-600',
      lightBg: 'bg-emerald-50',
      textDark: 'text-emerald-700',
    }
  if (marginPct >= 10)
    return {
      bg: 'bg-amber-500',
      text: 'text-white',
      border: 'border-amber-600',
      lightBg: 'bg-amber-50',
      textDark: 'text-amber-700',
    }
  return {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
    lightBg: 'bg-red-50',
    textDark: 'text-red-700',
  }
}
