import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle2, XCircle, FileText, Loader2, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

export function ValidationReportModal({ open, onOpenChange }: any) {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      generateReport()
    }
  }, [open])

  const generateReport = async () => {
    setLoading(true)
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email, cargo_id, cargos(nome)')
      const { data: userPerms } = await supabase.from('permissoes_usuario').select('user_id')
      const { data: cargoPerms } = await supabase.from('permissoes_cargo').select('cargo_id')

      const report = (profiles || []).filter(Boolean).map((p: any) => {
        const hasCargo = !!p.cargo_id
        const userPermsCount = Array.isArray(userPerms)
          ? userPerms.filter((up: any) => up?.user_id === p.id).length
          : 0
        const cargoPermsCount =
          hasCargo && Array.isArray(cargoPerms)
            ? cargoPerms.filter((cp: any) => cp?.cargo_id === p.cargo_id).length
            : 0

        // Validação: Se tem cargo, deve ter ao menos a mesma quantidade de permissões do cargo na tabela de usuário (herança)
        const isInherited = hasCargo && userPermsCount > 0 && userPermsCount >= cargoPermsCount

        return {
          id: p.id,
          nome: p.nome || 'Sem Nome',
          email: p.email,
          cargo: p.cargos?.nome || 'SEM CARGO',
          hasCargo,
          userPermsCount,
          cargoPermsCount,
          isValid:
            isInherited ||
            (!hasCargo && userPermsCount > 0) ||
            (!hasCargo && cargoPermsCount === 0 && userPermsCount === 0),
        }
      })

      setReportData(report)
    } catch (err) {
      console.error('Erro ao gerar relatório', err)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Nome,Email,Cargo,Permissoes do Cargo,Permissoes do Usuario,Status Heranca']
    const rows = reportData.map(
      (r) =>
        `"${r.nome}","${r.email}","${r.cargo}","${r.cargoPermsCount}","${r.userPermsCount}","${r.isValid ? 'OK' : 'Pendente'}"`,
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'relatorio_permissoes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl uppercase max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-nuvia-navy font-black tracking-widest">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              RELATÓRIO DE VALIDAÇÃO DE PERMISSÕES
            </div>
            <Button
              onClick={exportCSV}
              variant="outline"
              size="sm"
              className="font-bold text-xs w-full sm:w-auto"
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" /> EXPORTAR CSV
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-black text-xs">USUÁRIO</TableHead>
                <TableHead className="font-black text-xs">CARGO</TableHead>
                <TableHead className="font-black text-xs text-center whitespace-nowrap">
                  REGRAS CARGO
                </TableHead>
                <TableHead className="font-black text-xs text-center whitespace-nowrap">
                  REGRAS USUÁRIO
                </TableHead>
                <TableHead className="font-black text-xs text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                reportData.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[200px]">{r.nome}</span>
                        <span className="text-[10px] text-muted-foreground lowercase truncate max-w-[200px]">
                          {r.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold whitespace-nowrap bg-white"
                      >
                        {r.cargo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-600">
                      {r.cargoPermsCount}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-600">
                      {r.userPermsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.isValid ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] whitespace-nowrap">
                          <XCircle className="w-3 h-3 mr-1" /> PENDENTE
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
