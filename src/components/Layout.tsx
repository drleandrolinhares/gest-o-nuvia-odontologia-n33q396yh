import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { navItems } from '@/config/navigation'
import useAppStore from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { employees, currentUserId, isAdmin } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  const currentUser = employees.find((e) => e.id === currentUserId)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const isItemVisible = (item: any) => {
    if (isAdmin) return true
    if (item.id === 'dashboard') return true
    if (!currentUser?.permissions) return false

    const p = currentUser.permissions
    if (item.id === 'agenda')
      return Object.keys(p.agenda || {}).length > 0 || currentUser.agendaAccess === 'ADD_EDIT'
    if (item.id === 'acessos') return Object.keys(p.acessos || {}).length > 0
    if (item.id === 'rh')
      return (
        Object.keys(p.colaboradores || {}).length > 0 || Object.keys(p.documentos || {}).length > 0
      )
    if (item.id === 'estoque') return Object.keys(p.estoque || {}).length > 0
    if (item.id === 'configuracoes')
      return (
        Object.keys(p.fornecedores || {}).length > 0 ||
        Object.keys(p.colaboradores || {}).length > 0
      )
    if (item.id === 'auditoria') return false

    return false
  }

  const visibleNav = navItems.filter(isItemVisible)

  const NavLinks = () => (
    <div className="flex flex-col gap-2 p-4">
      {visibleNav.map((item) => {
        const isActive =
          location.pathname === item.href ||
          (item.href !== '/admin' && location.pathname.startsWith(item.href))
        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold uppercase',
              isActive
                ? 'bg-nuvia-gold text-white shadow-sm'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/20 flex w-full">
      <aside className="hidden md:flex flex-col w-64 bg-nuvia-navy border-r border-nuvia-navy shrink-0 sticky top-0 h-screen shadow-xl z-20">
        <div className="h-20 flex items-center justify-center px-6 border-b border-white/10">
          <img src={logoUrl} alt="Nuvia" className="h-10 object-contain brightness-0 invert" />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-white/10 bg-nuvia-navy mt-auto">
          <div className="mb-4 px-2">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-0.5">
              LOGADO COMO
            </p>
            <p className="text-sm font-black text-white truncate uppercase leading-tight">
              {currentUser?.name || 'ADMINISTRADOR'}
            </p>
            <p
              className={cn(
                'text-xs font-bold uppercase mt-0.5',
                currentUser?.accessLevel === 'MASTER' ? 'text-nuvia-gold' : 'text-white/70',
              )}
            >
              {currentUser?.accessLevel || 'ESTRATEGICO'}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start border-white/20 text-white/70 hover:bg-white/10 hover:text-white uppercase font-bold"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> SAIR
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 border-b bg-nuvia-navy flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <img src={logoUrl} alt="Nuvia" className="h-8 object-contain brightness-0 invert" />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 flex flex-col w-64 border-r border-nuvia-navy bg-nuvia-navy"
            >
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="h-20 flex items-center justify-center px-6 border-b border-white/10">
                <img
                  src={logoUrl}
                  alt="Nuvia"
                  className="h-10 object-contain brightness-0 invert"
                />
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <NavLinks />
              </div>
              <div className="p-4 border-t border-white/10 mt-auto">
                <div className="mb-4 px-2">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-0.5">
                    LOGADO COMO
                  </p>
                  <p className="text-sm font-black text-white truncate uppercase leading-tight">
                    {currentUser?.name || 'ADMINISTRADOR'}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-bold uppercase mt-0.5',
                      currentUser?.accessLevel === 'MASTER' ? 'text-nuvia-gold' : 'text-white/70',
                    )}
                  >
                    {currentUser?.accessLevel || 'ESTRATEGICO'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white/70 hover:bg-white/10 hover:text-white uppercase font-bold"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> SAIR
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
