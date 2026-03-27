import { Target, LineChart, Sparkles, Lightbulb, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export default function Performance() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" /> PERFORMANCE
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          ACOMPANHAMENTO DE DESEMPENHO E FEEDBACKS DA EQUIPE.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <Link to="/performance/pp-pdm" className="block">
          <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/50 cursor-pointer bg-white group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-8 flex flex-col items-center text-center gap-5 h-full justify-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <LineChart className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-nuvia-navy group-hover:text-primary transition-colors">
                  PP E PDM
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground tracking-widest">
                  PLANO DE PERFORMANCE
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/performance/ser-5s" className="block">
          <Card className="h-full hover:shadow-xl transition-all duration-300 border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer bg-white group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-8 flex flex-col items-center text-center gap-5 h-full justify-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <Sparkles className="h-10 w-10 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-nuvia-navy group-hover:text-emerald-600 transition-colors">
                  SER 5S
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground tracking-widest">
                  AVALIAÇÃO DE AMBIENTE
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/performance/inovacao-implementada" className="block">
          <Card className="h-full hover:shadow-xl transition-all duration-300 border-amber-500/20 hover:border-amber-500/50 cursor-pointer bg-white group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-8 flex flex-col items-center text-center gap-5 h-full justify-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <Lightbulb className="h-10 w-10 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-nuvia-navy group-hover:text-amber-600 transition-colors">
                  INOVAÇÃO
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground tracking-widest">
                  IDEIAS IMPLEMENTADAS
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/performance/leitura-do-mes" className="block">
          <Card className="h-full hover:shadow-xl transition-all duration-300 border-blue-500/20 hover:border-blue-500/50 cursor-pointer bg-white group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-8 flex flex-col items-center text-center gap-5 h-full justify-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <BookOpen className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-nuvia-navy group-hover:text-blue-600 transition-colors">
                  LEITURA
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground tracking-widest">
                  LIVRO DO MÊS
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
