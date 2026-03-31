import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Save, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export default function GestaoVendas() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [crcNome, setCrcNome] = useState('')
  const [dentistas, setDentistas] = useState<{ id: string; nome: string }[]>([])

  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    paciente: '',
    valorOrcamento: '',
    dentistaId: '',
    origemVenda: 'AVALIACAO',
    valorVenda: '',
    valorEntrada: '',
  })

  const [registros, setRegistros] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setCrcNome(data.nome || user.email || '')
        })
    }

    const fetchDentistas = async () => {
      try {
        const { data, error } = await supabase.from('dentistas_avaliadores').select('usuario_id')

        if (error) throw error

        if (data && data.length > 0) {
          const ids = data.map((d) => d.usuario_id)
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, nome')
            .in('id', ids)

          if (profilesError) throw profilesError

          if (profilesData && profilesData.length > 0) {
            setDentistas(profilesData.map((p) => ({ id: p.id, nome: p.nome || 'Sem Nome' })))
          } else {
            setDentistas([
              { id: 'mock-1', nome: 'Dra. Ana Silva' },
              { id: 'mock-2', nome: 'Dr. Carlos Mendes' },
            ])
          }
        } else {
          setDentistas([
            { id: 'mock-1', nome: 'Dra. Ana Silva' },
            { id: 'mock-2', nome: 'Dr. Carlos Mendes' },
          ])
        }
      } catch (err) {
        console.error('Erro ao buscar dentistas:', err)
        setDentistas([
          { id: 'mock-1', nome: 'Dra. Ana Silva' },
          { id: 'mock-2', nome: 'Dr. Carlos Mendes' },
        ])
      }
    }
    fetchDentistas()

    // Mock initial data
    setRegistros([
      {
        id: 'mock-reg-1',
        data: new Date().toISOString().split('T')[0],
        paciente: 'JOÃO ALVES',
        valorOrcamento: 8500,
        dentistaId: 'mock-1',
        origemVenda: 'COMERCIAL',
        valorVenda: 8000,
        valorEntrada: 2400,
        percentualEntrada: 30,
      },
    ])
  }, [user])

  const percentual =
    form.valorEntrada && form.valorVenda
      ? (Number(form.valorEntrada) / Number(form.valorVenda)) * 100
      : 0

  const handleSave = () => {
    if (!form.paciente || !form.valorOrcamento || !form.dentistaId) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    const novo = {
      id: Math.random().toString(36).substring(2, 9),
      ...form,
      percentualEntrada: percentual,
    }

    setRegistros([novo, ...registros])
    setForm({
      ...form,
      paciente: '',
      valorOrcamento: '',
      valorVenda: '',
      valorEntrada: '',
    })
    toast({ title: 'Lançamento salvo com sucesso!' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" /> GESTÃO DE VENDAS
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          LANÇAMENTO DE ORÇAMENTOS E VENDAS.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> NOVO LANÇAMENTO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">DATA</Label>
              <Input
                type="date"
                className="font-bold uppercase"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">PACIENTE</Label>
              <Input
                className="font-bold uppercase"
                placeholder="NOME DO PACIENTE"
                value={form.paciente}
                onChange={(e) => setForm({ ...form, paciente: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">
                ORÇAMENTO (R$)
              </Label>
              <Input
                type="number"
                className="font-bold uppercase"
                placeholder="0,00"
                value={form.valorOrcamento}
                onChange={(e) => setForm({ ...form, valorOrcamento: e.target.value })}
              />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">
                DENTISTA AVALIADOR
              </Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold uppercase"
                value={form.dentistaId}
                onChange={(e) => setForm({ ...form, dentistaId: e.target.value })}
              >
                <option value="" disabled>
                  SELECIONE O DENTISTA
                </option>
                {dentistas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">
                CRC COMERCIAL
              </Label>
              <Input className="font-bold uppercase bg-slate-100" value={crcNome} disabled />
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">
                TIPO DE VENDA
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant={form.origemVenda === 'AVALIACAO' ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, origemVenda: 'AVALIACAO' })}
                  className={`flex-1 font-bold tracking-widest ${form.origemVenda === 'AVALIACAO' ? 'bg-primary text-white' : ''}`}
                >
                  VENDA FECHADA NA AVALIAÇÃO
                </Button>
                <Button
                  type="button"
                  variant={form.origemVenda === 'COMERCIAL' ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, origemVenda: 'COMERCIAL' })}
                  className={`flex-1 font-bold tracking-widest ${form.origemVenda === 'COMERCIAL' ? 'bg-primary text-white' : ''}`}
                >
                  VENDA FECHADA NO COMERCIAL
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR DA VENDA (R$)
                </Label>
                <Input
                  type="number"
                  className="font-bold uppercase"
                  placeholder="0,00"
                  value={form.valorVenda}
                  onChange={(e) => setForm({ ...form, valorVenda: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR DA ENTRADA (R$)
                </Label>
                <Input
                  type="number"
                  className="font-bold uppercase"
                  placeholder="0,00"
                  value={form.valorEntrada}
                  onChange={(e) => setForm({ ...form, valorEntrada: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  % DE ENTRADA
                </Label>
                <Input
                  type="number"
                  className="font-bold uppercase bg-slate-100"
                  value={percentual.toFixed(2)}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest min-w-[200px]"
            >
              <Save className="w-4 h-4 mr-2" /> SALVAR LANÇAMENTO
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
          <h3 className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> HISTÓRICO DE LANÇAMENTOS
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="font-black text-slate-500 text-xs">DATA</TableHead>
                <TableHead className="font-black text-slate-500 text-xs">PACIENTE</TableHead>
                <TableHead className="font-black text-slate-500 text-xs">DENTISTA</TableHead>
                <TableHead className="font-black text-slate-500 text-xs">TIPO</TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right">
                  ORÇAMENTO
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right">
                  VENDA
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right">
                  ENTRADA
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.length > 0 ? (
                registros.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-bold text-slate-600 text-xs whitespace-nowrap">
                      {new Date(reg.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-bold text-nuvia-navy uppercase text-xs">
                      {reg.paciente}
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 uppercase text-xs">
                      {dentistas.find((d) => d.id === reg.dentistaId)?.nome || '-'}
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 uppercase text-[10px]">
                      {reg.origemVenda === 'AVALIACAO' ? 'AVALIAÇÃO' : 'COMERCIAL'}
                    </TableCell>
                    <TableCell className="font-black text-nuvia-navy text-right text-xs whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(reg.valorOrcamento)}
                    </TableCell>
                    <TableCell className="font-black text-primary text-right text-xs whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(reg.valorVenda)}
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-right text-xs whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(reg.valorEntrada)}
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 text-right text-xs">
                      {reg.percentualEntrada.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center font-bold text-slate-400 text-xs"
                  >
                    NENHUM REGISTRO ENCONTRADO.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
