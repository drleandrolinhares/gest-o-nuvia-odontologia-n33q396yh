import { describe, it, expect } from 'vitest'
import { getCostPerMinute, calculateProfitability, getMarginColor } from '@/lib/pricing'
import type { AppSettings } from '@/types/pricing'

const makeSettings = (overrides: Partial<AppSettings> = {}): AppSettings => ({
  id: 'test',
  hourly_cost_fixed_items: [
    { id: '1', label: 'Aluguel', value: 5000 },
    { id: '2', label: 'Salários', value: 15000 },
  ],
  hourly_cost_monthly_hours: 160,
  predicted_loss_percentage: 20,
  evaluation_factor_percentage: 15,
  global_card_fee: 3,
  global_commission: 5,
  global_taxes: 8,
  global_inadimplency: 2,
  ...overrides,
})

// ─── getCostPerMinute ────────────────────────────────────────────────────────

describe('getCostPerMinute', () => {
  it('retorna 0 quando settings é null', () => {
    expect(getCostPerMinute(null)).toBe(0)
  })

  it('retorna 0 quando horas mensais são 0', () => {
    expect(getCostPerMinute(makeSettings({ hourly_cost_monthly_hours: 0 }))).toBe(0)
  })

  it('calcula corretamente com valores padrão', () => {
    const settings = makeSettings()
    const result = getCostPerMinute(settings)
    // totalFixed = 20000, effectiveHours = 160 * (1 - 0.20) = 128
    // baseHourlyCost = 20000 / 128 = 156.25
    // finalHourlyCost = 156.25 * 1.15 = 179.6875
    // costPerMinute = 179.6875 / 60 ≈ 2.9948
    expect(result).toBeCloseTo(2.9948, 2)
  })

  it('retorna valor maior quando há menos horas disponíveis', () => {
    const base = getCostPerMinute(makeSettings({ hourly_cost_monthly_hours: 160 }))
    const less = getCostPerMinute(makeSettings({ hourly_cost_monthly_hours: 80 }))
    expect(less).toBeGreaterThan(base)
  })

  it('retorna 0 quando não há itens de custo fixo', () => {
    const result = getCostPerMinute(makeSettings({ hourly_cost_fixed_items: [] }))
    expect(result).toBe(0)
  })
})

// ─── calculateProfitability ───────────────────────────────────────────────────

describe('calculateProfitability', () => {
  it('retorna todos os campos esperados', () => {
    const settings = makeSettings()
    const result = calculateProfitability(
      { price: 500, execution_time: 60, material_cost: 50, cadista_cost: 0 },
      settings,
    )
    expect(result).toHaveProperty('fixedCost')
    expect(result).toHaveProperty('netProfit')
    expect(result).toHaveProperty('marginPct')
    expect(result).toHaveProperty('totalCost')
    expect(result).toHaveProperty('costPerMinute')
  })

  it('marginPct é 0 quando price é 0', () => {
    const result = calculateProfitability(
      { price: 0, execution_time: 30, material_cost: 0, cadista_cost: 0 },
      makeSettings(),
    )
    expect(result.marginPct).toBe(0)
  })

  it('lucro líquido é positivo quando preço cobre todos os custos', () => {
    const result = calculateProfitability(
      { price: 10000, execution_time: 30, material_cost: 0, cadista_cost: 0 },
      makeSettings(),
    )
    expect(result.netProfit).toBeGreaterThan(0)
  })

  it('lucro líquido é negativo quando preço não cobre os custos', () => {
    const result = calculateProfitability(
      { price: 1, execution_time: 120, material_cost: 1000, cadista_cost: 0 },
      makeSettings(),
    )
    expect(result.netProfit).toBeLessThan(0)
  })

  it('funciona com settings null (sem taxas)', () => {
    const result = calculateProfitability(
      { price: 100, execution_time: 0, material_cost: 0, cadista_cost: 0 },
      null,
    )
    expect(result.netProfit).toBe(100)
    expect(result.marginPct).toBe(100)
  })
})

// ─── getMarginColor ───────────────────────────────────────────────────────────

describe('getMarginColor', () => {
  it('retorna verde (emerald) para margem >= 20%', () => {
    expect(getMarginColor(20).bg).toBe('bg-emerald-500')
    expect(getMarginColor(50).bg).toBe('bg-emerald-500')
    expect(getMarginColor(100).bg).toBe('bg-emerald-500')
  })

  it('retorna amarelo (amber) para margem entre 10% e 19.99%', () => {
    expect(getMarginColor(10).bg).toBe('bg-amber-500')
    expect(getMarginColor(15).bg).toBe('bg-amber-500')
    expect(getMarginColor(19.99).bg).toBe('bg-amber-500')
  })

  it('retorna vermelho (red) para margem < 10%', () => {
    expect(getMarginColor(0).bg).toBe('bg-red-500')
    expect(getMarginColor(9.99).bg).toBe('bg-red-500')
    expect(getMarginColor(-5).bg).toBe('bg-red-500')
  })

  it('cada cor inclui todos os campos necessários', () => {
    const color = getMarginColor(25)
    expect(color).toHaveProperty('bg')
    expect(color).toHaveProperty('text')
    expect(color).toHaveProperty('border')
    expect(color).toHaveProperty('lightBg')
    expect(color).toHaveProperty('textDark')
  })
})
