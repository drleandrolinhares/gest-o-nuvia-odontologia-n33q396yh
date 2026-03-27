import { supabase } from '@/lib/supabase/client'

export const permissionsService = {
  fetchMenus: async () => {
    const { data, error } = await supabase.from('menus_sistema').select('*').order('ordem')
    if (error) throw error
    return data || []
  },

  fetchCargos: async () => {
    const { data, error } = await supabase.from('cargos').select('*').order('nome')
    if (error) throw error
    return data || []
  },

  fetchUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, email, cargos(nome)')
      .order('nome')
    if (error) throw error
    return data || []
  },

  fetchPermissoesCargo: async (cargoId: string) => {
    const { data, error } = await supabase
      .from('permissoes_cargo')
      .select('*')
      .eq('cargo_id', cargoId)
    if (error) throw error
    return data || []
  },

  savePermissoesCargo: async (cargoId: string, permissoes: any[]) => {
    const payloads = permissoes.map((p) => ({
      cargo_id: cargoId,
      menu_id: p.menu_id,
      pode_ver: p.pode_ver,
      pode_editar: p.pode_editar,
      pode_deletar: p.pode_deletar,
    }))

    const { error } = await supabase
      .from('permissoes_cargo')
      .upsert(payloads, { onConflict: 'cargo_id,menu_id' })

    if (error) throw error
  },

  fetchPermissoesUsuario: async (userId: string) => {
    const { data, error } = await supabase
      .from('permissoes_usuario')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return data || []
  },

  savePermissoesUsuario: async (userId: string, permissoes: any[]) => {
    const payloads = permissoes.map((p) => ({
      user_id: userId,
      menu_id: p.menu_id,
      pode_ver: p.pode_ver,
      pode_editar: p.pode_editar,
      pode_deletar: p.pode_deletar,
    }))

    const { error } = await supabase
      .from('permissoes_usuario')
      .upsert(payloads, { onConflict: 'user_id,menu_id' })

    if (error) throw error
  },

  getUserPermissions: async (userId?: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get_user_permissions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(userId ? { userId } : {}),
      },
    )

    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao buscar permissões')
    }

    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao buscar permissões')
    }

    return result.permissions
  },
}
