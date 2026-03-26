import { DocumentsTab } from '@/components/rh/DocumentsTab'

export default function RH() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">RECURSOS HUMANOS</h1>
        <p className="text-muted-foreground mt-1">
          REPOSITÓRIO DE DOCUMENTOS E NORMATIVAS OPERACIONAIS PADRÃO (POPS).
        </p>
      </div>

      <DocumentsTab />
    </div>
  )
}
