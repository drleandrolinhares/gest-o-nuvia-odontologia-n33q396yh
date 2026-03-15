import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore from '@/stores/main'
import { Navigate } from 'react-router-dom'
import { HourlyCostCalculator } from '@/components/pricing/HourlyCostCalculator'
import { PricingKanban } from '@/components/pricing/PricingKanban'
import { FinancialParameters } from '@/components/pricing/FinancialParameters'

export default function Pricing() {
  const { isAdmin } = useAppStore()

  if (!isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
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
