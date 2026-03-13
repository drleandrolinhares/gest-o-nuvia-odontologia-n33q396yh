import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { UsersList } from '@/components/settings/UsersList'
import { BonusSettings } from '@/components/settings/BonusSettings'

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1">
          GERENCIE AS PARAMETRIZAÇÕES E FORNECEDORES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-4 max-w-4xl h-auto">
          <TabsTrigger value="geral" className="py-2">
            GERAL
          </TabsTrigger>
          <TabsTrigger value="fornecedores" className="py-2">
            FORNECEDORES
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="py-2">
            USUÁRIOS
          </TabsTrigger>
          <TabsTrigger value="bonificacoes" className="py-2">
            BONIFICAÇÕES
          </TabsTrigger>
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
      </Tabs>
    </div>
  )
}
