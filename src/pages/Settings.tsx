import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { UsersList } from '@/components/settings/UsersList'
import { BonusSettings } from '@/components/settings/BonusSettings'
import { InventorySettings } from '@/components/settings/InventorySettings'
import useAppStore from '@/stores/main'

export default function Settings() {
  const { isAdmin } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1">
          GERENCIE AS PARAMETRIZAÇÕES E FORNECEDORES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 flex flex-wrap w-full max-w-4xl h-auto">
          <TabsTrigger value="geral" className="py-2 px-4 flex-1">
            GERAL
          </TabsTrigger>
          <TabsTrigger value="fornecedores" className="py-2 px-4 flex-1">
            FORNECEDORES
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="py-2 px-4 flex-1">
            USUÁRIOS
          </TabsTrigger>
          <TabsTrigger value="bonificacoes" className="py-2 px-4 flex-1">
            BONIFICAÇÕES
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="estoque" className="py-2 px-4 flex-1">
              ESTOQUE
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="geral">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="fornecedores">
          <SuppliersManagement />
        </TabsContent>

        <TabsContent value="usuarios">
          <UsersList />
        </TabsContent>

        <TabsContent value="bonificacoes">
          <BonusSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="estoque">
            <InventorySettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
