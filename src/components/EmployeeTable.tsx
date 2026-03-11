import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Employee } from '@/stores/main'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'
import { UserCircle, Trash2 } from 'lucide-react'

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const navigate = useNavigate()
  const { isAdmin, deleteEmployee } = useAppStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'Férias':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'Aviso Prévio':
        return 'bg-destructive hover:bg-destructive'
      default:
        return 'bg-gray-500'
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  if (sortedEmployees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card uppercase">
        Nenhum colaborador encontrado no momento.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedEmployees.map((emp) => (
        <div
          key={emp.id}
          onClick={() => navigate(`/rh/colaborador/${emp.id}`)}
          className="flex flex-col sm:flex-row sm:items-center p-4 border rounded-lg bg-card hover:border-primary/50 cursor-pointer transition-all gap-4 shadow-sm group"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground uppercase">{emp.name}</h4>
              <p className="text-sm text-muted-foreground uppercase">
                {emp.role} • {emp.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 border-t sm:border-0 pt-3 sm:pt-0">
            <div className="text-sm text-right hidden md:block">
              <p className="text-muted-foreground text-xs uppercase">ADMISSÃO</p>
              <p className="font-medium uppercase">
                {new Date(emp.hireDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Badge
              className={cn('text-white whitespace-nowrap uppercase', getStatusColor(emp.status))}
            >
              {emp.status}
            </Badge>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm(`Tem certeza que deseja remover ${emp.name}?`)) {
                    deleteEmployee(emp.id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
