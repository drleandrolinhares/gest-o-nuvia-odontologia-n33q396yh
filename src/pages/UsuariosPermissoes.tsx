import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UsuariosPermissoes() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Usuários e Permissões
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie os colaboradores, cargos e níveis de acesso ao sistema.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Usuários e Permissões</CardTitle>
          <CardDescription>Em desenvolvimento...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            A interface de gestão de usuários e permissões será implementada aqui na próxima etapa.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
