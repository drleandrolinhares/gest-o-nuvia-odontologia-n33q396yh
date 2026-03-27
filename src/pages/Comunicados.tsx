import { Megaphone } from 'lucide-react'

export default function Comunicados() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" /> COMUNICADOS
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          MURAL DE AVISOS E INFORMAÇÕES OFICIAIS.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 border-2 border-dashed rounded-xl bg-card/50">
        <Megaphone className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-black text-muted-foreground tracking-widest">
          MÓDULO EM DESENVOLVIMENTO
        </h2>
        <p className="text-sm font-medium text-muted-foreground max-w-md">
          O NOVO MURAL DE COMUNICADOS ESTÁ SENDO CONFIGURADO E EM BREVE ESTARÁ DISPONÍVEL AQUI.
        </p>
      </div>
    </div>
  )
}
