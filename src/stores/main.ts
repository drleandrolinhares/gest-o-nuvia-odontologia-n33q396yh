import {
  createContext,
  useContext,
  useState,
  ReactNode,
  createElement,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react'

export interface InventoryItem {
  id: string
  name: string
  barcode?: string
  brand?: string
  specialty?: string
  packageCost?: number
  packageType?: string
  itemsPerBox?: number
  quantity: number
  storageLocation?: string
  storageRoom?: string
  cabinetNumber?: string
  nfeNumber?: string
  minStock?: number
  entryDate?: string
  expirationDate?: string
  lastBrand?: string
  lastValue?: number
  notes?: string
  criticalObservations?: string
  consumptionMode?: string
  consumptionReference?: string
  specialtyDetails?: Record<string, any>
  purchaseHistory?: any[]
}

export interface InventoryMovement {
  id: string
  inventory_id: string
  type: string
  quantity: number
  recipient?: string
  created_at: string
}

export interface TemporaryOutflow {
  id: string
  inventory_id: string
  employee_id: string
  quantity: number
  status: string
  employees?: any
}

export interface Supplier {
  id: string
  name: string
  contact?: string
  phone?: string
  email?: string
  cnpj?: string
  website?: string
  hasSpecialNegotiation?: boolean
  negotiationNotes?: string
}

export interface NegotiationSettings {
  ranges: any[]
  defaultEntryPercentage: number
  discounts: any
}

export interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: any | null
  setUser: (user: any | null) => void
  profile: any | null
  setProfile: (profile: any | null) => void
  permissions: any
  setPermissions: (permissions: any) => void
  modules: any[]
  setModules: (modules: any[]) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  isMaster: boolean
  inventory: InventoryItem[]
  inventoryOptions: any[]
  packageTypes: string[]
  storageRooms: any[]
  implantBrands: any[]
  componentTypes: any[]
  localSpecialties: any[]
  users: any[]
  employees: any[]
  suppliers: Supplier[]
  schedules: any[]
  permissionsList: any[]
  appSettings: any
  inventoryItems: any[]
  implantHeights: any[]
  explanations: any[]
  categories: any[]
  addInventoryOption: any
  removeInventoryOption: any
  updateInventoryOption: any
  addUser: any
  removeUser: any
  updateUser: any
  addSchedule: any
  removeSchedule: any
  updateSchedule: any
  addPermission: any
  removePermission: any
  addInventoryItem: any
  updateInventoryItemDetails: any
  getInventoryMovements: any
  registerDefinitiveOutflow: any
  finalizeTemporaryOutflow: any
  addPurchaseHistory: any
  addTemporaryOutflow: any
  addSupplier: any
  updateSupplier: any
  removeSupplier: any
  updateAppSettings: any
  setState: any
  modalRefs: React.MutableRefObject<Record<string, any>>
  registerModalRef: (id: string, ref: any) => void
  [key: string]: any
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const modalRefs = useRef<Record<string, any>>({})

  const [state, setState] = useState<Record<string, any>>({
    sidebarOpen: true,
    user: null,
    profile: null,
    isAdmin: false,
    isMaster: false,
    permissions: {
      precificacao: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      estoque: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      usuarios: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      escala_trabalho: {
        visualizar: true,
        pode_ver: true,
        criar: true,
        editar: true,
        deletar: true,
      },
      dashboard: { visualizar: true, pode_ver: true, criar: false, editar: false, deletar: false },
      kpis: { visualizar: true, pode_ver: true, criar: false, editar: false, deletar: false },
      bonificacoes: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      configuracoes: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      permissoes: { visualizar: true, pode_ver: true, criar: true, editar: true, deletar: true },
      logs: { visualizar: true, pode_ver: true, criar: false, editar: false, deletar: false },
      debug: { visualizar: true, pode_ver: true, criar: false, editar: false, deletar: false },
    },
    modules: [],
    isLoading: false,
    inventory: [],
    inventoryOptions: [],
    packageTypes: [],
    storageRooms: [],
    implantBrands: [],
    componentTypes: [],
    localSpecialties: [],
    users: [],
    employees: [],
    suppliers: [],
    schedules: [],
    permissionsList: [],
    appSettings: {},
    inventoryItems: [],
    implantHeights: [],
    explanations: [],
    categories: [],
  })

  useEffect(() => {
    // Initial setup if needed, empty dependency array guarantees running only once
  }, [])

  // Callbacks seguros
  const setSidebarOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, sidebarOpen: open }))
  }, [])

  const setUser = useCallback((user: any | null) => {
    setState((prev) => ({ ...prev, user }))
  }, [])

  const setProfile = useCallback((profile: any | null) => {
    setState((prev) => ({ ...prev, profile }))
  }, [])

  const setPermissions = useCallback((permissions: any) => {
    setState((prev) => ({ ...prev, permissions: permissions || {} }))
  }, [])

  const setModules = useCallback((modules: any[]) => {
    setState((prev) => ({ ...prev, modules: Array.isArray(modules) ? modules : [] }))
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setIsAdmin = useCallback((isAdmin: boolean) => {
    setState((prev) => ({ ...prev, isAdmin }))
  }, [])

  const addInventoryOption = useCallback((category: string, value: string, label?: string) => {
    setState((prev) => ({
      ...prev,
      inventoryOptions: [
        ...(prev.inventoryOptions ?? []),
        { id: Math.random().toString(), category, value, label: label ?? value },
      ],
    }))
  }, [])

  const removeInventoryOption = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      inventoryOptions: (prev.inventoryOptions ?? []).filter((o: any) => o.id !== id),
    }))
  }, [])

  const updateInventoryOption = useCallback((id: string, valueOrLabel: string, label?: string) => {
    setState((prev) => ({
      ...prev,
      inventoryOptions: (prev.inventoryOptions ?? []).map((o: any) =>
        o.id === id
          ? {
              ...o,
              ...(label !== undefined ? { value: valueOrLabel, label } : { label: valueOrLabel }),
            }
          : o,
      ),
    }))
  }, [])

  const addUser = useCallback((user: any) => {
    setState((prev) => ({ ...prev, users: [...(prev.users ?? []), user] }))
  }, [])

  const removeUser = useCallback((id: string) => {
    setState((prev) => ({ ...prev, users: (prev.users ?? []).filter((u: any) => u.id !== id) }))
  }, [])

  const updateUser = useCallback((id: string, user: any) => {
    setState((prev) => ({
      ...prev,
      users: (prev.users ?? []).map((u: any) => (u.id === id ? { ...u, ...user } : u)),
    }))
  }, [])

  const addSchedule = useCallback((schedule: any) => {
    setState((prev) => ({ ...prev, schedules: [...(prev.schedules ?? []), schedule] }))
  }, [])

  const removeSchedule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      schedules: (prev.schedules ?? []).filter((s: any) => s.id !== id),
    }))
  }, [])

  const updateSchedule = useCallback((id: string, schedule: any) => {
    setState((prev) => ({
      ...prev,
      schedules: (prev.schedules ?? []).map((s: any) => (s.id === id ? { ...s, ...schedule } : s)),
    }))
  }, [])

  const addPermission = useCallback((permission: any) => {
    setState((prev) => ({
      ...prev,
      permissionsList: [...(prev.permissionsList ?? []), permission],
    }))
  }, [])

  const removePermission = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      permissionsList: (prev.permissionsList ?? []).filter((p: any) => p.id !== id),
    }))
  }, [])

  // Additional mock functions requested
  const addInventoryItem = useCallback(async (item: any) => {
    setState((prev) => ({
      ...prev,
      inventory: [
        ...(prev.inventory ?? []),
        { id: Math.random().toString(), ...item, quantity: item.quantity || 0 },
      ],
    }))
    return { success: true }
  }, [])

  const updateInventoryItemDetails = useCallback(async (id: string, updates: any) => {
    setState((prev) => ({
      ...prev,
      inventory: (prev.inventory ?? []).map((i: any) => (i.id === id ? { ...i, ...updates } : i)),
    }))
    return { success: true }
  }, [])

  const getInventoryMovements = useCallback(async (id: string) => {
    return []
  }, [])

  const registerDefinitiveOutflow = useCallback(
    async (id: string, qty: number, recipient: string) => {
      setState((prev) => ({
        ...prev,
        inventory: (prev.inventory ?? []).map((i: any) =>
          i.id === id ? { ...i, quantity: Math.max(0, i.quantity - qty) } : i,
        ),
      }))
      return { success: true }
    },
    [],
  )

  const finalizeTemporaryOutflow = useCallback(
    async (outflowId: string, used: number, returned: number) => {
      return { success: true }
    },
    [],
  )

  const addPurchaseHistory = useCallback(async (id: string, purchase: any) => {
    setState((prev) => ({
      ...prev,
      inventory: (prev.inventory ?? []).map((i: any) => {
        if (i.id === id) {
          const qty = purchase.quantity * (i.itemsPerBox || 1)
          return {
            ...i,
            quantity: (i.quantity || 0) + qty,
            purchaseHistory: [purchase, ...(i.purchaseHistory || [])],
          }
        }
        return i
      }),
    }))
    return { success: true }
  }, [])

  const addTemporaryOutflow = useCallback(
    async (id: string, employeeId: string, qty: number, destination: string) => {
      return { success: true }
    },
    [],
  )

  const addSupplier = useCallback((supplier: any) => {
    setState((prev) => ({
      ...prev,
      suppliers: [...(prev.suppliers ?? []), { id: Math.random().toString(), ...supplier }],
    }))
  }, [])

  const updateSupplier = useCallback((id: string, updates: any) => {
    setState((prev) => ({
      ...prev,
      suppliers: (prev.suppliers ?? []).map((s: any) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }, [])

  const removeSupplier = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      suppliers: (prev.suppliers ?? []).filter((s: any) => s.id !== id),
    }))
  }, [])

  const updateAppSettings = useCallback(async (updates: any) => {
    setState((prev) => ({
      ...prev,
      appSettings: { ...(prev.appSettings || {}), ...updates },
    }))
    return { success: true }
  }, [])

  const updateState = useCallback(
    (updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
      setState((prev) => {
        const newValues = typeof updates === 'function' ? updates(prev as AppState) : updates
        return { ...prev, ...newValues }
      })
    },
    [],
  )

  const registerModalRef = useCallback((id: string, ref: any) => {
    modalRefs.current[id] = ref
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setSidebarOpen,
      setUser,
      setProfile,
      setPermissions,
      setModules,
      setIsLoading,
      setIsAdmin,
      addInventoryOption,
      removeInventoryOption,
      updateInventoryOption,
      addUser,
      removeUser,
      updateUser,
      addSchedule,
      removeSchedule,
      updateSchedule,
      addPermission,
      removePermission,
      addInventoryItem,
      updateInventoryItemDetails,
      getInventoryMovements,
      registerDefinitiveOutflow,
      finalizeTemporaryOutflow,
      addPurchaseHistory,
      addTemporaryOutflow,
      addSupplier,
      updateSupplier,
      removeSupplier,
      updateAppSettings,
      setState: updateState,
      modalRefs,
      registerModalRef,
    }),
    [
      state,
      modalRefs,
      registerModalRef,
      setSidebarOpen,
      setUser,
      setProfile,
      setPermissions,
      setModules,
      setIsLoading,
      setIsAdmin,
      addInventoryOption,
      removeInventoryOption,
      updateInventoryOption,
      addUser,
      removeUser,
      updateUser,
      addSchedule,
      removeSchedule,
      updateSchedule,
      addPermission,
      removePermission,
      addInventoryItem,
      updateInventoryItemDetails,
      getInventoryMovements,
      registerDefinitiveOutflow,
      finalizeTemporaryOutflow,
      addPurchaseHistory,
      addTemporaryOutflow,
      addSupplier,
      updateSupplier,
      removeSupplier,
      updateAppSettings,
      updateState,
    ],
  )

  return createElement(AppContext.Provider, { value: value as AppState }, children)
}

export function useAppStore<T = AppState>(selector?: (state: AppState) => T): T {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  if (selector) {
    return selector(context)
  }
  return context as unknown as T
}

export default useAppStore
