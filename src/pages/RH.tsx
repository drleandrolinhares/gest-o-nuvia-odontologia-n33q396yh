import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAppStore from '@/stores/main'
import { EmployeeTable } from '@/components/EmployeeTable'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RH() {
  const { employees, onboarding, toggleTask } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Recursos Humanos</h1>
        <p className="text-muted-foreground mt-1">
          Gestão consolidada de equipe, integrações de onboarding e rotinas operacionais.
        </p>
      </div>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="equipe">Equipe Nuvia</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="rotinas">Rotinas / POPs</TabsTrigger>
        </TabsList>

        <TabsContent value="equipe" className="mt-6">
          <EmployeeTable employees={employees} />
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {onboarding.map((candidate) => {
              const completed = candidate.tasks.filter((t) => t.completed).length
              const total = candidate.tasks.length
              const progress = total === 0 ? 0 : (completed / total) * 100
              const isFinished = progress === 100

              return (
                <Card key={candidate.id} className={isFinished ? 'border-emerald-200' : ''}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription>
                          {candidate.role} • {candidate.department}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={isFinished ? 'default' : 'secondary'}
                        className={isFinished ? 'bg-emerald-500' : ''}
                      >
                        {isFinished ? 'Concluído' : 'Em Andamento'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Checklist de Tarefas
                      </h4>
                      {candidate.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`task-${candidate.id}-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(candidate.id, task.id)}
                          />
                          <label
                            htmlFor={`task-${candidate.id}-${task.id}`}
                            className={`text-sm font-medium leading-none cursor-pointer ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {onboarding.length === 0 && (
              <div className="col-span-2 py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                Nenhum processo de onboarding em andamento no momento.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rotinas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e Normativas</CardTitle>
              <CardDescription>
                Manuais e Procedimentos Operacionais Padrão (POPs) do RH.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 1, name: 'POP - Onboarding e Admissão v2.pdf', date: '10/01/2026' },
                { id: 2, name: 'Manual de Conduta Nuvia.pdf', date: '15/02/2026' },
              ].map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
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
      </Tabs>
    </div>
  )
}
