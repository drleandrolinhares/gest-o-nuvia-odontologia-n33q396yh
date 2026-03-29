import { useState, useEffect } from 'react'
import {
  Settings,
  Pencil,
  Trash2,
  CalendarDays,
  User,
  Briefcase,
  Plus,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { supabase } from '@/lib/supabase/client'
import { ConfigRotinaModal, Task } from '@/components/ConfigRotinaModal'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Cargo {
  id: string
  nome: string
}

export default function ConfigurarRotina() {
  const { toast } = useToast()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [cargosWithRoutines, setCargosWithRoutines] = useState<Set<string>>(new Set())
  const [selectedCargoId, setSelectedCargoId] = useState<string>('')

  const [colaboradores, setColaboradores] = useState<{ id: string; nome: string }[]>([])
  const [selectedColaboradorId, setSelectedColaboradorId] = useState<string>('')

  const [tasks, setTasks] = useState<Task[]>([])
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCargosWithRoutinesStatus = async () => {
    const { data } = await supabase.from('rotinas_config').select('cargo_id')
    if (data) {
      setCargosWithRoutines(new Set(data.map((r: any) => r.cargo_id)))
    }
  }

  useEffect(() => {
    const fetchCargos = async () => {
      const { data } = await supabase.from('cargos').select('id, nome').order('nome')
      if (data) setCargos(data.filter((c) => c.nome.toUpperCase() !== 'CEO'))
    }
    fetchCargos()
    fetchCargosWithRoutinesStatus()
  }, [])

  useEffect(() => {
    if (!selectedCargoId) {
      setColaboradores([])
      setSelectedColaboradorId('')
      setTasks([])
      return
    }

    const fetchColabs = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, nome')
        .eq('cargo_id', selectedCargoId)
        .order('nome')

      if (data) {
        setColaboradores([{ id: 'todos', nome: 'GERAL (TODOS DO CARGO)' }, ...data])
      }
    }
    fetchColabs()
  }, [selectedCargoId])

  const fetchTasks = async () => {
    if (!selectedColaboradorId) {
      setTasks([])
      return
    }

    let query = supabase.from('rotinas_config').select('*').eq('cargo_id', selectedCargoId)

    if (selectedColaboradorId === 'todos') {
      query = query.is('colaborador_id', null)
    } else {
      query = query.eq('colaborador_id', selectedColaboradorId)
    }

    const { data: configData } = await query.order('horario')

    if (configData) {
      const mappedTasks: Task[] = configData.map((c: any) => ({
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
      }))
      setTasks(mappedTasks)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [selectedColaboradorId, selectedCargoId])

  const handleDeleteTask = async () => {
    if (!taskToDelete) return
    setIsDeleting(true)
    const { error } = await supabase.from('rotinas_config').delete().eq('id', taskToDelete.id)
    setIsDeleting(false)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a rotina.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Rotina removida com sucesso.' })
      setTaskToDelete(null)
      fetchTasks()
      fetchCargosWithRoutinesStatus()
    }
  }

  const selectedColaboradorNome = colaboradores.find((c) => c.id === selectedColaboradorId)?.nome
  const isGeral = selectedColaboradorId === 'todos'

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/rotina-diaria"
            className="text-nuvia-navy/60 hover:text-nuvia-navy flex items-center gap-1 text-sm font-bold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> VOLTAR PARA ROTINA DIÁRIA
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" /> CONFIGURAR ROTINA
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold">
            GERENCIE AS TAREFAS ESPECÍFICAS POR CARGO E COLABORADOR.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-xs font-black text-slate-500 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> 1. SELECIONE O CARGO
          </label>
          <Select
            value={selectedCargoId}
            onValueChange={(val) => {
              setSelectedCargoId(val)
              setSelectedColaboradorId('')
            }}
          >
            <SelectTrigger className="w-full bg-white font-bold text-nuvia-navy uppercase tracking-wider h-11">
              <SelectValue placeholder="SELECIONE UM CARGO" />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((cargo) => (
                <SelectItem
                  key={cargo.id}
                  value={cargo.id}
                  className="font-bold uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {cargo.nome}
                    {cargosWithRoutines.has(cargo.id) && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCargoId && (
          <div className="space-y-4 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
            <label className="text-xs font-black text-slate-500 flex items-center gap-2">
              <User className="h-4 w-4" /> 2. SELECIONE O COLABORADOR
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {colaboradores.map((colab) => (
                <button
                  key={colab.id}
                  onClick={() => setSelectedColaboradorId(colab.id)}
                  className={cn(
                    'flex flex-col items-start p-4 rounded-xl border transition-all text-left focus:outline-none',
                    selectedColaboradorId === colab.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm ring-1 ring-[#D4AF37]/50'
                      : 'border-slate-200 hover:border-[#D4AF37]/40 hover:bg-slate-50 bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'font-bold uppercase tracking-wide',
                      selectedColaboradorId === colab.id ? 'text-nuvia-navy' : 'text-nuvia-navy/80',
                    )}
                  >
                    {colab.nome}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-bold">
                    {colab.id === 'todos' ? 'TAREFAS GERAIS DO CARGO' : 'TAREFAS INDIVIDUAIS'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedColaboradorId && (
          <div className="space-y-6 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-black text-nuvia-navy tracking-wider">
                ROTINAS {isGeral ? 'GERAIS DO CARGO' : 'ESPECÍFICAS'}:{' '}
                <span className="text-primary">{selectedColaboradorNome}</span>
              </h2>
              <Button
                onClick={() => {
                  setTaskToEdit(null)
                  setIsConfigOpen(true)
                }}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md shrink-0 h-11 px-4 sm:px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isGeral
                  ? 'ADICIONAR TAREFA GERAL'
                  : `ADICIONAR TAREFA PARA ${selectedColaboradorNome?.split(' ')[0]}`}
              </Button>
            </div>

            {tasks.length > 0 ? (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-nuvia-navy tracking-wide">{task.action}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          ⏰ {task.time}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          🔄 {task.frequency}
                        </span>
                        {task.dataInicio && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded">
                            INÍCIO: {format(new Date(task.dataInicio + 'T00:00:00'), 'dd/MM/yyyy')}
                          </span>
                        )}
                        {task.dataFim && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded">
                            FIM: {format(new Date(task.dataFim + 'T00:00:00'), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                        onClick={() => {
                          setTaskToEdit(task)
                          setIsConfigOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => setTaskToDelete(task)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-400 tracking-wider text-center">
                  NENHUMA ROTINA CONFIGURADA.
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedCargoId && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <User className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-400 tracking-wider text-center max-w-md">
              SELECIONE UM CARGO ACIMA PARA VISUALIZAR A LISTA DE COLABORADORES E GERENCIAR SUAS
              ROTINAS.
            </p>
          </div>
        )}
      </div>

      <ConfigRotinaModal
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false)
          setTaskToEdit(null)
        }}
        cargos={cargos}
        onSave={() => {
          fetchTasks()
          fetchCargosWithRoutinesStatus()
        }}
        defaultCargoId={selectedCargoId}
        defaultColaboradorId={isGeral ? undefined : selectedColaboradorId}
        colaboradorNome={selectedColaboradorNome}
        taskToEdit={taskToEdit}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase font-black text-nuvia-navy">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-slate-500">
              Tem certeza que deseja remover esta rotina? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteTask()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
