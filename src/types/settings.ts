export type Supplier = {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  cnpj: string
  website?: string
  hasSpecialNegotiation?: boolean
  negotiationNotes?: string
}

export type BonusSetting = { id: string; name: string }

export type SystemRole = {
  id: string
  name: string
  created_at?: string
}

export type RolePermission = {
  id?: string
  role: string
  module: string
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  updated_at?: string
}
