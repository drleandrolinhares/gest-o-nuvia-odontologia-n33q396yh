import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAppStore, { Employee } from '@/stores/main'
import { getVacationStatus } from '@/lib/vacation'

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const { deleteEmployee } = useAppStore()

  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 uppercase">
            <TableHead className="font-semibold">COLABORADOR</TableHead>
            <TableHead className="font-semibold">CATEGORIA</TableHead>
            <TableHead className="font-semibold">FUNÇÃO / SETOR</TableHead>
            <TableHead className="font-semibold">FÉRIAS</TableHead>
            <TableHead className="font-semibold">STATUS</TableHead>
            <TableHead className="font-semibold text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => {
            const vStatus = getVacationStatus(emp.vacationDueDate)

            return (
              <TableRow key={emp.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <Link to={`/admin/rh/colaborador/${emp.id}`} className="hover:underline">
                    <div className="font-bold text-foreground uppercase">{emp.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {emp.email || 'SEM EMAIL'}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(emp.teamCategory || ['COLABORADOR']).map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="uppercase bg-background text-[10px] leading-tight"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium uppercase text-sm">{emp.role}</div>
                  <div className="text-xs text-muted-foreground uppercase">{emp.department}</div>
                </TableCell>
                <TableCell>
                  {vStatus.status !== 'unknown' ? (
                    <Badge
                      variant="outline"
                      className={`uppercase text-[10px] leading-tight font-bold ${vStatus.badgeClass}`}
                    >
                      {vStatus.days} DIAS
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground uppercase">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={emp.status === 'Ativo' ? 'default' : 'secondary'}
                    className="uppercase"
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteEmployee(emp.id)}
                    title="EXCLUIR COLABORADOR"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
          {employees.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 uppercase text-muted-foreground font-semibold"
              >
                NENHUM COLABORADOR ENCONTRADO.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
