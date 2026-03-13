import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Calendar,
  Users,
  Package,
  Settings,
  LogOut,
  Menu,
  FileText,
  Shield,
  Home,
  LayoutDashboard,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import logoImg from '@/assets/img_3243-2f960.jpg'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useChatStore } from '@/stores/chat'

const navigation = [
  { name: 'DASH NUVIA', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'AGENDA', href: '/admin/agenda', icon: Calendar },
  { name: 'MENSAGENS', href: '/admin/chat', icon: MessageCircle },
  { name: 'Recursos Humanos', href: '/admin/rh', icon: Users },
  { name: 'Estoque', href: '/admin/estoque', icon: Package },
  { name: 'Acessos', href: '/admin/acessos', icon: Shield },
  { name: 'Logs', href: '/admin/auditoria', icon: FileText },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export function Layout() {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { unreadCounts } = useChatStore()

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#0A192F] text-slate-300">
      <div className="p-6 flex items-center justify-center border-b border-white/5 bg-[#0A192F]">
        <Link to="/admin" className="block w-full text-center hover:opacity-80 transition-opacity">
          <img
            src={logoImg}
            alt="Nuvia Odontologia"
            className="h-12 w-auto mx-auto object-contain mix-blend-screen invert grayscale contrast-150"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">
            Gestão Integrada
          </p>
          {navigation.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href || location.pathname === `${item.href}/`
              : location.pathname.startsWith(item.href)

            const hasUnread = item.name === 'MENSAGENS' && totalUnread > 0

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-white',
                    hasUnread && !isActive && 'text-red-400 animate-pulse',
                  )}
                  aria-hidden="true"
                />
                <span className={cn(hasUnread && 'text-red-400 animate-pulse font-bold')}>
                  {item.name}
                </span>
                {hasUnread && (
                  <span className="ml-auto bg-red-500 animate-pulse text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0A192F]">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className="text-xs text-slate-400 truncate">Administrador</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400" />
          Sair do sistema
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A192F] border-b border-white/5">
        <Link to="/admin" className="hover:opacity-80 transition-opacity">
          <img
            src={logoImg}
            alt="Nuvia Odontologia"
            className="h-8 w-auto object-contain mix-blend-screen invert grayscale contrast-150"
          />
        </Link>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Menu className="h-6 w-6" />
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#0A192F]"></span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-[#0A192F] border-r-slate-800">
            <SheetTitle className="sr-only">Menu Principal</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-10">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 flex flex-col min-h-screen overflow-hidden">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center px-8 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Home className="w-4 h-4" />
            <span>/</span>
            <span className="font-medium text-slate-900 capitalize">
              {location.pathname.split('/')[2] || 'Dash Nuvia'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex border-slate-200 text-slate-600 hover:bg-slate-50"
              asChild
            >
              <Link to="/">Ver Site Público</Link>
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
