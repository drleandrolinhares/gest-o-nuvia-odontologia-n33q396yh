import { Sparkles, ArrowLeft, Hammer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function PerformanceSer5s() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-emerald-600" /> SER 5S
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          AVALIAÇÃO E MANUTENÇÃO DO AMBIENTE DE TRABALHO.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 border-2 border-dashed rounded-xl bg-white shadow-sm p-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
          <Hammer className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-nuvia-navy tracking-widest">
          ESTA PÁGINA ESTÁ EM CONSTRUÇÃO
        </h2>
        <p className="text-sm font-bold text-muted-foreground max-w-md leading-relaxed">
          ESTAMOS TRABALHANDO PARA DISPONIBILIZAR ESTE MÓDULO O MAIS RÁPIDO POSSÍVEL. EM BREVE
          TEREMOS NOVIDADES!
        </p>
        <Button
          onClick={() => navigate('/performance')}
          className="mt-4 bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md"
          size="lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> VOLTAR PARA PERFORMANCE
        </Button>
      </div>
    </div>
  )
}
