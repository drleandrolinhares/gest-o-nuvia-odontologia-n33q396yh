import {
  createContext,
  useContext,
  useState,
  ReactNode,
  createElement,
  useMemo,
  useCallback,
} from 'react'

interface AppState {
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
  addInventoryOption?: any
  removeInventoryOption?: any
  updateInventoryOption?: any
  addUser?: any
  removeUser?: any
  updateUser?: any
  addSchedule?: any
  removeSchedule?: any
  updateSchedule?: any
  addPermission?: any
  removePermission?: any
  [key: string]: any
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Record<string, any>>({
    sidebarOpen: true,
    user: null,
    profile: null,
    isAdmin: false,
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
    inventoryOptions: [],
    packageTypes: [],
    storageRooms: [],
    implantBrands: [],
    componentTypes: [],
    localSpecialties: [],
    users: [],
    schedules: [],
    permissionsList: [],
  })

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
    setState((prev) => ({ ...prev, permissions }))
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

  const updateState = useCallback(
    (updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
      setState((prev) => {
        const newValues = typeof updates === 'function' ? updates(prev as AppState) : updates
        return { ...prev, ...newValues }
      })
    },
    [],
  )

  const value = useMemo(
    () => ({
      ...state,
      sidebarOpen: state.sidebarOpen,
      user: state.user,
      profile: state.profile,
      permissions: state.permissions,
      modules: state.modules,
      isLoading: state.isLoading,
      isAdmin: state.isAdmin,
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
      setSidebarOpen,
      setUser,
      setProfile,
      setPermissions,
      setModules,
      setIsLoading,
      setIsAdmin,
      setState: updateState,
    }),
    [
      state,
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
      setSidebarOpen,
      setUser,
      setProfile,
      setPermissions,
      setModules,
      setIsLoading,
      setIsAdmin,
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
