import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/main'
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, authError } = useAuth()
  const appStore = useAppStore()
  const storeLoading = appStore?.loading
  const location = useLocation()
  const [isStuck, setIsStuck] = useState(false)
  const [forceRender, setForceRender] = useState(false)

  // Estamos pendentes se a auth ou a store estiver carregando, OU se temos usuário logado mas sem perfil carregado
  const isLoading = authLoading || storeLoading
  const missingProfile = user && !appStore?.profile
  const isPending = isLoading || missingProfile

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let forceTimeout: NodeJS.Timeout

    if (isPending) {
      // Após 4s mostra botões de tentar novamente
      timeout = setTimeout(() => setIsStuck(true), 4000)

      // Auto-force render após 8s para impedir bloqueios absolutos (fail-safe)
      forceTimeout = setTimeout(() => {
        if (!authLoading && user) {
          console.warn('Forçando renderização da rota protegida após timeout prolongado.')
          setForceRender(true)
        }
      }, 8000)
    } else {
      setIsStuck(false)
      setForceRender(false)
    }

    return () => {
      clearTimeout(timeout)
      clearTimeout(forceTimeout)
    }
  }, [isPending, authLoading, user])

  const handleClearCache = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login?clear=1')
  }

  if (!user && !authLoading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white space-y-6 px-4">
        <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-widest uppercase text-[#D4AF37]">
            Falha de Conexão
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">{authError}</p>
        </div>
        <Button
          onClick={handleClearCache}
          className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold uppercase mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Limpar Cache e Recarregar
        </Button>
      </div>
    )
  }

  // Se não estiver mais pendente ou se ativamos o render forçado, liberamos a interface
  if (!isPending || forceRender) {
    return <>{children}</>
  }

  // Caso contrário, mantemos a tela de carregamento (com botões de escape se estiver preso)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6 px-4 text-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
      <p className="text-sm opacity-80 animate-pulse">Carregando dados do sistema...</p>

      {isStuck && (
        <div className="mt-8 flex flex-col items-center space-y-4 animate-fade-in">
          <p className="text-xs text-slate-400 max-w-sm">
            O carregamento está demorando mais do que o normal. Se o problema persistir, você pode
            limpar o cache do sistema e recarregar a página.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A192F]"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
            <Button
              onClick={handleClearCache}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" /> Limpar e Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
