import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Employee } from '@/stores/main'
import { cn } from '@/lib/utils'
import { UserCircle } from 'lucide-react'

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const navigate = useNavigate()

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

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card">
        Nenhum colaborador encontrado no momento.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {employees.map((emp) => (
        <div
          key={emp.id}
          onClick={() => navigate(`/rh/colaborador/${emp.id}`)}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:border-primary/50 cursor-pointer transition-all gap-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{emp.name}</h4>
              <p className="text-sm text-muted-foreground">
                {emp.role} • {emp.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 border-t sm:border-0 pt-3 sm:pt-0">
            <div className="text-sm text-right hidden md:block">
              <p className="text-muted-foreground text-xs">Admissão</p>
              <p className="font-medium">{new Date(emp.hireDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <Badge className={cn('text-white whitespace-nowrap', getStatusColor(emp.status))}>
              {emp.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
