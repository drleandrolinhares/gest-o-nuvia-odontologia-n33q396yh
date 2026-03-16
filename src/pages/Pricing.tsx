import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore from '@/stores/main'
import { HourlyCostCalculator } from '@/components/pricing/HourlyCostCalculator'
import { PricingKanban } from '@/components/pricing/PricingKanban'
import { FinancialParameters } from '@/components/pricing/FinancialParameters'
import { ShieldAlert } from 'lucide-react'

export default function Pricing() {
  const { isAdmin } = useAppStore()

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] py-20 uppercase animate-fade-in">
        <ShieldAlert className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-black text-muted-foreground tracking-widest">
          Acesso Restrito
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Esta página é exclusiva para administradores.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">PRECIFICAÇÃO</h1>
        <p className="text-muted-foreground mt-1">
          GESTÃO DE CUSTOS, MARGENS DE LUCRO E TABELA DE PREÇOS DE SERVIÇOS.
        </p>
      </div>

      <Tabs defaultValue="tabela" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 md:max-w-[700px] h-auto p-1 gap-1">
          <TabsTrigger value="tabela" className="py-2">
            TABELA DE PREÇOS
          </TabsTrigger>
          <TabsTrigger value="custo" className="py-2">
            CUSTO HORA
          </TabsTrigger>
          <TabsTrigger value="parametros" className="py-2">
            PARÂMETROS FINANCEIROS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tabela" className="mt-6">
          <PricingKanban />
        </TabsContent>

        <TabsContent value="custo" className="mt-6">
          <HourlyCostCalculator />
        </TabsContent>

        <TabsContent value="parametros" className="mt-6">
          <FinancialParameters />
        </TabsContent>
      </Tabs>
    </div>
  )
}
