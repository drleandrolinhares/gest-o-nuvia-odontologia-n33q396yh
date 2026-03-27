import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Activity,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Loader2,
  Database,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type TestResults = {
  isCeo: boolean
  masterDeleted: boolean
  menus: {
    nome: string
    view: boolean
    edit: boolean
    delete: boolean
  }[]
}

export default function DebugAccess() {
  const { user } = useAuth()
  const { can } = useAppStore()

  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setResults(null)

    try {
      const report: TestResults = {
        menus: [],
        masterDeleted: false,
        isCeo: false,
      }

      // 1. Validar se o usuário logado é o CEO
      report.isCeo = user?.email === 'drleandrolinhares@gmail.com'

      // 2. Verificar no banco se a conta master fictícia foi removida
      const { data: masterProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'master@nuvia.com.br')
        .maybeSingle()
      report.masterDeleted = !masterProfile

      // 3. Checar permissões em todos os menus do sistema (CRUD)
      const { data: menus } = await supabase.from('menus_sistema').select('nome').order('ordem')

      if (menus) {
        report.menus = menus.map((m) => ({
          nome: m.nome,
          view: can(m.nome, 'view'),
          edit: can(m.nome, 'edit'),
          delete: can(m.nome, 'delete'),
        }))
      }

      // Pequeno delay para efeito visual da bateria de testes
      await new Promise((r) => setTimeout(r, 2000))
      setResults(report)
    } catch (err) {
      console.error('Erro ao executar testes E2E', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Activity className="h-7 w-7 text-white" /> DIAGNÓSTICO DE ACESSO
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ANÁLISE DE SESSÃO ATIVA E VALIDAÇÃO DE PERMISSÕES (E2E)
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> INFORMAÇÕES DE SESSÃO DO SUPABASE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-widest">
                ID DO AUTH (SUPABASE)
              </p>
              <p className="text-sm font-medium break-all mt-1">{user?.id || 'NÃO ENCONTRADO'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-widest">
                E-MAIL LOGADO
              </p>
              <p className="text-sm font-medium lowercase mt-1">
                {user?.email || 'NÃO ENCONTRADO'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-widest">
                NÍVEL DE PRIVILÉGIO (ROLE)
              </p>
              <div className="flex items-center gap-2 mt-2">
                {user?.email === 'drleandrolinhares@gmail.com' ? (
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded text-xs font-black tracking-widest flex items-center gap-1.5 w-fit border border-emerald-200 shadow-sm">
                    <ShieldCheck className="w-4 h-4" /> MASTER / CEO
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded text-xs font-black tracking-widest w-fit border border-slate-200">
                    USUÁRIO PADRÃO
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/20 bg-white">
          <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-primary tracking-widest">
              <Database className="h-4 w-4" /> BATERIA DE TESTES DE SEGURANÇA
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-600 mt-1">
              EXECUTE A VALIDAÇÃO AUTOMATIZADA PARA CONFIRMAR O ACESSO TOTAL.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[250px]">
            {!results && !isRunning && (
              <div className="space-y-5 w-full">
                <ShieldCheck className="w-14 h-14 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto leading-relaxed">
                  CLIQUE ABAIXO PARA INICIAR A VALIDAÇÃO DE TODAS AS PERMISSÕES E GARANTIR QUE O
                  USUÁRIO FICTÍCIO FOI REMOVIDO DA BASE.
                </p>
                <Button
                  onClick={runTests}
                  className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest w-full h-12 shadow-md transition-transform hover:scale-[1.02]"
                >
                  <PlayCircle className="w-5 h-5 mr-2" /> EXECUTAR TESTES AGORA
                </Button>
              </div>
            )}

            {isRunning && (
              <div className="space-y-4 flex flex-col items-center justify-center py-6">
                <Loader2 className="w-14 h-14 text-primary animate-spin" />
                <p className="text-xs font-black text-primary animate-pulse tracking-widest mt-2">
                  VALIDANDO PERMISSÕES NO BANCO DE DADOS...
                </p>
              </div>
            )}

            {results && !isRunning && (
              <div className="w-full space-y-4 text-left animate-fade-in">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border shadow-sm">
                  <span className="text-xs font-black text-slate-700 tracking-widest">
                    1. CONTA CEO (MASTER) RECONHECIDA?
                  </span>
                  {results.isCeo ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 drop-shadow-sm" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border shadow-sm">
                  <span className="text-xs font-black text-slate-700 tracking-widest">
                    2. CONTA FICTÍCIA (MASTER@...) REMOVIDA?
                  </span>
                  {results.masterDeleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 drop-shadow-sm" />
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-black text-slate-500 tracking-widest mb-3 border-b pb-1">
                    3. ACESSO AOS MÓDULOS (CRUD)
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {results.menus.map((m, i) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm gap-2 hover:border-primary/30 transition-colors"
                        >
                          <span className="text-[11px] font-black tracking-widest text-nuvia-navy">
                            {m.nome}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-[9px] font-black tracking-widest px-2 py-1 rounded flex items-center gap-1 shadow-sm',
                                m.view
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                            >
                              {m.view ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}{' '}
                              LER
                            </span>
                            <span
                              className={cn(
                                'text-[9px] font-black tracking-widest px-2 py-1 rounded flex items-center gap-1 shadow-sm',
                                m.edit
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                            >
                              {m.edit ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}{' '}
                              CRIAR/EDITAR
                            </span>
                            <span
                              className={cn(
                                'text-[9px] font-black tracking-widest px-2 py-1 rounded flex items-center gap-1 shadow-sm',
                                m.delete
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                            >
                              {m.delete ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}{' '}
                              DELETAR
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t">
                  <Button
                    onClick={() => setResults(null)}
                    variant="outline"
                    className="w-full font-black tracking-widest text-xs h-11 border-slate-300 hover:bg-slate-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> REPETIR TESTES
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
