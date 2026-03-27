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
  fetchDepartamentos: async () => {
    const { data, error } = await supabase.from('departamentos').select('*').order('nome')
    if (error) {
      console.error(error)
      return []
    }
    return data || []
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
  updateMyEmail: async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) throw error
    return true
  },
}
