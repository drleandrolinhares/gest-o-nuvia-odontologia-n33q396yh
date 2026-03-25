import { describe, it, expect, vi, afterEach } from 'vitest'
import { getVacationStatus } from '@/lib/vacation'

// Fixa a data atual em 2024-01-01 para testes deterministas
const FIXED_TODAY = new Date('2024-01-01T12:00:00Z')

afterEach(() => {
  vi.useRealTimers()
})

const setToday = (date: Date) => {
  vi.useFakeTimers()
  vi.setSystemTime(date)
}

// ─── getVacationStatus ────────────────────────────────────────────────────────

describe('getVacationStatus', () => {
  it('retorna status "unknown" quando dueDate é undefined', () => {
    const result = getVacationStatus(undefined)
    expect(result.status).toBe('unknown')
    expect(result.days).toBe(0)
    expect(result.phrase).toBe('NÃO DEFINIDO')
  })

  it('retorna status "unknown" quando dueDate é null', () => {
    const result = getVacationStatus(null)
    expect(result.status).toBe('unknown')
  })

  it('retorna status "unknown" quando dueDate é string inválida', () => {
    const result = getVacationStatus('data-invalida')
    expect(result.status).toBe('unknown')
  })

  it('retorna status "ok" quando faltam mais de 90 dias', () => {
    setToday(FIXED_TODAY)
    const futureDate = '2024-05-15' // 135 dias à frente
    const result = getVacationStatus(futureDate)
    expect(result.status).toBe('ok')
    expect(result.days).toBeGreaterThan(90)
    expect(result.phrase).toBe('NO PRAZO')
    expect(result.colorClass).toContain('emerald')
  })

  it('retorna status "warning" quando faltam entre 31 e 90 dias', () => {
    setToday(FIXED_TODAY)
    const soonDate = '2024-02-15' // ~45 dias à frente
    const result = getVacationStatus(soonDate)
    expect(result.status).toBe('warning')
    expect(result.days).toBeGreaterThan(30)
    expect(result.days).toBeLessThanOrEqual(90)
    expect(result.phrase).toBe('PROGRAME-SE: FÉRIAS CHEGANDO')
    expect(result.colorClass).toContain('amber')
  })

  it('retorna status "critical" quando faltam 30 dias ou menos', () => {
    setToday(FIXED_TODAY)
    const urgentDate = '2024-01-20' // 19 dias à frente
    const result = getVacationStatus(urgentDate)
    expect(result.status).toBe('critical')
    expect(result.days).toBeLessThanOrEqual(30)
    expect(result.phrase).toBe('MÊS DE FÉRIAS: AÇÃO NECESSÁRIA')
    expect(result.colorClass).toContain('red')
  })

  it('retorna status "critical" quando a data já passou', () => {
    setToday(FIXED_TODAY)
    const pastDate = '2023-12-01' // 31 dias atrás
    const result = getVacationStatus(pastDate)
    expect(result.status).toBe('critical')
    expect(result.days).toBeLessThan(0)
  })

  it('inclui todos os campos de retorno obrigatórios', () => {
    setToday(FIXED_TODAY)
    const result = getVacationStatus('2024-06-01')
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('days')
    expect(result).toHaveProperty('colorClass')
    expect(result).toHaveProperty('badgeClass')
    expect(result).toHaveProperty('phrase')
    expect(result).toHaveProperty('iconColor')
  })

  it('badgeClass contém a cor correspondente ao status', () => {
    setToday(FIXED_TODAY)
    expect(getVacationStatus('2024-06-01').badgeClass).toContain('emerald') // ok
    expect(getVacationStatus('2024-02-10').badgeClass).toContain('amber') // warning
    expect(getVacationStatus('2024-01-15').badgeClass).toContain('red') // critical
  })
})
