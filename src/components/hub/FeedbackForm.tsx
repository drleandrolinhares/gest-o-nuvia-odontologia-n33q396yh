import { useState } from 'react'
import { useHubStore } from '@/stores/hub'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FeedbackForm() {
  const { submitFeedback } = useHubStore()
  const { toast } = useToast()

  const [excellent, setExcellent] = useState('')
  const [improvement, setImprovement] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!excellent.trim() || !improvement.trim()) {
      toast({
        title: 'ATENÇÃO',
        description: 'PREENCHA AMBOS OS CAMPOS PARA ENVIAR.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const res = await submitFeedback(excellent.trim(), improvement.trim())
    setIsSubmitting(false)

    if (res.success) {
      setExcellent('')
      setImprovement('')
      toast({ title: 'SUCESSO', description: 'FEEDBACK ENVIADO! VOCÊ GANHOU 50 PONTOS.' })
    } else {
      toast({ title: 'ERRO', description: 'FALHA AO ENVIAR FEEDBACK.', variant: 'destructive' })
    }
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardContent className="p-6 space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <label className="flex items-center gap-2 text-sm font-black text-emerald-800 tracking-widest mb-2">
            <CheckCircle className="h-4 w-4" /> PONTOS POSITIVOS (O QUE FOI EXCELENTE NESSA SEMANA?)
          </label>
          <Textarea
            value={excellent}
            onChange={(e) => setExcellent(e.target.value)}
            placeholder="DESCREVA AS VITÓRIAS E PONTOS POSITIVOS..."
            className="bg-white min-h-[120px] resize-none"
            disableUppercase
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <label className="flex items-center gap-2 text-sm font-black text-amber-800 tracking-widest mb-2">
            <TrendingUp className="h-4 w-4" /> PONTOS DE MELHORIA (O QUE PODEMOS MELHORAR?)
          </label>
          <Textarea
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            placeholder="DESCREVA OPORTUNIDADES DE SOLUÇÃO E MELHORIA..."
            className="bg-white min-h-[120px] resize-none"
            disableUppercase
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !excellent.trim() || !improvement.trim()}
          className="w-full h-12 text-base font-black tracking-widest uppercase shadow-lg bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37]"
        >
          <Send className="h-5 w-5 mr-2" />
          {isSubmitting ? 'ENVIANDO...' : 'ENVIAR FEEDBACK SEMANAL (GANHAR 50 PTS)'}
        </Button>
      </CardContent>
    </Card>
  )
}
