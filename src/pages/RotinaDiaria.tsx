import { useState, useEffect } from 'react'
import { CalendarDays, Settings, CheckCircle2, ChevronDown, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { ConfigRotinaModal, Task } from '@/components/ConfigRotinaModal'

interface Cargo {
  id: string
  nome: string
}

export default function RotinaDiaria() {
  const { user } = useAuth()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [selectedCargoId, setSelectedCargoId] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  useEffect(() => {
    const fetchCargos = async () => {
      const { data } = await supabase.from('cargos').select('id, nome').order('nome')
      if (data) setCargos(data)
    }
    fetchCargos()
  }, [])

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: user.id })
      const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: user.id })
      setIsAdmin(!!isAdminData || !!isMasterData)
    }
    checkAdmin()
  }, [user])

  const selectedCargo = cargos.find((c) => c.id === selectedCargoId)

  // Formatting current date nicely
  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" /> ROTINA DIÁRIA
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold">
            ACOMPANHAMENTO DE TAREFAS E ROTINAS DA CLÍNICA.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Select value={selectedCargoId} onValueChange={setSelectedCargoId}>
            <SelectTrigger className="w-full bg-white font-bold text-nuvia-navy uppercase tracking-wider h-11">
              <SelectValue placeholder="SELECIONAR CARGO" />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((cargo) => (
                <SelectItem
                  key={cargo.id}
                  value={cargo.id}
                  className="font-bold uppercase tracking-wider"
                >
                  {cargo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCargoId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-nuvia-navy tracking-wider">
                ROTINA DIÁRIA - {selectedCargo?.nome}
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-600 capitalize">{currentDate}</span>
              </div>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setIsConfigOpen(true)}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md shrink-0 h-11 px-6"
              >
                <Settings className="h-4 w-4 mr-2" /> CONFIGURAR ROTINA
              </Button>
            )}
          </div>

          {/* Progress section */}
          {(() => {
            const cargoTasks = tasks.filter((t) => t.cargoId === selectedCargoId)
            const completedCount = cargoTasks.filter((t) => t.completed).length
            const totalCount = cargoTasks.length
            const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

            return (
              <>
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-sm font-black text-nuvia-navy tracking-wider">
                    <span className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary" /> PROGRESSO DA ROTINA
                    </span>
                    <span className="text-primary text-base">{progress}% CONCLUÍDO</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-3 bg-slate-200"
                    indicatorClassName="bg-[#D4AF37]"
                  />
                </div>

                {/* Tasks section */}
                <div className="pt-2">
                  {cargoTasks.length > 0 ? (
                    <div className="space-y-3">
                      {cargoTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#D4AF37]/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={(c) =>
                                setTasks(
                                  tasks.map((t) =>
                                    t.id === task.id ? { ...t, completed: !!c } : t,
                                  ),
                                )
                              }
                              className="h-6 w-6 border-slate-300 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                            />
                            <div>
                              <p
                                className={cn(
                                  'font-bold text-nuvia-navy tracking-wide',
                                  task.completed && 'line-through text-slate-400',
                                )}
                              >
                                {task.action}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                  {task.time}
                                </span>
                                {task.days && task.days.length > 0 && (
                                  <span>• {task.days.map((d) => d.toUpperCase()).join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 transition-colors hover:bg-slate-50">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <CheckCircle2 className="h-8 w-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-black text-slate-400 tracking-widest mb-2">
                        NENHUMA TAREFA ENCONTRADA
                      </h3>
                      <p className="text-sm font-bold text-slate-400 tracking-wider text-center max-w-md leading-relaxed">
                        ESTE CARGO AINDA NÃO POSSUI UMA ROTINA DIÁRIA CONFIGURADA NO SISTEMA.
                      </p>
                      {isAdmin && (
                        <p className="text-xs font-black text-[#D4AF37] text-center mt-4 bg-[#D4AF37]/10 px-4 py-2 rounded-md tracking-widest">
                          CLIQUE EM "CONFIGURAR ROTINA" PARA ADICIONAR TAREFAS
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 p-8 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
            <ChevronDown className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-400 tracking-widest">SELECIONE UM CARGO</h2>
          <p className="text-sm font-bold text-slate-400 max-w-md leading-relaxed">
            ESCOLHA UM CARGO NO MENU ACIMA PARA VISUALIZAR OU GERENCIAR SUA ROTINA DIÁRIA E
            ACOMPANHAR O PROGRESSO DAS TAREFAS.
          </p>
        </div>
      )}

      {isAdmin && (
        <ConfigRotinaModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          cargos={cargos}
          onSave={(task) => setTasks((prev) => [...prev, task])}
          defaultCargoId={selectedCargoId}
        />
      )}
    </div>
  )
}
