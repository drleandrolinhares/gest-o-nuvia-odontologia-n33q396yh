import { Trophy, Medal } from 'lucide-react'

export default function Ranking() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Trophy className="h-7 w-7 text-white" /> RANKING DE PERFORMANCE
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ACOMPANHE O ENGAJAMENTO DA EQUIPE
          </p>
        </div>
      </div>

      <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
        <Medal className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <p className="font-bold text-base tracking-widest">SISTEMA DE RANKING INDISPONÍVEL.</p>
        <p className="text-sm font-semibold text-slate-400 mt-2">
          MÓDULO DE USUÁRIOS FOI REMOVIDO.
        </p>
      </div>
    </div>
  )
}
