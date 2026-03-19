import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Info, Lightbulb, User, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format, parseISO } from 'date-fns'

type InnovationRecord = {
  id: string
  user_id: string
  title: string
  problem_description: string
  proposed_solution: string
  implementation_details: string
  perceived_results: string
  evidence_url_or_desc: string | null
  created_at: string
}

export function InnovationSection() {
  const { user } = useAuth()
  const { employees, isAdmin } = useAppStore()
  const { toast } = useToast()

  const [records, setRecords] = useState<InnovationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [proposedSolution, setProposedSolution] = useState('')
  const [implementationDetails, setImplementationDetails] = useState('')
  const [perceivedResults, setPerceivedResults] = useState('')
  const [evidence, setEvidence] = useState('')

  const fetchRecords = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('innovation_records' as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setRecords(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (
      !title ||
      !problemDescription ||
      !proposedSolution ||
      !implementationDetails ||
      !perceivedResults
    ) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.from('innovation_records' as any).insert({
      user_id: user.id,
      title,
      problem_description: problemDescription,
      proposed_solution: proposedSolution,
      implementation_details: implementationDetails,
      perceived_results: perceivedResults,
      evidence_url_or_desc: evidence || null,
    })

    setIsSubmitting(false)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao registrar a inovação.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: 'Inovação registrada com sucesso!',
      })
      setTitle('')
      setProblemDescription('')
      setProposedSolution('')
      setImplementationDetails('')
      setPerceivedResults('')
      setEvidence('')
      fetchRecords()
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm text-amber-900">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-amber-500" />
          <h3 className="font-black tracking-widest uppercase">SOBRE A INOVAÇÃO IMPLEMENTADA</h3>
        </div>
        <div className="space-y-2 text-sm font-medium leading-relaxed normal-case">
          <p>
            Inovação Implementada é o espaço para registrar melhorias reais criadas pela equipe.
            Aqui, a ideia só gera valor quando sai do papel e passa a funcionar na prática.
          </p>
          <p>
            Pode ser uma melhoria de processo, organização, comunicação, atendimento, rotina,
            produtividade ou experiência do paciente.
          </p>
          <p className="font-bold mt-4 mb-1">A proposta é simples:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>identificar um problema ou oportunidade</li>
            <li>propor uma solução</li>
            <li>mostrar o que foi feito</li>
            <li>registrar o resultado obtido</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-black tracking-widest text-slate-800 flex items-center gap-2 uppercase">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Mostre a melhoria que você colocou em prática e o resultado que ela gerou.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Título da melhoria *
            </label>
            <Input
              placeholder="Ex: Novo processo de triagem..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Problema identificado *
            </label>
            <Textarea
              placeholder="Descreva o problema ou a oportunidade de melhoria..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Solução proposta *
            </label>
            <Textarea
              placeholder="Qual foi a ideia para resolver o problema?"
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              O que foi implementado na prática *
            </label>
            <Textarea
              placeholder="Como a solução foi colocada em prática no dia a dia?"
              value={implementationDetails}
              onChange={(e) => setImplementationDetails(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Resultado percebido *
            </label>
            <Textarea
              placeholder="Quais foram os benefícios reais gerados?"
              value={perceivedResults}
              onChange={(e) => setPerceivedResults(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Evidência da melhoria (Opcional)
            </label>
            <Textarea
              placeholder="Link para foto, documento ou descrição adicional..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black tracking-widest shadow-md uppercase"
            >
              {isSubmitting ? 'Registrando...' : 'Salvar Inovação'}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black tracking-widest text-slate-800 border-b pb-2 uppercase">
          HISTÓRICO DE INOVAÇÕES {isAdmin && '(VISÃO ADMIN)'}
        </h3>

        {loading ? (
          <div className="text-center py-10 text-slate-400">
            <span className="text-xs font-bold tracking-widest uppercase">Carregando...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-xs uppercase tracking-widest">
              Nenhum registro encontrado.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => {
              const emp = employees.find((e) => e.user_id === record.user_id)
              const isExpanded = expandedId === record.id

              return (
                <div
                  key={record.id}
                  className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="bg-slate-50 p-4 border-b flex justify-between items-start gap-4">
                    <div>
                      <h4
                        className="font-black text-slate-800 leading-tight uppercase line-clamp-2"
                        title={record.title}
                      >
                        {record.title}
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
                      {format(parseISO(record.created_at), 'dd/MM/yyyy')}
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                          PROBLEMA
                        </span>
                        <p className="text-slate-700 font-medium line-clamp-2">
                          {record.problem_description}
                        </p>
                      </div>

                      {isExpanded && (
                        <div className="animate-fade-in space-y-3 pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                              SOLUÇÃO PROPOSTA
                            </span>
                            <p className="text-slate-700 font-medium whitespace-pre-wrap">
                              {record.proposed_solution}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                              IMPLEMENTAÇÃO PRÁTICA
                            </span>
                            <p className="text-slate-700 font-medium whitespace-pre-wrap">
                              {record.implementation_details}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                              RESULTADO PERCEBIDO
                            </span>
                            <p className="text-slate-700 font-medium whitespace-pre-wrap">
                              {record.perceived_results}
                            </p>
                          </div>
                          {record.evidence_url_or_desc && (
                            <div>
                              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-0.5">
                                EVIDÊNCIA
                              </span>
                              <p className="text-slate-500 font-medium italic text-xs whitespace-pre-wrap">
                                {record.evidence_url_or_desc}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
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
