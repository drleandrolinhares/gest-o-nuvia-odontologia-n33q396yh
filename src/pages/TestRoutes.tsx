import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, XCircle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react'
import useAppStore from '@/stores/main'

const NEW_ROUTES = [
  { path: '/dashboard', module: 'DASHBOARD' },
  { path: '/agenda', module: 'AGENDA' },
  { path: '/chat', module: 'MENSAGENS' },
  { path: '/sac', module: 'SAC' },
  { path: '/negociacao', module: 'NEGOCIAÇÃO' },
  { path: '/gestao-fiscal', module: 'GESTÃO FISCAL' },
  { path: '/acessos', module: 'ACESSOS' },
  { path: '/estoque', module: 'ESTOQUE' },
  { path: '/kpis', module: 'KPIS' },
  { path: '/rh', module: 'RH' },
  { path: '/rh/escala', module: 'ESCALA DE TRABALHO' },
  { path: '/precificacao', adminOnly: true },
  { path: '/segmentacao-agenda', module: 'SEGMENTAÇÃO' },
  { path: '/configuracoes', module: 'CONFIGURAÇÕES' },
  { path: '/permissoes', adminOnly: true },
  { path: '/logs', module: 'LOGS' },
  { path: '/hub/mural', free: true },
  { path: '/hub/feedback', free: true },
  { path: '/hub/performance', free: true },
  { path: '/hub/ranking', free: true },
]

export default function TestRoutes() {
  const { rolePermissions, isAdmin } = useAppStore()

  const ROLES_TO_CHECK = ['MASTER', 'SÓCIO', 'DENTISTA', 'COLABORADOR']

  const evaluateAccess = (route: any, roleName: string) => {
    if (roleName === 'MASTER' || roleName === 'SÓCIO') return true
    if (route.free) return true
    if (route.adminOnly) {
      return false
    }
    if (route.module) {
      const perm = rolePermissions.find(
        (p) => p.role.toUpperCase() === roleName && p.module === route.module,
      )
      return perm ? perm.can_view : false
    }
    return false
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] py-20 uppercase animate-fade-in">
        <ShieldAlert className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-black text-muted-foreground tracking-widest">
          Acesso Restrito
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Esta página é exclusiva para administradores.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-white" /> AUDITORIA DE ROTAS
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            VALIDE O MAPEAMENTO E AS PERMISSÕES DE CADA PERFIL
          </p>
        </div>
      </div>

      <Card className="mb-6 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 text-sm font-black flex items-center gap-2">
            <XCircle className="w-5 h-5" /> VALIDAÇÃO DE ROTAS ANTIGAS (/ADMIN/*)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-700 font-bold leading-relaxed">
            TODAS AS ROTAS COM O PREFIXO "/ADMIN" FORAM REMOVIDAS DO SISTEMA. QUALQUER TENTATIVA DE
            ACESSO A ESSAS ROTAS RESULTARÁ NO COMPONENTE "NOT FOUND" (404). O ACESSO É{' '}
            <span className="font-black underline">100% NEGADO</span> PARA TODOS OS PERFIS.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {NEW_ROUTES.map((route) => {
          const oldRoute = `/admin${route.path === '/' ? '' : route.path}`

          return (
            <Card key={route.path} className="overflow-hidden shadow-sm">
              <CardHeader className="bg-slate-50 border-b py-3 px-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black tracking-widest text-nuvia-navy flex items-center gap-2">
                    ROTA ATIVA <ArrowRight className="w-4 h-4 text-emerald-600" /> {route.path}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-bold mt-1 line-through opacity-70">
                    ROTA ANTIGA: {oldRoute}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest px-3 py-1 bg-slate-200 text-slate-600 rounded">
                    {route.module
                      ? `MÓDULO: ${route.module}`
                      : route.adminOnly
                        ? 'ADMINISTRADOR'
                        : 'ACESSO LIVRE'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ROLES_TO_CHECK.map((role) => {
                    const hasAccess = evaluateAccess(route, role)
                    return (
                      <div
                        key={role}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${hasAccess ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                      >
                        <span
                          className={`text-xs font-black tracking-widest mb-2 ${hasAccess ? 'text-emerald-800' : 'text-red-800'}`}
                        >
                          {role}
                        </span>
                        {hasAccess ? (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-[10px] font-bold">PERMITIDO</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span className="text-[10px] font-bold">NEGADO</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
