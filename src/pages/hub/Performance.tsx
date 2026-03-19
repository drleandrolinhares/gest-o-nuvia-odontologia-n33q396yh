import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, BookOpen, Lightbulb, Sparkles } from 'lucide-react'
import { Ser5sSection } from '@/components/hub/Ser5sSection'
import { MonthlyReadingSection } from '@/components/hub/MonthlyReadingSection'
import { InnovationSection } from '@/components/hub/InnovationSection'

export default function Performance() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Target className="h-7 w-7 text-white" /> DESENVOLVIMENTO E PERFORMANCE
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ACOMPANHE SUAS INICIATIVAS DE DESENVOLVIMENTO E ENGAJAMENTO
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-t-4 border-t-emerald-500 shadow-md">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-widest text-slate-800">
                  SER 5S
                </CardTitle>
                <CardDescription className="text-xs font-bold mt-1 text-slate-500 uppercase tracking-wider">
                  Organização, limpeza, padronização e disciplina no ambiente de trabalho.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Ser5sSection />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500 shadow-md">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-widest text-slate-800">
                  LEITURA DO MÊS
                </CardTitle>
                <CardDescription className="text-xs font-bold mt-1 text-slate-500 uppercase tracking-wider">
                  Aprendizados aplicados na prática para fortalecer a cultura e o atendimento.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <MonthlyReadingSection />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-md">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-widest text-slate-800">
                  INOVAÇÃO IMPLEMENTADA
                </CardTitle>
                <CardDescription className="text-xs font-bold mt-1 text-slate-500 uppercase tracking-wider">
                  Ideias de melhoria que saíram do papel e geraram resultado real.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <InnovationSection />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
