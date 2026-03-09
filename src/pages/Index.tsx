import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  CalendarClock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  FileText,
  KeyRound,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const { employees, alerts, onboarding } = useAppStore()

  const activeEmployees = employees.filter((e) => e.status === 'Ativo').length
  const vacationAlerts = employees.filter((e) => e.status === 'Férias').length
  const pendingOnboarding = onboarding.length

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Dashboard Nuvia</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da gestão clínica e administrativa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">De um total de {employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Férias</CardTitle>
            <CalendarClock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacationAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Colaboradores afastados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding Pendente</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOnboarding}</div>
            <p className="text-xs text-muted-foreground mt-1">Processos em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumo Financeiro</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Saudável</div>
            <p className="text-xs text-muted-foreground mt-1">Consulte o painel financeiro</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Avisos e Alertas (RH)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, idx) => (
              <Alert
                key={idx}
                variant={idx === 0 ? 'destructive' : 'default'}
                className={cn(idx !== 0 && 'border-amber-200 bg-amber-50 text-amber-900')}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{idx === 0 ? 'Urgente' : 'Atenção'}</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Colaborador
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Adicionar Documento
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <KeyRound className="mr-2 h-4 w-4" /> Acessar Senhas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
