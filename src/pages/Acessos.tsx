import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, EyeOff, Copy, Check, Plus, Trash2, Shield } from 'lucide-react'

export default function Acessos() {
  const { acessos, addAccess, removeAccess, isAdmin } = useAppStore()
  const [open, setOpen] = useState(false)
  const [visibleRows, setVisibleRows] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [instructions, setInstructions] = useState('')

  const sortedAcessos = [...acessos].sort((a, b) => a.platform.localeCompare(b.platform))

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (platform && login && pass) {
      addAccess({ platform, url, login, pass, instructions })
      setOpen(false)
      setPlatform('')
      setUrl('')
      setLogin('')
      setPass('')
      setInstructions('')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">
            GERENCIADOR DE ACESSOS
          </h1>
          <p className="text-muted-foreground mt-1">
            ARMAZENE E GERENCIE CREDENCIAIS E INSTRUÇÕES DE SISTEMAS PARCEIROS DE FORMA SEGURA.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> NOVO ACESSO
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-muted overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground">
                PLATAFORMA / URL
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">LOGIN</TableHead>
              <TableHead className="font-semibold text-muted-foreground">SENHA</TableHead>
              <TableHead className="font-semibold text-muted-foreground">INSTRUÇÕES</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAcessos.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/10">
                <TableCell>
                  <div className="font-bold text-primary">{item.platform}</div>
                  <div className="text-xs text-muted-foreground lowercase">{item.url}</div>
                </TableCell>
                <TableCell className="font-medium">{item.login}</TableCell>
                <TableCell className="font-mono text-sm tracking-widest bg-muted/50 rounded px-2 py-1 inline-block mt-2 lowercase">
                  {visibleRows[item.id] ? item.pass : '••••••••••••'}
                </TableCell>
                <TableCell
                  className="text-sm text-muted-foreground max-w-[200px] truncate"
                  title={item.instructions}
                >
                  {item.instructions || '-'}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setVisibleRows((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    title="VER SENHA"
                  >
                    {visibleRows[item.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(item.id, item.pass)}
                    title="COPIAR SENHA"
                  >
                    {copied === item.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAccess(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="REMOVER"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {sortedAcessos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  NENHUM ACESSO CADASTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> ADICIONAR CREDENCIAL
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                PLATAFORMA / SERVIÇO
              </label>
              <Input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
                placeholder="EX: FORNECEDOR DENTAL"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">URL DE ACESSO</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="HTTPS://..."
                className="lowercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  USUÁRIO / LOGIN
                </label>
                <Input
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="lowercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">SENHA</label>
                <Input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  type="text"
                  className="lowercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                INSTRUÇÕES DE USO (OPCIONAL)
              </label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="DETALHES IMPORTANTES..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR CREDENCIAL</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
