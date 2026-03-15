import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore from '@/stores/main'
import { Navigate } from 'react-router-dom'
import { HourlyCostCalculator } from '@/components/pricing/HourlyCostCalculator'
import { PricingKanban } from '@/components/pricing/PricingKanban'

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
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="tabela">TABELA DE PREÇOS</TabsTrigger>
          <TabsTrigger value="custo">CUSTO HORA</TabsTrigger>
        </TabsList>

        <TabsContent value="tabela" className="mt-6">
          <PricingKanban />
        </TabsContent>

        <TabsContent value="custo" className="mt-6">
          <HourlyCostCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
