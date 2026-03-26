import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { InventorySettings } from '@/components/settings/InventorySettings'
import { NegotiationSettingsPanel } from '@/components/settings/NegotiationSettingsPanel'

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          GERENCIE AS PARAMETRIZAÇÕES E FORNECEDORES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 flex flex-wrap w-full max-w-5xl h-auto">
          <TabsTrigger value="geral" className="py-2 px-4 flex-1 font-bold tracking-widest">
            GERAL
          </TabsTrigger>
          <TabsTrigger value="fornecedores" className="py-2 px-4 flex-1 font-bold tracking-widest">
            FORNECEDORES
          </TabsTrigger>
          <TabsTrigger value="estoque" className="py-2 px-4 flex-1 font-bold tracking-widest">
            ESTOQUE
          </TabsTrigger>
          <TabsTrigger value="negociacao" className="py-2 px-4 flex-1 font-bold tracking-widest">
            SIMULADOR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="fornecedores">
          <SuppliersManagement />
        </TabsContent>

        <TabsContent value="estoque">
          <InventorySettings />
        </TabsContent>

        <TabsContent value="negociacao">
          <NegotiationSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
