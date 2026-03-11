import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Package,
  ListTodo,
  TrendingDown,
  AlertCircle,
  FileText,
  DollarSign,
  Boxes,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function Index() {
  const { employees, alerts, onboarding, inventory } = useAppStore()

  const activeEmployees = employees.filter((e) => e.status === 'Ativo').length
  const pendingOnboarding = onboarding.length
  const lowStockItems = inventory.filter((i) => i.quantity <= i.minStock).length
  const totalItemsInStock = inventory.reduce((acc, item) => acc + item.quantity, 0)
  const investedCapital = inventory.reduce((acc, item) => acc + item.quantity * item.packageCost, 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Dashboard Nuvia</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da gestão de recursos humanos e estoque clínico.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe Ativa</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Colaboradores de um total de {employees.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding Pendente</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOnboarding}</div>
            <p className="text-xs text-muted-foreground mt-1">Processos em andamento (RH)</p>
          </CardContent>
        </Card>

        <Card className={lowStockItems > 0 ? 'border-destructive/30 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos de Estoque</CardTitle>
            <TrendingDown
              className={cn('h-4 w-4', lowStockItems > 0 ? 'text-destructive' : 'text-emerald-500')}
            />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', lowStockItems > 0 ? 'text-destructive' : '')}>
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Itens precisam de reposição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capital Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(investedCapital)}</div>
            <p className="text-xs text-muted-foreground mt-1">Valor em estoque clínico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Boxes className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsInStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de unidades disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Central de Alertas Operacionais
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
            {lowStockItems > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Estoque Crítico</AlertTitle>
                <AlertDescription>
                  Existem {lowStockItems} itens com estoque abaixo do limite no inventário clínico.
                  Reposição necessária.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/rh" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> Gestão de Equipe (RH)
              </Button>
            </Link>
            <Link to="/estoque" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" /> Atualizar Estoque
              </Button>
            </Link>
            <Link to="/rh" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Rotinas e Manuais
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
