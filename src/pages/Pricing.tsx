import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore from '@/stores/main'
import { ShieldAlert } from 'lucide-react'
import { checkPermission } from '@/lib/permissions'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading dos componentes pesados para otimização de performance (LCP e INP)
const HourlyCostCalculator = React.lazy(() =>
  import('@/components/pricing/HourlyCostCalculator').then((m) => ({
    default: m.HourlyCostCalculator,
  })),
)
const PricingKanban = React.lazy(() =>
  import('@/components/pricing/PricingKanban').then((m) => ({ default: m.PricingKanban })),
)
const FinancialParameters = React.lazy(() =>
  import('@/components/pricing/FinancialParameters').then((m) => ({
    default: m.FinancialParameters,
  })),
)

function LoadingFallback() {
  return (
    <div className="space-y-4 w-full animate-pulse p-2">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

export default function Pricing() {
  const store = useAppStore() as any

  // Verificação crítica: CEO/Admin sempre tem acesso
  const isCEO = store?.isAdmin === true

  // Verificação de permissão do módulo
  const hasModulePermission = checkPermission('precificacao', 'visualizar')

  // Acesso final: CEO OU tem permissão específica
  const hasAccess = isCEO || hasModulePermission

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] py-20 uppercase animate-fade-in">
        <ShieldAlert className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-black text-muted-foreground tracking-widest">
          Acesso Restrito
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Você não tem permissão para visualizar esta página.
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
          <Suspense fallback={<LoadingFallback />}>
            <PricingKanban />
          </Suspense>
        </TabsContent>

        <TabsContent value="custo" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <HourlyCostCalculator />
          </Suspense>
        </TabsContent>

        <TabsContent value="parametros" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <FinancialParameters />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
