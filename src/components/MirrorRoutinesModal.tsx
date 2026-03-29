import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface UserProfile {
  id: string
  nome: string
  cargo_id: string | null
}

interface Routine {
  id: string
  acao: string
  horario: string
  dias_semana: any
  frequencia: string
  data_inicio: string | null
  data_fim: string | null
  intervalo_dias: number | null
  cargo_id: string
}

export function MirrorRoutinesModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [sourceUser, setSourceUser] = useState('')
  const [destUser, setDestUser] = useState('')
  const [routines, setRoutines] = useState<Routine[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
      setSourceUser('')
      setDestUser('')
      setRoutines([])
      setSelected([])
    }
  }, [isOpen])

  useEffect(() => {
    if (sourceUser) fetchRoutines(sourceUser)
  }, [sourceUser])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, cargo_id')
      .not('nome', 'is', null)
      .order('nome')
    if (data) setUsers(data as UserProfile[])
  }

  const fetchRoutines = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase.from('rotinas_config').select('*').eq('colaborador_id', userId)

    if (data) {
      setRoutines(data)
      setSelected(data.map((r) => r.id))
    }
    setLoading(false)
  }

  const handleToggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const handleCopy = async () => {
    if (!sourceUser || !destUser) {
      return toast({
        title: 'Erro',
        description: 'Selecione origem e destino.',
        variant: 'destructive',
      })
    }
    if (sourceUser === destUser) {
      return toast({
        title: 'Erro',
        description: 'Origem e destino não podem ser iguais.',
        variant: 'destructive',
      })
    }
    if (selected.length === 0) {
      return toast({
        title: 'Erro',
        description: 'Selecione rotinas para copiar.',
        variant: 'destructive',
      })
    }

    const destInfo = users.find((u) => u.id === destUser)
    if (!destInfo?.cargo_id) {
      return toast({
        title: 'Erro',
        description: 'Destino sem cargo vinculado.',
        variant: 'destructive',
      })
    }

    setSaving(true)
    const newRoutines = routines
      .filter((r) => selected.includes(r.id))
      .map((r) => ({
        cargo_id: destInfo.cargo_id,
        colaborador_id: destUser,
        acao: r.acao,
        horario: r.horario,
        dias_semana: r.dias_semana,
        frequencia: r.frequencia,
        data_inicio: r.data_inicio,
        data_fim: r.data_fim,
        intervalo_dias: r.intervalo_dias,
      }))

    const { error } = await supabase.from('rotinas_config').insert(newRoutines)
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao copiar rotinas.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Rotinas copiadas com sucesso!' })
      onSuccess()
      onClose()
    }
    setSaving(false)
  }

  const getDays = (t: Routine) => {
    if (t.frequencia === 'diario' && (!t.dias_semana || t.dias_semana.length === 0)) return 'TODOS'
    if (t.frequencia === 'customizado') return `A CADA ${t.intervalo_dias} DIAS`
    if (t.frequencia === 'mensal') return 'MENSAL'
    return t.dias_semana?.map((d: string) => d.toUpperCase()).join(', ') || '-'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-black uppercase tracking-wider text-nuvia-navy">
            ESPELHAR ROTINAS
          </DialogTitle>
          <DialogDescription className="font-bold text-slate-500">
            Copie as rotinas de um colaborador para outro rapidamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Origem (Copiar de)
              </Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 font-semibold"
                value={sourceUser}
                onChange={(e) => setSourceUser(e.target.value)}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Destino (Copiar para)
              </Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 font-semibold"
                value={destUser}
                onChange={(e) => setDestUser(e.target.value)}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Rotinas para Copiar
            </Label>
            <div className="border rounded-md bg-white">
              <ScrollArea className="h-[200px] p-2">
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin h-5 w-5 text-slate-400" />
                  </div>
                ) : routines.length === 0 ? (
                  <p className="p-4 text-sm text-center text-slate-500 font-bold uppercase tracking-wider">
                    {sourceUser ? 'Nenhuma rotina encontrada.' : 'Selecione a origem primeiro.'}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {routines.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-md transition-colors"
                      >
                        <Checkbox
                          id={`r-${r.id}`}
                          checked={selected.includes(r.id)}
                          onCheckedChange={() => handleToggle(r.id)}
                          className="mt-0.5"
                        />
                        <div
                          className="grid gap-1 cursor-pointer flex-1"
                          onClick={() => handleToggle(r.id)}
                        >
                          <Label className="text-xs font-black text-nuvia-navy cursor-pointer">
                            {r.acao}
                          </Label>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {r.horario} • {getDays(r)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="font-bold tracking-widest text-xs"
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleCopy}
            disabled={saving || routines.length === 0}
            className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-bold tracking-widest text-xs"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            COPIAR SELECIONADAS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
