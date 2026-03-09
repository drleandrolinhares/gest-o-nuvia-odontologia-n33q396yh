import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Employee } from '@/stores/main'
import { cn } from '@/lib/utils'

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

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

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Admissão</TableHead>
              <TableHead>Salário Base</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedEmp(emp)}
                >
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{new Date(emp.hireDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{emp.salary}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn('text-white', getStatusColor(emp.status))}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedEmp} onOpenChange={(open) => !open && setSelectedEmp(null)}>
        {selectedEmp && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Colaborador</DialogTitle>
              <DialogDescription>Informações completas de {selectedEmp.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Departamento</span>
                  <span className="font-medium">{selectedEmp.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Função</span>
                  <span className="font-medium">{selectedEmp.role}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Admissão</span>
                  <span className="font-medium">
                    {new Date(selectedEmp.hireDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Status Atual</span>
                  <Badge className={cn('text-white mt-1', getStatusColor(selectedEmp.status))}>
                    {selectedEmp.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium text-sm">Controle de Férias</h4>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{selectedEmp.vacationDaysTaken} dias gozados</span>
                  <span>Total: {selectedEmp.vacationDaysTotal} dias</span>
                </div>
                <Progress
                  value={(selectedEmp.vacationDaysTaken / selectedEmp.vacationDaysTotal) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
