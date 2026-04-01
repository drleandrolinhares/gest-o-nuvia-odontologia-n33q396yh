import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50/50">
      <Loader2 className="h-12 w-12 animate-spin text-[#D81B84]" />
      <p className="mt-4 text-sm font-medium text-muted-foreground uppercase tracking-widest animate-pulse">
        Carregando...
      </p>
    </div>
  )
}
