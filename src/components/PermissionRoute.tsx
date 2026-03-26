import { Navigate, useLocation } from 'react-router-dom'
import useAppStore from '@/stores/main'

type Props = {
  children: React.ReactNode
  module?: string
  adminOnly?: boolean
}

export default function PermissionRoute({ children, module, adminOnly }: Props) {
  const { can, isAdmin, isMaster } = useAppStore()
  const location = useLocation()

  let hasAccess = true

  if (!isAdmin && !isMaster) {
    if (adminOnly) {
      hasAccess = false
    } else if (module && !can(module, 'view')) {
      hasAccess = false
    }
  }

  if (!hasAccess) {
    return <Navigate to="/acesso-negado" state={{ module, from: location.pathname }} replace />
  }

  return <>{children}</>
}
