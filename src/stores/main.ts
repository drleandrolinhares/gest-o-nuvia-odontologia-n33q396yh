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
  inventoryOptions: any[]
  packageTypes: any[]
  inventory: any[]
  loading: boolean
  fetchProfile: (user: any) => Promise<void>
  refreshProfile: () => Promise<void>
  can: (module: string, action?: 'ver' | 'criar' | 'editar' | 'deletar') => boolean
  loadInventoryData: () => Promise<void>
  clear: () => void
}

const useMainStore = create<AppState>((set, get) => ({
  profile: null,
  permissions: [],
  inventoryOptions: [],
  packageTypes: [],
  inventory: [],
  loading: true,
  fetchProfile: async (userParam: any) => {
    set({ loading: true })
    const userId = typeof userParam === 'string' ? userParam : userParam?.id
    const userEmail = typeof userParam === 'string' ? '' : userParam?.email

    // Hardcoded Bypass de Emergência
    const isSuperUser =
      userEmail === 'drleandrolinhares@gmail.com' || userEmail === 'master@nuvia.com.br'

    try {
      // 1. Busca do Perfil Principal - Try/Catch Isolado para não quebrar a execução geral
      let profileData = null
      try {
        const res = await supabase
          .from('profiles')
          .select('id, nome, email, departamento_id')
          .eq('id', userId)
          .single()
        profileData = res.data
      } catch (e) {
        console.warn('Fallback: Erro ao buscar perfil no Supabase', e)
      }

      // 2. Busca de Cargos
      let cargosData: any[] = []
      try {
        const res = await supabase
          .from('user_cargos')
          .select('cargo_id, cargo, is_principal')
          .eq('user_id', userId)
        if (res.data) cargosData = res.data
      } catch (e) {
        console.warn('Fallback: Erro ao buscar cargos no Supabase', e)
      }

      const cargos = Array.isArray(cargosData) ? cargosData : []

      let is_admin = isSuperUser
      let is_master = isSuperUser

      // 3. Verificação de Acesso - Fallback seguro caso as funções RPC falhem
      if (!isSuperUser) {
        try {
          const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: userId })
          const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: userId })
          is_admin = !!isAdminData
          is_master = !!isMasterData
        } catch (e) {
          console.warn('Aviso: RPC de validação falhou, usando fallback de cargos locais.', e)
          is_admin = cargos.some((c: any) =>
            ['ADMIN', 'MASTER', 'DIRETORIA', 'CEO'].includes(String(c?.cargo || '').toUpperCase()),
          )
          is_master = cargos.some((c: any) =>
            ['MASTER', 'ADMIN'].includes(String(c?.cargo || '').toUpperCase()),
          )
        }
      }

      const principalCargo = cargos.find((c: any) => c?.is_principal) || cargos[0] || null

      set({
        profile: {
          id: userId,
          nome: profileData?.nome || (is_admin ? 'Administrador' : 'Usuário'),
          email: profileData?.email || userEmail || null,
          cargo_id: principalCargo?.cargo_id || null,
          cargo_nome: principalCargo?.cargo || null,
          departamento_id: profileData?.departamento_id || null,
          is_admin,
          is_master,
          isAdmin: is_admin,
          user_cargos: cargos,
        },
      })

      // 4. Busca de Permissões (Assíncrono, não-bloqueante)
      supabase.functions
        .invoke('get_user_permissions', {
          body: { userId },
        })
        .then(({ data, error }) => {
          if (!error && data?.permissions) {
            set({ permissions: Array.isArray(data.permissions) ? data.permissions : [] })
          }
        })
        .catch(console.warn)
    } catch (error: any) {
      console.error('Erro crítico no fetchProfile da store:', error)

      // Modo de Segurança Extremo garantido
      set({
        profile: {
          id: userId,
          nome: isSuperUser ? 'Administrador (Safe Mode)' : 'Usuário (Safe Mode)',
          email: userEmail || '',
          cargo_id: null,
          cargo_nome: null,
          departamento_id: null,
          is_admin: isSuperUser,
          is_master: isSuperUser,
          isAdmin: isSuperUser,
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
      await get().fetchProfile({ id: profile.id, email: profile.email })
    }
  },
  can: (module: string, action = 'ver') => {
    const { profile, permissions } = get()
    if (!profile) return false

    // Libera 100% o acesso para Admin/Master
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
  clear: () => set({ profile: null, permissions: [], loading: false }),loadInventoryData: async () => {
    try {
      const { data: options } = await supabase
        .from('inventory_settings')
        .select('*')
      const { data: types } = await supabase
        .from('package_types')
        .select('*')
      const { data: items } = await supabase
        .from('inventory')
        .select('*')
      
      set({
        inventoryOptions: options || [],
        packageTypes: types || [],
        inventory: items || [],
      })
    } catch (error) {
      console.error('Erro ao carregar dados de inventário:', error)
      set({
        inventoryOptions: [],
        packageTypes: [],
        inventory: [],
      })
    }
  }, }),
})
export default useMainStore
export const useAppStore = useMainStore
export const useApp = useMainStore

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const fetchProfile = useMainStore((state) => state.fetchProfile)
  const clear = useMainStore((state) => state.clear)
  const loadInventoryData = useMainStore((state) => state.loadInventoryData)

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProfile(user)
          loadInventoryData()
      } else {
        clear()
      }
    }
  }, [user, authLoading, fetchProfile, clear, loadInventoryData])

  return React.createElement(React.Fragment, null, children)
}
