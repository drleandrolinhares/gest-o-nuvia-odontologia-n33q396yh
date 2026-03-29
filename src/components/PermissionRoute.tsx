import { Navigate, useLocation } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'

type Props = {
  children: React.ReactNode
  module?: string
  adminOnly?: boolean
}

export default function PermissionRoute({ children, module, adminOnly }: Props) {
  const { can, isDataLoading, userPermissions } = useAppStore()
  const { user } = useAuth()
  const location = useLocation()

  let hasAccess = true

  const isMaster =
    user?.email === 'drleandrolinhares@gmail.com' || user?.email === 'master@nuvia.com.br'

  // Aguardar resposta de permissões antes de avaliar e liberar a tela
  if (isDataLoading && !isMaster && (!userPermissions || userPermissions.length === 0)) {
    return (
      <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Validando acessos seguros...
        </p>
      </div>
    )
  }

  if (isMaster) {
    hasAccess = true
  } else if (adminOnly) {
    hasAccess = false
  } else if (module && typeof can === 'function' && !can(module, 'view')) {
    hasAccess = false
  } else if (module && typeof can !== 'function') {
    hasAccess = false
  }

  if (!hasAccess) {
    return <Navigate to="/acesso-negado" state={{ module, from: location.pathname }} replace />
  }

  return <>{children}</>
}
