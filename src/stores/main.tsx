import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
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
}

interface AppContextType {
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}

export default useApp

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      // CORREÇÃO: Utilizando nova query e evitando 'cargo_id' solto em profiles para previnir erro 42703
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          nome, 
          email,
          departamento_id,
          user_cargos(cargo_id, cargo, is_principal)
        `)
        .eq('id', user.id)
        .single()

      if (error) throw error

      const { data: isAdmin } = await supabase.rpc('is_admin_user', { user_uuid: user.id })
      const { data: isMaster } = await supabase.rpc('is_master_user', { user_uuid: user.id })

      const principalCargo =
        data?.user_cargos?.find((c: any) => c.is_principal) || data?.user_cargos?.[0]

      setProfile({
        id: data.id,
        nome: data.nome,
        email: data.email,
        cargo_id: principalCargo?.cargo_id || null,
        cargo_nome: principalCargo?.cargo || null,
        departamento_id: data.departamento_id,
        is_admin: !!isAdmin,
        is_master: !!isMaster,
      })
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
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  return (
    <AppContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </AppContext.Provider>
  )
}
