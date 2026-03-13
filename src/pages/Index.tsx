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
  UserCheck,
  Stethoscope,
  Briefcase,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn, formatCurrency } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'

export default function Index() {
  const { employees, alerts, onboarding, inventory } = useAppStore()
  const navigate = useNavigate()

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')
  const countSocios = activeEmployees.filter((e) => e.teamCategory === 'SÓCIO').length
  const countDentistas = activeEmployees.filter((e) => e.teamCategory === 'DENTISTA').length
  const countColaboradores = activeEmployees.filter(
    (e) => e.teamCategory === 'COLABORADOR' || !e.teamCategory,
  ).length
  const totalTeam = activeEmployees.length

  const pendingOnboarding = onboarding.length
  const lowStockItems = inventory.filter((i) => i.quantity <= i.minStock).length
  const totalItemsInStock = inventory.reduce((acc, item) => acc + item.quantity, 0)
  const investedCapital = inventory.reduce((acc, item) => acc + item.quantity * item.packageCost, 0)

  const now = new Date()
  const sixtyDays = new Date()
  sixtyDays.setDate(now.getDate() + 60)

  const expiringItems = inventory.filter((i) => {
    if (!i.expirationDate || i.quantity <= 0) return false
    const exp = new Date(i.expirationDate)
    return exp <= sixtyDays && exp >= now
  })

  const expiredItems = inventory.filter((i) => {
    if (!i.expirationDate || i.quantity <= 0) return false
    const exp = new Date(i.expirationDate)
    return exp < now
  })

  return (
    <div className="space-y-8 animate-fade-in uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">DASHBOARD NUVIA</h1>
        <p className="text-muted-foreground mt-1">VISÃO GERAL DA GESTÃO DE RH E ESTOQUE CLÍNICO.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md bg-stone-50"
          onClick={() => navigate('/admin/rh')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SÓCIOS</CardTitle>
            <Briefcase className="h-4 w-4 text-nuvia-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nuvia-navy">{countSocios}</div>
            <p className="text-xs text-muted-foreground mt-1">SÓCIOS ATIVOS NA CLÍNICA</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md bg-stone-50"
          onClick={() => navigate('/admin/rh')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DENTISTAS</CardTitle>
            <Stethoscope className="h-4 w-4 text-nuvia-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nuvia-navy">{countDentistas}</div>
            <p className="text-xs text-muted-foreground mt-1">PROFISSIONAIS CLÍNICOS</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md bg-stone-50"
          onClick={() => navigate('/admin/rh')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COLABORADORES</CardTitle>
            <UserCheck className="h-4 w-4 text-nuvia-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nuvia-navy">{countColaboradores}</div>
            <p className="text-xs text-muted-foreground mt-1">EQUIPE DE APOIO E GESTÃO</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md bg-primary/5 border-primary/20"
          onClick={() => navigate('/admin/rh')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TIME TOTAL</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalTeam}</div>
            <p className="text-xs text-muted-foreground mt-1">TOTAL DE PESSOAS ATIVAS</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
          onClick={() => navigate('/admin/rh')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ONBOARDING PENDENTE</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOnboarding}</div>
            <p className="text-xs text-muted-foreground mt-1">PROCESSOS EM ANDAMENTO (RH)</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md',
            lowStockItems > 0 ? 'border-destructive/30 bg-destructive/5' : '',
          )}
          onClick={() => navigate('/admin/estoque')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AVISOS DE ESTOQUE</CardTitle>
            <TrendingDown
              className={cn('h-4 w-4', lowStockItems > 0 ? 'text-destructive' : 'text-emerald-500')}
            />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', lowStockItems > 0 ? 'text-destructive' : '')}>
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ITENS PRECISAM DE REPOSIÇÃO</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
          onClick={() => navigate('/admin/estoque')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CAPITAL INVESTIDO</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(investedCapital)}</div>
            <p className="text-xs text-muted-foreground mt-1">VALOR EM ESTOQUE CLÍNICO</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
          onClick={() => navigate('/admin/estoque')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITENS EM ESTOQUE</CardTitle>
            <Boxes className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsInStock}</div>
            <p className="text-xs text-muted-foreground mt-1">TOTAL DE UNIDADES DISPONÍVEIS</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> CENTRAL DE ALERTAS OPERACIONAIS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/admin/rh')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <Alert
                  variant={idx === 0 ? 'destructive' : 'default'}
                  className={cn(idx !== 0 && 'border-amber-200 bg-amber-50 text-amber-900')}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{idx === 0 ? 'URGENTE' : 'ATENÇÃO'}</AlertTitle>
                  <AlertDescription className="uppercase">{alert}</AlertDescription>
                </Alert>
              </div>
            ))}

            {expiredItems.length > 0 && (
              <div
                onClick={() => navigate('/admin/estoque')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>PRODUTOS VENCIDOS</AlertTitle>
                  <AlertDescription>
                    EXISTEM {expiredItems.length} ITENS VENCIDOS NO ESTOQUE. REALIZE A BAIXA
                    IMEDIATAMENTE.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {expiringItems.length > 0 && (
              <div
                onClick={() => navigate('/admin/estoque')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <Alert
                  variant="destructive"
                  className="border-orange-500 text-orange-700 bg-orange-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>ATENÇÃO: VENCIMENTO PRÓXIMO</AlertTitle>
                  <AlertDescription>
                    EXISTEM {expiringItems.length} PRODUTOS QUE VENCERÃO NOS PRÓXIMOS 60 DIAS.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {lowStockItems > 0 && (
              <div
                onClick={() => navigate('/admin/estoque')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>ESTOQUE CRÍTICO</AlertTitle>
                  <AlertDescription>
                    EXISTEM {lowStockItems} ITENS COM ESTOQUE ABAIXO DO LIMITE NO INVENTÁRIO
                    CLÍNICO. REPOSIÇÃO NECESSÁRIA.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {alerts.length === 0 &&
              expiredItems.length === 0 &&
              expiringItems.length === 0 &&
              lowStockItems === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                  NENHUM ALERTA NO MOMENTO. TUDO EM ORDEM.
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AÇÕES RÁPIDAS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/rh" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> GESTÃO DE EQUIPE (RH)
              </Button>
            </Link>
            <Link to="/admin/estoque" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" /> ATUALIZAR ESTOQUE
              </Button>
            </Link>
            <Link to="/admin/rh" className="w-full block">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> ROTINAS E MANUAIS
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
