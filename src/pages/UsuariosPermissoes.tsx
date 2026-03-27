import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, UserCircle, Edit, Trash2, Search, Users, ShieldAlert, FileText } from 'lucide-react'
import { userService } from '@/services/userService'
import { useAuth } from '@/hooks/use-auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UserFormModal } from '@/components/usuarios/UserFormModal'
import { MyProfileModal } from '@/components/usuarios/MyProfileModal'
import { ValidationReportModal } from '@/components/usuarios/ValidationReportModal'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/stores/main'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function UsuariosPermissoes() {
  const { isAdmin } = useAppStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const [profiles, setProfiles] = useState<any[]>([])
  const [cargos, setCargos] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pData, cData, dData] = await Promise.all([
        userService.fetchProfiles(),
        userService.fetchCargos(),
        userService.fetchDepartamentos(),
      ])

      const validProfiles = (pData || []).filter((p) => p != null)

      setProfiles(validProfiles)
      setCargos(cData || [])
      setDepartamentos(dData || [])
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredProfiles = useMemo(() => {
    return profiles.filter(
      (p) =>
        p?.nome?.toLowerCase().includes(search.toLowerCase()) ||
        p?.email?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [profiles, search])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await userService.deleteUser(deleteId)
      toast({ title: 'Sucesso', description: 'Usuário removido com sucesso.' })
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover usuário.',
        variant: 'destructive',
      })
    } finally {
      setDeleteId(null)
    }
  }

  const myProfile = useMemo(() => {
    if (!user || !user.email) return null

    const matchedProfile =
      profiles.find((p) => p?.id === user.id) || profiles.find((p) => p?.email === user.email)

    if (matchedProfile) {
      return matchedProfile
    }

    return {
      id: user.id,
      email: user.email,
      nome: user.user_metadata?.name || '',
      telefone: '',
      pix_tipo: '',
      pix_numero: '',
      pix_banco: '',
      data_admissao: '',
      cargo_id: 'none',
      departamento_id: 'none',
    }
  }, [profiles, user])

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" /> USUÁRIOS E PERMISSÕES
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold">
            GERENCIE OS COLABORADORES, CARGOS E NÍVEIS DE ACESSO AO SISTEMA.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <Button
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 shadow-sm font-bold tracking-widest"
            onClick={() => setProfileOpen(true)}
            disabled={!myProfile}
          >
            <UserCircle className="h-4 w-4 mr-2" /> MEU PERFIL
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 shadow-sm font-bold tracking-widest"
                onClick={() => setReportOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" /> RELATÓRIO VALIDAÇÃO
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-bold tracking-widest"
                onClick={() => {
                  setSelectedUser(null)
                  setFormOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> ADICIONAR USUÁRIO
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR USUÁRIO POR NOME OU EMAIL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 uppercase font-bold"
          />
        </div>
      </div>

      <Card className="shadow-sm border-muted rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100/50 hover:bg-slate-100/50">
              <TableHead className="font-black text-slate-500 tracking-widest text-xs">
                NOME / EMAIL
              </TableHead>
              <TableHead className="font-black text-slate-500 tracking-widest text-xs">
                CARGO / DEPTO
              </TableHead>
              <TableHead className="font-black text-slate-500 tracking-widest text-xs">
                DATA ADMISSÃO
              </TableHead>
              <TableHead className="font-black text-slate-500 tracking-widest text-xs">
                STATUS
              </TableHead>
              {isAdmin && (
                <TableHead className="font-black text-slate-500 tracking-widest text-xs text-right">
                  AÇÕES
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center text-muted-foreground font-bold tracking-widest">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                    CARREGANDO USUÁRIOS...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-16 text-muted-foreground border-dashed"
                >
                  <Users className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <p className="font-bold text-sm tracking-widest">NENHUM USUÁRIO ENCONTRADO.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm border border-primary/20 shrink-0">
                        {p?.nome?.charAt(0).toUpperCase() ||
                          p?.email?.charAt(0).toUpperCase() ||
                          'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-slate-800 tracking-wide uppercase">
                          {p?.nome || 'SEM NOME'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 lowercase tracking-wider">
                          {p?.email || 'sem e-mail'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-middle">
                    <div className="flex flex-col gap-1.5 items-start">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-black tracking-widest"
                      >
                        {p?.cargos?.nome || 'SEM CARGO'}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {p?.departamentos?.nome || 'SEM DEPTO'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-middle">
                    <span className="text-xs font-bold text-slate-600">
                      {p?.data_admissao
                        ? format(new Date(p.data_admissao), 'dd/MM/yyyy', { locale: ptBR })
                        : 'N/I'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 align-middle">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-black text-[10px] tracking-widest shadow-none">
                      {p?.status || 'ATIVO'}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-slate-500 hover:text-nuvia-navy font-bold text-xs"
                          onClick={() => {
                            setSelectedUser(p)
                            setFormOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1.5" /> EDITAR
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(p.id)}
                          disabled={p?.id === user?.id || p?.email === 'master@nuvia.com.br'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <UserFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        cargos={cargos}
        departamentos={departamentos}
        onSuccess={fetchData}
      />

      <ValidationReportModal open={reportOpen} onOpenChange={setReportOpen} />

      {myProfile && (
        <MyProfileModal
          open={profileOpen}
          onOpenChange={setProfileOpen}
          profile={myProfile}
          cargos={cargos}
          departamentos={departamentos}
          onSuccess={fetchData}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
        <AlertDialogContent className="max-w-sm uppercase">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-black tracking-widest">
              <ShieldAlert className="w-5 h-5" /> EXCLUIR USUÁRIO
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-slate-500 mt-2">
              TEM CERTEZA QUE DESEJA EXCLUIR ESTE USUÁRIO? ESSA AÇÃO REMOVERÁ SEU ACESSO E TODOS OS
              DADOS VINCULADOS DEFINITIVAMENTE.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="font-bold tracking-widest text-xs h-10">
              CANCELAR
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-black tracking-widest text-xs h-10"
            >
              SIM, EXCLUIR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
