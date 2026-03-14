import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Plus, Trash2, ShieldAlert } from 'lucide-react'
import useAppStore, { AccessItem, ManualStep, TroubleshootingFaq } from '@/stores/main'

interface AcessoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: AccessItem
}

const SECTORS = ['FINANCEIRO', 'CLÍNICO', 'MARKETING', 'RECEPÇÃO', 'LABORATÓRIO', 'GERAL']

export function AcessoFormModal({ open, onOpenChange, item }: AcessoFormModalProps) {
  const { addAccess, updateAccess } = useAppStore()

  // Tab 1: Credenciais
  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [sector, setSector] = useState('GERAL')
  const [accessLevel, setAccessLevel] = useState('ACESSO GERAL')
  const [logoUrl, setLogoUrl] = useState('')
  const [securityNote, setSecurityNote] = useState('')

  // Tab 2: Visão Geral
  const [description, setDescription] = useState('')
  const [targetUsers, setTargetUsers] = useState('')
  const [frequency, setFrequency] = useState('')

  // Tab 3: Manual & FAQ
  const [videoUrl, setVideoUrl] = useState('')
  const [steps, setSteps] = useState<ManualStep[]>([])
  const [faqs, setFaqs] = useState<TroubleshootingFaq[]>([])

  useEffect(() => {
    if (open) {
      if (item) {
        setPlatform(item.platform)
        setUrl(item.url)
        setLogin(item.login)
        setPass(item.pass)
        setSector(item.sector || 'GERAL')
        setAccessLevel(item.access_level || 'ACESSO GERAL')
        setLogoUrl(item.logo_url || '')
        setSecurityNote(item.security_note || '')
        setDescription(item.description || item.instructions || '')
        setTargetUsers(item.target_users || '')
        setFrequency(item.frequency || '')
        setVideoUrl(item.video_url || '')
        setSteps(item.manual_steps || [])
        setFaqs(item.troubleshooting || [])
      } else {
        setPlatform('')
        setUrl('')
        setLogin('')
        setPass('')
        setSector('GERAL')
        setAccessLevel('ACESSO GERAL')
        setLogoUrl('')
        setSecurityNote('')
        setDescription('')
        setTargetUsers('')
        setFrequency('')
        setVideoUrl('')
        setSteps([])
        setFaqs([])
      }
    }
  }, [open, item])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!platform || !login || !pass) return

    const payload = {
      platform,
      url,
      login,
      pass,
      sector,
      access_level: accessLevel,
      logo_url: logoUrl,
      description,
      target_users: targetUsers,
      frequency,
      video_url: videoUrl,
      manual_steps: steps,
      troubleshooting: faqs,
      security_note: securityNote,
      instructions: description, // fallback for legacy
    }

    if (item) {
      updateAccess(item.id, payload)
    } else {
      addAccess(payload as Omit<AccessItem, 'id'>)
    }
    onOpenChange(false)
  }

  const addStep = () => {
    setSteps([...steps, { id: crypto.randomUUID(), text: '' }])
  }

  const updateStep = (id: string, text: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, text } : s)))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id))
  }

  const addFaq = () => {
    setFaqs([...faqs, { id: crypto.randomUUID(), question: '', answer: '' }])
  }

  const updateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-nuvia-navy">
            <Shield className="h-6 w-6 text-primary" />{' '}
            {item ? 'EDITAR SISTEMA' : 'ADICIONAR NOVO SISTEMA'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-4">
          <Tabs defaultValue="credenciais" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="credenciais">1. CREDENCIAIS</TabsTrigger>
              <TabsTrigger value="visao">2. VISÃO GERAL</TabsTrigger>
              <TabsTrigger value="manual">3. MANUAL & FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="credenciais" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    NOME DO SISTEMA *
                  </label>
                  <Input
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                    placeholder="EX: NUVIA CRM"
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    URL DA LOGO (OPCIONAL)
                  </label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="HTTPS://..."
                    className="lowercase"
                  />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">SETOR *</label>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    NÍVEL DE ACESSO *
                  </label>
                  <Select value={accessLevel} onValueChange={setAccessLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACESSO GERAL">ACESSO GERAL</SelectItem>
                      <SelectItem value="ACESSO RESTRITO">ACESSO RESTRITO</SelectItem>
                      <SelectItem value="DIRETORIA">DIRETORIA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    URL DE ACESSO
                  </label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="HTTPS://..."
                    className="lowercase"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    USUÁRIO / LOGIN *
                  </label>
                  <Input
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    className="lowercase"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">SENHA *</label>
                  <Input
                    type="text"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-red-600 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> NOTA DE SEGURANÇA (OPCIONAL)
                  </label>
                  <Input
                    value={securityNote}
                    onChange={(e) => setSecurityNote(e.target.value)}
                    placeholder="EX: SENHA MASTER, NÃO COMPARTILHAR"
                    className="uppercase border-red-200 focus-visible:ring-red-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visao" className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  PARA QUE SERVE? (2 LINHAS) *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="RESUMO PRÁTICO DO OBJETIVO DO SISTEMA..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  QUEM DEVE USAR? *
                </label>
                <Input
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  required
                  placeholder="EX: TODOS OS DENTISTAS"
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  FREQUÊNCIA DE USO *
                </label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="SELECIONE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIÁRIO">DIÁRIO</SelectItem>
                    <SelectItem value="SEMANAL">SEMANAL</SelectItem>
                    <SelectItem value="MENSAL (FECHAMENTO)">MENSAL (FECHAMENTO)</SelectItem>
                    <SelectItem value="SOB DEMANDA">SOB DEMANDA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  URL DO VÍDEO DE TREINAMENTO (OPCIONAL)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YOUTUBE, LOOM, VIMEO..."
                  className="lowercase"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">PASSO A PASSO (SOP)</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStep}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> ADICIONAR
                  </Button>
                </div>
                <div className="space-y-2">
                  {steps.map((step, i) => (
                    <div key={step.id} className="flex gap-2 items-start">
                      <div className="mt-2 text-xs font-bold text-muted-foreground w-4">
                        {i + 1}.
                      </div>
                      <Input
                        value={step.text}
                        onChange={(e) => updateStep(step.id, e.target.value)}
                        placeholder="DESCRIÇÃO DO PASSO..."
                        className="uppercase"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        className="text-red-500 hover:text-red-600 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {steps.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      NENHUM PASSO ADICIONADO.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    SOLUÇÃO DE PROBLEMAS (FAQ)
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaq}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> ADICIONAR
                  </Button>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-slate-50 p-3 rounded-lg border relative group">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFaq(faq.id)}
                        className="absolute top-1 right-1 h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="space-y-2 mt-1">
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                          placeholder="PERGUNTA / PROBLEMA COMUM"
                          className="uppercase font-bold h-8 text-xs bg-white"
                        />
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                          placeholder="SOLUÇÃO..."
                          className="uppercase text-xs bg-white min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))}
                  {faqs.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      NENHUMA PERGUNTA ADICIONADA.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CANCELAR
            </Button>
            <Button type="submit">SALVAR SISTEMA</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
