import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Users, Pencil } from 'lucide-react'
import useAppStore, { Employee } from '@/stores/main'
import { AddEmployeeDialog } from '@/components/rh/AddEmployeeDialog'
import { EditEmployeeDialog } from '@/components/rh/EditEmployeeDialog'

export function UsersList() {
  const { employees, updateEmployeeAgendaAccess } = useAppStore()
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState<Employee | null>(null)
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> LISTA DE COLABORADORES
          </CardTitle>
          <CardDescription className="mt-1 uppercase">
            VISUALIZE E DEFINA NÍVEL BÁSICO DA AGENDA E DADOS DOS COLABORADORES.
          </CardDescription>
        </div>
        <AddEmployeeDialog triggerText="INCLUIR USUÁRIOS" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME DO COLABORADOR</TableHead>
              <TableHead>FUNÇÃO</TableHead>
              <TableHead className="w-[300px]">PERMISSÃO DA AGENDA</TableHead>
              <TableHead className="text-right">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium uppercase">{emp.name}</TableCell>
                <TableCell className="text-muted-foreground uppercase">{emp.role}</TableCell>
                <TableCell>
                  <Select
                    value={emp.agendaAccess || 'VIEW_ONLY'}
                    onValueChange={(v) => updateEmployeeAgendaAccess(emp.id, v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEW_ONLY">APENAS VISUALIZAR A AGENDA</SelectItem>
                      <SelectItem value="ADD_EDIT">PODE ADD ITENS A AGENDA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEmpForEdit(emp)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    title="EDITAR COLABORADOR"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 uppercase text-muted-foreground">
                  NENHUM COLABORADOR CADASTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <EditEmployeeDialog
          employee={selectedEmpForEdit}
          open={!!selectedEmpForEdit}
          onOpenChange={(open) => !open && setSelectedEmpForEdit(null)}
        />
      </CardContent>
    </Card>
  )
}
