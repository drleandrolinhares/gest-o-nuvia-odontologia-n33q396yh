import { Navigate, useLocation } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'

type Props = {
  children: React.ReactNode
  module?: string
  adminOnly?: boolean
}

export default function PermissionRoute({ children, module, adminOnly }: Props) {
  const { can } = useAppStore()
  const { user } = useAuth()
  const location = useLocation()

  let hasAccess = true

  if (adminOnly) {
    if (user?.email !== 'drleandrolinhares@gmail.com' && user?.email !== 'master@nuvia.com.br') {
      hasAccess = false
    }
  } else if (module && !can(module, 'view')) {
    hasAccess = false
  }

  if (!hasAccess) {
    return <Navigate to="/acesso-negado" state={{ module, from: location.pathname }} replace />
  }

  return <>{children}</>
}
