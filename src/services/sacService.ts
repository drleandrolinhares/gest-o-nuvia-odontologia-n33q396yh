import { supabase } from '@/lib/supabase/client'
import type { SacRecord } from '@/types/sac'

export const sacService = {
  fetchAll: () =>
    supabase.from('sac_records' as any).select('*').order('created_at', { ascending: false }),

  create: (record: Omit<SacRecord, 'id' | 'created_at' | 'received_at' | 'limit_at'>) => {
    const received = new Date().toISOString()
    const limit = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    return supabase
      .from('sac_records' as any)
      .insert([
        {
          type: record.type,
          patient_name: record.patient_name,
          receiving_employee_id: record.receiving_employee_id,
          responsible_employee_id: record.responsible_employee_id,
          status: record.status || 'RECEBIDO',
          sector: record.sector,
          description: record.description,
          solution_details: record.solution_details,
          received_at: received,
          limit_at: limit,
        } as any,
      ])
      .select()
      .single()
  },

  update: (id: string, data: Partial<SacRecord>) =>
    supabase.from('sac_records' as any).update(data as any).eq('id', id).select().single(),

  delete: (id: string) => supabase.from('sac_records' as any).delete().eq('id', id),
}
