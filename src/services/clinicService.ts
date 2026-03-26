import { supabase } from '@/lib/supabase/client'
import type { SpecialtyConfig, Consultorio } from '@/types/clinic'

export const clinicService = {
  fetchConsultorios: () =>
    supabase
      .from('clinica_consultorios' as any)
      .select('*')
      .order('created_at', { ascending: true }),

  upsertConsultorio: (consultorio: Partial<Consultorio>) =>
    supabase
      .from('clinica_consultorios' as any)
      .upsert(consultorio as any)
      .select()
      .single(),

  deleteConsultorio: (id: string) =>
    supabase
      .from('clinica_consultorios' as any)
      .delete()
      .eq('id', id),

  deleteConsultoriosIn: (ids: string[]) =>
    supabase
      .from('clinica_consultorios' as any)
      .delete()
      .in('id', ids),

  fetchSpecialtyConfigs: () => supabase.from('specialty_configs' as any).select('*'),

  addSpecialtyConfig: (name: string, colorHex: string) =>
    supabase
      .from('specialty_configs' as any)
      .insert([{ name: name.toUpperCase(), color_hex: colorHex }])
      .select()
      .single(),

  deleteSpecialtyConfig: (id: string) =>
    supabase
      .from('specialty_configs' as any)
      .delete()
      .eq('id', id),
}
