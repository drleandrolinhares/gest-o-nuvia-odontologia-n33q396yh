import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import type { InventoryItem } from '@/types/inventory'

type DbInventoryUpdate = Database['public']['Tables']['inventory']['Update']

export const inventoryService = {
  fetchAll: () => supabase.from('inventory').select('*'),

  fetchOptions: () => supabase.from('inventory_settings' as any).select('*'),

  fetchPendingOutflows: () =>
    supabase
      .from('inventory_temporary_outflows' as any)
      .select('*')
      .eq('status', 'PENDING'),

  create: (item: Omit<InventoryItem, 'id'> & { initialPackages?: number }) => {
    const pkgs = item.initialPackages ?? item.quantity / (item.itemsPerBox || 1)
    const ph =
      pkgs > 0
        ? [
            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              price: item.packageCost,
              quantity: pkgs,
              expirationDate: item.expirationDate,
              nfeNumber: item.nfeNumber,
            },
          ]
        : []
    return supabase
      .from('inventory')
      .insert([
        {
          name: item.name,
          package_cost: item.packageCost,
          storage_location: item.storageLocation,
          package_type: item.packageType,
          items_per_box: item.itemsPerBox,
          min_stock: item.minStock,
          quantity: item.quantity,
          specialty: item.specialty,
          entry_date: item.entryDate,
          expiration_date: item.expirationDate,
          brand: item.brand,
          last_brand: item.lastBrand,
          last_value: item.lastValue,
          notes: item.notes,
          barcode: item.barcode,
          purchase_history: ph as any,
          specialty_details: item.specialtyDetails || {},
          nfe_number: item.nfeNumber || null,
          storage_room: item.storageRoom || null,
          cabinet_number: item.cabinetNumber || null,
          critical_observations: item.criticalObservations || null,
          consumption_mode: item.consumptionMode || null,
          consumption_reference: item.consumptionReference || null,
        } as any,
      ])
      .select()
      .single()
  },

  updateQuantity: (id: string, quantity: number) =>
    supabase.from('inventory').update({ quantity }).eq('id', id),

  update: (id: string, payload: DbInventoryUpdate) =>
    supabase.from('inventory').update(payload).eq('id', id).select().single(),

  delete: (id: string) => supabase.from('inventory').delete().eq('id', id),

  addPurchaseHistory: (id: string, history: unknown[]) =>
    supabase
      .from('inventory')
      .update({ purchase_history: history as any })
      .eq('id', id),

  addOption: (category: string, value: string, label?: string) =>
    supabase
      .from('inventory_settings' as any)
      .insert([{ category, label: label || value, value }])
      .select()
      .single(),

  updateOption: (id: string, label: string) =>
    supabase
      .from('inventory_settings' as any)
      .update({ label })
      .eq('id', id),

  removeOption: (id: string) =>
    supabase
      .from('inventory_settings' as any)
      .delete()
      .eq('id', id),

  addTemporaryOutflow: (
    inventoryId: string,
    employeeId: string,
    quantity: number,
    destination: string,
  ) =>
    supabase
      .from('inventory_temporary_outflows' as any)
      .insert([
        {
          inventory_id: inventoryId,
          employee_id: employeeId,
          quantity,
          status: 'PENDING',
          destination,
        },
      ])
      .select()
      .single(),

  fetchMovements: (inventoryId: string) =>
    supabase
      .from('inventory_movements')
      .select('*, profiles(name)')
      .eq('inventory_id', inventoryId)
      .order('created_at', { ascending: false }),

  addMovement: (
    inventoryId: string,
    userId: string,
    type: string,
    quantity: number,
    recipient: string,
  ) =>
    supabase
      .from('inventory_movements')
      .insert([{ inventory_id: inventoryId, user_id: userId, type, quantity, recipient }]),

  addMovements: (movements: any[]) => supabase.from('inventory_movements' as any).insert(movements),

  finalizeTemporaryOutflow: (id: string) =>
    supabase
      .from('inventory_temporary_outflows' as any)
      .update({ status: 'FINALIZED' })
      .eq('id', id)
      .select()
      .single(),
}
