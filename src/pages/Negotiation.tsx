import { Handshake } from 'lucide-react'
import { NegotiationSimulator } from '@/components/negotiation/NegotiationSimulator'

export default function Negotiation() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <Handshake className="h-8 w-8 text-primary" /> SIMULADOR DE NEGOCIAÇÃO
        </h1>
        <p className="text-muted-foreground mt-1">
          CALCULE OPÇÕES DE PAGAMENTO, DESCONTOS E PARCELAMENTOS PARA OS PACIENTES.
        </p>
      </div>

      <NegotiationSimulator />
    </div>
  )
}
