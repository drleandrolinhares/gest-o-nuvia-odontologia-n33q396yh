import { supabase } from './client'
import { toast } from '@/components/ui/use-toast'

/** Retorna true se o erro representa um token de auth expirado ou inválido. */
export function isAuthError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as any
  return Boolean(
    e?.code === 'PGRST303' ||
    e?.message?.includes('JWT expired') ||
    e?.status === 401 ||
    e?.message?.includes('Sessão expirada') ||
    e?.message?.includes('Unauthorized')
  )
}

/**
 * Para stores: verifica silenciosamente se um erro é de autenticação,
 * ignorando erros benignos (400, PGRST204). Retorna true se for erro de auth.
 */
export function checkAuthError(err: unknown): boolean {
  const e = err as any
  if (e?.status === 400 || e?.code === 'PGRST204') return false
  if (isAuthError(err)) {
    console.warn('Auth token may be expired or refreshing. Deferring to Supabase auth client.')
    return true
  }
  return false
}

/**
 * Para recursos em tempo real: verifica erro de auth, faz signOut e exibe toast.
 * Retorna true se o erro era de autenticação.
 */
export function handleAuthError(err: unknown): boolean {
  if (!isAuthError(err)) return false
  supabase.auth.signOut()
  toast({
    title: 'Sessão Expirada',
    description: 'Sua sessão de acesso expirou. Faça login novamente.',
    variant: 'destructive',
  })
  return true
}
