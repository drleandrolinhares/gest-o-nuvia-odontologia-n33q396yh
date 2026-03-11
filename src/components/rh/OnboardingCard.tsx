import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import useAppStore, { OnboardingCandidate } from '@/stores/main'

export function OnboardingCard({ candidate }: { candidate: OnboardingCandidate }) {
  const { toggleTask, addOnboardingTask, removeOnboardingTask } = useAppStore()
  const [newTask, setNewTask] = useState('')

  const completed = candidate.tasks.filter((t) => t.completed).length
  const total = candidate.tasks.length
  const progress = total === 0 ? 0 : (completed / total) * 100
  const isFinished = progress === 100 && total > 0

  const handleAddTask = () => {
    if (!newTask.trim()) return
    addOnboardingTask(candidate.id, newTask)
    setNewTask('')
  }

  return (
    <Card
      className={`transition-colors ${isFinished ? 'border-emerald-200 bg-emerald-50/30' : ''}`}
    >
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
            className={isFinished ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
          >
            {isFinished ? 'Concluído' : 'Em Andamento'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-right text-muted-foreground">
            {completed} de {total} tarefas concluídas
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-foreground mb-3">Checklist de Tarefas</h4>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
            {candidate.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors group bg-background"
              >
                <div className="flex items-center space-x-3 max-w-[85%]">
                  <Checkbox
                    id={`task-${candidate.id}-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(candidate.id, task.id)}
                  />
                  <label
                    htmlFor={`task-${candidate.id}-${task.id}`}
                    className={`text-sm font-medium leading-none cursor-pointer truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.title}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeOnboardingTask(candidate.id, task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-2 border-t">
            <Input
              placeholder="Nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="h-9 text-sm"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddTask}
              className="h-9 px-3 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
