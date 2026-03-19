import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { getISOWeek, getYear } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CheckCircle2, Star } from 'lucide-react'

export function Ser5sForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentWeek = `Semana ${getISOWeek(new Date())} - ${getYear(new Date())}`

  useEffect(() => {
    if (!user) return
    const checkSubmission = async () => {
      const { data } = await supabase
        .from('ser_5s_submissions' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('reference_week', currentWeek)
      if (data && data.length > 0) setHasSubmitted(true)
      setChecking(false)
    }
    checkSubmission()
  }, [user, currentWeek])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const file = formData.get('photo') as File
    const notes = formData.get('notes') as string

    if (!file || file.size === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma foto.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('ser-5s').upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('ser-5s').getPublicUrl(filePath)

      const pointsEarned = 40

      const { error: insertError } = await supabase.from('ser_5s_submissions' as any).insert({
        user_id: user.id,
        reference_week: currentWeek,
        photo_url: publicUrl,
        notes: notes || null,
        points_earned: pointsEarned,
      })

      if (insertError) throw insertError

      toast({
        title: 'Sucesso!',
        description: `Registro 5S enviado com sucesso! Você ganhou ${pointsEarned} pontos.`,
      })
      setHasSubmitted(true)
      onSubmitted()
    } catch (error: any) {
      toast({ title: 'Erro ao enviar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (checking)
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin w-6 h-6 text-slate-400" />
      </div>
    )

  if (hasSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
        <CheckCircle2 className="w-12 h-12 mb-2" />
        <p className="font-bold uppercase tracking-wider text-sm">
          Você já enviou seu 5S desta semana!
        </p>
        <p className="text-xs mt-1 text-emerald-700 font-medium text-center">
          Obrigado por contribuir com a organização.
          <br />
          <span className="flex items-center justify-center gap-1 mt-2 bg-emerald-100 text-emerald-800 w-fit mx-auto px-3 py-1 rounded-full font-black text-xs">
            <Star className="w-3 h-3 fill-emerald-800" /> 40 PONTOS GARANTIDOS
          </span>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Semana de Referência</Label>
          <Input
            value={currentWeek}
            readOnly
            className="bg-slate-100 cursor-not-allowed text-slate-500 font-bold"
          />
        </div>
        <div className="space-y-2">
          <Label>Foto do Ambiente</Label>
          <Input type="file" name="photo" accept="image/*" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Observações rápidas (opcional)</Label>
        <Textarea
          name="notes"
          placeholder="Descreva o que foi organizado..."
          className="resize-none normal-case"
          disableUppercase
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto uppercase tracking-wider font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
            </>
          ) : (
            'Enviar Registro e Ganhar 40 pts'
          )}
        </Button>
      </div>
    </form>
  )
}
