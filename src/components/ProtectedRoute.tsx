import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, authError } = useAuth()
  const location = useLocation()

  const handleClearCache = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login?clear=1')
  }

  // Se a autenticação estiver carregando, mostramos o loader simples e rápido
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6 px-4 text-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Verificando sessão...</p>
      </div>
    )
  }

  // Se houver erro crasso na autenticação, permitimos limpar o cache
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

  // Se não tem usuário e já terminou de carregar, redireciona pro login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Desacoplamento do Perfil: Liberamos a interface imediatamente, sem depender da store
  // Isso impede o ciclo infinito de bloqueio caso os dados do usuário falhem em carregar
  return <>{children}</>
}
