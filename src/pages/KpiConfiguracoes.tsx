import { useState, useEffect } from 'react'
import { Settings, Plus, Pencil, Trash2, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserProfile {
  id: string
  nome: string | null
  cargos: { nome: string } | null
}
interface DentistaAvaliador {
  id: string
  user_id: string
  profile?: UserProfile
}

export default function KpiConfiguracoes() {
  const [loading, setLoading] = useState(true)
  const [dentistas, setDentistas] = useState<DentistaAvaliador[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Goals State
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [companyGoals, setCompanyGoals] = useState({
    sales_total_target: 100000,
    average_ticket_target: 5000,
    conversion_target_percent: 30,
    entry_target_percent: 40,
  })
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [individualGoals, setIndividualGoals] = useState<any[]>([])
  const [isIndModalOpen, setIsIndModalOpen] = useState(false)
  const [editingInd, setEditingInd] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pRes, dRes, cgRes, igRes] = await Promise.all([
        supabase.from('profiles').select('id, nome, cargos(nome)').order('nome'),
        supabase.from('kpis_dentistas_avaliadores').select('*'),
        supabase.from('kpi_company_goals').select('*').eq('period', period).maybeSingle(),
        supabase.from('kpi_individual_goals').select('*').eq('period', period),
      ])
      if (pRes.error) throw pRes.error

      const pData = (pRes.data || []) as unknown as UserProfile[]
      setUsers(pData)
      setDentistas(
        (dRes.data || []).map((d: any) => ({
          id: d.id,
          user_id: d.user_id,
          profile: pData.find((p) => p.id === d.user_id),
        })),
      )

      if (cgRes.data) {
        setCompanyGoals({
          sales_total_target: cgRes.data.sales_total_target,
          average_ticket_target: cgRes.data.average_ticket_target,
          conversion_target_percent: cgRes.data.conversion_target_percent,
          entry_target_percent: cgRes.data.entry_target_percent,
        })
      }

      setIndividualGoals(
        pData.map((p) => {
          const ex = igRes.data?.find((g: any) => g.user_id === p.id)
          return {
            user_id: p.id,
            nome: p.nome || 'Sem Nome',
            cargo: p.cargos?.nome || '-',
            sales_target: ex?.sales_target || 20000,
            average_ticket_target: ex?.average_ticket_target || 3000,
            conversion_target_percent: ex?.conversion_target_percent || 20,
            entry_target_percent: ex?.entry_target_percent || 30,
          }
        }),
      )
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (dentista?: DentistaAvaliador) => {
    setEditingId(dentista ? dentista.id : null)
    setSelectedUserId(dentista ? dentista.user_id : '')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUserId)
      return toast({
        title: 'Atenção',
        description: 'Selecione um usuário.',
        variant: 'destructive',
      })
    try {
      const { error } = editingId
        ? await supabase
            .from('kpis_dentistas_avaliadores')
            .update({ user_id: selectedUserId })
            .eq('id', editingId)
        : await supabase.from('kpis_dentistas_avaliadores').insert([{ user_id: selectedUserId }])
      if (error && error.code === '23505') throw new Error('Este usuário já é avaliador.')
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Salvo com sucesso.' })
      setIsModalOpen(false)
      fetchData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover dentista avaliador?')) return
    try {
      await supabase.from('kpis_dentistas_avaliadores').delete().eq('id', id)
      toast({ title: 'Sucesso', description: 'Removido.' })
      fetchData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleSaveCompanyGoals = async () => {
    try {
      const { error } = await supabase
        .from('kpi_company_goals')
        .upsert({ period, ...companyGoals }, { onConflict: 'period' })
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Metas da empresa salvas.' })
      setIsEditingCompany(false)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleSaveIndGoal = async () => {
    try {
      const { error } = await supabase.from('kpi_individual_goals').upsert(
        {
          user_id: editingInd.user_id,
          period,
          sales_target: editingInd.sales_target,
          average_ticket_target: editingInd.average_ticket_target,
          conversion_target_percent: editingInd.conversion_target_percent,
          entry_target_percent: editingInd.entry_target_percent,
        },
        { onConflict: 'user_id,period' },
      )
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Metas salvas.' })
      setIsIndModalOpen(false)
      fetchData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div>
        <h1 className="text-3xl font-bold text-nuvia-navy flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" /> CONFIGURAÇÕES DE KPIs
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-nuvia-navy">METAS COMERCIAIS</h2>
          <div className="flex items-center gap-2">
            <Label className="font-bold">PERÍODO:</Label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-10 rounded-md border px-3"
            />
          </div>
        </div>
        <Tabs defaultValue="empresa" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="empresa" className="font-bold">
              METAS DA EMPRESA
            </TabsTrigger>
            <TabsTrigger value="individuais" className="font-bold">
              METAS INDIVIDUAIS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="empresa" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'sales_total_target',
                'average_ticket_target',
                'conversion_target_percent',
                'entry_target_percent',
              ].map((k, i) => (
                <div key={k} className="space-y-2">
                  <Label>
                    {
                      [
                        'Meta Vendas Total (R$)',
                        'Meta Ticket (R$)',
                        'Conversão (%)',
                        'Entrada (%)',
                      ][i]
                    }
                  </Label>
                  <input
                    type="number"
                    disabled={!isEditingCompany}
                    value={(companyGoals as any)[k]}
                    onChange={(e) =>
                      setCompanyGoals({ ...companyGoals, [k]: Number(e.target.value) })
                    }
                    className="w-full h-10 rounded-md border px-3 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
            {isEditingCompany ? (
              <Button onClick={handleSaveCompanyGoals}>
                <Save className="h-4 w-4 mr-2" /> SALVAR
              </Button>
            ) : (
              <Button onClick={() => setIsEditingCompany(true)}>
                <Pencil className="h-4 w-4 mr-2" /> EDITAR
              </Button>
            )}
          </TabsContent>
          <TabsContent value="individuais">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {[
                      'COLABORADOR',
                      'META VENDAS',
                      'META TICKET',
                      'META CONVERSÃO',
                      'META ENTRADA',
                      'AÇÕES',
                    ].map((h) => (
                      <TableHead key={h} className="font-black text-nuvia-navy">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualGoals.map((ind) => (
                    <TableRow key={ind.user_id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold">{ind.nome}</TableCell>
                      <TableCell>R$ {ind.sales_target}</TableCell>
                      <TableCell>R$ {ind.average_ticket_target}</TableCell>
                      <TableCell>{ind.conversion_target_percent}%</TableCell>
                      <TableCell>{ind.entry_target_percent}%</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingInd({ ...ind })
                            setIsIndModalOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-nuvia-navy">DENTISTAS AVALIADORES</h2>
          <Button onClick={() => handleOpenModal()} className="font-bold">
            <Plus className="h-4 w-4 mr-2" /> ADICIONAR
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black">NOME</TableHead>
                <TableHead className="font-black">CARGO</TableHead>
                <TableHead className="text-center font-black">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dentistas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    NENHUM CADASTRADO.
                  </TableCell>
                </TableRow>
              ) : (
                dentistas.map((d) => (
                  <TableRow key={d.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold">{d.profile?.nome || '-'}</TableCell>
                    <TableCell>{d.profile?.cargos?.nome || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(d)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'EDITAR' : 'NOVO'} DENTISTA AVALIADOR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label className="font-bold">Selecionar Usuário</Label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
            >
              <option value="" disabled>
                SELECIONE...
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome || u.id}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              CANCELAR
            </Button>
            <Button onClick={handleSave}>SALVAR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isIndModalOpen} onOpenChange={setIsIndModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>EDITAR METAS INDIVIDUAIS - {editingInd?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 grid grid-cols-2 gap-4">
            {[
              'sales_target',
              'average_ticket_target',
              'conversion_target_percent',
              'entry_target_percent',
            ].map((k, i) => (
              <div key={k} className="space-y-2 col-span-2 sm:col-span-1">
                <Label>
                  {['Meta Vendas (R$)', 'Meta Ticket (R$)', 'Conversão (%)', 'Entrada (%)'][i]}
                </Label>
                <input
                  type="number"
                  value={editingInd?.[k] || 0}
                  onChange={(e) => setEditingInd({ ...editingInd, [k]: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border px-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIndModalOpen(false)}>
              CANCELAR
            </Button>
            <Button onClick={handleSaveIndGoal}>SALVAR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
