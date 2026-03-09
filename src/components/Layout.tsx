import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Stethoscope,
  Briefcase,
  Target,
  CircleDollarSign,
  UserPlus,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/departamento/operacional', label: 'Operacional', icon: Stethoscope },
  { href: '/departamento/administrativo', label: 'Administrativo', icon: Briefcase },
  { href: '/departamento/estrategico', label: 'Estratégico', icon: Target },
  { href: '/departamento/financeiro', label: 'Financeiro', icon: CircleDollarSign },
  { href: '/onboarding', label: 'Onboarding', icon: UserPlus },
]

function SidebarNav({ className }: { className?: string }) {
  const location = useLocation()
  return (
    <nav className={cn('flex flex-col gap-2 p-4', className)}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : '',
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="p-6">
          <img src={logoUrl} alt="Nuvia Odontologia" className="h-12 w-auto object-contain" />
        </div>
        <SidebarNav className="flex-1" />
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. Souza Filho</span>
              <span className="text-xs text-muted-foreground">Administrador</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="p-6 border-b">
                <img src={logoUrl} alt="Nuvia Odontologia" className="h-10 w-auto" />
              </div>
              <SidebarNav className="flex-1" />
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar documentos, colaboradores..."
                className="pl-8 bg-muted/50 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
