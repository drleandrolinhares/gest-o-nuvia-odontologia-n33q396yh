import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { ConfigRotinaModal, Task } from './ConfigRotinaModal'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  isOpen: boolean
  onClose: () => void
  cargoId: string
  colaboradorId?: string
  colaboradorNome?: string
  isAdmin: boolean
  cargos: { id: string; nome: string }[]
  onRoutinesChanged: () => void
}

export function AllRoutinesModal({
  isOpen,
  onClose,
  cargoId,
  colaboradorId,
  colaboradorNome,
  isAdmin,
  cargos,
  onRoutinesChanged,
}: Props) {
  const [routines, setRoutines] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const fetchRoutines = useCallback(async () => {
    if (!cargoId) return
    setLoading(true)
    let query = supabase.from('rotinas_config').select('*').eq('cargo_id', cargoId)

    if (colaboradorId && colaboradorId !== 'todos') {
      query = query.or(`colaborador_id.eq.${colaboradorId},colaborador_id.is.null`)
    } else {
      query = query.is('colaborador_id', null)
    }

    const { data } = await query.order('horario')
    if (data) {
      setRoutines(
        data.map(
          (c) =>
            ({
              id: c.id,
              cargoId: c.cargo_id,
              colaboradorId: c.colaborador_id,
              action: c.acao,
              time: c.horario,
              days: c.dias_semana || [],
              frequency: c.frequencia,
              dataInicio: c.data_inicio,
              dataFim: c.data_fim,
              intervaloDias: c.intervalo_dias,
              completed: false,
            }) as any,
        ),
      )
    }
    setLoading(false)
  }, [cargoId, colaboradorId])

  useEffect(() => {
    if (isOpen) {
      fetchRoutines()
    }
  }, [isOpen, fetchRoutines])

  const handleDelete = async () => {
    if (!taskToDelete) return
    const { error } = await supabase.from('rotinas_config').delete().eq('id', taskToDelete)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a rotina.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Rotina deletada com sucesso.' })
      fetchRoutines()
      onRoutinesChanged()
    }
    setTaskToDelete(null)
  }

  const handleEdit = (task: Task) => {
    setTaskToEdit(task)
    setIsConfigOpen(true)
  }

  const handleAddNew = () => {
    setTaskToEdit(null)
    setIsConfigOpen(true)
  }

  const handleConfigSaved = () => {
    fetchRoutines()
    onRoutinesChanged()
  }

  const getDaysString = (task: Task) => {
    if (task.frequency === 'diario' && (!task.days || task.days.length === 0)) return 'TODOS'
    if (task.frequency === 'customizado') return `A CADA ${task.intervaloDias} DIAS`
    if (task.frequency === 'mensal') return 'MENSAL'
    return task.days?.map((d) => d.toUpperCase()).join(', ') || '-'
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <DialogTitle className="uppercase font-black text-nuvia-navy tracking-wider text-lg">
                  TODAS AS ROTINAS
                </DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                  {colaboradorId && colaboradorId !== 'todos'
                    ? `VISUALIZANDO ROTINAS DE ${colaboradorNome}`
                    : 'VISUALIZANDO ROTINAS GERAIS DO CARGO'}
                </DialogDescription>
              </div>
              {isAdmin && (
                <Button
                  onClick={handleAddNew}
                  size="sm"
                  className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-bold tracking-widest shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" /> ADICIONAR ROTINA
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-0 mt-4 min-h-[300px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm rounded-t-md">
                <TableRow>
                  <TableHead className="font-black text-[10px] tracking-widest uppercase text-slate-500">
                    AÇÃO
                  </TableHead>
                  <TableHead className="font-black text-[10px] tracking-widest uppercase text-slate-500">
                    HORÁRIO
                  </TableHead>
                  <TableHead className="font-black text-[10px] tracking-widest uppercase text-slate-500">
                    FREQUÊNCIA
                  </TableHead>
                  <TableHead className="font-black text-[10px] tracking-widest uppercase text-slate-500">
                    DIAS
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="font-black text-[10px] tracking-widest uppercase text-slate-500 text-right">
                      AÇÕES
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 5 : 4}
                      className="text-center py-12 font-bold text-slate-400 uppercase tracking-widest text-xs"
                    >
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : routines.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 5 : 4}
                      className="text-center py-12 font-bold text-slate-400 uppercase tracking-widest text-xs"
                    >
                      Nenhuma rotina cadastrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  routines.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-xs text-nuvia-navy">
                        {task.action}
                        {task.colaboradorId && (
                          <span className="ml-2 text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-widest font-black whitespace-nowrap">
                            ESPECÍFICA
                          </span>
                        )}
                        {!task.colaboradorId && (
                          <span className="ml-2 text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-widest font-black whitespace-nowrap">
                            GERAL
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-slate-600">
                        {task.time}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-slate-600 uppercase">
                        {task.frequency}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                        {getDaysString(task)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                              onClick={() => handleEdit(task)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                              onClick={() => setTaskToDelete(task.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <ConfigRotinaModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        cargos={cargos}
        onSave={handleConfigSaved}
        defaultCargoId={cargoId}
        defaultColaboradorId={colaboradorId !== 'todos' ? colaboradorId : undefined}
        colaboradorNome={colaboradorNome}
        taskToEdit={taskToEdit}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-wider text-nuvia-navy">
              Excluir rotina?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-slate-500">
              Tem certeza que deseja excluir esta rotina? Esta ação não pode ser desfeita e será
              removida de todos os relatórios futuros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold uppercase tracking-wider text-xs">
              CANCELAR
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs"
            >
              SIM, EXCLUIR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
