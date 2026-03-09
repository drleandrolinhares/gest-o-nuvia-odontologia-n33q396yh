import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import useAppStore from '@/stores/main'
import { Badge } from '@/components/ui/badge'

export default function Onboarding() {
  const { onboarding, toggleTask } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">
          Onboarding & Integração
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe a trilha de entrada dos novos colaboradores.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {onboarding.map((candidate) => {
          const completedTasks = candidate.tasks.filter((t) => t.completed).length
          const totalTasks = candidate.tasks.length
          const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100
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
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Progresso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-medium mb-3">Checklist de Tarefas</h4>
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
                        className={`text-sm font-medium leading-none cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
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
          <div className="col-span-2 py-12 text-center text-muted-foreground bg-card rounded-lg border border-dashed">
            Nenhum processo de onboarding em andamento no momento.
          </div>
        )}
      </div>
    </div>
  )
}
