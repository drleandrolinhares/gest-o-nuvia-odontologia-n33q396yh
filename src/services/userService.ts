import { supabase } from '@/lib/supabase/client'

export const userService = {
  fetchCargos: async () => {
    const { data, error } = await supabase.from('cargos').select('*').order('nome')
    if (error) {
      console.error(error)
      return []
    }
    return data || []
  },
  createCargo: async (nome: string) => {
    const { data, error } = await supabase.from('cargos').insert([{ nome }]).select().single()
    if (error) throw error
    return data
  },
  deleteCargo: async (id: string) => {
    const { error } = await supabase.from('cargos').delete().eq('id', id)
    if (error) throw error
    return true
  },
  fetchDepartamentos: async () => {
    const { data, error } = await supabase.from('departamentos').select('*').order('nome')
    if (error) {
      console.error(error)
      return []
    }
    return data || []
  },
  createDepartamento: async (nome: string) => {
    const { data, error } = await supabase
      .from('departamentos')
      .insert([{ nome }])
      .select()
      .single()
    if (error) throw error
    return data
  },
  deleteDepartamento: async (id: string) => {
    const { error } = await supabase.from('departamentos').delete().eq('id', id)
    if (error) throw error
    return true
  },
  fetchProfiles: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_cargos(cargo, cargo_id, is_principal), departamentos(nome)')
      .order('nome')
    if (error) {
      console.error(error)
      return []
    }

    return (data || []).map((p: any) => {
      const principalCargo =
        p.user_cargos?.find((c: any) => c.is_principal) || p.user_cargos?.[0] || null
      return {
        ...p,
        cargo_id: principalCargo?.cargo_id || null,
        cargos: principalCargo ? { nome: principalCargo.cargo } : null,
        user_cargos: undefined,
      }
    })
  },
  updateProfile: async (id: string, data: any) => {
    const { cargo_id, ...profileData } = data

    if (Object.keys(profileData).length > 0) {
      const { error } = await supabase.from('profiles').update(profileData).eq('id', id)
      if (error) throw error
    }

    if (cargo_id !== undefined) {
      await supabase.from('user_cargos').delete().eq('user_id', id)

      if (cargo_id) {
        const { data: cargoData } = await supabase
          .from('cargos')
          .select('nome')
          .eq('id', cargo_id)
          .single()
        await supabase.from('user_cargos').insert({
          user_id: id,
          cargo_id: cargo_id,
          cargo: cargoData?.nome || '',
          is_principal: true,
        })
      }
    }
    return true
  },
  deleteUser: async (id: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ userId: id }),
    })
    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao excluir usuário')
    }
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao excluir usuário')
    }
    return true
  },
  createUser: async (email: string, password: string, name: string, cargo_id?: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ email, password, name, cargo_id }),
    })
    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao criar usuário')
    }
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao criar usuário')
    }
    return result.id
  },
  updateUserAuth: async (userId: string, email: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ userId, email }),
    })
    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao atualizar e-mail do usuário')
    }
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao atualizar e-mail do usuário')
    }
    return true
  },
  updateUserPassword: async (userId: string, password: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ user_id: userId, nova_senha: password }),
      },
    )
    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao atualizar a senha do usuário')
    }
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao atualizar a senha do usuário')
    }
    return true
  },
  updateMyEmail: async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) {
      if (error.status === 429) {
        throw new Error(
          'Limite de tentativas excedido (Rate Limit do Supabase). Aguarde alguns instantes antes de alterar o e-mail novamente.',
        )
      }
      throw error
    }
    return true
  },
  resetPassword: async (email: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ email }),
      },
    )
    const text = await res.text()
    let result
    try {
      result = JSON.parse(text)
    } catch {
      throw new Error('Erro ao solicitar redefinição de senha')
    }
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erro ao solicitar redefinição de senha')
    }
    return true
  },
}
