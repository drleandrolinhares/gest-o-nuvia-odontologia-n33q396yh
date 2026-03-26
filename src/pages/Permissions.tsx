import { ShieldAlert } from 'lucide-react'

export default function Permissions() {
  return (
    <div className="animate-fade-in-up pb-10 h-full">
      <div className="bg-[#0A192F] min-h-full rounded-2xl p-6 md:p-8 text-slate-100 shadow-xl border border-[#D4AF37]/20 flex flex-col items-center justify-center">
        <ShieldAlert className="h-20 w-20 text-[#D4AF37] mb-6 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-widest text-center uppercase">
          Gestão de Permissões
        </h2>
        <p className="text-sm md:text-base font-medium text-slate-400 mt-4 text-center max-w-lg leading-relaxed uppercase tracking-wider">
          O sistema de permissões está passando por uma reestruturação de segurança. As tabelas de
          acesso e cargos foram removidas para a implementação de um novo modelo.
        </p>
      </div>
    </div>
  )
}
