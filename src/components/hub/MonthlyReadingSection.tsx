import React, { useState } from 'react'
import { useHubStore } from '@/stores/hub'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Info, BookOpen, User, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MonthlyReadingSection() {
  const { monthlyReadings, submitMonthlyReading } = useHubStore()
  const { employees, isAdmin } = useAppStore()
  const { toast } = useToast()

  const [referenceMonth, setReferenceMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [materialName, setMaterialName] = useState('')
  const [mainLearning, setMainLearning] = useState('')
  const [practicalApplication, setPracticalApplication] = useState('')
  const [observations, setObservations] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!referenceMonth || !materialName || !mainLearning || !practicalApplication) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const { success, error } = await submitMonthlyReading({
      reference_month: referenceMonth,
      material_name: materialName,
      main_learning: mainLearning,
      practical_application: practicalApplication,
      observations: observations || undefined,
    })

    setIsSubmitting(false)

    if (success) {
      toast({
        title: 'Sucesso',
        description: 'Leitura do mês registrada com sucesso! Você ganhou 150 pontos.',
      })
      setMaterialName('')
      setMainLearning('')
      setPracticalApplication('')
      setObservations('')
    } else {
      let msg = 'Ocorreu um erro ao registrar a leitura.'
      if (error?.code === '23505') {
        msg = 'Você já registrou uma leitura para este mês de referência.'
      }
      toast({
        title: 'Erro',
        description: msg,
        variant: 'destructive',
      })
    }
  }

  const formatMonth = (yyyyMm: string) => {
    try {
      const [year, month] = yyyyMm.split('-')
      const d = new Date(Number(year), Number(month) - 1, 1)
      return format(d, 'MMMM yyyy', { locale: ptBR }).toUpperCase()
    } catch {
      return yyyyMm
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm text-blue-900">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-blue-500" />
          <h3 className="font-black tracking-widest uppercase">SOBRE A LEITURA DO MÊS</h3>
        </div>
        <div className="space-y-2 text-sm font-medium leading-relaxed normal-case">
          <p>
            A Leitura do Mês existe para transformar conhecimento em melhoria prática dentro da
            Nuvia.
          </p>
          <p>A proposta não é apenas ler, mas refletir e aplicar.</p>
          <p className="font-bold mt-4 mb-1">Como funciona:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>o colaborador faz a leitura do material do mês</li>
            <li>registra o principal aprendizado</li>
            <li>mostra como aquele aprendizado pode ser usado na prática dentro da empresa</li>
            <li>
              ganha <strong>150 pontos</strong> no ranking por cada leitura válida registrada.
            </li>
          </ul>
          <p className="mt-4">
            Isso ajuda a desenvolver visão, repertório, comunicação e crescimento profissional.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-black tracking-widest text-slate-800 flex items-center gap-2 uppercase">
            <BookOpen className="h-5 w-5 text-blue-500" />
            REGISTRAR APRENDIZADO
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase mt-1">
            Compartilhe seu aprendizado do mês e mostre como ele pode gerar valor real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Mês de Referência *
              </label>
              <Input
                type="month"
                value={referenceMonth}
                onChange={(e) => setReferenceMonth(e.target.value)}
                required
                className="uppercase font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Nome do Material Estudado *
              </label>
              <Input
                placeholder="Livro, Artigo, Curso..."
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Principal Aprendizado *
            </label>
            <Textarea
              placeholder="Descreva o que você aprendeu de mais valioso com este material..."
              value={mainLearning}
              onChange={(e) => setMainLearning(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Como aplicar isso na prática na Nuvia? *
            </label>
            <Textarea
              placeholder="Ex: Podemos melhorar o processo X aplicando a técnica Y..."
              value={practicalApplication}
              onChange={(e) => setPracticalApplication(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Observações (Opcional)
            </label>
            <Textarea
              placeholder="Comentários adicionais..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black tracking-widest shadow-md uppercase"
            >
              {isSubmitting ? 'Registrando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black tracking-widest text-slate-800 border-b pb-2 uppercase">
          HISTÓRICO DE LEITURAS {isAdmin && '(VISÃO ADMIN)'}
        </h3>

        {monthlyReadings.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-xs uppercase tracking-widest">
              Nenhum registro encontrado.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {monthlyReadings.map((reading) => {
              const emp = employees.find((e) => e.user_id === reading.user_id)
              const isExpanded = expandedId === reading.id

              return (
                <div
                  key={reading.id}
                  className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="bg-slate-50 p-4 border-b flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase">
                          {formatMonth(reading.reference_month)}
                        </span>
                        {(reading.points_earned || 0) > 0 && (
                          <span className="text-[10px] font-black tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase">
                            +{reading.points_earned} PTS
                          </span>
                        )}
                      </div>
                      <h4
                        className="font-black text-slate-800 leading-tight uppercase line-clamp-2"
                        title={reading.material_name}
                      >
                        {reading.material_name}
                      </h4>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-muted-foreground uppercase">
                          <User className="w-3 h-3" />
                          {emp?.name || 'Usuário Desconhecido'}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 whitespace-nowrap shrink-0">
                      <CalendarClock className="w-3 h-3" />
                      {format(parseISO(reading.submission_date), 'dd/MM/yyyy')}
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                          APRENDIZADO
                        </span>
                        <p className="text-slate-700 font-medium line-clamp-3">
                          {reading.main_learning}
                        </p>
                      </div>

                      {isExpanded && (
                        <div className="animate-fade-in space-y-3 pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                              APLICAÇÃO PRÁTICA
                            </span>
                            <p className="text-slate-700 font-medium">
                              {reading.practical_application}
                            </p>
                          </div>
                          {reading.observations && (
                            <div>
                              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                                OBSERVAÇÕES
                              </span>
                              <p className="text-slate-500 font-medium italic text-xs">
                                {reading.observations}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : reading.id)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center transition-colors border-t"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" /> VER MENOS
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" /> VER DETALHES
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
