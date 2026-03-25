import { supabase } from '@/lib/supabase/client'
import type { PriceItem, AppSettings, Consultorio } from '@/types/pricing'
import type { SpecialtyConfig } from '@/types/clinic'

export const pricingService = {
  fetchPriceList: () => supabase.from('price_list' as any).select('*'),

  addPriceItem: (item: Omit<PriceItem, 'id'>) =>
    supabase.from('price_list' as any).insert([item as any]).select().single(),

  updatePriceItem: (id: string, item: Partial<PriceItem>) =>
    supabase.from('price_list' as any).update(item as any).eq('id', id),

  deletePriceItem: (id: string) => supabase.from('price_list' as any).delete().eq('id', id),

  fetchSettings: () =>
    supabase.from('app_settings' as any).select('*').limit(1).maybeSingle(),

  createDefaultSettings: () =>
    supabase.from('app_settings' as any).insert([{}]).select().single(),

  updateSettings: (id: string, data: Partial<AppSettings>) =>
    supabase
      .from('app_settings' as any)
      .update(data as any)
      .eq('id', id)
      .select()
      .single(),

  fetchConsultorios: () =>
    supabase
      .from('clinica_consultorios' as any)
      .select('*, schedules:consultorio_weekly_schedules(*)')
      .order('created_at', { ascending: true }),

  upsertConsultorio: (consultorio: Partial<Consultorio>) =>
    supabase
      .from('clinica_consultorios' as any)
      .upsert(consultorio as any)
      .select()
      .single(),

  deleteConsultorio: (id: string) =>
    supabase.from('clinica_consultorios' as any).delete().eq('id', id),

  upsertConsultorioSchedules: (schedules: unknown[]) =>
    supabase.from('consultorio_weekly_schedules' as any).upsert(schedules as any),

  fetchSpecialtyConfigs: () => supabase.from('specialty_configs' as any).select('*'),

  addSpecialtyConfig: (name: string, colorHex: string) =>
    supabase
      .from('specialty_configs' as any)
      .insert([{ name, color_hex: colorHex }])
      .select()
      .single(),

  deleteSpecialtyConfig: (id: string) =>
    supabase.from('specialty_configs' as any).delete().eq('id', id),
}
