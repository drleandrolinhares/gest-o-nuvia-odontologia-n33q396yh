import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isAuthError, checkAuthError } from '@/lib/supabase/authHelpers'

// Mock do módulo supabase/client para não precisar de variáveis de ambiente
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: { signOut: vi.fn() },
  },
}))

// Mock do toast para evitar dependências de UI
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// ─── isAuthError ──────────────────────────────────────────────────────────────

describe('isAuthError', () => {
  it('retorna true para código PGRST303', () => {
    expect(isAuthError({ code: 'PGRST303' })).toBe(true)
  })

  it('retorna true para mensagem "JWT expired"', () => {
    expect(isAuthError({ message: 'JWT expired' })).toBe(true)
  })

  it('retorna true para status 401', () => {
    expect(isAuthError({ status: 401 })).toBe(true)
  })

  it('retorna true para mensagem "Sessão expirada"', () => {
    expect(isAuthError({ message: 'Sessão expirada, faça login.' })).toBe(true)
  })

  it('retorna true para mensagem "Unauthorized"', () => {
    expect(isAuthError({ message: 'Unauthorized access' })).toBe(true)
  })

  it('retorna false para erro genérico sem código de auth', () => {
    expect(isAuthError({ message: 'Not found', status: 404 })).toBe(false)
  })

  it('retorna false para null', () => {
    expect(isAuthError(null)).toBe(false)
  })

  it('retorna false para undefined', () => {
    expect(isAuthError(undefined)).toBe(false)
  })

  it('retorna false para objeto vazio', () => {
    expect(isAuthError({})).toBe(false)
  })

  it('retorna false para erro de validação (status 400)', () => {
    expect(isAuthError({ status: 400, message: 'Bad request' })).toBe(false)
  })
})

// ─── checkAuthError ───────────────────────────────────────────────────────────

describe('checkAuthError', () => {
  it('retorna false para erros benignos com status 400', () => {
    expect(checkAuthError({ status: 400, code: 'PGRST200' })).toBe(false)
  })

  it('retorna false para código PGRST204 (no content)', () => {
    expect(checkAuthError({ code: 'PGRST204' })).toBe(false)
  })

  it('retorna true para JWT expirado', () => {
    expect(checkAuthError({ message: 'JWT expired' })).toBe(true)
  })

  it('retorna true para status 401', () => {
    expect(checkAuthError({ status: 401 })).toBe(true)
  })

  it('retorna false para erro genérico (404)', () => {
    expect(checkAuthError({ status: 404, message: 'Not found' })).toBe(false)
  })

  it('retorna false para null', () => {
    expect(checkAuthError(null)).toBe(false)
  })
})
