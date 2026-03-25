import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type DbEmployee = Database['public']['Tables']['employees']['Row']
type DbEmployeeInsert = Database['public']['Tables']['employees']['Insert']
type DbEmployeeUpdate = Database['public']['Tables']['employees']['Update']

export const employeeService = {
  fetchAll: () => supabase.from('employees').select('*'),

  create: (data: Omit<DbEmployeeInsert, 'id'>) =>
    supabase.from('employees').insert([data]).select().single(),

  update: (id: string, data: DbEmployeeUpdate) =>
    supabase.from('employees').update(data).eq('id', id),

  updateStatus: (id: string, status: string) =>
    supabase.from('employees').update({ status }).eq('id', id),

  delete: (id: string) => supabase.from('employees').delete().eq('id', id),

  updatePassword: (userId: string, newPassword: string) =>
    supabase.functions.invoke('update-user-password', {
      body: { userId, newPassword },
    }),

  createAuthUser: (email: string, password: string, name: string) =>
    supabase.functions.invoke('admin-create-user', {
      body: { email, password, name },
    }),

  deleteAuthUser: (userId: string) =>
    supabase.functions.invoke('admin-delete-user', {
      body: { userId },
    }),

  fetchDocuments: () => supabase.from('employee_documents').select('*'),

  uploadDocument: async (employeeId: string, fileName: string, file: File) => {
    const path = `employee-docs/${employeeId}/${Date.now()}_${fileName}`
    const { error: uploadError } = await supabase.storage
      .from('employee-documents')
      .upload(path, file)
    if (uploadError) return { data: null, error: uploadError }
    return supabase
      .from('employee_documents')
      .insert([{ employee_id: employeeId, file_name: fileName, file_path: path }])
      .select()
      .single()
  },

  deleteDocument: async (id: string, filePath: string) => {
    await supabase.storage.from('employee-documents').remove([filePath])
    return supabase.from('employee_documents').delete().eq('id', id)
  },

  fetchWorkSchedules: (start: string, end: string) =>
    supabase.from('work_schedules').select('*').gte('work_date', start).lte('work_date', end),

  upsertWorkSchedule: (data: { employee_id: string; work_date: string; [key: string]: unknown }) =>
    supabase
      .from('work_schedules')
      .upsert(data as any, { onConflict: 'employee_id,work_date' })
      .select()
      .single(),
} satisfies Record<string, (...args: any[]) => any>
