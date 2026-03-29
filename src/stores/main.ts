import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

export interface UserProfile {
  id: string
  nome: string | null
  email: string | null
  cargo_id: string | null
  cargo_nome: string | null
  departamento_id: string | null
  is_admin: boolean
  is_master: boolean
  user_cargos?: any[]
  isAdmin?: boolean // Alias for backwards compatibility
}

interface AppState {
  profile: UserProfile | null
  permissions: any[]
  loading: boolean
  fetchProfile: (userId: string) => Promise<void>
  refreshProfile: () => Promise<void>
  can: (module: string, action?: 'ver' | 'criar' | 'editar' | 'deletar') => boolean
  clear: () => void
}

const fetchWithTimeout = async <T>(promise: Promise<T>, ms: number = 6000): Promise<T> => {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error('Timeout de comunicação com o banco de dados')),
      ms,
    )
  })
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId))
}

const useMainStore = create<AppState>((set, get) => ({
  profile: null,
  permissions: [],
  loading: true,
  fetchProfile: async (userId: string) => {
    set({ loading: true })
    try {
      // 1. Busca de perfil com proteção de Timeout
      const profilePromise = supabase
        .from('profiles')
        .select('id, nome, email, departamento_id, user_cargos(cargo_id, cargo, is_principal)')
        .eq('id', userId)
        .single()

      const { data, error } = (await fetchWithTimeout(profilePromise, 7000)) as any

      if (error && error.code !== 'PGRST116') {
        console.warn('Erro ao buscar profile, prosseguindo com dados de contingência.', error)
      }

      // 2. Proteção rigorosa de null safety
      const rawCargos = data?.user_cargos
      const cargos = Array.isArray(rawCargos) ? rawCargos : rawCargos ? [rawCargos] : []

      let is_admin = false
      let is_master = false

      try {
        const isAdminData = await fetchWithTimeout(
          supabase.rpc('is_admin_user', { user_uuid: userId }),
          3000,
        )
        const isMasterData = await fetchWithTimeout(
          supabase.rpc('is_master_user', { user_uuid: userId }),
          3000,
        )
        is_admin = !!isAdminData?.data
        is_master = !!isMasterData?.data
      } catch (e) {
        console.warn('Aviso: RPC de validação falhou, usando fallback de cargos locais.', e)
      }

      if (!is_admin) {
        is_admin = cargos.some((c: any) =>
          ['ADMIN', 'MASTER', 'DIRETORIA', 'CEO'].includes(String(c?.cargo || '').toUpperCase()),
        )
      }

      if (!is_master) {
        is_master = cargos.some((c: any) =>
          ['MASTER', 'ADMIN'].includes(String(c?.cargo || '').toUpperCase()),
        )
      }

      const principalCargo = cargos.find((c: any) => c?.is_principal) || cargos[0] || null

      const profileData: UserProfile = {
        id: userId,
        nome: data?.nome || 'Usuário',
        email: data?.email || null,
        cargo_id: principalCargo?.cargo_id || null,
        cargo_nome: principalCargo?.cargo || null,
        departamento_id: data?.departamento_id || null,
        is_admin,
        is_master,
        isAdmin: is_admin,
        user_cargos: cargos,
      }

      set({ profile: profileData })

      // 3. Busca permissões assincronamente sem travar o estado principal
      try {
        const permPromise = supabase.functions.invoke('get_user_permissions', {
          body: { userId },
        })
        const res = await fetchWithTimeout(permPromise, 5000)
        const perms = res.data?.permissions
        set({ permissions: Array.isArray(perms) ? perms : [] })
      } catch (permError) {
        console.warn('Aviso: Falha ao carregar permissoes detalhadas:', permError)
        set({ permissions: [] })
      }
    } catch (error: any) {
      console.error('Error fetching profile na store:', error)
      if (error?.code === '42703' || error?.status === 400) {
        console.warn('Erro de schema detectado (42703/400). Forçando limpeza de cache.')
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace('/login?clear=1')
      }

      // Fallback seguro para evitar tela de loading infinito
      set({
        profile: {
          id: userId,
          nome: 'Usuário Offline',
          email: '',
          cargo_id: null,
          cargo_nome: null,
          departamento_id: null,
          is_admin: false,
          is_master: false,
          isAdmin: false,
          user_cargos: [],
        },
        permissions: [],
      })
    } finally {
      set({ loading: false })
    }
  },
  refreshProfile: async () => {
    const { profile } = get()
    if (profile?.id) {
      await get().fetchProfile(profile.id)
    }
  },
  can: (module: string, action = 'ver') => {
    const { profile, permissions } = get()
    if (!profile) return false
    if (profile.is_admin || profile.is_master || profile.isAdmin) return true

    const safePermissions = Array.isArray(permissions) ? permissions : []
    const perm = safePermissions.find((p: any) => p?.nome?.toUpperCase() === module.toUpperCase())
    if (!perm) return false

    switch (action) {
      case 'ver':
        return perm.pode_ver || perm.pode_visualizar
      case 'criar':
        return perm.pode_criar
      case 'editar':
        return perm.pode_editar
      case 'deletar':
        return perm.pode_deletar
      default:
        return false
    }
  },
  clear: () => set({ profile: null, permissions: [], loading: false }),
}))

export default useMainStore
export const useAppStore = useMainStore
export const useApp = useMainStore

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const fetchProfile = useMainStore((state) => state.fetchProfile)
  const clear = useMainStore((state) => state.clear)

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProfile(user.id)
      } else {
        clear()
      }
    }
  }, [user, authLoading, fetchProfile, clear])

  return React.createElement(React.Fragment, null, children)
}
