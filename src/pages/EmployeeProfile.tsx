import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import useAppStore, { EmployeeDocument } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
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
  Clock,
  CheckCircle,
  AlertTriangle,
  Gift,
  Upload,
  Download,
  Paperclip,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditEmployeeDialog } from '@/components/rh/EditEmployeeDialog'
import { getVacationStatus } from '@/lib/vacation'

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    employees,
    deleteEmployee,
    updateEmployeeStatus,
    employeeDocuments,
    addEmployeeDocument,
    removeEmployeeDocument,
  } = useAppStore()
  const employee = employees.find((e) => e.id === id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTab, setEditTab] = useState('dados')
  const fileRef = useRef<HTMLInputElement>(null)

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && employee.id) {
      await addEmployeeDocument(employee.id, file.name, file)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDownload = (doc: EmployeeDocument) => {
    const link = document.createElement('a')
    link.href = doc.file_path
    link.download = doc.file_name
    link.click()
  }

  const docs = employeeDocuments.filter((d) => d.employee_id === employee.id)
  const vStatus = getVacationStatus(employee.vacationDueDate)

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
                <div className="flex flex-wrap gap-2">
                  {(employee.teamCategory || ['COLABORADOR']).map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="border-primary/50 text-primary bg-primary/5"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Briefcase className="h-4 w-4" /> {employee.role} • {employee.department}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {employee.user_id ? (
            <Button
              variant="outline"
              className="text-stone-700 border-stone-500 hover:bg-stone-100 hover:text-stone-900"
              onClick={handleResetAccess}
            >
              <Key className="h-4 w-4 mr-2" /> REDEFINIR ACESSO
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                setEditTab('seguranca')
                setIsEditOpen(true)
              }}
            >
              <Key className="h-4 w-4 mr-2" /> GERAR ACESSO
            </Button>
          )}
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
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
            <CardTitle className="text-primary text-lg">DADOS CADASTRAIS</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary/60 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-muted-foreground">EMAIL PROFISSIONAL</p>
                <p className="text-sm font-medium text-foreground truncate lowercase">
                  {employee.email || 'NÃO INFORMADO'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-primary/60 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">TELEFONE</p>
                <p className="text-sm font-medium text-foreground">
                  {employee.phone || 'NÃO INFORMADO'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary/60 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">DATA DE ADMISSÃO</p>
                <p className="text-sm font-medium text-foreground">
                  {employee.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString('pt-BR')
                    : 'NÃO INFORMADA'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary/60 bg-primary/10 p-1.5 rounded-full shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">SALÁRIO BASE</p>
                <p className="text-sm font-medium text-foreground">
                  {employee.salary || 'NÃO INFORMADO'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`md:col-span-1 border-2 shadow-md ${vStatus.colorClass} transition-colors`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" /> VENCIMENTO DE FÉRIAS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-white/20">
              {vStatus.status === 'ok' && (
                <CheckCircle className={`h-8 w-8 shrink-0 ${vStatus.iconColor}`} />
              )}
              {(vStatus.status === 'warning' || vStatus.status === 'critical') && (
                <AlertTriangle className={`h-8 w-8 shrink-0 ${vStatus.iconColor}`} />
              )}
              {vStatus.status === 'unknown' && (
                <Clock className={`h-8 w-8 shrink-0 ${vStatus.iconColor}`} />
              )}
              <div>
                <p className="font-bold text-lg leading-tight">{vStatus.phrase}</p>
                {vStatus.status !== 'unknown' && (
                  <p className="text-sm opacity-80 font-medium mt-1">
                    DIAS ATÉ O VENCIMENTO DAS FÉRIAS: {vStatus.days}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/60 p-4 rounded-xl border border-white/20 text-center">
              <p className="text-xs font-bold opacity-80 mb-1">DATA DE VENCIMENTO DO PERÍODO</p>
              <p className="text-xl font-black">
                {employee.vacationDueDate
                  ? new Date(employee.vacationDueDate).toLocaleDateString('pt-BR')
                  : 'NÃO CADASTRADO'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-nuvia-gold/30 shadow-md">
          <CardHeader className="bg-nuvia-gold/10 pb-4 border-b border-nuvia-gold/20">
            <CardTitle className="text-nuvia-gold flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5" /> BONIFICAÇÃO
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {employee.bonusType ? (
              <>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">TIPO DE BONIFICAÇÃO</p>
                  <p className="text-sm font-black text-foreground mt-0.5">{employee.bonusType}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">VENCIMENTO / CICLO</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {employee.bonusDueDate
                      ? new Date(employee.bonusDueDate).toLocaleDateString('pt-BR')
                      : 'NÃO DEFINIDO'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1">REGRAS APLICÁVEIS</p>
                  <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md border min-h-[60px] whitespace-pre-wrap">
                    {employee.bonusRules || 'NENHUMA REGRA ESPECÍFICA DEFINIDA.'}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground opacity-70">
                <Gift className="h-10 w-10 mb-2" />
                <p className="text-sm font-bold">NENHUMA BONIFICAÇÃO ATIVA</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-nuvia-navy" /> DOCUMENTOS DA CONTRATAÇÃO / ANEXOS
              </CardTitle>
              <CardDescription className="mt-1 uppercase text-xs">
                GERENCIE ARQUIVOS E DOCUMENTOS VINCULADOS A ESTE COLABORADOR.
              </CardDescription>
            </div>
            <div>
              <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
              <Button onClick={() => fileRef.current?.click()} size="sm" className="uppercase">
                <Upload className="h-4 w-4 mr-2" /> ANEXAR
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {docs.length === 0 ? (
              <p className="text-sm text-muted-foreground uppercase text-center py-8 border border-dashed rounded-md bg-card/50">
                NENHUM DOCUMENTO ANEXADO ATÉ O MOMENTO.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className="font-medium text-sm text-foreground truncate uppercase"
                          title={doc.file_name}
                        >
                          {doc.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('REMOVER ESTE DOCUMENTO?')) removeEmployeeDocument(doc.id)
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-nuvia-navy" /> RELAÇÕES E ACORDOS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employee.contractDetails ? (
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed p-4 bg-muted/30 rounded-md border min-h-[150px]">
                {employee.contractDetails}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground uppercase text-center py-10 border border-dashed rounded-md bg-card/50">
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
