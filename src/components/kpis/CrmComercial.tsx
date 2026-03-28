import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export interface Orcamento {
  id: string
  data: string
  paciente: string
  valor: number
  vendido: boolean
}

interface CrmComercialProps {
  orcamentos: Orcamento[]
  setOrcamentos: React.Dispatch<React.SetStateAction<Orcamento[]>>
}

export function CrmComercial({ orcamentos, setOrcamentos }: CrmComercialProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Orcamento>>({})

  const handleSave = () => {
    if (!form.paciente || !form.valor || !form.data) return
    const novo: Orcamento = {
      id: Math.random().toString(),
      data: form.data,
      paciente: form.paciente,
      valor: form.valor,
      vendido: form.vendido || false,
    }
    setOrcamentos([novo, ...orcamentos])
    setIsModalOpen(false)
    setForm({})
    toast({ title: 'Orçamento lançado com sucesso!' })
  }

  const toggleVendido = (id: string) => {
    setOrcamentos(orcamentos.map((o) => (o.id === id ? { ...o, vendido: !o.vendido } : o)))
  }

  return (
    <div className="mt-8 space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-nuvia-navy/5 p-4 rounded-xl border border-nuvia-navy/10">
        <div>
          <h2 className="text-xl font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> OPORTUNIDADES E VENDAS
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            LANCE OS ORÇAMENTOS PARA CÁLCULO AUTOMÁTICO DOS KPIS.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setForm({ data: new Date().toISOString().split('T')[0], vendido: false })
              }
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" /> NOVO ORÇAMENTO
            </Button>
          </DialogTrigger>
          <DialogContent className="uppercase">
            <DialogHeader>
              <DialogTitle className="font-black text-nuvia-navy tracking-widest">
                LANÇAR ORÇAMENTO
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">DATA</Label>
                <Input
                  type="date"
                  className="font-bold uppercase"
                  value={form.data || ''}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">PACIENTE</Label>
                <Input
                  className="font-bold uppercase"
                  placeholder="NOME DO PACIENTE"
                  value={form.paciente || ''}
                  onChange={(e) => setForm({ ...form, paciente: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR (R$)
                </Label>
                <Input
                  type="number"
                  className="font-bold uppercase"
                  placeholder="0,00"
                  value={form.valor ?? ''}
                  onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="vendido-switch"
                  checked={form.vendido || false}
                  onCheckedChange={(c) => setForm({ ...form, vendido: c })}
                  className="data-[state=checked]:bg-green-500"
                />
                <Label
                  htmlFor="vendido-switch"
                  className="font-bold text-xs text-slate-500 tracking-wider cursor-pointer"
                >
                  JÁ FOI VENDIDO?
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="font-bold tracking-widest"
                onClick={() => setIsModalOpen(false)}
              >
                CANCELAR
              </Button>
              <Button
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
                onClick={handleSave}
              >
                SALVAR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-slate-500 text-xs">DATA</TableHead>
              <TableHead className="font-black text-slate-500 text-xs">PACIENTE</TableHead>
              <TableHead className="font-black text-slate-500 text-xs text-right">
                VALOR (R$)
              </TableHead>
              <TableHead className="font-black text-slate-500 text-xs text-center w-32">
                VENDIDO?
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamentos.length > 0 ? (
              orcamentos.map((orc) => (
                <TableRow key={orc.id}>
                  <TableCell className="font-bold text-slate-600">
                    {new Date(orc.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-bold text-nuvia-navy uppercase">
                    {orc.paciente}
                  </TableCell>
                  <TableCell className="font-black text-nuvia-navy text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      orc.valor,
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <Switch
                        checked={orc.vendido}
                        onCheckedChange={() => toggleVendido(orc.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center font-bold text-slate-400">
                  NENHUM ORÇAMENTO LANÇADO AINDA.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
