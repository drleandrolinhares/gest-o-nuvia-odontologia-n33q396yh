import { useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Home, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GlobalSearch } from '@/components/GlobalSearch'

interface AppHeaderProps {
  isCollapsed: boolean
  onToggleSidebar: () => void
}

export function AppHeader({ isCollapsed, onToggleSidebar }: AppHeaderProps) {
  const location = useLocation()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="hidden md:flex h-16 bg-[#0A192F] border-b border-[#D4AF37]/20 items-center px-4 justify-between sticky top-0 z-10 transition-all duration-300 shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
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
  )
}
