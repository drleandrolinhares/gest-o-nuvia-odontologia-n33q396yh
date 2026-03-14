import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  ShieldAlert,
  Key,
  Link as LinkIcon,
  User,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { AccessItem } from '@/stores/main'

export function AcessoRapido({ item }: { item: AccessItem }) {
  const [showPass, setShowPass] = useState(false)

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt)
    toast({ title: 'COPIADO', description: 'ENVIADO PARA A ÁREA DE TRANSFERÊNCIA.' })
  }

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary text-lg flex items-center gap-2">
          <Key className="h-5 w-5" /> ACESSO RÁPIDO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <Button
          className="w-full h-12 text-base font-bold shadow-md hover:scale-[1.02] transition-transform bg-[#0A192F] hover:bg-[#112240] text-white"
          onClick={() => window.open(item.url, '_blank')}
        >
          <ExternalLink className="mr-2 h-5 w-5" /> ACESSAR SISTEMA
        </Button>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <LinkIcon className="h-3 w-3" /> URL DE ACESSO
            </label>
            <div className="flex gap-2">
              <Input
                value={item.url}
                readOnly
                className="bg-muted/30 font-medium text-xs lowercase"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(item.url)}
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <User className="h-3 w-3" /> USUÁRIO / LOGIN
            </label>
            <div className="flex gap-2">
              <Input
                value={item.login}
                readOnly
                className="bg-muted/30 font-bold text-sm lowercase"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(item.login)}
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Key className="h-3 w-3" /> SENHA
            </label>
            <div className="flex gap-2">
              <Input
                type={showPass ? 'text' : 'password'}
                value={item.pass}
                readOnly
                className="bg-muted/30 font-mono tracking-widest text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPass(!showPass)}
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(item.pass)}
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {item.security_note && (
          <div className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-200 flex gap-3 mt-2 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-red-800 uppercase mb-0.5">
                ATENÇÃO: ACESSO RESTRITO
              </p>
              <p className="text-xs font-semibold leading-snug uppercase">{item.security_note}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
