import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AppState {
  profile: any | null
  permissions: any[]
  loading: boolean
  fetchProfile: (userId: string) => Promise<void>
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
      // FIX: Consulta ajustada para usar 'user_cargos'
      const { data, error } = await supabase
        .from('profiles')
        .select('id,nome,email,user_cargos(cargo_id,cargo,is_principal)')
        .eq('id', userId)
        .single()

      if (error) throw error

      const p = data as any
      const isAdmin =
        p?.user_cargos?.some((c: any) =>
          ['ADMIN', 'MASTER', 'DIRETORIA', 'CEO'].includes(c.cargo?.toUpperCase()),
        ) || false

      // Extraindo cargo_id principal para manter compatibilidade
      const principalCargo = p?.user_cargos?.find((c: any) => c.is_principal) || p?.user_cargos?.[0]
      const cargo_id = principalCargo?.cargo_id || null
      const cargo_nome = principalCargo?.cargo || null

      set({ profile: { ...p, cargo_id, cargo_nome, isAdmin } })

      const res = await supabase.functions.invoke('get_user_permissions', {
        body: { userId },
      })

      if (res.data?.permissions) {
        set({ permissions: res.data.permissions })
      }
    } catch (error: any) {
      console.error('Error fetching profile', error)
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
  can: (module: string, action = 'ver') => {
    const { profile, permissions } = get()
    if (!profile) return false
    if (profile.isAdmin) return true

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

// Export aliases for backwards compatibility
export const useAppStore = useMainStore
export const useApp = useMainStore

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading: authLoading } = useAuth()
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
