import { Navigate } from 'react-router-dom'
import useAppStore from '@/stores/main'

type Props = {
  children: React.ReactNode
  module?: string
  adminOnly?: boolean
}

export default function PermissionRoute({ children, module, adminOnly }: Props) {
  const { can, isAdmin, isMaster } = useAppStore()

  if ((adminOnly || module) && !isAdmin && !isMaster) {
    if (adminOnly) {
      return <Navigate to="/hub/mural" replace />
    }
    if (module && !can(module, 'view')) {
      return <Navigate to="/hub/mural" replace />
    }
  }

  return <>{children}</>
}
