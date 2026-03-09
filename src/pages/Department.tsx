import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download } from 'lucide-react'
import useAppStore from '@/stores/main'
import { EmployeeTable } from '@/components/EmployeeTable'
import { PasswordVault } from '@/components/PasswordVault'
import { Button } from '@/components/ui/button'

const mockDocuments = [
  { id: 1, name: 'POP - Atendimento Inicial.pdf', date: '10/01/2026' },
  { id: 2, name: 'Manual de Biossugurança v2.pdf', date: '15/02/2026' },
  { id: 3, name: 'Regulamento Interno Nuvia.pdf', date: '05/03/2026' },
]

export default function Department() {
  const { id } = useParams<{ id: string }>()
  const { employees } = useAppStore()

  const deptName = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Departamento'

  // Filter employees for this specific department
  const deptEmployees = employees.filter((e) => e.department.toLowerCase() === id?.toLowerCase())

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Setor {deptName}</h1>
        <p className="text-muted-foreground mt-1">Gestão de equipe, rotinas e acessos do setor.</p>
      </div>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="rotinas">Rotinas / POPs</TabsTrigger>
          <TabsTrigger value="acessos">Cofre de Acessos</TabsTrigger>
        </TabsList>

        <TabsContent value="equipe" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>
                Gerencie os colaboradores alocados neste departamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeTable employees={deptEmployees} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rotinas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Operacionais</CardTitle>
              <CardDescription>Manuais e Procedimentos Operacionais Padrão (POPs).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Atualizado em {doc.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Baixar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acessos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cofre de Senhas</CardTitle>
              <CardDescription>Credenciais seguras e compartilhadas da clínica.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordVault />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
