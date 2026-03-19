import { RankingItem } from '@/stores/hub'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const getAvatarUrl = (id: string) => {
  if (!id) return ''
  const seed = (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100) + 1
  return `https://img.usecurling.com/ppl/thumbnail?seed=${seed}`
}

export function Podium({ items }: { items: RankingItem[] }) {
  if (items.length === 0) return null

  const first = items[0]
  const second = items[1]
  const third = items[2]

  return (
    <div className="flex flex-row justify-center items-end gap-2 sm:gap-6 pt-10 pb-6 px-4">
      {/* 2nd Place */}
      {second && (
        <div
          className="flex flex-col items-center animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="relative mb-3">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-[#C0C0C0] shadow-lg z-10">
              <AvatarImage src={getAvatarUrl(second.employee_id)} />
              <AvatarFallback>{second.employee_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#C0C0C0] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20">
              2º
            </div>
          </div>
          <p
            className="text-xs sm:text-sm font-black text-slate-700 text-center max-w-[90px] truncate"
            title={second.employee_name}
          >
            {second.employee_name.split(' ')[0]}
          </p>
          <p className="text-xs font-bold text-[#C0C0C0]">{second.total_points} PTS</p>
          <div className="w-16 sm:w-24 h-24 bg-gradient-to-t from-slate-100 to-white border-t-2 border-[#C0C0C0] rounded-t-lg mt-3 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-4xl font-black text-[#C0C0C0]/30">2</span>
          </div>
        </div>
      )}

      {/* 1st Place */}
      {first && (
        <div
          className="flex flex-col items-center animate-fade-in-up z-10"
          style={{ animationDelay: '200ms' }}
        >
          <Trophy className="h-8 w-8 text-[#D4AF37] mb-2 drop-shadow-md animate-pulse" />
          <div className="relative mb-3">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-[5px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10">
              <AvatarImage src={getAvatarUrl(first.employee_id)} />
              <AvatarFallback>{first.employee_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-xs font-black px-3 py-0.5 rounded-full shadow-md z-20">
              1º
            </div>
          </div>
          <p
            className="text-sm sm:text-base font-black text-nuvia-navy text-center max-w-[110px] truncate"
            title={first.employee_name}
          >
            {first.employee_name.split(' ')[0]}
          </p>
          <p className="text-sm font-black text-[#D4AF37]">{first.total_points} PTS</p>
          <div className="w-20 sm:w-28 h-32 bg-gradient-to-t from-[#D4AF37]/5 to-white border-t-[3px] border-[#D4AF37] rounded-t-lg mt-3 flex items-center justify-center shadow-[inset_0_2px_15px_rgba(212,175,55,0.1)]">
            <span className="text-5xl font-black text-[#D4AF37]/20">1</span>
          </div>
        </div>
      )}

      {/* 3rd Place */}
      {third && (
        <div
          className="flex flex-col items-center animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="relative mb-3">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-[#CD7F32] shadow-lg z-10">
              <AvatarImage src={getAvatarUrl(third.employee_id)} />
              <AvatarFallback>{third.employee_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#CD7F32] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20">
              3º
            </div>
          </div>
          <p
            className="text-xs sm:text-sm font-black text-slate-700 text-center max-w-[90px] truncate"
            title={third.employee_name}
          >
            {third.employee_name.split(' ')[0]}
          </p>
          <p className="text-xs font-bold text-[#CD7F32]">{third.total_points} PTS</p>
          <div className="w-16 sm:w-24 h-20 bg-gradient-to-t from-slate-100 to-white border-t-2 border-[#CD7F32] rounded-t-lg mt-3 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-4xl font-black text-[#CD7F32]/30">3</span>
          </div>
        </div>
      )}
    </div>
  )
}
