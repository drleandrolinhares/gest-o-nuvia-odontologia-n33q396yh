import { supabase } from '@/lib/supabase/client'
import type { AgendaItem, AgendaSegmentation } from '@/types/agenda'

export const agendaService = {
  fetchAll: () => supabase.from('agenda').select('*'),

  create: (item: Omit<AgendaItem, 'id'>) =>
    supabase
      .from('agenda')
      .insert([
        {
          title: item.title,
          date: item.date,
          end_date: item.end_date,
          time: item.time,
          location: item.location,
          type: item.type,
          assigned_to: item.assignedTo,
          involves_third_party: item.involvesThirdParty,
          third_party_details: item.thirdPartyDetails,
          created_by: item.createdBy,
          is_completed: item.is_completed ?? false,
          requester_id: item.requester_id,
          sac_record_id: item.sac_record_id,
          periodicity: item.periodicity,
        } as any,
      ])
      .select()
      .single(),

  update: (id: string, item: Partial<AgendaItem>) =>
    supabase
      .from('agenda')
      .update({
        title: item.title,
        date: item.date,
        end_date: item.end_date,
        time: item.time,
        location: item.location,
        type: item.type,
        assigned_to: item.assignedTo,
        involves_third_party: item.involvesThirdParty,
        third_party_details: item.thirdPartyDetails,
        is_completed: item.is_completed,
        completed_at: item.completed_at,
        periodicity: item.periodicity,
      } as any)
      .eq('id', id),

  delete: (id: string) => supabase.from('agenda').delete().eq('id', id),

  fetchSegmentation: () => supabase.from('agenda_segmentation' as any).select('*'),

  upsertSegmentation: (data: Omit<AgendaSegmentation, 'id'>) =>
    supabase
      .from('agenda_segmentation' as any)
      .upsert(data as any, {
        onConflict: 'consultorio_id,day_of_week,shift',
        ignoreDuplicates: false,
      })
      .select()
      .single(),
}
