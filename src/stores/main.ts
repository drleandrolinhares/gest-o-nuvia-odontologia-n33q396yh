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

const useMainStore = create<AppState>((set, get) => ({
  profile: null,
  permissions: [],
  loading: true,
  fetchProfile: async (userId: string) => {
    set({ loading: true })
    try {
      // Utilizando a query robusta para previnir erros de schema e trazer os relacionamentos
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, departamento_id, user_cargos(cargo_id, cargo, is_principal)')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // Resolvendo as permissões de admin/master (RPC > Fallback Cargos)
      let is_admin = false
      let is_master = false

      try {
        const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: userId })
        const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: userId })
        is_admin = !!isAdminData
        is_master = !!isMasterData
      } catch (e) {
        console.warn('Aviso: RPC não encontrada ou erro, avaliando permissão por string de cargo.')
      }

      const cargos = data?.user_cargos || []

      if (!is_admin) {
        is_admin = cargos.some((c: any) =>
          ['ADMIN', 'MASTER', 'DIRETORIA', 'CEO'].includes(c.cargo?.toUpperCase()),
        )
      }

      if (!is_master) {
        is_master = cargos.some((c: any) => ['MASTER', 'ADMIN'].includes(c.cargo?.toUpperCase()))
      }

      const principalCargo = cargos.find((c: any) => c.is_principal) || cargos[0]
      const cargo_id = principalCargo?.cargo_id || null
      const cargo_nome = principalCargo?.cargo || null

      const profileData: UserProfile = {
        id: userId,
        nome: data?.nome || null,
        email: data?.email || null,
        cargo_id,
        cargo_nome,
        departamento_id: data?.departamento_id || null,
        is_admin,
        is_master,
        isAdmin: is_admin, // Retrocompatibilidade para chamadas antigas
        user_cargos: cargos,
      }

      set({ profile: profileData })

      // Carregando permissões finas via Edge Function
      try {
        const res = await supabase.functions.invoke('get_user_permissions', {
          body: { userId },
        })
        if (res.data?.permissions) {
          set({ permissions: res.data.permissions })
        }
      } catch (permError) {
        console.warn('Aviso: Falha ao carregar permissoes detalhadas:', permError)
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      if (error?.code === '42703' || error?.status === 400) {
        console.warn('Erro de schema detectado (42703/400). Limpando cache e forçando logout.')
        localStorage.clear()
        sessionStorage.clear()
        await supabase.auth.signOut()
        window.location.replace('/login?clear=1')
      }
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

    const safePermissions = permissions?.filter?.((p: any) => p) || []
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

// Exportando aliases universais
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
