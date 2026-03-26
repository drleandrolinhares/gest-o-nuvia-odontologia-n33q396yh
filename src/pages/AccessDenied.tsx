import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AccessDenied() {
  const location = useLocation()
  const module = location.state?.module

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] py-20 uppercase animate-fade-in text-center px-4">
      <ShieldAlert className="h-24 w-24 text-red-500 mb-6 drop-shadow-sm" />
      <h2 className="text-3xl md:text-4xl font-black text-nuvia-navy tracking-widest mb-3">
        Acesso Negado
      </h2>
      <p className="text-sm md:text-base font-bold text-muted-foreground max-w-lg mb-8 leading-relaxed">
        Você não possui a permissão de visualização necessária para acessar{' '}
        {module ? (
          <span className="text-red-500 font-black">o módulo {module}</span>
        ) : (
          'esta área restrita'
        )}
        .<br />
        Por favor, contate o administrador caso precise de acesso.
      </p>
      <Link to="/hub/mural">
        <Button
          size="lg"
          className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest uppercase shadow-md transition-transform hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Voltar para o Início
        </Button>
      </Link>
    </div>
  )
}
