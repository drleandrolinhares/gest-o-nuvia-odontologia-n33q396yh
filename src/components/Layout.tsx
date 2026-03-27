import { Outlet, useNavigate } from 'react-router-dom'
import { AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import useAppStore from '@/stores/main'
import { useHubStore } from '@/stores/hub'
import { useChatStore } from '@/stores/chat'
import { AppSidebar } from './layout/AppSidebar'
import { AppHeader } from './layout/AppHeader'
import { MobileNav } from './layout/MobileNav'
import { AnnouncementModal } from './layout/AnnouncementModal'
import { NuviaLogo } from './layout/NuviaLogo'

export function Layout() {
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true',
  )

  const { isDataLoading, fetchError } = useAppStore()
  const { isLoading: isHubLoading } = useHubStore()
  const { unreadCounts } = useChatStore()
  const totalUnread = useMemo(
    () => Object.values(unreadCounts).reduce((a, b) => a + b, 0),
    [unreadCounts],
  )

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev
      localStorage.setItem('sidebar_collapsed', String(newState))
      return newState
    })
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      <MobileNav />

      <div
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-20 transition-all duration-300 ease-in-out bg-[#0A192F]',
          isCollapsed ? 'w-20' : 'w-72',
        )}
      >
        <AppSidebar isCollapsed={isCollapsed} />
      </div>

      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:pl-20' : 'md:pl-72',
        )}
      >
        <AppHeader isCollapsed={isCollapsed} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </div>
      </main>

      <Button
        onClick={() => navigate('/mensagens')}
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

      <AnnouncementModal />
    </div>
  )
}
