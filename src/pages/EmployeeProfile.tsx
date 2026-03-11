import { useParams, Link } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, ArrowLeft, Calendar, DollarSign, Mail, Phone, Briefcase } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>()
  const { employees } = useAppStore()
  const employee = employees.find((e) => e.id === id)

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-nuvia-navy">Colaborador não encontrado</h2>
        <Link to="/rh">
          <Button variant="outline">Voltar para o RH</Button>
        </Link>
      </div>
    )
  }

  const isVacationNear = employee.vacationDaysTotal - employee.vacationDaysTaken < 10

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link to="/rh">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">{employee.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Briefcase className="h-4 w-4" /> {employee.role} • {employee.department}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dados Cadastrais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full" />
              <div>
                <p className="text-sm font-medium">Email Profissional</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full" />
              <div>
                <p className="text-sm font-medium">Data de Admissão</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(employee.hireDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full" />
              <div>
                <p className="text-sm font-medium">Salário Base</p>
                <p className="text-sm text-muted-foreground">{employee.salary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controle de Férias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Gozados: {employee.vacationDaysTaken} dias</span>
                <span className="text-muted-foreground">
                  Total: {employee.vacationDaysTotal} dias
                </span>
              </div>
              <Progress
                value={(employee.vacationDaysTaken / employee.vacationDaysTotal) * 100}
                className="h-2"
              />
            </div>

            {isVacationNear && (
              <Alert variant="destructive" className="bg-destructive/5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alerta RH</AlertTitle>
                <AlertDescription>
                  O período aquisitivo de férias está próximo do vencimento ou do limite.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
