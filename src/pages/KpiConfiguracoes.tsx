import { useState, useEffect } from 'react'
import { Settings, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
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
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profilesRes, dentistasRes] = await Promise.all([
        supabase.from('profiles').select('id, nome, cargos(nome)').order('nome'),
        supabase.from('kpis_dentistas_avaliadores').select('*'),
      ])

      if (profilesRes.error) throw profilesRes.error
      if (dentistasRes.error) throw dentistasRes.error

      const profilesData = (profilesRes.data || []) as unknown as UserProfile[]
      setUsers(profilesData)

      const dentistasMapped = (dentistasRes.data || []).map((d: any) => ({
        id: d.id,
        user_id: d.user_id,
        profile: profilesData.find((p) => p.id === d.user_id),
      }))

      setDentistas(dentistasMapped)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (dentista?: DentistaAvaliador) => {
    if (dentista) {
      setEditingId(dentista.id)
      setSelectedUserId(dentista.user_id)
    } else {
      setEditingId(null)
      setSelectedUserId('')
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUserId) {
      toast({ title: 'Atenção', description: 'Selecione um usuário.', variant: 'destructive' })
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('kpis_dentistas_avaliadores')
          .update({ user_id: selectedUserId })
          .eq('id', editingId)
        if (error) {
          if (error.code === '23505')
            throw new Error('Este usuário já está cadastrado como avaliador.')
          throw error
        }
        toast({ title: 'Sucesso', description: 'Dentista atualizado.' })
      } else {
        const { error } = await supabase
          .from('kpis_dentistas_avaliadores')
          .insert([{ user_id: selectedUserId }])
        if (error) {
          if (error.code === '23505')
            throw new Error('Este usuário já está cadastrado como avaliador.')
          throw error
        }
        toast({ title: 'Sucesso', description: 'Dentista adicionado.' })
      }
      setIsModalOpen(false)
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este dentista avaliador?')) return
    try {
      const { error } = await supabase.from('kpis_dentistas_avaliadores').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Dentista removido.' })
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" /> CONFIGURAÇÕES DE KPIs
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          GERENCIE OS DENTISTAS AVALIADORES E OUTRAS CONFIGURAÇÕES GERAIS.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-nuvia-navy">DENTISTAS AVALIADORES</h2>
          <Button onClick={() => handleOpenModal()} className="font-bold w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" /> ADICIONAR DENTISTA AVALIADOR
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-nuvia-navy">NOME</TableHead>
                <TableHead className="font-black text-nuvia-navy">CARGO</TableHead>
                <TableHead className="w-[150px] text-center font-black text-nuvia-navy">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dentistas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-500 font-bold py-8">
                    NENHUM DENTISTA AVALIADOR CADASTRADO.
                  </TableCell>
                </TableRow>
              ) : (
                dentistas.map((dentista) => (
                  <TableRow key={dentista.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-nuvia-navy">
                      {dentista.profile?.nome || 'USUÁRIO NÃO ENCONTRADO'}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-600">
                      {dentista.profile?.cargos?.nome || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(dentista)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(dentista.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-nuvia-navy uppercase">
              {editingId ? 'EDITAR DENTISTA AVALIADOR' : 'NOVO DENTISTA AVALIADOR'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-nuvia-navy uppercase">Selecionar Usuário</Label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  SELECIONE UM USUÁRIO...
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome || u.id} {u.cargos?.nome ? `(${u.cargos.nome})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="font-bold w-full sm:w-auto"
            >
              CANCELAR
            </Button>
            <Button onClick={handleSave} className="font-bold w-full sm:w-auto mt-2 sm:mt-0">
              SALVAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
