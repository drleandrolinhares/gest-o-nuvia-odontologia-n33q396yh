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
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'

const navigation = [
  { name: 'AGENDA', href: '/admin/agenda', icon: Calendar },
  { name: 'DASHBOARD', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'MENSAGENS', href: '/admin/chat', icon: MessageCircle },
  { name: 'RH', href: '/admin/rh', icon: Users, exact: true },
  { name: 'ESCALA DE TRABALHO', href: '/admin/rh/escala', icon: Clock },
  { name: 'ESTOQUE', href: '/admin/estoque', icon: Package },
  { name: 'ACESSOS', href: '/admin/acessos', icon: Shield },
  { name: 'LOGS', href: '/admin/auditoria', icon: FileText },
  { name: 'CONFIGURAÇÕES', href: '/admin/configuracoes', icon: Settings },
]

const NuviaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 350 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M95 65 C95 85, 75 95, 55 90 C30 80, 25 50, 45 35 C65 20, 95 30, 105 50 C115 70, 95 90, 80 90"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M45 45 C35 55, 35 75, 55 80"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <text
      x="130"
      y="45"
      fontFamily="sans-serif"
      fontSize="38"
      fontWeight="300"
      letterSpacing="0.05em"
      fill="currentColor"
    >
      N U V I Λ
    </text>
    <text x="130" y="75" fontFamily="serif" fontSize="24" fill="currentColor">
      Odontologia
    </text>
    <text
      x="130"
      y="95"
      fontFamily="sans-serif"
      fontSize="10"
      letterSpacing="0.1em"
      fill="currentColor"
    >
      BY SOUZA FILHO
    </text>
  </svg>
)

export function Layout() {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { unreadCounts } = useChatStore()
  const { isDataLoading } = useAppStore()

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6">
        <NuviaLogo className="h-24 w-auto mb-4 animate-pulse opacity-80" />
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Sincronizando dados da clínica...</p>
      </div>
    )
  }

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#0A192F] text-slate-300">
      <div className="pt-8 pb-4 flex items-center justify-center bg-[#0A192F]">
        <Link
          to="/admin/agenda"
          className="block w-full text-center hover:opacity-80 transition-opacity text-[#D4AF37]"
        >
          <NuviaLogo className="h-20 w-auto mx-auto" />
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
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300',
                  isActive
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  hasUnread &&
                    !isActive &&
                    'bg-red-500/10 shadow-[inset_4px_0_0_0_rgba(239,68,68,1)]',
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                    isActive ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-white',
                    hasUnread && 'text-red-400 animate-pulse',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'transition-colors',
                    hasUnread && 'text-red-400 font-bold',
                    hasUnread && !isActive && 'animate-pulse',
                  )}
                >
                  {item.name}
                </span>
                {hasUnread && (
                  <span className="ml-auto bg-red-500 animate-pulse text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]">
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
            <p className="text-xs text-slate-400 truncate uppercase">Administrador</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 uppercase"
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
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A192F] border-b border-white/5">
        <Link to="/admin/agenda" className="hover:opacity-80 transition-opacity text-[#D4AF37]">
          <NuviaLogo className="h-12 w-auto" />
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

      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-10">
        <SidebarContent />
      </div>

      <main className="flex-1 md:pl-72 flex flex-col min-h-screen overflow-hidden">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center px-8 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 uppercase tracking-widest font-bold">
            <Home className="w-4 h-4" />
            <span>/</span>
            <span className="text-slate-900">
              {location.pathname === '/admin/agenda' || location.pathname === '/admin'
                ? 'AGENDA'
                : location.pathname === '/admin/dashboard'
                  ? 'DASHBOARD'
                  : location.pathname.split('/')[2]?.replace(/-/g, ' ') || 'SISTEMA'}
            </span>
          </div>
          <div className="flex items-center gap-4"></div>
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
