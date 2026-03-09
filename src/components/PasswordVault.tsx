import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

const mockVault = [
  { id: 1, service: 'Sistema Nuvia (Admin)', username: 'admin@nuvia.com.br', pass: 'Nuvia@2026!' },
  { id: 2, service: 'Portal de Exames', username: 'contato@nuvia.com.br', pass: 'Exames123#' },
  { id: 3, service: 'Fornecedor Dental', username: 'compras@nuvia.com.br', pass: 'Dental!Buy26' },
]

export function PasswordVault() {
  const [visibleRows, setVisibleRows] = useState<Record<number, boolean>>({})
  const [copied, setCopied] = useState<number | null>(null)

  const toggleVisibility = (id: number) => {
    setVisibleRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço/Plataforma</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Senha</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVault.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.service}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell className="font-mono text-sm">
                {visibleRows[item.id] ? item.pass : '••••••••••••'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => toggleVisibility(item.id)}>
                  {visibleRows[item.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(item.id, item.pass)}>
                  {copied === item.id ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
