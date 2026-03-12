import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/img_3243-2f960.jpg'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0A192F]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img
              src={logoImg}
              alt="Nuvia Odontologia"
              className="h-10 md:h-14 w-auto rounded-sm object-contain shadow-sm"
            />
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <a
              href="#servicos"
              className="text-sm font-medium text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Tratamentos
            </a>
            <a
              href="#equipe"
              className="text-sm font-medium text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Corpo Clínico
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Contato
            </a>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Área do Paciente
              </Button>
            </Link>
            <Button className="bg-[#D4AF37] text-[#0A192F] hover:bg-[#C5A028] font-bold">
              Agendar Consulta
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-[#0A192F] overflow-hidden flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <div className="mb-10 inline-block animate-fade-in-up">
              <img
                src={logoImg}
                alt="Nuvia Odontologia"
                className="h-20 md:h-28 w-auto rounded-lg shadow-2xl border border-white/10 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl leading-tight animate-fade-in-up delay-100">
              Excelência em Odontologia <span className="text-[#D4AF37]">Avançada</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl animate-fade-in-up delay-200">
              Transformando sorrisos com tecnologia de ponta e atendimento humanizado. Descubra o
              padrão Nuvia de cuidado odontológico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Button
                size="lg"
                className="bg-[#D4AF37] text-[#0A192F] font-bold hover:bg-[#C5A028] text-lg px-8"
              >
                Agendar Avaliação
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0A192F] text-lg px-8"
              >
                Conheça a Clínica
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#D4AF37] rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>
        </section>

        {/* Info Section */}
        <section id="contato" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#0A192F]/5 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-[#0A192F]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">Localização</h3>
                <p className="text-slate-600">
                  Av. das Américas, 3500
                  <br />
                  Barra da Tijuca, RJ
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#0A192F]/5 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-[#0A192F]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">Horário</h3>
                <p className="text-slate-600">
                  Seg a Sex: 08h às 19h
                  <br />
                  Sábados: 08h às 13h
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#0A192F]/5 rounded-full flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-[#0A192F]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">Contato</h3>
                <p className="text-slate-600">
                  (21) 99999-9999
                  <br />
                  contato@nuvia.com.br
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A192F] text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/">
                <img
                  src={logoImg}
                  alt="Nuvia Odontologia"
                  className="h-14 md:h-16 w-auto rounded mb-6 opacity-90 object-contain"
                />
              </Link>
              <p className="text-slate-400 max-w-sm mb-6">
                Referência em odontologia estética e reabilitadora. Trazendo o que há de mais
                moderno para o seu sorriso.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0A192F] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0A192F] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Links Rápidos</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">
                    Sobre a Clínica
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">
                    Nossos Tratamentos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">
                    Corpo Clínico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">
                    Agende sua Consulta
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-1" />
                  <span>
                    Av. das Américas, 3500 - Sala 123
                    <br />
                    Barra da Tijuca, RJ
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span>(21) 99999-9999</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span>contato@nuvia.com.br</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Nuvia Odontologia by Souza Filho. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
