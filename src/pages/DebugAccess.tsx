import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, User } from 'lucide-react'

export default function DebugAccess() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Activity className="h-7 w-7 text-white" /> DIAGNÓSTICO DE ACESSO
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ANÁLISE DE SESSÃO ATIVA
          </p>
        </div>
      </div>

      <Card className="shadow-sm max-w-2xl">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> INFORMAÇÕES DE SESSÃO DO SUPABASE
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
        </CardContent>
      </Card>
    </div>
  )
}
