import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Briefcase,
  Trash2,
  CalendarDays,
  UserX,
  Key,
  FileText,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditEmployeeDialog } from '@/components/rh/EditEmployeeDialog'

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { employees, isAdmin, deleteEmployee, updateEmployeeStatus } = useAppStore()
  const employee = employees.find((e) => e.id === id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTab, setEditTab] = useState('dados')

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 uppercase">
        <h2 className="text-2xl font-bold text-nuvia-navy">COLABORADOR NÃO ENCONTRADO</h2>
        <Link to="/admin/rh">
          <Button variant="outline">VOLTAR PARA O RH</Button>
        </Link>
      </div>
    )
  }

  const isVacationNear = employee.vacationDaysTotal - employee.vacationDaysTaken < 10

  const handleDelete = () => {
    if (
      window.confirm(`TEM CERTEZA QUE DESEJA REMOVER O COLABORADOR ${employee.name.toUpperCase()}?`)
    ) {
      deleteEmployee(employee.id)
      navigate('/admin/rh')
    }
  }

  const handleInactivate = () => {
    if (
      window.confirm(
        `TEM CERTEZA QUE DESEJA MARCAR O COLABORADOR ${employee.name.toUpperCase()} COMO DESLIGADO?`,
      )
    ) {
      updateEmployeeStatus(employee.id, 'Desligado')
    }
  }

  const handleResetAccess = () => {
    setEditTab('seguranca')
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/rh">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
              {employee.name}
              {employee.status === 'Desligado' && (
                <Badge variant="secondary" className="bg-stone-500 text-white hover:bg-stone-600">
                  DESLIGADO DA EMPRESA
                </Badge>
              )}
              {employee.status !== 'Desligado' && (
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">
                  {employee.teamCategory || 'COLABORADOR'}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Briefcase className="h-4 w-4" /> {employee.role} • {employee.department}
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              variant="outline"
              className="text-stone-700 border-stone-500 hover:bg-stone-100 hover:text-stone-900"
              onClick={handleResetAccess}
            >
              <Key className="h-4 w-4 mr-2" /> REDEFINIR ACESSO
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                setEditTab('dados')
                setIsEditOpen(true)
              }}
            >
              EDITAR DADOS
            </Button>
            {employee.status !== 'Desligado' && (
              <Button
                variant="outline"
                className="text-stone-700 border-stone-500 hover:bg-stone-100 hover:text-stone-900"
                onClick={handleInactivate}
              >
                <UserX className="h-4 w-4 mr-2" /> DESLIGAR
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> REMOVER
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>DADOS CADASTRAIS</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium">EMAIL PROFISSIONAL</p>
                <p className="text-sm text-muted-foreground lowercase">
                  {employee.email || 'NÃO INFORMADO'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium">TELEFONE</p>
                <p className="text-sm text-muted-foreground">{employee.phone || 'NÃO INFORMADO'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium">DATA DE ADMISSÃO</p>
                <p className="text-sm text-muted-foreground">
                  {employee.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString('pt-BR')
                    : 'NÃO INFORMADA'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary/40 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium">SALÁRIO BASE</p>
                <p className="text-sm text-muted-foreground">
                  {employee.salary || 'NÃO INFORMADO'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <CalendarDays className="h-8 w-8 text-amber-500/40 bg-amber-500/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium">VENCIMENTO DE FÉRIAS</p>
                <p className="text-sm text-muted-foreground">
                  {employee.vacationDueDate
                    ? new Date(employee.vacationDueDate).toLocaleDateString('pt-BR')
                    : 'NÃO CADASTRADO'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CONTROLE DE FÉRIAS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>GOZADOS: {employee.vacationDaysTaken} DIAS</span>
                <span className="text-muted-foreground">
                  TOTAL: {employee.vacationDaysTotal} DIAS
                </span>
              </div>
              <Progress
                value={(employee.vacationDaysTaken / employee.vacationDaysTotal) * 100}
                className="h-2"
              />
            </div>

            {isVacationNear && employee.status !== 'Desligado' && (
              <Alert variant="destructive" className="bg-destructive/5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>ALERTA RH</AlertTitle>
                <AlertDescription>
                  O PERÍODO AQUISITIVO DE FÉRIAS ESTÁ PRÓXIMO DO VENCIMENTO OU DO LIMITE.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-nuvia-navy" /> RELAÇÕES E ACORDOS COM A EMPRESA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employee.contractDetails ? (
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed p-4 bg-muted/30 rounded-md border">
                {employee.contractDetails}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground uppercase text-center py-6 border border-dashed rounded-md bg-card/50">
                NENHUMA INFORMAÇÃO SOBRE ACORDOS REGISTRADA PARA ESTE PERFIL.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <EditEmployeeDialog
        employee={employee}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        defaultTab={editTab}
      />
    </div>
  )
}
