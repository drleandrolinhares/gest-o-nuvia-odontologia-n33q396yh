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
  permissions: any[]
  setPermissions: (permissions: any[]) => void
  modules: any[]
  setModules: (modules: any[]) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  [key: string]: any
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Record<string, any>>({
    sidebarOpen: true,
    user: null,
    profile: null,
    isAdmin: false,
    permissions: [],
    modules: [],
    isLoading: false,
    agendaTypes: [],
    cargos: [],
    departamentos: [],
    users: [],
    avaliadores: [],
    criterios: [],
    packageTypes: [],
    inventoryOptions: [],
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

  const setPermissions = useCallback((permissions: any[]) => {
    setState((prev) => ({ ...prev, permissions }))
  }, [])

  const setModules = useCallback((modules: any[]) => {
    setState((prev) => ({ ...prev, modules }))
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setIsAdmin = useCallback((isAdmin: boolean) => {
    setState((prev) => ({ ...prev, isAdmin }))
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
