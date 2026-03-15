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
  AlertTriangle,
  RefreshCw,
  DollarSign,
  PanelLeftClose,
  PanelLeftOpen,
  Key,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'

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

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev
      localStorage.setItem('sidebar_collapsed', String(newState))
      return newState
    })
  }

  const { unreadCounts } = useChatStore()
  const { isDataLoading, fetchError, isAdmin } = useAppStore()

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6">
        <NuviaLogo className="h-24 w-auto mb-4 animate-pulse opacity-80" />
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Sincronizando dados da clínica...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white space-y-6">
        <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
        <div className="text-center space-y-2 px-4">
          <h2 className="text-2xl font-bold tracking-widest uppercase text-[#D4AF37]">
            Falha na Sincronização
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">{fetchError}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold uppercase mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Recarregar Sistema
        </Button>
      </div>
    )
  }

  const navigationSections = [
    {
      title: 'VISÃO DIÁRIA',
      items: [
        { name: 'DASHBOARD', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'AGENDA', href: '/admin/agenda', icon: Calendar },
        { name: 'MENSAGENS', href: '/admin/chat', icon: MessageCircle },
      ],
    },
    {
      title: 'GESTÃO DE EQUIPE',
      items: [
        { name: 'RH', href: '/admin/rh', icon: Users, exact: true },
        { name: 'ESCALA DE TRABALHO', href: '/admin/rh/escala', icon: Clock },
      ],
    },
    {
      title: 'OPERAÇÃO',
      items: [
        { name: 'ESTOQUE', href: '/admin/estoque', icon: Package },
        { name: 'PRECIFICAÇÃO', href: '/admin/precificacao', icon: DollarSign, adminOnly: true },
      ],
    },
    {
      title: 'ADMINISTRAÇÃO',
      items: [
        {
          name: 'CONFIGURAÇÕES',
          icon: Settings,
          subItems: [
            { name: 'SISTEMA', href: '/admin/configuracoes' },
            { name: 'PERMISSÕES', href: '/admin/permissoes', adminOnly: true },
          ],
        },
        { name: 'CENTRAL DE ACESSOS', href: '/admin/acessos', icon: Shield },
        { name: 'LOGS', href: '/admin/auditoria', icon: FileText },
      ],
    },
  ]

  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly && !isAdmin) return false
        return true
      }),
    }))
    .filter((section) => section.items.length > 0)

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col bg-[#0A192F] text-slate-300">
      <div className="pt-8 pb-4 flex items-center justify-center bg-[#0A192F]">
        <Link
          to="/admin/agenda"
          className="block w-full text-center hover:opacity-80 transition-opacity text-[#D4AF37]"
        >
          {isCollapsed && !isMobile ? (
            <span className="text-3xl font-light tracking-widest text-[#D4AF37]">N</span>
          ) : (
            <NuviaLogo className="h-20 w-auto mx-auto" />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar overflow-x-hidden">
        {filteredSections.map((section, idx) => (
          <div key={section.title} className={cn('mb-6', isCollapsed && !isMobile && 'mb-4')}>
            {(!isCollapsed || isMobile) && (
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
                {section.title}
              </p>
            )}
            {isCollapsed && !isMobile && idx > 0 && <div className="h-px bg-white/10 mx-2 mb-4" />}
            <div className="space-y-1">
              {section.items.map((item) => {
                if (item.subItems) {
                  const filteredSubItems = item.subItems.filter((s) => !s.adminOnly || isAdmin)
                  if (filteredSubItems.length === 0) return null

                  const isAnySubActive = filteredSubItems.some((s) =>
                    location.pathname.startsWith(s.href),
                  )

                  return (
                    <Collapsible key={item.name} defaultOpen={isAnySubActive}>
                      <CollapsibleTrigger asChild>
                        <button
                          onClick={() => {
                            if (isCollapsed && !isMobile) toggleSidebar()
                          }}
                          className={cn(
                            'w-full group flex items-center py-3 text-sm font-medium rounded-md transition-all duration-300 relative outline-none',
                            isCollapsed && !isMobile ? 'justify-center px-2' : 'px-4',
                            isAnySubActive
                              ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white',
                          )}
                          title={isCollapsed && !isMobile ? item.name : undefined}
                        >
                          <item.icon
                            className={cn(
                              'flex-shrink-0 h-5 w-5 transition-colors',
                              isCollapsed && !isMobile ? 'mr-0' : 'mr-3',
                              isAnySubActive
                                ? 'text-[#D4AF37]'
                                : 'text-slate-400 group-hover:text-white',
                            )}
                            aria-hidden="true"
                          />
                          {(!isCollapsed || isMobile) && (
                            <span className="flex-1 text-left whitespace-nowrap transition-colors">
                              {item.name}
                            </span>
                          )}
                          {(!isCollapsed || isMobile) && (
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      {(!isCollapsed || isMobile) && (
                        <CollapsibleContent className="space-y-1 mt-1 pl-11 pr-4">
                          {filteredSubItems.map((sub) => {
                            const isSubActive = location.pathname.startsWith(sub.href)
                            return (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  'block py-2 px-3 text-xs font-bold tracking-wider rounded-md transition-colors whitespace-nowrap',
                                  isSubActive
                                    ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5',
                                )}
                              >
                                {sub.name}
                              </Link>
                            )
                          })}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  )
                }

                const isActive = item.exact
                  ? location.pathname === item.href || location.pathname === `${item.href}/`
                  : location.pathname.startsWith(item.href as string)

                const hasUnread = item.name === 'MENSAGENS' && totalUnread > 0

                return (
                  <Link
                    key={item.name}
                    to={item.href as string}
                    title={isCollapsed && !isMobile ? item.name : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center py-3 text-sm font-medium rounded-md transition-all duration-300 relative',
                      isCollapsed && !isMobile ? 'justify-center px-2' : 'px-4',
                      isActive
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      hasUnread &&
                        !isActive &&
                        'bg-red-500/10 shadow-[inset_4px_0_0_0_rgba(239,68,68,1)]',
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          'flex-shrink-0 h-5 w-5 transition-colors',
                          isCollapsed && !isMobile ? 'mr-0' : 'mr-3',
                          isActive ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-white',
                          hasUnread && 'text-red-400 animate-pulse',
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {(!isCollapsed || isMobile) && (
                      <span
                        className={cn(
                          'transition-colors whitespace-nowrap',
                          hasUnread && 'text-red-400 font-bold',
                          hasUnread && !isActive && 'animate-pulse',
                        )}
                      >
                        {item.name}
                      </span>
                    )}
                    {hasUnread && (
                      <span
                        className={cn(
                          'bg-red-500 animate-pulse text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]',
                          isCollapsed && !isMobile
                            ? 'absolute top-1 right-1 px-1.5 py-0 text-[8px]'
                            : 'ml-auto',
                        )}
                      >
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'p-4 border-t border-white/5 bg-[#0A192F]',
          isCollapsed && !isMobile && 'flex flex-col items-center',
        )}
      >
        <div
          className={cn(
            'flex items-center mb-4',
            isCollapsed && !isMobile ? 'justify-center px-0' : 'px-2',
          )}
        >
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-sm shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 truncate uppercase">
                {isAdmin ? 'Administrador' : 'Colaborador'}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          title={isCollapsed && !isMobile ? 'Sair do sistema' : undefined}
          className={cn(
            'justify-start text-slate-300 hover:text-white hover:bg-white/5 uppercase',
            isCollapsed && !isMobile ? 'w-auto px-2 justify-center' : 'w-full',
          )}
          onClick={() => signOut()}
        >
          <LogOut
            className={cn('h-5 w-5 text-slate-400', isCollapsed && !isMobile ? 'mr-0' : 'mr-3')}
          />
          {(!isCollapsed || isMobile) && 'Sair do sistema'}
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
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-20 transition-all duration-300 ease-in-out bg-[#0A192F]',
          isCollapsed ? 'w-20' : 'w-72',
        )}
      >
        <SidebarContent />
      </div>

      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:pl-20' : 'md:pl-72',
        )}
      >
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center px-4 justify-between sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 h-9 w-9 ml-2"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-500 uppercase tracking-widest font-bold ml-2">
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
