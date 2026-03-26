import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export function AdminPermissionRestorer() {
  const { user } = useAuth()
  const checked = useRef(false)

  useEffect(() => {
    if (!user || checked.current) return

    const checkAndRestore = async () => {
      try {
        checked.current = true

        // 1. Check if user is admin or master
        const [masterRes, adminRes] = await Promise.all([
          supabase.rpc('is_master_user', { user_uuid: user.id }),
          supabase.rpc('is_admin_user', { user_uuid: user.id }),
        ])

        const isMaster = masterRes.data
        const isAdmin = adminRes.data

        if (!isMaster && !isAdmin) return

        // 2. Check if user_permissions are zeroed
        const { data: userPerms } = await supabase
          .from('user_permissions')
          .select('can_view, can_create, can_edit, can_delete')
          .eq('user_id', user.id)

        const hasAnyUserPerm =
          userPerms &&
          userPerms.some((p) => p.can_view || p.can_create || p.can_edit || p.can_delete)

        // 3. Check if role_permissions are zeroed
        const { data: emp } = await supabase
          .from('employees')
          .select('role')
          .eq('user_id', user.id)
          .single()

        let hasAnyRolePerm = false
        if (emp?.role) {
          const { data: rolePerms } = await supabase
            .from('role_permissions')
            .select('can_view, can_create, can_edit, can_delete')
            .eq('role', emp.role)

          hasAnyRolePerm =
            rolePerms &&
            rolePerms.some((p) => p.can_view || p.can_create || p.can_edit || p.can_delete)
        }

        // If ALL permissions are zeroed, invoke edge function
        if (!hasAnyUserPerm && !hasAnyRolePerm) {
          console.log('Admin user has zeroed permissions. Restoring automatically...')
          const { error } = await supabase.functions.invoke('restore-admin-permissions')
          if (!error) {
            window.location.reload()
          } else {
            console.error('Failed to restore permissions:', error)
          }
        }
      } catch (err) {
        console.error('Error checking admin permissions:', err)
      }
    }

    checkAndRestore()
  }, [user])

  return null
}
