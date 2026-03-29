import { Link, useLocation } from 'react-router-dom'
import {
  LogOut,
  Settings,
  ChevronDown,
  Handshake,
  Briefcase,
  DollarSign,
  Bug,
  Users,
  Shield,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState, useMemo, useEffect } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import useAppStore from '@/stores/main'
import { NuviaLogo } from './NuviaLogo'
import { supabase } from '@/lib/supabase/client'

interface AppSidebarProps {
  isCollapsed: boolean
  isMobile?: boolean
  onLinkClick?: () => void
}

export function AppSidebar({ isCollapsed, isMobile = false, onLinkClick }: AppSidebarProps) {
  const { signOut, user } = useAuth()
  const location = useLocation()

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sidebar_expanded_sections')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Destructure can to force reactivity when permissions change
  const { sacRecords, can, userPermissions } = useAppStore()

  const pendingSacsCount = useMemo(() => {
    return (sacRecords?.filter((item) => item) || []).filter(
      (r) => r?.status === 'OPORTUNIDADE DE SOLUÇÃO',
    ).length
  }, [sacRecords])

  const [hasRotina, setHasRotina] = useState<boolean | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user) return

    const checkAccess = async () => {
      try {
        const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: user.id })
        const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: user.id })
        const isAdm = !!isAdminData || !!isMasterData
        setIsUserAdmin(isAdm)

        if (isAdm) {
          setHasRotina(true)
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('cargo_id')
          .eq('id', user.id)
          .maybeSingle()

        if (profile?.cargo_id) {
          const { data: rotinas } = await supabase
            .from('rotinas_config')
            .select('id')
            .or(`cargo_id.eq.${profile.cargo_id},colaborador_id.eq.${user.id}`)
            .limit(1)

          setHasRotina((rotinas && rotinas.length > 0) || false)
        } else {
          setHasRotina(false)
        }
      } catch (err) {
        console.error('Error checking access:', err)
        setIsUserAdmin(false)
        setHasRotina(false)
      }
    }

    checkAccess()
  }, [user])

  const navigationSections = useMemo(() => {
    const sections = [
      {
        title: 'OPERACIONAL',
        icon: Activity,
        items: [
          { name: 'SAC', href: '/sac', module: 'SAC', badge: pendingSacsCount },
          {
            name: 'ROTINA DIÁRIA',
            href: '/rotina-diaria',
            module: 'ROTINA DIÁRIA',
            hideIfNoRoutine: true,
          },
          {
            name: 'RELATÓRIO DE ROTINAS',
            href: '/rotina-relatorio',
            module: 'ROTINA DIÁRIA',
            adminOnly: true,
          },
          { name: 'PERFORMANCE', href: '/performance', module: 'PERFORMANCE' },
          { name: 'COMUNICADOS', href: '/comunicados', module: 'COMUNICADOS' },
          { name: 'AVISOS E RECADOS', href: '/avisos-e-recados', module: 'AVISOS E RECADOS' },
        ],
      },
      {
        title: 'COMERCIAL',
        icon: Handshake,
        items: [
          { name: 'GESTÃO DE VENDAS', href: '/gestao-de-vendas', module: 'GESTÃO DE VENDAS' },
          { name: 'NEGOCIAÇÃO', href: '/negociacao', module: 'NEGOCIAÇÃO' },
          { name: 'GESTÃO FISCAL', href: '/gestao-fiscal', module: 'GESTÃO FISCAL' },
        ],
      },
      {
        title: 'FINANCEIRO',
        icon: DollarSign,
        items: [
          { name: 'CENTRAL DE ACESSOS', href: '/central-de-acessos', module: 'CENTRAL DE ACESSOS' },
          { name: 'ESTOQUE', href: '/estoque', module: 'ESTOQUE' },
        ],
      },
      {
        title: 'ADMINISTRATIVO',
        icon: Briefcase,
        items: [
          { name: 'DASHBOARD', href: '/dashboard', module: 'DASHBOARD' },
          { name: 'KPIS', href: '/kpis', module: 'KPIS' },
          { name: 'BONIFICAÇÕES', href: '/kpis/bonificacoes', module: 'KPIS', adminOnly: true },
          { name: 'USUÁRIOS', href: '/usuarios', module: 'USUÁRIOS', icon: Users },
          {
            name: 'ESCALA DE TRABALHO',
            href: '/escala-de-trabalho',
            module: 'ESCALA DE TRABALHO',
          },
          { name: 'PRECIFICAÇÃO', href: '/precificacao', module: 'PRECIFICAÇÃO' },
          {
            name: 'SEGMENTAÇÃO DA AGENDA',
            href: '/segmentacao-agenda',
            module: 'SEGMENTAÇÃO DA AGENDA',
          },
        ],
      },
      {
        title: 'SISTEMA',
        icon: Settings,
        items: [
          { name: 'CONFIGURAÇÕES', href: '/configuracoes', module: 'CONFIGURAÇÕES' },
          { name: 'PERMISSÕES', href: '/permissoes', module: 'PERMISSÕES', icon: Shield },
          { name: 'LOGS', href: '/logs', module: 'LOGS' },
          { name: 'DEBUG', href: '/debug', module: 'DEBUG', adminOnly: true, icon: Bug },
        ],
      },
    ]

    return sections
      .map((section) => {
        const visibleItems = (section.items?.filter((item) => item) || []).filter((item) => {
          if (
            item.adminOnly &&
            user?.email !== 'drleandrolinhares@gmail.com' &&
            user?.email !== 'master@nuvia.com.br'
          ) {
            return false
          }
          if ((item as any).hideIfNoRoutine && isUserAdmin === false && hasRotina === false) {
            return false
          }
          return can ? can(item.module, 'view') : false
        })
        return { ...section, items: visibleItems }
      })
      .filter((section) => section && section.items && section.items.length > 0)
  }, [pendingSacsCount, can, user?.email, userPermissions, isUserAdmin, hasRotina])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = { ...prev, [title]: !prev[title] }
      localStorage.setItem('sidebar_expanded_sections', JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    setOpenSections((prev) => {
      let hasChanges = false
      const next = { ...prev }
      ;(navigationSections?.filter((item) => item) || []).forEach((section) => {
        const isAnySubActive = (section.items?.filter((item) => item) || []).some((item) =>
          location.pathname.startsWith(item.href),
        )
        if (isAnySubActive && !next[section.title]) {
          next[section.title] = true
          hasChanges = true
        }
      })
      if (hasChanges) {
        localStorage.setItem('sidebar_expanded_sections', JSON.stringify(next))
        return next
      }
      return prev
    })
  }, [location.pathname, navigationSections])

  return (
    <div className="flex h-full flex-col bg-[#0A192F] text-slate-300 border-r border-white/5">
      <div className="pt-8 pb-6 flex items-center justify-center bg-[#0A192F] shrink-0 border-b border-white/5">
        <Link
          to="/dashboard"
          className="block w-full text-center hover:opacity-80 transition-opacity text-[#D4AF37]"
        >
          {isCollapsed && !isMobile ? (
            <span className="text-3xl font-light tracking-widest text-[#D4AF37]">N</span>
          ) : (
            <NuviaLogo className="h-16 w-auto mx-auto" />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 overflow-x-hidden custom-scrollbar">
        {(navigationSections?.filter((item) => item) || []).map((section) => {
          return (
            <div key={section.title} className="mb-2">
              <Collapsible
                open={(openSections[section.title] || false) && (!isCollapsed || isMobile)}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'w-full flex items-center py-3 px-3 text-xs font-black uppercase tracking-widest rounded-md transition-all outline-none group text-[#D4AF37] hover:bg-white/5',
                      isCollapsed && !isMobile ? 'justify-center px-2' : '',
                    )}
                    title={isCollapsed && !isMobile ? section.title : undefined}
                  >
                    <section.icon
                      className={cn(
                        'h-5 w-5 shrink-0 transition-colors',
                        isCollapsed && !isMobile ? 'mr-0' : 'mr-3',
                      )}
                    />
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="flex-1 text-left whitespace-nowrap">{section.title}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform opacity-70 group-hover:opacity-100',
                            openSections[section.title] ? 'rotate-180' : '',
                          )}
                        />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                {(!isCollapsed || isMobile) && (
                  <CollapsibleContent className="space-y-1 mt-1 pl-11 pr-2 pb-2">
                    {(section.items?.filter((item) => item) || []).map((item) => {
                      const isActive =
                        item.href === '/rotina-diaria'
                          ? location.pathname === '/rotina-diaria' ||
                            location.pathname === '/rotina-diaria/'
                          : location.pathname.startsWith(item.href)

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={onLinkClick}
                          className={cn(
                            'flex items-center justify-between py-2.5 px-3 text-[11px] font-bold tracking-widest rounded-md transition-colors whitespace-nowrap relative',
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <span className="flex items-center overflow-hidden pr-2">
                            {'icon' in item && item.icon ? (
                              <item.icon
                                className={cn(
                                  'w-3.5 h-3.5 mr-2 shrink-0 transition-colors',
                                  isActive ? 'text-[#D4AF37]' : 'text-slate-400',
                                )}
                              />
                            ) : (
                              <span
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full mr-2 shrink-0 transition-colors',
                                  isActive ? 'bg-[#D4AF37]' : 'bg-transparent',
                                )}
                              />
                            )}
                            <span className="truncate">{item.name}</span>
                          </span>
                          {'badge' in item && item.badge !== undefined && item.badge > 0 && (
                            <span className="bg-red-600 animate-pulse text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm shrink-0 ml-auto">
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                )}
              </Collapsible>
            </div>
          )
        })}
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
                {user?.user_metadata?.name || 'SISTEMA'}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          title={isCollapsed && !isMobile ? 'Sair do sistema' : undefined}
          className={cn(
            'justify-start text-slate-300 hover:text-white hover:bg-white/5 uppercase font-bold text-xs tracking-wider',
            isCollapsed && !isMobile ? 'w-auto px-2 justify-center' : 'w-full',
          )}
          onClick={() => signOut()}
        >
          <LogOut
            className={cn('h-4 w-4 text-slate-400', isCollapsed && !isMobile ? 'mr-0' : 'mr-3')}
          />
          {(!isCollapsed || isMobile) && 'SAIR DO SISTEMA'}
        </Button>
      </div>
    </div>
  )
}
