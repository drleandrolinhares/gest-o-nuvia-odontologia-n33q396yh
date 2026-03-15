import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PriceListTab } from '@/components/financeiro/PriceListTab'
import { HourlyCostTab } from '@/components/financeiro/HourlyCostTab'
import { GlobalSettingsTab } from '@/components/financeiro/GlobalSettingsTab'
import useAppStore from '@/stores/main'
import { ShieldAlert, DollarSign } from 'lucide-react'

export default function Financeiro() {
  const { isAdmin, isMaster } = useAppStore()

  if (!isAdmin && !isMaster) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in uppercase">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-nuvia-navy">ACESSO NEGADO</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          VOCÊ NÃO TEM PERMISSÃO PARA ACESSAR O MÓDULO FINANCEIRO. CONTATE A DIRETORIA.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-emerald-600" /> GESTÃO FINANCEIRA
        </h1>
        <p className="text-muted-foreground mt-1">
          TABELA DE PREÇOS, MARGEM DE LUCRO, CUSTO HORA E PARAMETRIZAÇÕES GLOBAIS.
        </p>
      </div>

      <Tabs defaultValue="tabela" className="w-full">
        <TabsList className="mb-6 flex flex-wrap w-full max-w-4xl h-auto">
          <TabsTrigger value="tabela" className="py-2 px-4 flex-1 font-bold tracking-widest">
            TABELA DE PREÇOS
          </TabsTrigger>
          <TabsTrigger value="custo-hora" className="py-2 px-4 flex-1 font-bold tracking-widest">
            CUSTO HORA
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="py-2 px-4 flex-1 font-bold tracking-widest">
            CONFIG. GLOBAIS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tabela">
          <PriceListTab />
        </TabsContent>

        <TabsContent value="custo-hora">
          <HourlyCostTab />
        </TabsContent>

        <TabsContent value="configuracoes">
          <GlobalSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
