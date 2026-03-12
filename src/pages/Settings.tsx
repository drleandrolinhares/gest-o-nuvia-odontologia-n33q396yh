import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { UsersList } from '@/components/settings/UsersList'

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
        <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-3 max-w-2xl">
          <TabsTrigger value="geral">GERAL</TabsTrigger>
          <TabsTrigger value="fornecedores">FORNECEDORES</TabsTrigger>
          <TabsTrigger value="usuarios">USUÁRIOS</TabsTrigger>
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
      </Tabs>
    </div>
  )
}
