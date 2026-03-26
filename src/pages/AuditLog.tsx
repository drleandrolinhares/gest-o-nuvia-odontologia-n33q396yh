import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { ClipboardList } from 'lucide-react'

type AuditEntry = {
  id: string
  userName: string
  action: string
  timestamp: string
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) {
          setLogs(
            data.map((d) => ({
              id: d.id,
              userName: d.user_id ? 'USUÁRIO AUTENTICADO' : 'SISTEMA',
              action: d.action,
              timestamp: d.created_at,
            })),
          )
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-[#D81B84]" /> LOG DE AUDITORIA
          </h1>
          <p className="text-muted-foreground mt-1">
            RASTREIE TODAS AS AÇÕES REALIZADAS PELOS USUÁRIOS NO SISTEMA.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-muted overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-muted-foreground w-[220px]">
                DATA E HORA
              </TableHead>
              <TableHead className="font-bold text-muted-foreground w-[250px]">
                NOME DO USUÁRIO
              </TableHead>
              <TableHead className="font-bold text-muted-foreground">AÇÃO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-12 text-muted-foreground font-bold"
                >
                  CARREGANDO...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-12 text-muted-foreground font-bold"
                >
                  NENHUM REGISTRO DE AUDITORIA ENCONTRADO.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-bold text-nuvia-navy">{log.userName}</TableCell>
                  <TableCell className="text-sm font-semibold">{log.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
