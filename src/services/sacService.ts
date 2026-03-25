import { supabase } from '@/lib/supabase/client'
import type { SacRecord } from '@/types/sac'

export const sacService = {
  fetchAll: () =>
    supabase
      .from('sac_records' as any)
      .select('*')
      .order('created_at', { ascending: false }),

  create: (record: any) =>
    supabase
      .from('sac_records' as any)
      .insert([record])
      .select()
      .single(),

  update: (id: string, data: any) =>
    supabase
      .from('sac_records' as any)
      .update(data)
      .eq('id', id),

  delete: (id: string) =>
    supabase
      .from('sac_records' as any)
      .delete()
      .eq('id', id),
}
