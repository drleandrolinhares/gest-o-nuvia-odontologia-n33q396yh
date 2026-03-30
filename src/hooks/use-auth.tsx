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
    let mounted = true

    // Sincronização síncrona sem timers que causam loopings
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
      }
    })

    // Busca de sessão inicial com tratamento seguro
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (mounted) {
        if (error) {
          console.error('Error fetching session:', error)
          setAuthError(error.message)
        }
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, keepSignedIn: boolean = false) => {
    try {
      if (keepSignedIn) {
        localStorage.setItem('keepSignedIn', 'true')
      } else {
        localStorage.removeItem('keepSignedIn')
      }

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
