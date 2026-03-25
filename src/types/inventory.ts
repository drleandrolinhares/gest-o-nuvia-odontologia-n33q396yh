export type PurchaseRecord = {
  id: string
  date: string
  price: number
  quantity: number
  expirationDate?: string
  lot?: string
  supplierId?: string
  nfeNumber?: string
}

export type InventoryItem = {
  id: string
  name: string
  packageCost: number
  storageLocation: string
  packageType: string
  itemsPerBox: number
  minStock: number
  quantity: number
  specialty?: string
  entryDate?: string
  expirationDate?: string
  brand?: string
  lastBrand?: string
  lastValue?: number
  notes?: string
  barcode?: string
  purchaseHistory?: PurchaseRecord[]
  specialtyDetails?: Record<string, unknown>
  nfeNumber?: string
  storageRoom?: string
  cabinetNumber?: string
  criticalObservations?: string
  consumptionMode?: string
  consumptionReference?: string
}

export type TemporaryOutflow = {
  id: string
  inventory_id: string
  employee_id: string
  quantity: number
  status: 'PENDING' | 'FINALIZED' | 'RETURNED'
  created_at: string
  employees?: { name: string }
}

export type InventoryMovement = {
  id: string
  inventory_id: string
  user_id: string
  type: string
  quantity: number
  recipient: string
  created_at: string
  profiles?: { name: string }
}

export type InventoryOption = {
  id: string
  category: string
  label?: string
  value: string
}
