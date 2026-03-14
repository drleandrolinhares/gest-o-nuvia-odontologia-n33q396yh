import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Play, CheckCircle2, Circle } from 'lucide-react'
import { AccessItem } from '@/stores/main'
import { cn } from '@/lib/utils'

export function GrandeManual({ item }: { item: AccessItem }) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const steps = item.manual_steps || []

  return (
    <Card className="shadow-sm border-muted h-full">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> O GRANDE MANUAL
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* VIDEO PLACEHOLDER */}
        {item.video_url ? (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" /> TREINAMENTO EM VÍDEO
            </h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-muted shadow-sm bg-slate-900 relative group cursor-pointer">
              {item.video_url.includes('youtube.com') || item.video_url.includes('youtu.be') ? (
                <iframe
                  src={item.video_url
                    .replace('watch?v=', 'embed/')
                    .replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Play className="h-16 w-16 text-primary mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <p className="font-bold text-lg uppercase tracking-widest text-[#D4AF37]">
                    VÍDEO DE TREINAMENTO
                  </p>
                  <p className="text-xs text-slate-400 mt-2 lowercase">{item.video_url}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
              <Play className="h-4 w-4 text-muted-foreground" /> TREINAMENTO EM VÍDEO
            </h3>
            <div className="h-40 w-full rounded-xl border-2 border-dashed border-muted bg-slate-50 flex flex-col items-center justify-center text-muted-foreground">
              <Play className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs font-bold uppercase">NENHUM VÍDEO DISPONÍVEL</p>
            </div>
          </div>
        )}

        {/* CHECKLIST */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> PASSO A PASSO PADRÃO (SOP)
          </h3>

          {steps.length > 0 ? (
            <div className="space-y-2.5">
              {steps.map((step) => {
                const isDone = completedSteps[step.id]
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-white hover:border-primary/30',
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm font-medium leading-relaxed transition-colors',
                        isDone ? 'text-emerald-900/70' : 'text-slate-700',
                      )}
                    >
                      {step.text}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-dashed text-center text-muted-foreground">
              <p className="text-xs font-bold uppercase tracking-widest">NENHUM FLUXO CADASTRADO</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
