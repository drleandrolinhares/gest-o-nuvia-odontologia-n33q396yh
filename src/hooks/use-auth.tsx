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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (isMounted) {
        setSession(newSession)

        // Prevent setting a new user object reference if it's the exact same user ID.
        // This avoids full app re-renders/blips on TOKEN_REFRESH events.
        setUser((prevUser) => {
          if (prevUser?.id === newSession?.user?.id) {
            return prevUser
          }
          return newSession?.user ?? null
        })
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (isMounted) {
        if (error) {
          console.error('Error fetching session:', error)
          setAuthError('Não foi possível verificar a sessão. Verifique sua conexão de rede.')
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, keepSignedIn: boolean = false) => {
    try {
      localStorage.setItem('keepSignedIn', keepSignedIn ? 'true' : 'false')
      return await supabase.auth.signInWithPassword({ email, password })
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
