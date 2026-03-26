import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SEARCH_ROUTES = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Agenda e Pedidos', href: '/agenda' },
  { title: 'Mensagens / Chat', href: '/chat' },
  { title: 'SAC (Oportunidades de Solução)', href: '/sac' },
  { title: 'RH - Equipe', href: '/rh' },
  { title: 'RH - Escala de Trabalho', href: '/rh/escala' },
  { title: 'Estoque', href: '/estoque' },
  { title: 'Precificação', href: '/precificacao' },
  { title: 'Simulador de Negociação', href: '/negociacao' },
  { title: 'Configurações', href: '/configuracoes' },
  { title: 'Permissões', href: '/permissoes' },
  { title: 'Central de Acessos', href: '/acessos' },
  { title: 'Logs de Auditoria', href: '/logs' },
  { title: 'Nuvia Hub - Mural', href: '/hub/mural' },
  { title: 'Nuvia Hub - PP & PDM', href: '/hub/feedback' },
  { title: 'Nuvia Hub - Desenv. e Performance', href: '/hub/performance' },
  { title: 'Nuvia Hub - Ranking', href: '/hub/ranking' },
]

export function GlobalSearch({ className, isMobile }: { className?: string; isMobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant={isMobile ? 'ghost' : 'outline'}
        className={cn(
          isMobile
            ? 'text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full'
            : 'w-64 justify-start text-sm text-muted-foreground shadow-sm bg-slate-50 hover:bg-slate-100 relative',
          className,
        )}
        onClick={() => setOpen(true)}
        title="Busca Global"
      >
        <Search className={cn('h-5 w-5', !isMobile && 'mr-2 h-4 w-4')} />
        {!isMobile && <span className="inline-flex">Buscar módulos...</span>}
        {!isMobile && (
          <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para buscar módulos e páginas..." className="uppercase" />
        <CommandList>
          <CommandEmpty>NENHUM MÓDULO ENCONTRADO.</CommandEmpty>
          <CommandGroup heading="MÓDULOS DO SISTEMA">
            {SEARCH_ROUTES.map((route) => (
              <CommandItem
                key={route.href}
                value={route.title}
                onSelect={() => {
                  navigate(route.href)
                  setOpen(false)
                }}
                className="uppercase font-bold text-xs cursor-pointer py-3"
              >
                {route.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
