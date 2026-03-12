import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import { publicNavigation } from '@/config/navigation'
import {
  ArrowRight,
  Star,
  Clock,
  Shield,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  User,
} from 'lucide-react'

export default function PublicHome() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }))

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header / Top Action Menu */}
      <header className="sticky top-0 z-50 w-full bg-nuvia-blue shadow-lg border-b border-nuvia-gold/20">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <svg
              viewBox="0 0 100 60"
              className="h-12 w-auto text-nuvia-gold fill-none stroke-current stroke-[2] group-hover:scale-105 transition-transform"
            >
              <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-widest text-nuvia-gold leading-none">
                NUVIA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-white/80 mt-1">ODONTOLOGIA</span>
            </div>
          </Link>

          {/* Navigation Items as Highlighted Boxes */}
          <nav className="hidden lg:flex items-center gap-3">
            {publicNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="bg-nuvia-blue border border-nuvia-gold text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue px-6 py-2.5 rounded-sm font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/login"
              className="ml-4 bg-nuvia-gold/10 border border-nuvia-gold/30 text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue px-4 py-2.5 rounded-sm font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Portal
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex lg:hidden overflow-x-auto gap-2 pb-2 -mb-2 no-scrollbar max-w-[50vw]">
            {publicNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="whitespace-nowrap bg-nuvia-blue border border-nuvia-gold text-nuvia-gold px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* High-Impact Brand Hero with Horizontal Carousel */}
      <section className="relative w-full h-[85vh] bg-nuvia-dark overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-full ml-0">
              <CarouselItem className="pl-0 h-[85vh] relative">
                <img
                  src="https://img.usecurling.com/p/1600/900?q=beautiful%20brazilian%20woman%20smiling%20happy"
                  alt="Paciente Nuvia"
                  className="w-full h-full object-cover opacity-40"
                />
              </CarouselItem>
              <CarouselItem className="pl-0 h-[85vh] relative">
                <img
                  src="https://img.usecurling.com/p/1600/900?q=handsome%20brazilian%20man%20smile"
                  alt="Sorriso Confiante"
                  className="w-full h-full object-cover opacity-40"
                />
              </CarouselItem>
              <CarouselItem className="pl-0 h-[85vh] relative">
                <img
                  src="https://img.usecurling.com/p/1600/900?q=brazilian%20dentist%20working%20clinic"
                  alt="Atendimento Nuvia"
                  className="w-full h-full object-cover opacity-40 object-top"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-0 bg-nuvia-blue/70 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nuvia-blue/40 to-nuvia-blue/90 pointer-events-none" />
        </div>

        {/* Central Enlarged Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center mt-[-5vh]">
          <div className="animate-fade-in-up">
            <svg
              viewBox="0 0 100 60"
              className="h-40 md:h-64 w-auto text-nuvia-gold fill-none stroke-current stroke-[1.5] mx-auto drop-shadow-2xl"
            >
              <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
            </svg>
            <h1 className="text-5xl md:text-8xl font-serif text-nuvia-gold tracking-[0.25em] drop-shadow-2xl uppercase mt-8">
              NUVIA
            </h1>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-12 md:w-24 bg-nuvia-gold/50"></div>
              <p className="text-sm md:text-xl text-white tracking-[0.4em] font-light uppercase">
                Odontologia
              </p>
              <div className="h-px w-12 md:w-24 bg-nuvia-gold/50"></div>
            </div>
            <p className="text-xs md:text-sm text-nuvia-gold tracking-[0.3em] font-medium mt-6 uppercase">
              By Souza Filho
            </p>
          </div>
        </div>
      </section>

      {/* Information Bar */}
      <div
        className="relative z-20 -mt-16 mx-4 md:mx-auto max-w-6xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-sm p-8 border-t-4 border-nuvia-gold grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
          <Clock className="w-10 h-10 text-nuvia-gold shrink-0" stroke-width="1.5" />
          <div>
            <h4 className="text-nuvia-blue font-serif text-lg font-bold">
              Segunda - Sexta: 08h - 18h
            </h4>
            <p className="text-slate-500 text-sm mt-1">Sábado e Domingo - Fechado</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:border-l md:border-nuvia-gold/20 md:pl-8">
          <Phone className="w-10 h-10 text-nuvia-gold shrink-0" stroke-width="1.5" />
          <div>
            <h4 className="text-nuvia-blue font-serif text-lg font-bold">(11) 96172-9130</h4>
            <p className="text-slate-500 text-sm mt-1">(11) 3040-8884</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:border-l md:border-nuvia-gold/20 md:pl-8">
          <MapPin className="w-10 h-10 text-nuvia-gold shrink-0" stroke-width="1.5" />
          <div>
            <h4 className="text-nuvia-blue font-serif text-lg font-bold">Endereço</h4>
            <p className="text-slate-500 text-sm mt-1">
              Rua Tabapuã, 50 – Cj. 302 – 3º andar
              <br />
              Itaim Bibi, São Paulo
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5511961729130"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] z-50 hover:bg-[#1EBE5D] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="h-8 w-8 group-hover:animate-pulse" />
      </a>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 bg-white mt-12">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-nuvia-gold text-sm font-bold tracking-widest uppercase">
                Nossa Essência
              </h2>
              <h3 className="text-nuvia-blue text-3xl md:text-5xl font-serif leading-tight">
                A Arte de Transformar
              </h3>
              <p className="text-lg text-slate-600 font-light leading-relaxed">
                Nuvia nasce como um sopro leve, desenhando no ar a promessa de um novo sorriso. Não
                é apenas odontologia, é a arte de transformar ciência em confiança e cuidado em
                beleza.
              </p>
              <p className="text-lg text-slate-600 font-light leading-relaxed">
                Sua essência é sofisticação acessível: um espaço onde leveza e inovação caminham
                juntas para revelar a sua melhor versão.
              </p>
              <Button className="bg-nuvia-blue hover:bg-nuvia-dark text-nuvia-gold rounded-sm px-8 py-6 text-sm font-bold tracking-widest uppercase mt-4">
                Conheça Nossa História
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute inset-0 bg-nuvia-gold/5 rounded-full blur-3xl -z-10 transform scale-110"></div>
              <img
                src="https://img.usecurling.com/p/600/800?q=dentistry%20clinic%20tools"
                alt="Estrutura Nuvia"
                className="rounded-t-[100px] rounded-bl-sm rounded-br-sm h-72 w-full object-cover border border-nuvia-gold/20 shadow-xl"
              />
              <img
                src="https://img.usecurling.com/p/600/800?q=beautiful%20brazilian%20smile"
                alt="Sorriso Brasileiro"
                className="rounded-b-[100px] rounded-tl-sm rounded-tr-sm h-72 w-full object-cover mt-16 border border-nuvia-gold/20 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-nuvia-gold text-sm font-bold tracking-widest uppercase mb-4">
              Especialidades
            </h2>
            <h3 className="text-nuvia-blue text-3xl md:text-5xl font-serif mb-6">
              Nossos Tratamentos
            </h3>
            <div className="h-1 w-24 bg-nuvia-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
              Oferecemos uma gama completa de serviços odontológicos, aliando tecnologia de ponta ao
              toque humano e especializado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Estética Dental',
                desc: 'Facetas, lentes de contato e clareamento para um sorriso radiante e perfeitamente alinhado.',
                icon: <Star className="h-8 w-8 text-nuvia-gold" stroke-width="1.5" />,
              },
              {
                title: 'Implantes',
                desc: 'Reabilitação oral segura e definitiva, devolvendo sua confiança e qualidade de vida.',
                icon: <Shield className="h-8 w-8 text-nuvia-gold" stroke-width="1.5" />,
              },
              {
                title: 'Ortodontia',
                desc: 'Alinhadores invisíveis e aparelhos modernos para um tratamento discreto e eficiente.',
                icon: <Clock className="h-8 w-8 text-nuvia-gold" stroke-width="1.5" />,
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-sm shadow-sm border border-slate-100 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="mb-8 bg-nuvia-gold/10 w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-nuvia-gold transition-colors duration-300">
                  <div className="group-hover:text-nuvia-blue transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-nuvia-blue mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{service.desc}</p>
                <a
                  href="#"
                  className="text-nuvia-gold font-bold tracking-widest text-sm uppercase flex items-center gap-2 hover:gap-4 transition-all"
                >
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-nuvia-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nuvia-gold/10 to-transparent opacity-50"></div>
        <div className="container px-4 md:px-6 text-center relative z-10">
          <h2 className="text-nuvia-gold text-3xl md:text-5xl font-serif mb-6">
            Explore Nosso Blog
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10 font-light">
            Dicas, novidades e artigos sobre saúde bucal, estética e bem-estar, escritos por nossos
            especialistas para manter você sempre informado.
          </p>
          <Button className="bg-nuvia-gold hover:bg-white text-nuvia-blue rounded-sm px-10 py-6 text-sm font-bold tracking-widest uppercase shadow-xl transition-colors">
            Acessar Blog
          </Button>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-nuvia-dark text-slate-300 pt-20 pb-8 border-t-[6px] border-nuvia-gold">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand & RT */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-8">
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 100 60"
                  className="h-14 w-auto text-nuvia-gold fill-none stroke-current stroke-[2]"
                >
                  <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold tracking-widest text-nuvia-gold leading-none">
                    NUVIA
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-slate-400 mt-1">
                    ODONTOLOGIA
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left bg-nuvia-blue/50 p-6 rounded-sm border border-nuvia-gold/10 w-full">
                <h4 className="text-nuvia-gold font-bold text-xs tracking-widest uppercase mb-3">
                  Responsável Técnico
                </h4>
                <p className="text-white font-serif text-lg mb-2">Dr. Roberto Souza Filho</p>
                <div className="inline-block border border-nuvia-gold/40 text-nuvia-gold text-xs px-3 py-1.5 rounded-sm font-mono tracking-wider">
                  CRO SP 97.044 / CL 11.050
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="md:col-span-3 md:col-start-6">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8 border-b-2 border-nuvia-gold inline-block pb-2">
                Navegação
              </h4>
              <ul className="space-y-4">
                {publicNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="hover:text-nuvia-gold transition-colors flex items-center gap-3 text-sm font-medium tracking-wide"
                    >
                      <span className="text-nuvia-gold/50 text-[10px]">■</span> {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Socials */}
            <div className="md:col-span-4">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8 border-b-2 border-nuvia-gold inline-block pb-2">
                Contato
              </h4>
              <ul className="space-y-5 text-sm font-light text-slate-400 mb-10">
                <li className="flex items-start gap-4 group">
                  <Phone className="h-5 w-5 text-nuvia-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="hover:text-white transition-colors cursor-pointer">
                    (11) 96172-9130 <br /> (11) 3040-8884
                  </span>
                </li>
                <li className="flex items-start gap-4 group">
                  <MapPin className="h-5 w-5 text-nuvia-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="leading-relaxed hover:text-white transition-colors cursor-pointer">
                    Rua Tabapuã, 50 – Cj. 302 – 3º andar
                    <br />
                    Itaim Bibi, São Paulo - SP
                  </span>
                </li>
              </ul>

              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="bg-nuvia-blue p-3 rounded-sm border border-nuvia-gold/20 hover:bg-nuvia-gold hover:text-nuvia-blue hover:border-nuvia-gold transition-all text-nuvia-gold"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-nuvia-blue p-3 rounded-sm border border-nuvia-gold/20 hover:bg-nuvia-gold hover:text-nuvia-blue hover:border-nuvia-gold transition-all text-nuvia-gold"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-nuvia-blue p-3 rounded-sm border border-nuvia-gold/20 hover:bg-nuvia-gold hover:text-nuvia-blue hover:border-nuvia-gold transition-all text-nuvia-gold"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest text-slate-500 gap-4 uppercase font-medium">
            <p>© 2026 NUVIA ODONTOLOGIA. TODOS OS DIREITOS RESERVADOS.</p>
            <p>DESIGN EXCLUSIVO.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
