import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'
import { GlobalSearch } from '@/components/GlobalSearch'
import { AppSidebar } from './AppSidebar'
import { NuviaLogo } from './NuviaLogo'

export function MobileNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { unreadCounts } = useChatStore()
  const { sacRecords, currentUserId } = useAppStore()

  const totalUnread = useMemo(
    () =>
      Object.values(unreadCounts || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0),
    [unreadCounts],
  )

  const pendingSacsCount = useMemo(
    () =>
      (Array.isArray(sacRecords) ? sacRecords : []).filter(
        (r) =>
          r?.status === 'OPORTUNIDADE DE SOLUÇÃO' && r?.responsible_employee_id === currentUserId,
      ).length,
    [sacRecords, currentUserId],
  )

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#0A192F] border-b border-[#D4AF37]/20">
      <Link to="/dashboard" className="hover:opacity-80 transition-opacity text-[#D4AF37]">
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
            <AppSidebar
              isCollapsed={false}
              isMobile={true}
              onLinkClick={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
