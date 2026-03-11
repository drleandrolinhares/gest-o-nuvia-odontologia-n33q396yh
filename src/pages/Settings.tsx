import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldAlert } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { SuppliersManagement } from '@/components/settings/SuppliersManagement'
import { UsersList } from '@/components/settings/UsersList'

export default function Settings() {
  const { can, isAdmin } = useAppStore()

  const canViewGeneral = isAdmin
  const canViewFornecedores = isAdmin || can('fornecedores', 'visualizar_fornecedores')
  const canViewUsers = isAdmin || can('colaboradores', 'visualizar_lista')

  const hasAnyAccess = canViewGeneral || canViewFornecedores || canViewUsers

  if (!hasAnyAccess) {
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
            VOCÊ PRECISA DE PRIVILÉGIOS DE ACESSO PARA VISUALIZAR AS CONFIGURAÇÕES DO SISTEMA.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const defaultTab = canViewGeneral ? 'geral' : canViewFornecedores ? 'fornecedores' : 'usuarios'

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1">
          GERENCIE AS PARAMETRIZAÇÕES, FORNECEDORES E PERMISSÕES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-3 max-w-2xl">
          {canViewGeneral && <TabsTrigger value="geral">GERAL</TabsTrigger>}
          {canViewFornecedores && <TabsTrigger value="fornecedores">FORNECEDORES</TabsTrigger>}
          {canViewUsers && <TabsTrigger value="usuarios">USUÁRIOS E EQUIPE</TabsTrigger>}
        </TabsList>

        {canViewGeneral && (
          <TabsContent value="geral">
            <GeneralSettings />
          </TabsContent>
        )}

        {canViewFornecedores && (
          <TabsContent value="fornecedores">
            <SuppliersManagement />
          </TabsContent>
        )}

        {canViewUsers && (
          <TabsContent value="usuarios">
            <UsersList />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
