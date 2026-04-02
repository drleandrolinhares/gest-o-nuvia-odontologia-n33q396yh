import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useMainStore = create((set, get) => ({
  agendaTypes: [],
  cargos: [],
  departamentos: [],
  users: [],
  avaliadores: [],
  criterios: [],
  loadSettings: async () => {
    const { data: agendaTypes } = await supabase.from('agenda_types').select('*')
    set({ agendaTypes: agendaTypes || [] })
    const { data: cargos } = await supabase.from('cargos').select('*')
    set({ cargos: cargos || [] })
    const { data: departamentos } = await supabase.from('departamentos').select('*')
    set({ departamentos: departamentos || [] })
    const { data: users } = await supabase.from('users').select('*')
    set({ users: users || [] })
    const { data: avaliadores } = await supabase.from('avaliadores').select('*')
    set({ avaliadores: avaliadores || [] })
    const { data: criterios } = await supabase.from('criterios').select('*')
    set({ criterios: criterios || [] })
  },
  addAgendaType: async (name) => {
    const { data } = await supabase
      .from('agenda_types')
      .insert({ name, description: 'Novo tipo' })
      .select()
      .single()
    set((state) => ({ agendaTypes: [...state.agendaTypes, data] }))
  },
  removeAgendaType: async (id) => {
    await supabase.from('agenda_types').delete().eq('id', id)
    set((state) => ({ agendaTypes: state.agendaTypes.filter((t) => t.id !== id) }))
  },
  addCargo: async (nome) => {
    const { data } = await supabase.from('cargos').insert({ nome }).select().single()
    set((state) => ({ cargos: [...state.cargos, data] }))
  },
  removeCargo: async (id) => {
    await supabase.from('cargos').delete().eq('id', id)
    set((state) => ({ cargos: state.cargos.filter((c) => c.id !== id) }))
  },
  addDept: async (nome) => {
    const { data } = await supabase.from('departamentos').insert({ nome }).select().single()
    set((state) => ({ departamentos: [...state.departamentos, data] }))
  },
  removeDept: async (id) => {
    await supabase.from('departamentos').delete().eq('id', id)
    set((state) => ({ departamentos: state.departamentos.filter((d) => d.id !== id) }))
  },
  addAvaliador: async (userId) => {
    const { data } = await supabase
      .from('avaliadores')
      .insert({ user_id: userId })
      .select()
      .single()
    set((state) => ({ avaliadores: [...state.avaliadores, data] }))
  },
  removeAvaliador: async (id) => {
    await supabase.from('avaliadores').delete().eq('id', id)
    set((state) => ({ avaliadores: state.avaliadores.filter((a) => a.id !== id) }))
  },
  addCriterio: async (data) => {
    const { data: newCriterio } = await supabase.from('criterios').insert(data).select().single()
    set((state) => ({ criterios: [...state.criterios, newCriterio] }))
  },
  updateCriterio: async (id, data) => {
    await supabase.from('criterios').update(data).eq('id', id)
    set((state) => ({
      criterios: state.criterios.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }))
  },
  deleteCriterio: async (id) => {
    await supabase.from('criterios').delete().eq('id', id)
    set((state) => ({ criterios: state.criterios.filter((c) => c.id !== id) }))
  },
}))

// Export para import no GeneralSettings.tsx
export { useMainStore }
