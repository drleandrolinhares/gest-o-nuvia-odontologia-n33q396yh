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
      .select('*, cargos(nome), departamentos(nome)')
      .order('nome')
    if (error) {
      console.error(error)
      return []
    }
    return data || []
  },
  updateProfile: async (id: string, data: any) => {
    const { error } = await supabase.from('profiles').update(data).eq('id', id)
    if (error) throw error
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
  createUser: async (email: string, password: string, name: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ email, password, name }),
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
        body: JSON.stringify({ userId, password }),
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
