import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: (email: string, pass: string, keepSignedIn?: boolean) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
  authError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    // Aumentado ligeiramente para 3s para dar tempo à rede e evitar loopings infinitos
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Timeout na verificação de sessão. Forçando carregamento para concluir.')
        setLoading(false)
      }
    }, 3000)

    // Otimização: callback 100% síncrono para evitar deadlocks e atrasos de renderização
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (isMounted) {
        setSession((prevSession) => {
          if (prevSession?.access_token === newSession?.access_token) return prevSession
          return newSession
        })

        setUser((prevUser) => {
          if (prevUser?.id === newSession?.user?.id) return prevUser
          return newSession?.user ?? null
        })

        setLoading(false)
        clearTimeout(timeout)
      }
    })

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (isMounted) {
        if (error) {
          console.error('Error fetching session:', error)
          // Se falhar a verificação da sessão, limpamos o estado para forçar novo login (Handshake limpo)
          setSession(null)
          setUser(null)
          setAuthError(
            'Não foi possível verificar a sessão de forma segura. Por favor, acesse novamente e limpe o cache.',
          )
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
        setLoading(false)
        clearTimeout(timeout)
      }
    })

    return () => {
      isMounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, keepSignedIn: boolean = false) => {
    try {
      localStorage.setItem('keepSignedIn', keepSignedIn ? 'true' : 'false')
      const res = await supabase.auth.signInWithPassword({ email, password })

      if (res.error) {
        if (
          res.error.message.includes('Invalid login credentials') ||
          res.error.message.includes('invalid_credentials')
        ) {
          return {
            error: new Error(
              'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
            ),
          }
        }
        return { error: res.error }
      }

      return res
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      return await supabase.auth.signOut()
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading, authError }}>
      {children}
    </AuthContext.Provider>
  )
}
