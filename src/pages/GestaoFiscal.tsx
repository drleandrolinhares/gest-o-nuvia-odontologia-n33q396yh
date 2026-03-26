import { DollarSign } from 'lucide-react'

export default function GestaoFiscal() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" /> GESTÃO FISCAL
        </h1>
        <p className="text-muted-foreground mt-1">
          CONTROLE DE NOTAS, TRIBUTAÇÃO E CONFIGURAÇÕES FISCAIS.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 border-2 border-dashed rounded-xl bg-card/50">
        <DollarSign className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-black text-muted-foreground tracking-widest">
          MÓDULO EM DESENVOLVIMENTO
        </h2>
        <p className="text-sm font-medium text-muted-foreground max-w-md">
          A GESTÃO FISCAL ESTÁ SENDO IMPLEMENTADA E EM BREVE ESTARÁ DISPONÍVEL NESTA SESSÃO.
        </p>
      </div>
    </div>
  )
}
