import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Plus, MoreVertical, Briefcase, Mail, Phone, User as UserIcon } from 'lucide-react'
import useAppStore, { Employee } from '@/stores/main'
import { EditEmployeeDialog } from '@/components/rh/EditEmployeeDialog'
import { AddEmployeeDialog } from '@/components/rh/AddEmployeeDialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function UsersList() {
  const { employees, can, isAdmin } = useAppStore()
  const [search, setSearch] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

  const canAdd = isAdmin || can('colaboradores', 'criar_colaborador')
  const canEdit = isAdmin || can('colaboradores', 'editar_colaborador')

  const filteredEmployees = employees
    .filter((emp) => {
      if (activeOnly && emp.status !== 'Ativo') return false
      if (search && !emp.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleEdit = (emp: Employee) => {
    setSelectedEmp(emp)
  }

  const formatLastAccess = (dateString?: string) => {
    if (!dateString) return 'Não registrado'
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-nuvia-navy tracking-tight">Usuários e Permissões</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie aqui os membros da equipe e as permissões de acesso
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-xl border border-muted/50">
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar Usuário"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active-only"
              checked={activeOnly}
              onCheckedChange={(c) => setActiveOnly(!!c)}
            />
            <label
              htmlFor="active-only"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Mostrar apenas usuários ativos
            </label>
          </div>
        </div>

        {canAdd && (
          <AddEmployeeDialog
            customTrigger={
              <Button className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-black tracking-wide w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Novo Usuário
              </Button>
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEmployees.map((emp) => (
          <Card
            key={emp.id}
            className={cn(
              'overflow-hidden hover:shadow-md transition-shadow relative',
              emp.accessLevel === 'MASTER' ? 'border-nuvia-gold/50 bg-nuvia-gold/5' : '',
            )}
          >
            <CardContent className="p-0">
              <div className="p-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        emp.status === 'Ativo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {emp.status === 'Ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                    {emp.accessLevel === 'MASTER' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-nuvia-gold text-nuvia-navy border border-nuvia-gold/50 tracking-widest shadow-sm uppercase">
                        MASTER
                      </span>
                    )}
                  </div>
                  {canEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(emp)}>
                          Editar Perfil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex flex-col items-center text-center space-y-3 mb-6">
                  <Avatar
                    className={cn(
                      'h-16 w-16 border-2',
                      emp.accessLevel === 'MASTER'
                        ? 'bg-nuvia-navy border-nuvia-gold'
                        : 'bg-muted border-muted-foreground/20',
                    )}
                  >
                    <AvatarFallback
                      className={
                        emp.accessLevel === 'MASTER'
                          ? 'bg-nuvia-navy text-nuvia-gold'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      <UserIcon className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-foreground leading-tight px-2">{emp.name}</h3>
                </div>

                <div
                  className={cn(
                    'space-y-2 p-3 rounded-lg text-sm',
                    emp.accessLevel === 'MASTER' ? 'bg-nuvia-gold/10' : 'bg-muted/30',
                  )}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{emp.role || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {emp.username || emp.email?.split('@')[0] || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{emp.phone || 'Não encontrado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{emp.email || 'Não encontrado'}</span>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'border-t px-5 py-3 text-xs text-muted-foreground font-medium flex items-center',
                  emp.accessLevel === 'MASTER' ? 'bg-nuvia-gold/10' : 'bg-muted/10',
                )}
              >
                <span className="mr-1">🕒</span> Último acesso em:{' '}
                {formatLastAccess(emp.lastAccess)}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
            NENHUM USUÁRIO ENCONTRADO.
          </div>
        )}
      </div>

      <EditEmployeeDialog
        employee={selectedEmp}
        open={!!selectedEmp}
        onOpenChange={(open) => !open && setSelectedEmp(null)}
      />
    </div>
  )
}
