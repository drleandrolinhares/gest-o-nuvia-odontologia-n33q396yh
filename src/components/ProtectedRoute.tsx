import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()

  // Exibição simplificada e direta, sem verificações adicionais de erro que possam travar a tela
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37]">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse mt-4 font-bold tracking-widest uppercase">
          Verificando sessão...
        </p>
      </div>
    )
  }

  // Redirecionamento direto para o login caso o estado do usuário seja efetivamente nulo
  if (!user) {
    if (location.pathname === '/login') {
      return <>{children}</>
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Renderiza os filhos imediatamente sem qualquer outro tipo de bloqueio
  return <>{children}</>
}
