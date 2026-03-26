import { useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, ShieldAlert, Activity, User, Key, LayoutList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DebugAccess() {
  const { user } = useAuth()
  const { employees, rolePermissions, isAdmin, isMaster, can } = useAppStore()

  const me = useMemo(() => employees.find((e) => e.user_id === user?.id), [employees, user?.id])

  const myPermissions = useMemo(() => {
    if (!me) return []
    return rolePermissions.filter((p) => p.role.toUpperCase() === me.role.toUpperCase())
  }, [rolePermissions, me])

  const navigationSections = [
    {
      title: 'NUVIA HUB',
      items: [
        { name: 'MURAL DE AVISOS', href: '/hub/mural', free: true },
        { name: 'PP & PDM', href: '/hub/feedback', free: true },
        { name: 'DESENVOLVIMENTO E PERFORMANCE', href: '/hub/performance', free: true },
        { name: 'RANKING PERFORMANCE', href: '/hub/ranking', free: true },
      ],
    },
    {
      title: 'VISÃO DIÁRIA',
      items: [
        { name: 'AGENDA', href: '/agenda', module: 'AGENDA' },
        { name: 'MENSAGENS', href: '/chat', module: 'MENSAGENS' },
        { name: 'SAC', href: '/sac', module: 'SAC' },
      ],
    },
    {
      title: 'COMERCIAL',
      items: [
        { name: 'NEGOCIAÇÃO', href: '/negociacao', module: 'NEGOCIAÇÃO' },
        { name: 'GESTÃO FISCAL', href: '/gestao-fiscal', module: 'GESTÃO FISCAL' },
      ],
    },
    {
      title: 'FINANCEIRO',
      items: [
        { name: 'CENTRAL DE ACESSOS', href: '/acessos', module: 'ACESSOS' },
        { name: 'ESTOQUE', href: '/estoque', module: 'ESTOQUE' },
      ],
    },
    {
      title: 'ADMINISTRATIVO',
      items: [
        { name: 'DASHBOARDS', href: '/dashboard', module: 'DASHBOARD' },
        { name: 'KPIS', href: '/kpis', module: 'KPIS' },
        { name: 'USUÁRIOS / RH', href: '/rh', module: 'RH' },
        { name: 'ESCALA DE TRABALHO', href: '/rh/escala', module: 'ESCALA DE TRABALHO' },
        { name: 'PRECIFICAÇÃO', href: '/precificacao', adminOnly: true },
        { name: 'SEGMENTAÇÃO DA AGENDA', href: '/segmentacao-agenda', module: 'SEGMENTAÇÃO' },
      ],
    },
    {
      title: 'SISTEMA',
      items: [
        { name: 'PERMISSÕES', href: '/permissoes', adminOnly: true },
        { name: 'CONFIGURAÇÕES', href: '/configuracoes', module: 'CONFIGURAÇÕES' },
        { name: 'LOGS', href: '/logs', module: 'LOGS' },
        { name: 'AUDITORIA DE ROTAS', href: '/auditoria-rotas', adminOnly: true },
      ],
    },
  ]

  const allItems = navigationSections.flatMap((s) =>
    s.items.map((i) => ({ ...i, section: s.title })),
  )

  const isUserMaster = me?.teamCategory?.includes('MASTER')
  const isUserAdmin =
    !!me &&
    (me.role.toLowerCase().includes('admin') ||
      me.role.toLowerCase().includes('diretor') ||
      me.teamCategory?.includes('ADMIN') ||
      me.teamCategory?.includes('DIRETORIA'))
  const isGod = isUserMaster || isUserAdmin

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Activity className="h-7 w-7 text-white" /> DIAGNÓSTICO DE ACESSO
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ANÁLISE DE SESSÃO, CARGOS E PERMISSÕES RENDERIZADAS
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> (1) USUÁRIO LOGADO E (2) ROLE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground">ID DO AUTH (SUPABASE)</p>
              <p className="text-sm font-medium break-all">{user?.id || 'NÃO ENCONTRADO'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground">E-MAIL</p>
              <p className="text-sm font-medium lowercase">{user?.email || 'NÃO ENCONTRADO'}</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-muted-foreground">NOME NO SISTEMA</p>
              <p className="text-base font-black">{me?.name || 'NÃO VINCULADO'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs font-bold text-muted-foreground">CARGO (ROLE)</p>
                <p className="text-sm font-black text-primary">{me?.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">CATEGORIA(S)</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {me?.teamCategory?.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px]">
                      {c}
                    </Badge>
                  ))}
                  {!me?.teamCategory?.length && <span className="text-sm">N/A</span>}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground">isAdmin (Store)</p>
                <p className="text-sm font-black">{isAdmin ? 'SIM' : 'NÃO'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">isMaster (Store)</p>
                <p className="text-sm font-black">{isMaster ? 'SIM' : 'NÃO'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" /> (3) PERMISSÕES NO BANCO DE DADOS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[350px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                <TableRow>
                  <TableHead className="font-bold text-[10px]">MÓDULO</TableHead>
                  <TableHead className="font-bold text-[10px] text-center">VIEW</TableHead>
                  <TableHead className="font-bold text-[10px] text-center">CREATE</TableHead>
                  <TableHead className="font-bold text-[10px] text-center">EDIT</TableHead>
                  <TableHead className="font-bold text-[10px] text-center">DELETE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-xs font-bold text-muted-foreground"
                    >
                      NENHUMA PERMISSÃO ESPECÍFICA ENCONTRADA PARA ESTE CARGO.
                      <br /> (SE FOR ADMIN/MASTER, O ACESSO É GLOBAL)
                    </TableCell>
                  </TableRow>
                ) : (
                  myPermissions.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold text-xs">{p.module}</TableCell>
                      <TableCell className="text-center">
                        {p.can_view ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.can_create ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.can_edit ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.can_delete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <LayoutList className="h-4 w-4 text-primary" /> (4) ESPERADO VS (5) RENDERIZADO
            (SIDEBAR)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-xs">SEÇÃO</TableHead>
                <TableHead className="font-bold text-xs">MENU (ROTA)</TableHead>
                <TableHead className="font-bold text-xs text-center">REGRA NECESSÁRIA</TableHead>
                <TableHead className="font-bold text-xs text-center border-l bg-blue-50/50 text-blue-800">
                  (4) DEVERIA APARECER? (LÓGICA CRUA)
                </TableHead>
                <TableHead className="font-bold text-xs text-center bg-emerald-50/50 text-emerald-800">
                  (5) ESTÁ APARECENDO? (FUNÇÃO CAN)
                </TableHead>
                <TableHead className="font-bold text-xs text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item, idx) => {
                let shouldAppear = false
                if ('free' in item && item.free) shouldAppear = true
                else if ('adminOnly' in item && item.adminOnly) shouldAppear = isGod
                else if ('module' in item && item.module) {
                  if (isGod) shouldAppear = true
                  else {
                    shouldAppear = !!myPermissions.find((p) => p.module === item.module)?.can_view
                  }
                }

                let isAppearing = false
                if ('free' in item && item.free) isAppearing = true
                else if ('adminOnly' in item && item.adminOnly) isAppearing = isAdmin || isMaster
                else if ('module' in item && item.module) {
                  isAppearing = isAdmin || isMaster || can(item.module, 'view')
                }

                const matches = shouldAppear === isAppearing

                return (
                  <TableRow key={idx} className="hover:bg-slate-50/50">
                    <TableCell className="text-[10px] font-bold text-muted-foreground">
                      {item.section}
                    </TableCell>
                    <TableCell className="font-black text-xs text-nuvia-navy">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center text-[10px] font-semibold">
                      {'free' in item && item.free
                        ? 'ACESSO LIVRE'
                        : 'adminOnly' in item && item.adminOnly
                          ? 'SOMENTE ADMIN/MASTER'
                          : `MÓDULO: ${item.module} (VIEW)`}
                    </TableCell>
                    <TableCell className="text-center border-l bg-blue-50/10">
                      {shouldAppear ? (
                        <Badge className="bg-blue-600">SIM</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          NÃO
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center bg-emerald-50/10">
                      {isAppearing ? (
                        <Badge className="bg-emerald-600">SIM</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          NÃO
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {matches ? (
                        <div className="flex items-center justify-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold">OK</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-[10px] font-bold">DIVERGÊNCIA</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
