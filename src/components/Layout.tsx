import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  Bell,
  Search,
  User,
  Settings as SettingsIcon,
} from 'lucide-react'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useAppStore from '@/stores/main'
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

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rh', label: 'RH', icon: Users },
  { href: '/estoque', label: 'Estoque', icon: Package },
  { href: '/configuracoes', label: 'Configurações', icon: SettingsIcon },
]

export function AppSidebar() {
  const location = useLocation()
  const { isAdmin, toggleAdmin } = useAppStore()

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
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">Dr. Souza Filho</span>
            <span
              className="text-xs text-muted-foreground truncate cursor-pointer hover:underline hover:text-primary transition-colors"
              onClick={toggleAdmin}
              title="Clique para alternar permissões"
            >
              {isAdmin ? 'Administrador' : 'Usuário Padrão'}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm z-10">
          <SidebarTrigger className="-ml-2" />

          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar no sistema Nuvia..."
                className="pl-8 bg-muted/50 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
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
      </SidebarInset>
    </SidebarProvider>
  )
}
