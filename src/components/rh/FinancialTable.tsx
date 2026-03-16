import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore, { Employee } from '@/stores/main'
import { useState, useEffect } from 'react'
import { Copy, Check, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export function FinancialTable({ employees }: { employees: Employee[] }) {
  const dentistas = employees.filter((e) => e.teamCategory?.includes('DENTISTA'))
  const cols = employees.filter((e) => !e.teamCategory?.includes('DENTISTA'))

  return (
    <div className="space-y-6 animate-fade-in-up">
      <FinancialSection title="DENTISTAS" data={dentistas} />
      <FinancialSection title="COLABORADORES" data={cols} />
    </div>
  )
}

function FinancialSection({ title, data }: { title: string; data: Employee[] }) {
  if (data.length === 0) return null

  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
      <div className="bg-nuvia-navy text-white px-4 py-2 font-semibold uppercase text-sm flex items-center justify-between">
        {title}
        <span className="text-xs font-normal opacity-80">{data.length} REGISTROS</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 uppercase text-xs">
            <TableHead className="w-[30%] font-bold">COLABORADOR</TableHead>
            <TableHead className="w-[25%] font-bold">PIX NÚMERO</TableHead>
            <TableHead className="w-[20%] font-bold">PIX TIPO</TableHead>
            <TableHead className="w-[25%] font-bold">BANCO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((emp) => (
            <FinancialRow key={emp.id} employee={emp} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function FinancialRow({ employee }: { employee: Employee }) {
  const { updateEmployee } = useAppStore()
  const { toast } = useToast()
  const [bank, setBank] = useState(employee.bankName || '')
  const [pixType, setPixType] = useState(employee.pixType || '')
  const [pixNumber, setPixNumber] = useState(employee.pixNumber || '')
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setBank(employee.bankName || '')
    setPixType(employee.pixType || '')
    setPixNumber(employee.pixNumber || '')
  }, [employee])

  const handleBlur = async (field: string, value: string) => {
    if (employee[field as keyof Employee] !== value) {
      setIsUpdating(true)
      const res = await updateEmployee(employee.id, { [field]: value })
      setIsUpdating(false)

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Erro de Atualização',
          description:
            res.error?.message || 'Falha ao atualizar dados financeiros. Verifique os campos.',
        })

        if (field === 'bankName') setBank(employee.bankName || '')
        if (field === 'pixType') setPixType(employee.pixType || '')
        if (field === 'pixNumber') setPixNumber(employee.pixNumber || '')
      } else {
        toast({
          title: 'Sucesso',
          description: 'Dados financeiros atualizados com sucesso.',
        })
      }
    }
  }

  const handleCopy = () => {
    if (!pixNumber) return
    navigator.clipboard.writeText(pixNumber)
    setCopied(true)
    toast({ title: 'COPIADO', description: 'Chave PIX copiada para a área de transferência.' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TableRow className="hover:bg-muted/10 transition-colors">
      <TableCell className="font-semibold text-sm uppercase">
        <div className="flex items-center gap-2">
          {employee.name}
          {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Input
            value={pixNumber}
            onChange={(e) => setPixNumber(e.target.value)}
            onBlur={() => handleBlur('pixNumber', pixNumber)}
            disabled={isUpdating}
            className="h-8 text-xs bg-transparent border-transparent hover:border-input focus:bg-background transition-all font-mono placeholder:text-muted-foreground/50 flex-1 disabled:opacity-50"
            placeholder="NÚMERO DO PIX"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-nuvia-gold hover:bg-nuvia-gold/10 shrink-0"
            onClick={handleCopy}
            disabled={!pixNumber || isUpdating}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={pixType}
          onValueChange={(val) => {
            setPixType(val)
            handleBlur('pixType', val)
          }}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs bg-transparent border-transparent hover:border-input focus:bg-background transition-all uppercase w-full disabled:opacity-50">
            <SelectValue placeholder="TIPO PIX" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPF">CPF</SelectItem>
            <SelectItem value="CEL">CELULAR</SelectItem>
            <SelectItem value="EMAIL">E-MAIL</SelectItem>
            <SelectItem value="CHAVE ALEATÓRIA">ALEATÓRIA</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          onBlur={() => handleBlur('bankName', bank)}
          disabled={isUpdating}
          className="h-8 text-xs bg-transparent border-transparent hover:border-input focus:bg-background transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
          placeholder="NOME DO BANCO"
        />
      </TableCell>
    </TableRow>
  )
}
