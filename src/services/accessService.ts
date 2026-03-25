import { supabase } from '@/lib/supabase/client'
import type { AccessItem } from '@/types/access'

export const accessService = {
  fetchAll: () => supabase.from('acessos').select('*'),

  create: (item: Omit<AccessItem, 'id'>) =>
    supabase
      .from('acessos')
      .insert([
        {
          platform: item.platform,
          url: item.url,
          login: item.login,
          pass: item.pass,
          instructions: item.instructions,
          sector: item.sector,
          access_level: item.access_level,
          logo_url: item.logo_url,
          description: item.description,
          target_users: item.target_users,
          frequency: item.frequency,
          video_url: item.video_url,
          manual_steps: item.manual_steps as any,
          troubleshooting: item.troubleshooting as any,
          security_note: item.security_note,
        },
      ])
      .select()
      .single(),

  update: (id: string, item: Partial<AccessItem>) =>
    supabase
      .from('acessos')
      .update({
        platform: item.platform,
        url: item.url,
        login: item.login,
        pass: item.pass,
        instructions: item.instructions,
        sector: item.sector,
        access_level: item.access_level,
        logo_url: item.logo_url,
        description: item.description,
        target_users: item.target_users,
        frequency: item.frequency,
        video_url: item.video_url,
        manual_steps: item.manual_steps as any,
        troubleshooting: item.troubleshooting as any,
        security_note: item.security_note,
      })
      .eq('id', id),

  delete: (id: string) => supabase.from('acessos').delete().eq('id', id),
}
