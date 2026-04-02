import {
  createContext,
  useContext,
  useState,
  ReactNode,
  createElement,
  useMemo,
  useCallback,
} from 'react'

interface ChatState {
  [key: string]: any
}

const ChatContext = createContext<ChatState | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
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

  return createElement(ChatContext.Provider, { value }, children)
}

export function useChatStore<T = ChatState>(selector?: (state: ChatState) => T): T {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatStore must be used within a ChatProvider')
  }
  if (selector) {
    return selector(context)
  }
  return context as unknown as T
}

export default useChatStore
