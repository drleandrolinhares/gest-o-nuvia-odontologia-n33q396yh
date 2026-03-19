import { useState, useEffect } from 'react'
import { useHubStore, HubFeedback } from '@/stores/hub'
import useAppStore from '@/stores/main'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeedbackForm } from '@/components/hub/FeedbackForm'
import { FeedbackList } from '@/components/hub/FeedbackList'
import { MessageSquarePlus, AlertTriangle } from 'lucide-react'
import { isSameWeek } from 'date-fns'

export default function Feedback() {
  const { feedbacks, fetchAllFeedbacks } = useHubStore()
  const { isAdmin } = useAppStore()
  const [allFb, setAllFb] = useState<HubFeedback[]>([])

  useEffect(() => {
    if (isAdmin) {
      fetchAllFeedbacks().then(setAllFb)
    }
  }, [isAdmin, fetchAllFeedbacks, feedbacks]) // re-fetch if feedbacks changes

  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday
  const canSubmitDay = dayOfWeek >= 1 && dayOfWeek <= 6

  const alreadySubmittedThisWeek = feedbacks.some((f) =>
    isSameWeek(new Date(f.created_at), today, { weekStartsOn: 1 }),
  )

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <MessageSquarePlus className="h-7 w-7 text-white" /> PP & PDM
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            FEEDBACK SEMANAL: PONTOS POSITIVOS E OPORTUNIDADES DE MELHORIA
          </p>
        </div>
      </div>

      <Tabs defaultValue="enviar" className="w-full">
        <TabsList className="mb-6 flex flex-wrap w-full max-w-md h-auto">
          <TabsTrigger value="enviar" className="py-2 px-4 flex-1 font-bold tracking-widest">
            ENVIAR FEEDBACK
          </TabsTrigger>
          <TabsTrigger value="meus" className="py-2 px-4 flex-1 font-bold tracking-widest">
            MEU HISTÓRICO
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="todos" className="py-2 px-4 flex-1 font-bold tracking-widest">
              VISÃO ADMIN
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="enviar" className="space-y-4">
          {!canSubmitDay ? (
            <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-black text-lg tracking-widest mb-1">FORMULÁRIO FECHADO</h3>
              <p className="font-bold text-sm opacity-80">
                O FEEDBACK SEMANAL ESTÁ DISPONÍVEL APENAS DE SEGUNDA A SÁBADO.
              </p>
            </div>
          ) : alreadySubmittedThisWeek ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <MessageSquarePlus className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-black text-lg tracking-widest mb-1">FEEDBACK JÁ ENVIADO</h3>
              <p className="font-bold text-sm opacity-80">
                VOCÊ JÁ ENVIOU SEU FEEDBACK DESTA SEMANA. OBRIGADO PELA CONTRIBUIÇÃO!
              </p>
            </div>
          ) : (
            <FeedbackForm />
          )}
        </TabsContent>

        <TabsContent value="meus">
          <FeedbackList items={feedbacks} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="todos">
            <FeedbackList items={allFb} showAuthor />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
