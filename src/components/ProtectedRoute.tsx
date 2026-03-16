import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, authError } = useAuth()
  const location = useLocation()
  const [mustChange, setMustChange] = useState<boolean | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (loading) return

    if (user) {
      supabase
        .from('profiles')
        .select('must_change_password')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (isMounted) {
            if (!error && data) {
              setMustChange(!!data.must_change_password)
            } else {
              setMustChange(false)
            }
            setCheckingProfile(false)
          }
        })
    } else {
      if (isMounted) {
        setMustChange(null)
        setCheckingProfile(false)
      }
    }
    return () => {
      isMounted = false
    }
  }, [user, loading])

  if (loading || checkingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Verificando credenciais de acesso...</p>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white space-y-6">
        <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
        <div className="text-center space-y-2 px-4">
          <h2 className="text-2xl font-bold tracking-widest uppercase text-[#D4AF37]">
            Falha de Conexão
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">{authError}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold uppercase mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (mustChange) {
    return <Navigate to="/force-change-password" replace />
  }

  return <>{children}</>
}
