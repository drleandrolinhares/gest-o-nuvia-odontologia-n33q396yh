import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
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
  ChevronDown,
  HeadphonesIcon,
  Handshake,
  Grid,
  Megaphone,
  MessageSquarePlus,
  Trophy,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState, useMemo, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useChatStore } from '@/stores/chat'
import { useHubStore } from '@/stores/hub'
import useAppStore from '@/stores/main'
import { GlobalSearch } from '@/components/GlobalSearch'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

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
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [readingAnnouncement, setReadingAnnouncement] = useState(false)
  const [agreedToAnnouncement, setAgreedToAnnouncement] = useState(false)
  const { toast } = useToast()

  const { unreadCounts } = useChatStore()
  const { isDataLoading, fetchError, isAdmin, isMaster, can, sacRecords, currentUserId } =
    useAppStore()
  const { unreadAnnouncements, markAsRead, isLoading: isHubLoading } = useHubStore()

  const currentUnread = unreadAnnouncements.length > 0 ? unreadAnnouncements[0] : null

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setAgreedToAnnouncement(false)
  }, [currentUnread?.id])

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

  const pendingSacsCount = useMemo(() => {
    return sacRecords.filter(
      (r) => r.status === 'OPORTUNIDADE DE SOLUÇÃO' && r.responsible_employee_id === currentUserId,
    ).length
  }, [sacRecords, currentUserId])

  const navigationSections = useMemo(
    () => [
      {
        title: 'NUVIA HUB',
        items: [
          { name: 'MURAL DE AVISOS', href: '/hub/mural', icon: Megaphone },
          { name: 'PP & PDM', href: '/hub/feedback', icon: MessageSquarePlus },
          { name: 'DESENVOLVIMENTO E PERFORMANCE', href: '/hub/performance', icon: Target },
          { name: 'RANKING PERFORMANCE', href: '/hub/ranking', icon: Trophy },
        ],
      },
      {
        title: 'VISÃO DIÁRIA',
        items: [
          {
            name: 'DASHBOARD',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            module: 'DASHBOARD',
          },
          { name: 'AGENDA', href: '/admin/agenda', icon: Calendar, module: 'AGENDA' },
          { name: 'MENSAGENS', href: '/admin/chat', icon: MessageCircle, module: 'MENSAGENS' },
          { name: 'SAC', href: '/admin/sac', icon: HeadphonesIcon },
        ],
      },
      {
        title: 'GESTÃO DE EQUIPE',
        items: [
          { name: 'RH', href: '/admin/rh', icon: Users, exact: true, module: 'RH' },
          {
            name: 'ESCALA DE TRABALHO',
            href: '/admin/rh/escala',
            icon: Clock,
            module: 'ESCALA DE TRABALHO',
          },
        ],
      },
      {
        title: 'OPERAÇÃO',
        items: [
          { name: 'ESTOQUE', href: '/admin/estoque', icon: Package, module: 'ESTOQUE' },
          { name: 'PRECIFICAÇÃO', href: '/admin/precificacao', icon: DollarSign, adminOnly: true },
          { name: 'NEGOCIAÇÃO', href: '/admin/operacao/negociacao', icon: Handshake },
          { name: 'SEGMENTAÇÃO DA AGENDA', href: '/admin/operacao/segmentacao', icon: Grid },
        ],
      },
      {
        title: 'ADMINISTRAÇÃO',
        items: [
          {
            name: 'CONFIGURAÇÕES',
            icon: Settings,
            module: 'CONFIGURAÇÕES',
            subItems: [
              { name: 'SISTEMA', href: '/admin/configuracoes' },
              { name: 'PERMISSÕES', href: '/admin/permissoes', adminOnly: true },
            ],
          },
          { name: 'CENTRAL DE ACESSOS', href: '/admin/acessos', icon: Shield, module: 'ACESSOS' },
          { name: 'LOGS', href: '/admin/auditoria', icon: FileText, module: 'LOGS' },
        ],
      },
    ],
    [],
  )

  const filteredSections = useMemo(() => {
    return navigationSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (item.adminOnly && !isAdmin && !isMaster) return false
          if (item.module && !isAdmin && !isMaster && !can(item.module, 'view')) return false
          return true
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [navigationSections, isAdmin, isMaster, can])

  useEffect(() => {
    setOpenMenus((prev) => {
      let hasChanges = false
      const next = { ...prev }

      filteredSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.subItems) {
            const filteredSubItems = item.subItems.filter((s) => !s.adminOnly || isAdmin)
            const isAnySubActive = filteredSubItems.some((s) =>
              location.pathname.startsWith(s.href),
            )
            if (isAnySubActive && next[item.name] === undefined) {
              next[item.name] = true
              hasChanges = true
            }
          }
        })
      })

      return hasChanges ? next : prev
    })
  }, [location.pathname, filteredSections, isAdmin])

  const handleRead = async () => {
    if (currentUnread && agreedToAnnouncement) {
      setReadingAnnouncement(true)
      const res = await markAsRead(currentUnread)
      setReadingAnnouncement(false)
      if (res.success) {
        if (res.points && res.points > 0) {
          toast({
            title: 'PARABÉNS!',
            description: `Você ganhou ${res.points} pontos pela leitura rápida.`,
          })
        } else {
          toast({
            title: 'LEITURA CONFIRMADA',
            description: 'Sua leitura foi registrada no log de assinaturas.',
          })
        }
      }
    }
  }

  if (isDataLoading || isHubLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-[#D4AF37] font-bold tracking-widest uppercase space-y-6">
        <NuviaLogo className="h-24 w-auto mb-4 animate-pulse opacity-80" />
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
        <p className="text-sm opacity-80 animate-pulse">Sincronizando dados do sistema...</p>
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

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col bg-[#0A192F] text-slate-300 border-r border-white/5">
      <div className="pt-8 pb-4 flex items-center justify-center bg-[#0A192F] shrink-0">
        <Link
          to="/admin/dashboard"
          className="block w-full text-center hover:opacity-80 transition-opacity text-[#D4AF37]"
        >
          {isCollapsed && !isMobile ? (
            <span className="text-3xl font-light tracking-widest text-[#D4AF37]">N</span>
          ) : (
            <NuviaLogo className="h-20 w-auto mx-auto" />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
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
                    <Collapsible
                      key={item.name}
                      open={openMenus[item.name] || false}
                      onOpenChange={(isOpen) =>
                        setOpenMenus((prev) => ({ ...prev, [item.name]: isOpen }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <button
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
                let badgeCount = 0
                if (item.name === 'MENSAGENS') badgeCount = totalUnread
                if (item.name === 'AGENDA') badgeCount = pendingSacsCount
                const hasBadge = badgeCount > 0

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
                      hasBadge &&
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
                          hasBadge && 'text-red-400 animate-pulse',
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {(!isCollapsed || isMobile) && (
                      <span
                        className={cn(
                          'transition-colors whitespace-nowrap',
                          hasBadge && 'text-red-400 font-bold',
                          hasBadge && !isActive && 'animate-pulse',
                        )}
                      >
                        {item.name}
                      </span>
                    )}
                    {hasBadge && (
                      <span
                        className={cn(
                          'bg-red-600 animate-pulse text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-red-700',
                          isCollapsed && !isMobile
                            ? 'absolute top-1 right-1 px-1.5 py-0 text-[8px]'
                            : 'ml-auto',
                        )}
                      >
                        {badgeCount > 99 ? '99+' : badgeCount}
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
          'p-4 border-t border-white/5 bg-[#0A192F] shrink-0',
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A192F] border-b border-[#D4AF37]/20">
        <Link to="/admin/dashboard" className="hover:opacity-80 transition-opacity text-[#D4AF37]">
          <NuviaLogo className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-1">
          <GlobalSearch isMobile className="text-[#D4AF37] hover:text-white hover:bg-white/10" />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#D4AF37] hover:bg-white/10 relative"
              >
                <Menu className="h-6 w-6" />
                {(totalUnread > 0 || pendingSacsCount > 0) && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#0A192F]"></span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-[#0A192F] border-r-slate-800">
              <SheetTitle className="sr-only">Menu Principal</SheetTitle>
              {renderSidebarContent(true)}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-20 transition-all duration-300 ease-in-out bg-[#0A192F]',
          isCollapsed ? 'w-20' : 'w-72',
        )}
      >
        {renderSidebarContent()}
      </div>

      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:pl-20' : 'md:pl-72',
        )}
      >
        <header className="hidden md:flex h-16 bg-[#0A192F] border-b border-[#D4AF37]/20 items-center px-4 justify-between sticky top-0 z-10 transition-all duration-300 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-[#D4AF37] hover:text-white hover:bg-white/10 h-9 w-9 ml-2"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2 text-sm text-[#D4AF37]/60 uppercase tracking-widest font-bold ml-2">
              <Home className="w-4 h-4" />
              <span>/</span>
              <span className="text-[#D4AF37]">
                {location.pathname.split('/')[2]?.replace(/-/g, ' ') || 'SISTEMA'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="font-mono text-sm tracking-widest uppercase font-bold flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-md border border-[#D4AF37]/20">
              <Clock className="w-4 h-4" />
              {format(now, "EEEE, dd 'de' MMMM • HH:mm:ss", { locale: ptBR })}
            </div>
            <GlobalSearch className="bg-[#112240] text-[#D4AF37]/70 border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]" />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </div>
      </main>

      <Button
        onClick={() => navigate('/admin/chat')}
        title="Mensagens e Comunicação"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] shadow-[0_8px_30px_rgb(212,175,55,0.4)] z-50 p-0 flex items-center justify-center transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-[#D4AF37] animate-pulse">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </Button>

      {/* Nuvia Hub Forced Announcement Modal */}
      <AlertDialog open={!!currentUnread}>
        <AlertDialogContent
          className="max-w-2xl border-[#D4AF37]/30 bg-[#0A192F] text-slate-100 p-0 overflow-hidden outline-none"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="bg-[#D4AF37] p-4 text-[#0A192F] flex items-center justify-center gap-3">
            <Megaphone className="h-6 w-6 shrink-0" />
            <AlertDialogTitle className="text-xl uppercase tracking-widest font-black m-0 leading-none mt-1">
              COMUNICADO IMPORTANTE
            </AlertDialogTitle>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <AlertDialogDescription className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              <div className="font-bold text-white text-xl mb-4 uppercase tracking-wider">
                {currentUnread?.title}
              </div>
              {currentUnread?.content}
            </AlertDialogDescription>
          </div>
          <div className="p-6 bg-[#112240] border-t border-[#D4AF37]/20 flex flex-col gap-4">
            <div className="flex items-center gap-3 pl-1">
              <Checkbox
                id="agree-announcement"
                checked={agreedToAnnouncement}
                onCheckedChange={(c) => setAgreedToAnnouncement(!!c)}
                className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] h-5 w-5 rounded-sm"
              />
              <label
                htmlFor="agree-announcement"
                className="text-sm font-bold tracking-widest uppercase text-slate-300 cursor-pointer select-none"
              >
                Li e concordo com os termos do comunicado
              </label>
            </div>
            <Button
              onClick={handleRead}
              disabled={readingAnnouncement || !agreedToAnnouncement}
              className="w-full h-12 bg-[#D4AF37] text-[#0A192F] hover:bg-[#B3932D] font-black uppercase tracking-widest text-base shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {readingAnnouncement ? 'Registrando leitura...' : 'Confirmar Leitura'}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
