import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldAlert } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { UsersList } from '@/components/settings/UsersList'
import { PermissionsControl } from '@/components/settings/PermissionsControl'

export default function Settings() {
  const { isAdmin } = useAppStore()

  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in-up uppercase">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
          <p className="text-muted-foreground mt-1">GERENCIE AS PARAMETRIZAÇÕES DO SISTEMA.</p>
        </div>
        <Alert variant="destructive" className="bg-destructive/5 max-w-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>ACESSO RESTRITO</AlertTitle>
          <AlertDescription>
            VOCÊ PRECISA DE PRIVILÉGIOS DE ADMINISTRADOR PARA ACESSAR AS CONFIGURAÇÕES DO SISTEMA.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1">
          GERENCIE AS PARAMETRIZAÇÕES, FORNECEDORES E PERMISSÕES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-3 max-w-2xl">
          <TabsTrigger value="geral">GERAL</TabsTrigger>
          <TabsTrigger value="fornecedores">FORNECEDORES</TabsTrigger>
          <TabsTrigger value="usuarios">USUÁRIOS E PERMISSÕES</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="fornecedores">
          <SuppliersManagement />
        </TabsContent>

        <TabsContent value="usuarios">
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="lista">LISTA DE COLABORADORES</TabsTrigger>
              <TabsTrigger value="permissoes">CONTROLE DE PERMISSÕES</TabsTrigger>
            </TabsList>
            <TabsContent value="lista">
              <UsersList />
            </TabsContent>
            <TabsContent value="permissoes">
              <PermissionsControl />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
