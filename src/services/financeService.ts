import { supabase } from '@/lib/supabase/client'
import type { PriceItem, AppSettings } from '@/types/pricing'

export const financeService = {
  // Price List Management
  fetchPriceList: () =>
    supabase
      .from('price_list' as any)
      .select('*')
      .order('work_type', { ascending: true }),

  addPriceItem: (item: Omit<PriceItem, 'id'>) =>
    supabase
      .from('price_list' as any)
      .insert([item as any])
      .select()
      .single(),

  updatePriceItem: (id: string, item: Partial<PriceItem>) =>
    supabase
      .from('price_list' as any)
      .update(item as any)
      .eq('id', id)
      .select()
      .single(),

  deletePriceItem: (id: string) =>
    supabase
      .from('price_list' as any)
      .delete()
      .eq('id', id),

  // Global Financial Settings (App Settings)
  fetchSettings: () =>
    supabase
      .from('app_settings' as any)
      .select('*')
      .limit(1)
      .maybeSingle(),

  createSettings: (data: Partial<AppSettings>) =>
    supabase
      .from('app_settings' as any)
      .insert([data as any])
      .select()
      .single(),

  updateSettings: (id: string, data: Partial<AppSettings>) =>
    supabase
      .from('app_settings' as any)
      .update(data as any)
      .eq('id', id)
      .select()
      .single(),
}
