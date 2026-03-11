import {
  LayoutDashboard,
  Users,
  Package,
  Key,
  SettingsIcon,
  Calendar,
  ClipboardList,
} from 'lucide-react'

export const navItems = [
  { id: 'dashboard', href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
  { id: 'agenda', href: '/admin/agenda', label: 'AGENDA', icon: Calendar },
  { id: 'acessos', href: '/admin/acessos', label: 'ACESSOS', icon: Key },
  { id: 'rh', href: '/admin/rh', label: 'RH', icon: Users },
  { id: 'estoque', href: '/admin/estoque', label: 'ESTOQUE', icon: Package },
  { id: 'configuracoes', href: '/admin/configuracoes', label: 'CONFIGURAÇÕES', icon: SettingsIcon },
  { id: 'auditoria', href: '/admin/auditoria', label: 'LOG DE AUDITORIA', icon: ClipboardList },
]
