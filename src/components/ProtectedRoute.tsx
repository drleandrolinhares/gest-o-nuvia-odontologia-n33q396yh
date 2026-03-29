import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/main'
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, authError } = useAuth()
  const appStore = useAppStore()
  const storeLoading = appStore?.loading
  const location = useLocation()
  const [isStuck, setIsStuck] = useState(false)

  // Remove o fallback de `|| user` para garantir que a sidebar só
  // seja renderizada após o perfil estar totalmente carregado do banco.
  const perfil = (appStore as any)?.currentProfile || (appStore as any)?.profile

  // Guarda de segurança (Array Guard) para user_cargos
  const safeUserCargos = perfil?.user_cargos?.filter((item: any) => item) || []

  useEffect(() => {
    let timeout: NodeJS.Timeout
    // Se temos usuário mas o perfil não chegou após 5 segundos, exibimos a opção de limpeza
    if (user && (!perfil || !perfil.user_cargos) && !loading && !storeLoading) {
      timeout = setTimeout(() => {
        setIsStuck(true)
      }, 5000)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [user, perfil, loading, storeLoading])

  const handleClearCache = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login?clear=1')
  }

  if (loading || storeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Carregando dados do sistema...</p>
      </div>
    )
  }

  // Garantindo que a sidebar (layout e childrens) NUNCA seja renderizada
  // sem as permissões e o perfil adequadamente carregados no AppStore.
  if (user && (!perfil || !perfil.user_cargos)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6 px-4 text-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Carregando perfil e permissões...</p>

        {isStuck && (
          <div className="mt-8 flex flex-col items-center space-y-4 animate-fade-in">
            <p className="text-xs text-slate-400 max-w-sm">
              O carregamento está demorando mais do que o normal. Se o problema persistir, você pode
              limpar o cache do sistema.
            </p>
            <Button
              onClick={handleClearCache}
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A192F]"
            >
              <LogOut className="mr-2 h-4 w-4" /> Limpar Cache e Sair
            </Button>
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

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
