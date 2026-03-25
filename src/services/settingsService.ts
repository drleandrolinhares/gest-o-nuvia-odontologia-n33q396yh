import { supabase } from '@/lib/supabase/client'
import type { Supplier, RolePermission, SystemRole } from '@/types/settings'

export const settingsService = {
  // Suppliers
  fetchSuppliers: () => supabase.from('suppliers').select('*'),

  addSupplier: (item: Omit<Supplier, 'id'>) =>
    supabase.from('suppliers').insert([item as any]).select().single(),

  updateSupplier: (id: string, item: Partial<Supplier>) =>
    supabase.from('suppliers').update(item as any).eq('id', id),

  deleteSupplier: (id: string) => supabase.from('suppliers').delete().eq('id', id),

  // Bonus settings
  fetchBonusTypes: () => supabase.from('bonus_settings').select('*'),

  addBonusType: (name: string) =>
    supabase.from('bonus_settings').insert([{ name }]).select().single(),

  removeBonusType: (id: string) => supabase.from('bonus_settings').delete().eq('id', id),

  // Documents (onboarding docs)
  fetchDocuments: () => supabase.from('documents').select('*'),

  addDocument: (name: string) =>
    supabase
      .from('documents')
      .insert([{ name, date: new Date().toISOString().split('T')[0] }])
      .select()
      .single(),

  removeDocument: (id: string) => supabase.from('documents').delete().eq('id', id),

  // Roles & Permissions
  fetchRoles: () =>
    supabase.from('roles' as any).select('*').order('name', { ascending: true }),

  addRole: (name: string) =>
    supabase.from('roles' as any).insert([{ name }]).select().single(),

  updateRole: (id: string, name: string) =>
    supabase.from('roles' as any).update({ name }).eq('id', id),

  deleteRole: (id: string) => supabase.from('roles' as any).delete().eq('id', id),

  fetchRolePermissions: () => supabase.from('role_permissions' as any).select('*'),

  upsertRolePermissions: (permissions: RolePermission[]) =>
    supabase
      .from('role_permissions' as any)
      .upsert(permissions as any, { onConflict: 'role,module' }),

  // Onboarding
  fetchOnboarding: () => supabase.from('onboarding').select('*'),
}
