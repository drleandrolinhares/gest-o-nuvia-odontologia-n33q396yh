import { useState, useEffect } from 'react'
import { Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useHubStore } from '@/stores/hub'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

export function AnnouncementModal() {
  const { unreadAnnouncements, markAsRead } = useHubStore()
  const [agreedToAnnouncement, setAgreedToAnnouncement] = useState(false)
  const [readingAnnouncement, setReadingAnnouncement] = useState(false)
  const { toast } = useToast()

  const currentUnread = (unreadAnnouncements?.length ?? 0) > 0 ? unreadAnnouncements[0] : null

  useEffect(() => {
    setAgreedToAnnouncement(false)
  }, [currentUnread?.id])

  const handleRead = async () => {
    if (currentUnread && agreedToAnnouncement) {
      setReadingAnnouncement(true)
      const res = await markAsRead(currentUnread)
      setReadingAnnouncement(false)
      if (res.success) {
        if (res.points && res.points > 0) {
          toast({
            title: 'PARABÉNS!',
            description: `Você ganhou ${res.points} pontos pela leitura rápida.`,
          })
        } else {
          toast({
            title: 'LEITURA CONFIRMADA',
            description: 'Sua leitura foi registrada no log de assinaturas.',
          })
        }
      }
    }
  }

  return (
    <AlertDialog open={!!currentUnread}>
      <AlertDialogContent
        className="max-w-2xl border-[#D4AF37]/30 bg-[#0A192F] text-slate-100 p-0 overflow-hidden outline-none"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="bg-[#D4AF37] p-4 text-[#0A192F] flex items-center justify-center gap-3">
          <Megaphone className="h-6 w-6 shrink-0" />
          <AlertDialogTitle className="text-xl uppercase tracking-widest font-black m-0 leading-none mt-1">
            COMUNICADO IMPORTANTE
          </AlertDialogTitle>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <AlertDialogDescription className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
            <div className="font-bold text-white text-xl mb-4 uppercase tracking-wider">
              {currentUnread?.title}
            </div>
            {currentUnread?.content}
          </AlertDialogDescription>
        </div>
        <div className="p-6 bg-[#112240] border-t border-[#D4AF37]/20 flex flex-col gap-4">
          <div className="flex items-center gap-3 pl-1">
            <Checkbox
              id="agree-announcement"
              checked={agreedToAnnouncement}
              onCheckedChange={(c) => setAgreedToAnnouncement(!!c)}
              className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] h-5 w-5 rounded-sm"
            />
            <label
              htmlFor="agree-announcement"
              className="text-sm font-bold tracking-widest uppercase text-slate-300 cursor-pointer select-none"
            >
              Li e concordo com os termos do comunicado
            </label>
          </div>
          <Button
            onClick={handleRead}
            disabled={readingAnnouncement || !agreedToAnnouncement}
            className="w-full h-12 bg-[#D4AF37] text-[#0A192F] hover:bg-[#B3932D] font-black uppercase tracking-widest text-base shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {readingAnnouncement ? 'Registrando leitura...' : 'Confirmar Leitura'}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
