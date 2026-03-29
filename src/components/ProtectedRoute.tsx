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

  const isLoading = authLoading || storeLoading

  useEffect(() => {
    let timeout: NodeJS.Timeout
    // Se o sistema continuar carregando por mais de 5 segundos, exibimos a opção de limpeza
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsStuck(true)
      }, 5000)
    } else {
      setIsStuck(false)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isLoading])

  const handleClearCache = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login?clear=1')
  }

  if (!user && !authLoading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Garantimos que a aplicação aguarde todas as stores resolverem seus estados iniciais
  if (isLoading || (user && !appStore?.profile && !isStuck)) {
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

  return <>{children}</>
}
