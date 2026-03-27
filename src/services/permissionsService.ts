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
      .select('id, nome, email, cargo_id, cargos(nome)')
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
      pode_criar: p.pode_criar || false,
      pode_editar: p.pode_editar,
      pode_deletar: p.pode_deletar,
    }))

    if (payloads.length > 0) {
      const { error } = await supabase.from('permissoes_cargo').upsert(payloads, {
        onConflict: 'cargo_id,menu_id',
      })
      if (error) throw error
    }
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
      pode_criar: p.pode_criar || false,
      pode_editar: p.pode_editar,
      pode_deletar: p.pode_deletar,
    }))

    if (payloads.length > 0) {
      const { error } = await supabase.from('permissoes_usuario').upsert(payloads, {
        onConflict: 'user_id,menu_id',
      })
      if (error) throw error
    }
  },

  getUserPermissions: async (userId?: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) throw new Error('Não autenticado')

    const targetUserId = userId || session.user.id

    try {
      const { data, error } = await supabase.functions.invoke('get_user_permissions', {
        body: { userId: targetUserId },
      })

      if (!error && data && data.permissions) {
        return data.permissions
      }
    } catch (err) {
      console.warn(
        'Falha na chamada da Edge Function get_user_permissions. Utilizando fallback local.',
        err,
      )
    }

    // Fallback Local
    const { data: profile } = await supabase
      .from('profiles')
      .select('cargo_id')
      .eq('id', targetUserId)
      .single()

    const cargoId = profile?.cargo_id

    const { data: menus } = await supabase.from('menus_sistema').select('*')

    let cargoPerms: any[] = []
    if (cargoId) {
      const { data } = await supabase.from('permissoes_cargo').select('*').eq('cargo_id', cargoId)
      cargoPerms = data || []
    }

    const { data: userPerms } = await supabase
      .from('permissoes_usuario')
      .select('*')
      .eq('user_id', targetUserId)

    const permissions = (menus || []).map((menu: any) => {
      const parentMenu = menu.menu_filho
        ? (menus || []).find((m: any) => m.nome === menu.menu_pai && !m.menu_filho)
        : null

      const cargoP = cargoPerms.find((p: any) => p.menu_id === menu.id)
      const userP = (userPerms || []).find((p: any) => p.menu_id === menu.id)

      const parentCargoP = parentMenu
        ? cargoPerms.find((p: any) => p.menu_id === parentMenu.id)
        : null
      const parentUserP = parentMenu
        ? (userPerms || []).find((p: any) => p.menu_id === parentMenu.id)
        : null

      const resolvePerm = (field: string) => {
        if (userP && userP[field] !== undefined) return userP[field]
        if (parentUserP && parentUserP[field] === true) return true
        if (cargoP && cargoP[field] !== undefined) return cargoP[field]
        if (parentCargoP && parentCargoP[field] === true) return true
        return false
      }

      return {
        menu_id: menu.id,
        nome: menu.nome,
        rota: menu.rota,
        menu_pai: menu.menu_pai,
        menu_filho: menu.menu_filho,
        pode_ver: resolvePerm('pode_ver'),
        pode_criar: resolvePerm('pode_criar'),
        pode_editar: resolvePerm('pode_editar'),
        pode_deletar: resolvePerm('pode_deletar'),
      }
    })

    return permissions
  },
}
