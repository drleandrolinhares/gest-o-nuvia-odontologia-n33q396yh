import type { KpiFormat } from './types'

export const formatKpiValue = (v: number, format: KpiFormat) => {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  }
  if (format === 'percentage') {
    return `${v.toFixed(1)}%`
  }
  return v.toLocaleString('pt-BR')
}

export const getKpiProgress = (current: number, target: number, invert?: boolean) => {
  if (current === 0 && target === 0) return 100
  if (invert && current === 0) return 100
  const p = invert ? (target / current) * 100 : (current / target) * 100
  return Math.min(Math.max(p, 0), 100)
}

export const isKpiMet = (current: number, target: number, invert?: boolean) => {
  return invert ? current <= target : current >= target
}
