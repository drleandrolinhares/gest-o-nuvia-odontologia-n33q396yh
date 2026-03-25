import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InventoryMovement } from '@/stores/main'

interface EditInventoryMovementsTableProps {
  movements: InventoryMovement[]
  loading: boolean
}

export function EditInventoryMovementsTable({ movements, loading }: EditInventoryMovementsTableProps) {
  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden mt-2">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground w-40">
              DATA/HORA
            </TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground">
              RESPONSÁVEL
            </TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground w-40 text-center">
              TIPO
            </TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground w-20 text-center">
              QTD (UNIDADES)
            </TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground">
              DESTINATÁRIO/DESTINO
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="animate-pulse flex space-x-4 justify-center">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : movements.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-muted-foreground uppercase font-semibold text-xs"
              >
                NENHUMA MOVIMENTAÇÃO REGISTRADA.
              </TableCell>
            </TableRow>
          ) : (
            movements.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell className="font-medium text-xs">
                  {format(new Date(mov.created_at), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell className="text-xs font-bold uppercase text-slate-700">
                  {mov.profiles?.name || 'SISTEMA'}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider',
                      mov.type === 'SAÍDA'
                        ? 'bg-red-100 text-red-700'
                        : mov.type === 'RETORNO'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    {mov.type}
                  </span>
                </TableCell>
                <TableCell className="text-center font-black text-sm">{mov.quantity}</TableCell>
                <TableCell className="text-xs font-semibold uppercase text-muted-foreground max-w-[200px] truncate">
                  {mov.recipient || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
