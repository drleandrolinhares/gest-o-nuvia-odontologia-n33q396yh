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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Employee } from '@/stores/main'
import { User, Phone, Mail, Briefcase, Calendar as CalIcon, Building2 } from 'lucide-react'

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white'
      case 'Férias':
        return 'bg-amber-500 hover:bg-amber-600 text-white'
      case 'Aviso Prévio':
        return 'bg-rose-500 hover:bg-rose-600 text-white'
      case 'Desligado':
        return 'bg-stone-500 hover:bg-stone-600 text-white'
      default:
        return 'bg-slate-500 hover:bg-slate-600 text-white'
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <div className="border rounded-md shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground uppercase">
                NOME DO COLABORADOR
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase">
                FUNÇÃO
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase">
                DEPARTAMENTO
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((emp) => (
              <TableRow
                key={emp.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedEmp(emp)}
              >
                <TableCell className="font-medium text-primary hover:underline uppercase">
                  {emp.name}
                </TableCell>
                <TableCell className="text-muted-foreground uppercase">{emp.role}</TableCell>
                <TableCell className="text-muted-foreground uppercase">{emp.department}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`uppercase ${getStatusColor(emp.status)}`}>
                    {emp.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {sortedEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground uppercase">
                  NENHUM COLABORADOR ENCONTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedEmp} onOpenChange={(o) => !o && setSelectedEmp(null)}>
        <DialogContent className="max-w-2xl uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
              <User className="h-6 w-6" /> DETALHES DO COLABORADOR
            </DialogTitle>
          </DialogHeader>
          {selectedEmp && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">NOME COMPLETO</p>
                  <p className="text-base font-medium">{selectedEmp.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">STATUS ATUAL</p>
                  <Badge variant="secondary" className={`${getStatusColor(selectedEmp.status)}`}>
                    {selectedEmp.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">FUNÇÃO</p>
                    <p className="text-sm font-medium">{selectedEmp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">DEPARTAMENTO</p>
                    <p className="text-sm font-medium">{selectedEmp.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">ADMISSÃO</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedEmp.hireDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">SALÁRIO MENSAL</p>
                    <p className="text-sm font-medium">{selectedEmp.salary}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">E-MAIL</p>
                    <p className="text-sm font-medium lowercase">{selectedEmp.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">TELEFONE</p>
                    <p className="text-sm font-medium">{selectedEmp.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-muted">
                <h4 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <CalIcon className="h-4 w-4" /> GESTÃO DE FÉRIAS
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card border rounded p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">TOTAL DE DIAS</p>
                    <p className="text-lg font-bold">{selectedEmp.vacationDaysTotal}</p>
                  </div>
                  <div className="bg-card border rounded p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">DIAS GOZADOS</p>
                    <p className="text-lg font-bold text-amber-500">
                      {selectedEmp.vacationDaysTaken}
                    </p>
                  </div>
                  <div className="bg-card border rounded p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">SALDO DISPONÍVEL</p>
                    <p className="text-lg font-bold text-emerald-500">
                      {selectedEmp.vacationDaysTotal - selectedEmp.vacationDaysTaken}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground">
                    PERÍODO AQUISITIVO VENCE EM:
                  </p>
                  <p className="text-sm font-medium text-destructive mt-1">
                    {selectedEmp.vacationDueDate
                      ? new Date(selectedEmp.vacationDueDate).toLocaleDateString('pt-BR')
                      : 'NÃO CADASTRADO'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
