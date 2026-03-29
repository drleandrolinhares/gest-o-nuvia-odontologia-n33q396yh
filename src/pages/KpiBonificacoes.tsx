import { Fragment, useState, useEffect } from 'react'
import {
  Calculator,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function KpiBonificacoes() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [cargos, setCargos] = useState<any[]>([])
  const [criterios, setCriterios] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [configs, setConfigs] = useState<any[]>([])
  const [vendas, setVendas] = useState<any[]>([])
  const [rotinas, setRotinas] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState('criterios')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
    id: '',
    cargo_id: '',
    nome_criterio: '',
    valor_referencia: '',
    valor_remuneracao: '',
  })

  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (activeTab === 'relatorio') {
      fetchReportData()
    }
  }, [activeTab, selectedMonth, selectedYear])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [
        { data: cargosData },
        { data: criteriosData },
        { data: usuariosData },
        { data: configsData },
      ] = await Promise.all([
        supabase.from('cargos').select('id, nome').order('nome'),
        supabase.from('bonificacoes_criterios').select('*, cargos(nome)'),
        supabase.from('profiles').select('id, nome, email, cargo_id, cargos(nome)'),
        supabase.from('bonificacoes_config').select('*'),
      ])

      setCargos(cargosData || [])
      setCriterios(criteriosData || [])
      setUsuarios(usuariosData || [])
      setConfigs(configsData || [])
    } catch (e) {
      console.error(e)
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const padMonth = selectedMonth.padStart(2, '0')
      const startStr = `${selectedYear}-${padMonth}-01`
      const endOfMonth = new Date(Number(selectedYear), Number(selectedMonth), 0)
      const endStr = `${selectedYear}-${padMonth}-${endOfMonth.getDate().toString().padStart(2, '0')}`

      const [{ data: vData }, { data: rData }, { data: confData }] = await Promise.all([
        supabase.from('vendas').select('*').gte('data_venda', startStr).lte('data_venda', endStr),
        supabase.from('rotinas_pontos').select('*').gte('data', startStr).lte('data', endStr),
        supabase.from('bonificacoes_config').select('*'),
      ])

      setVendas(vData || [])
      setRotinas(rData || [])
      setConfigs(confData || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item?: any) => {
    if (item) {
      setFormData({
        id: item.id,
        cargo_id: item.cargo_id,
        nome_criterio: item.nome_criterio,
        valor_referencia: item.valor_referencia,
        valor_remuneracao: item.valor_remuneracao,
      })
    } else {
      setFormData({
        id: '',
        cargo_id: cargos.length > 0 ? cargos[0].id : '',
        nome_criterio: '',
        valor_referencia: '',
        valor_remuneracao: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveCriterio = async () => {
    if (
      !formData.cargo_id ||
      !formData.nome_criterio ||
      formData.valor_referencia === '' ||
      formData.valor_remuneracao === ''
    ) {
      toast({ title: 'Preencha todos os campos!', variant: 'destructive' })
      return
    }

    try {
      const payload = {
        cargo_id: formData.cargo_id,
        nome_criterio: formData.nome_criterio,
        valor_referencia: Number(formData.valor_referencia),
        valor_remuneracao: Number(formData.valor_remuneracao),
      }

      if (formData.id) {
        await supabase.from('bonificacoes_criterios').update(payload).eq('id', formData.id)
        toast({ title: 'Critério atualizado!' })
      } else {
        await supabase.from('bonificacoes_criterios').insert([payload])
        toast({ title: 'Critério adicionado!' })
      }
      setIsModalOpen(false)
      fetchInitialData()
    } catch (e) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  const handleDeleteCriterio = async (id: string) => {
    if (!confirm('Deseja realmente deletar este critério?')) return
    try {
      await supabase.from('bonificacoes_criterios').delete().eq('id', id)
      toast({ title: 'Critério deletado!' })
      fetchInitialData()
    } catch (e) {
      toast({ title: 'Erro ao deletar', variant: 'destructive' })
    }
  }

  const handleUpdateVencimento = async (userId: string, cargoId: string, dataStr: string) => {
    try {
      const existing = configs.find((c) => c.usuario_id === userId)
      if (existing) {
        await supabase
          .from('bonificacoes_config')
          .update({ data_vencimento_pagamento: dataStr || null })
          .eq('id', existing.id)
      } else {
        await supabase.from('bonificacoes_config').insert({
          usuario_id: userId,
          cargo_id: cargoId,
          data_vencimento_pagamento: dataStr || null,
        })
      }
      toast({ title: 'Vencimento atualizado!' })
      fetchReportData()
    } catch (e) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const generateReportData = () => {
    return usuarios.map((user) => {
      const userCriterios = criterios.filter((c) => c.cargo_id === user.cargo_id)
      const userVendas = vendas.filter(
        (v) => v.dentista_id === user.id || v.crc_comercial_id === user.id,
      )
      const userRotinas = rotinas.filter((r) => r.usuario_id === user.id)

      let totalBonus = 0
      const details: any[] = []

      userCriterios.forEach((crit) => {
        let earned = 0
        let qty = 0
        const nameLower = crit.nome_criterio.toLowerCase()

        if (
          nameLower.includes('venda') ||
          nameLower.includes('comercial') ||
          nameLower.includes('avaliação')
        ) {
          const validSales = userVendas.filter((v) => v.valor_venda >= crit.valor_referencia)
          qty = validSales.length
          earned = qty * crit.valor_remuneracao
        } else if (
          nameLower.includes('rotina') ||
          nameLower.includes('comparecimento') ||
          nameLower.includes('presença') ||
          nameLower.includes('escala')
        ) {
          const validDays = userRotinas.filter((r) => r.percentual >= crit.valor_referencia)
          qty = validDays.length
          earned = qty * crit.valor_remuneracao
        } else {
          const totalSalesVal = userVendas.reduce((acc, v) => acc + (Number(v.valor_venda) || 0), 0)
          if (totalSalesVal >= crit.valor_referencia) {
            qty = 1
            earned = crit.valor_remuneracao
          }
        }

        if (earned > 0 || qty > 0) {
          totalBonus += earned
          details.push({
            name: crit.nome_criterio,
            qty,
            earned,
          })
        }
      })

      const conf = configs.find((c) => c.usuario_id === user.id)

      return {
        ...user,
        totalBonus,
        details,
        vencimento: conf?.data_vencimento_pagamento || '',
      }
    })
  }

  const reportData = generateReportData().filter(
    (r) => r.details.length > 0 || r.totalBonus > 0 || r.vencimento,
  )

  if (loading && cargos.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" /> GESTÃO DE BONIFICAÇÕES
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          ADMINISTRAÇÃO DE CRITÉRIOS DE REMUNERAÇÃO E RELATÓRIO CONSOLIDADO.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="criterios" className="font-bold tracking-widest text-xs">
            CRITÉRIOS
          </TabsTrigger>
          <TabsTrigger value="relatorio" className="font-bold tracking-widest text-xs">
            RELATÓRIO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="criterios" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button
              onClick={() => openModal()}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" /> ADICIONAR CRITÉRIO
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider">
                    CARGO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider">
                    CRITÉRIO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-right">
                    VALOR REFERÊNCIA
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-right">
                    VALOR REMUNERAÇÃO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-center w-24">
                    AÇÕES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criterios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400 font-bold">
                      NENHUM CRITÉRIO CADASTRADO
                    </TableCell>
                  </TableRow>
                ) : (
                  criterios.map((crit) => (
                    <TableRow key={crit.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-600">
                        {crit.cargos?.nome}
                      </TableCell>
                      <TableCell className="font-bold text-nuvia-navy">
                        {crit.nome_criterio}
                      </TableCell>
                      <TableCell className="font-bold text-slate-600 text-right">
                        {formatCurrency(crit.valor_referencia)}
                      </TableCell>
                      <TableCell className="font-bold text-green-700 text-right">
                        {formatCurrency(crit.valor_remuneracao)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(crit)}
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCriterio(crit.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="relatorio" className="space-y-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full sm:w-auto">
              <Label className="font-bold text-xs text-slate-500">MÊS</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()} className="font-bold">
                      {new Date(0, i).toLocaleString('pt-BR', { month: 'long' }).toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1 w-full sm:w-auto">
              <Label className="font-bold text-xs text-slate-500">ANO</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[new Date().getFullYear(), new Date().getFullYear() - 1].map((y) => (
                    <SelectItem key={y} value={y.toString()} className="font-bold">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={fetchReportData}
              variant="outline"
              className="font-bold tracking-widest text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
            >
              ATUALIZAR
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider">
                    COLABORADOR
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider">
                    CARGO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-right">
                    TOTAL BONIFICAÇÃO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-center">
                    VENCIMENTO PAGAMENTO
                  </TableHead>
                  <TableHead className="font-black text-nuvia-navy text-xs tracking-wider text-center w-24">
                    DETALHES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400 font-bold">
                      NENHUMA BONIFICAÇÃO ENCONTRADA NO PERÍODO
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow className="hover:bg-slate-50/50">
                        <TableCell className="font-bold text-nuvia-navy">
                          {row.nome || row.email}
                        </TableCell>
                        <TableCell className="font-bold text-slate-500 text-xs">
                          {row.cargos?.nome || '-'}
                        </TableCell>
                        <TableCell className="font-black text-green-700 text-right">
                          {formatCurrency(row.totalBonus)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="date"
                            className="h-8 text-xs font-bold w-40 mx-auto"
                            defaultValue={row.vencimento}
                            onBlur={(e) => {
                              if (e.target.value !== row.vencimento) {
                                handleUpdateVencimento(row.id, row.cargo_id, e.target.value)
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-slate-400"
                            onClick={() => setExpandedUser(expandedUser === row.id ? null : row.id)}
                          >
                            {expandedUser === row.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedUser === row.id && (
                        <TableRow className="bg-slate-50/50">
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-4 border-b border-slate-100 space-y-2">
                              {row.details.length === 0 ? (
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5" /> NENHUMA META ATINGIDA
                                  NESTE PERÍODO.
                                </p>
                              ) : (
                                row.details.map((d: any, i: number) => (
                                  <div
                                    key={i}
                                    className="flex justify-between items-center bg-white p-2 rounded border border-slate-100"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-nuvia-navy">
                                        {d.name}
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400">
                                        QTD ATINGIDA: {d.qty}
                                      </span>
                                    </div>
                                    <span className="text-sm font-black text-green-700">
                                      {formatCurrency(d.earned)}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest uppercase">
              {formData.id ? 'EDITAR CRITÉRIO' : 'ADICIONAR CRITÉRIO'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 uppercase">
            <div className="space-y-2">
              <Label className="font-bold text-xs text-slate-500">CARGO APLICÁVEL</Label>
              <Select
                value={formData.cargo_id}
                onValueChange={(v) => setFormData({ ...formData, cargo_id: v })}
              >
                <SelectTrigger className="font-bold">
                  <SelectValue placeholder="SELECIONE UM CARGO" />
                </SelectTrigger>
                <SelectContent>
                  {cargos.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="font-bold">
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-xs text-slate-500">NOME DO CRITÉRIO</Label>
              <Input
                className="font-bold"
                placeholder="EX: VENDA FECHADA NA AVALIAÇÃO"
                value={formData.nome_criterio}
                onChange={(e) =>
                  setFormData({ ...formData, nome_criterio: e.target.value.toUpperCase() })
                }
              />
              <p className="text-[10px] text-slate-400 font-bold leading-tight">
                * DICA: USE PALAVRAS-CHAVE COMO "VENDA", "AVALIAÇÃO", "ROTINA" OU "PRESENÇA" PARA
                CÁLCULO AUTOMÁTICO INTELIGENTE.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs text-slate-500">VALOR REFERÊNCIA (META)</Label>
                <Input
                  type="number"
                  className="font-bold"
                  placeholder="EX: 1000"
                  value={formData.valor_referencia}
                  onChange={(e) => setFormData({ ...formData, valor_referencia: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs text-slate-500">VALOR REMUNERAÇÃO (R$)</Label>
                <Input
                  type="number"
                  className="font-bold text-green-700"
                  placeholder="EX: 50"
                  value={formData.valor_remuneracao}
                  onChange={(e) => setFormData({ ...formData, valor_remuneracao: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="font-bold tracking-widest uppercase"
            >
              CANCELAR
            </Button>
            <Button
              onClick={handleSaveCriterio}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest uppercase"
            >
              SALVAR CRITÉRIO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
