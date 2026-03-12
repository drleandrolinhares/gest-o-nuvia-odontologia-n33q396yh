import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/img_3243-2f960.jpg'
import { MapPin, Phone, Clock, Instagram, Facebook, Menu, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

export default function PublicHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'HOME', href: '#' },
    { label: 'CLÍNICA NUVIA', href: '#clinica' },
    { label: 'LENTES DE CONTATO', href: '#lentes' },
    { label: 'TRATAMENTOS', href: '#tratamentos' },
    { label: 'CLIENTES', href: '#clientes' },
    { label: 'MAIS SOBRE NÓS', href: '#sobre' },
    { label: 'CONTATO', href: '#contato' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 bg-[#0A192F] border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            {/*
              Using mix-blend-screen and invert to simulate a transparent, light-colored logo 
              from a standard black-on-white or white-background JPG 
            */}
            <img
              src={logoImg}
              alt="Nuvia Odontologia"
              className="h-16 md:h-20 w-auto object-contain mix-blend-screen invert sepia-[.3] hue-rotate-[10deg] saturate-[200%]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 items-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] xl:text-xs font-semibold tracking-[0.15em] text-white hover:text-[#D4AF37] transition-colors uppercase"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0A192F] border-l-slate-800 p-0 w-80">
                <div className="flex flex-col h-full py-8">
                  <div className="px-8 mb-12">
                    <img
                      src={logoImg}
                      alt="Nuvia Odontologia"
                      className="h-12 w-auto object-contain mix-blend-screen invert sepia-[.3] hue-rotate-[10deg] saturate-[200%]"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto px-4">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between w-full p-4 text-sm font-semibold tracking-widest text-slate-300 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors uppercase"
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </a>
                    ))}
                  </div>
                  <div className="p-8 border-t border-slate-800">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#D4AF37] text-[#0A192F] hover:bg-[#C5A028] font-bold tracking-widest uppercase">
                        Acesso Restrito
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section aligned with the reference */}
        <section className="relative pt-40 pb-48 md:pt-48 md:pb-64 bg-[#0A192F] flex items-center justify-center overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[200px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <p className="text-[#D4AF37] tracking-[0.4em] text-xs md:text-sm mb-6 uppercase font-semibold">
              Made By
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-[0.2em] uppercase mb-16 leading-tight">
              N u v i a<br />O d o n t o l o g i a
            </h1>

            <div className="flex items-center justify-center gap-6 md:gap-10">
              <div className="text-[#D4AF37] text-8xl md:text-[10rem] font-serif leading-none">
                N
              </div>
              <div className="text-left flex flex-col justify-center border-l border-white/20 pl-6 md:pl-10 h-full py-4">
                <div className="text-[#D4AF37] text-3xl md:text-5xl font-light tracking-widest mb-1">
                  15
                </div>
                <div className="text-white text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed font-light">
                  Anos de
                  <br />
                  História
                </div>
              </div>
            </div>

            <p className="text-[#D4AF37] tracking-[0.4em] text-xs md:text-sm mt-16 uppercase font-semibold">
              Since 2009
            </p>
          </div>
        </section>

        {/* Horizontal Infobar - Overlapping Hero */}
        <section className="relative z-20 -mt-20 md:-mt-24 mb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-[#fcfcfc] shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden rounded-sm relative">
              {/* Subtle background texture/pattern simulation */}
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://img.usecurling.com/p/800/200?q=marble&color=white')] bg-cover bg-center mix-blend-multiply"></div>

              {/* Box 1 */}
              <div className="flex-1 p-8 md:p-10 flex items-center gap-5 md:gap-6 border-b md:border-b-0 md:border-r border-slate-200/60 relative z-10 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-serif text-slate-800 leading-snug">
                    Segunda - Sexta:
                    <br />
                    08h - 18h
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-light">
                    Sábado e Domingo - Fechado
                  </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex-1 p-8 md:p-10 flex items-center gap-5 md:gap-6 border-b md:border-b-0 md:border-r border-slate-200/60 relative z-10 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-serif text-slate-800 leading-snug">
                    (11) 96172-9130
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-light">
                    (11) 3040-8884
                  </p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="flex-1 p-8 md:p-10 flex items-center gap-5 md:gap-6 relative z-10 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-serif text-slate-800 leading-snug">
                    Endereço
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-light">
                    Rua Tabapuã, 50 - Cj. 302 - 3º andar
                    <br />
                    Itaim Bibi, São Paulo
                  </p>
                </div>
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
                  className="h-14 md:h-16 w-auto rounded mb-6 object-contain mix-blend-screen invert sepia-[.3] hue-rotate-[10deg] saturate-[200%]"
                />
              </Link>
              <p className="text-slate-400 max-w-sm mb-6 font-light leading-relaxed">
                Referência em odontologia estética e reabilitadora. Trazendo o que há de mais
                moderno para o seu sorriso.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0A192F] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0A192F] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6 text-lg tracking-wider">Links Rápidos</h4>
              <ul className="space-y-3 font-light text-sm">
                <li>
                  <a href="#sobre" className="hover:text-[#D4AF37] transition-colors">
                    Sobre a Clínica
                  </a>
                </li>
                <li>
                  <a href="#tratamentos" className="hover:text-[#D4AF37] transition-colors">
                    Nossos Tratamentos
                  </a>
                </li>
                <li>
                  <a href="#clinica" className="hover:text-[#D4AF37] transition-colors">
                    Corpo Clínico
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:text-[#D4AF37] transition-colors">
                    Agende sua Consulta
                  </a>
                </li>
                <li className="pt-4 mt-4 border-t border-white/10">
                  <Link
                    to="/login"
                    className="text-[#D4AF37] font-semibold hover:text-white transition-colors tracking-widest uppercase text-xs"
                  >
                    Acesso ao Sistema
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6 text-lg tracking-wider">Contato</h4>
              <ul className="space-y-4 font-light text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <span>
                    Rua Tabapuã, 50 - Cj. 302
                    <br />
                    Itaim Bibi, São Paulo
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>(11) 96172-9130</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-light">
            <p>
              &copy; {new Date().getFullYear()} Nuvia Odontologia. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
