import { Link, useLocation } from 'react-router-dom'
import {
  Calendar,
  Users,
  Package,
  Settings,
  LogOut,
  FileText,
  Shield,
  LayoutDashboard,
  MessageCircle,
  Clock,
  DollarSign,
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'
import { NuviaLogo } from './NuviaLogo'

interface AppSidebarProps {
  isCollapsed: boolean
  isMobile?: boolean
  onLinkClick?: () => void
}

export function AppSidebar({ isCollapsed, isMobile = false, onLinkClick }: AppSidebarProps) {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const { unreadCounts } = useChatStore()
  const { isAdmin, isMaster, can, sacRecords, currentUserId } = useAppStore()

  const pendingSacsCount = useMemo(
    () =>
      sacRecords.filter(
        (r) =>
          r.status === 'OPORTUNIDADE DE SOLUÇÃO' && r.responsible_employee_id === currentUserId,
      ).length,
    [sacRecords, currentUserId],
  )

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

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

  const filteredSections = useMemo(
    () =>
      navigationSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            if ('adminOnly' in item && item.adminOnly && !isAdmin && !isMaster) return false
            if (
              'module' in item &&
              item.module &&
              !isAdmin &&
              !isMaster &&
              !can(item.module, 'view')
            )
              return false
            return true
          }),
        }))
        .filter((section) => section.items.length > 0),
    [navigationSections, isAdmin, isMaster, can],
  )

  useEffect(() => {
    setOpenMenus((prev) => {
      let hasChanges = false
      const next = { ...prev }
      filteredSections.forEach((section) => {
        section.items.forEach((item) => {
          if ('subItems' in item && item.subItems) {
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

  return (
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
                if ('subItems' in item && item.subItems) {
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
                                onClick={onLinkClick}
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

                const isActive =
                  'exact' in item && item.exact
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
                    onClick={onLinkClick}
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
}
