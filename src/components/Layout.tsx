import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, User, PackageSearch, LogOut } from 'lucide-react'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useAppStore from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { QuickProductSearchModal } from '@/components/inventory/QuickProductSearchModal'
import { navItems } from '@/config/navigation'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin, employees } = useAppStore()
  const { user, signOut } = useAuth()

  const currentUser = employees.find((e) => e.user_id === user?.id)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4 flex items-center justify-center h-16 border-b">
        <img
          src={logoUrl}
          alt="Nuvia Odontologia"
          className="h-8 w-auto object-contain group-data-[collapsible=icon]:hidden"
        />
        <span className="font-bold text-xl text-primary hidden group-data-[collapsible=icon]:block">
          N
        </span>
      </SidebarHeader>

      <SidebarContent className="p-2 pt-4">
        <SidebarMenu>
          {navItems.map((item) => {
            if (!isAdmin && currentUser && !currentUser.permissions?.includes(item.id)) {
              return null
            }
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="uppercase">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden uppercase">
              <span className="text-sm font-bold truncate">{currentUser?.name || 'SISTEMA'}</span>
              <span className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'ADMINISTRADOR' : 'COLABORADOR'}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 group-data-[collapsible=icon]:hidden"
            title="SAIR DO SISTEMA"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function Layout() {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden uppercase">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm z-10">
          <SidebarTrigger className="-ml-2" />
          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="BUSCAR NO SISTEMA NUVIA..."
                className="pl-8 bg-muted/50 w-full uppercase"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#D81B84] hover:bg-muted/80 hover:text-[#D81B84]"
              onClick={() => setIsQuickViewOpen(true)}
              title="CONSULTA RÁPIDA DE PRODUTOS"
            >
              <PackageSearch className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>

        <QuickProductSearchModal open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
      </SidebarInset>
    </SidebarProvider>
  )
}
