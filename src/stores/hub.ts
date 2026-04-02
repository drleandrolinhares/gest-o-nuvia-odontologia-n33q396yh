import {
  createContext,
  useContext,
  useState,
  ReactNode,
  createElement,
  useMemo,
  useCallback,
} from 'react'

interface HubState {
  [key: string]: any
}

const HubContext = createContext<HubState | undefined>(undefined)

export function HubProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Record<string, any>>({})

  const updateState = useCallback((updates: any) => {
    setState((prev) => ({ ...prev, ...(typeof updates === 'function' ? updates(prev) : updates) }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setState: updateState,
    }),
    [state, updateState],
  )

  return createElement(HubContext.Provider, { value }, children)
}

export default function useHubStore<T = HubState>(selector?: (state: HubState) => T): T {
  const context = useContext(HubContext)
  if (context === undefined) {
    throw new Error('useHubStore must be used within a HubProvider')
  }
  if (selector) {
    return selector(context)
  }
  return context as unknown as T
}
