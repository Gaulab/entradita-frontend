"use client"

import { useState, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import {
  QrCode, Zap, Users, MessageSquareText, Menu, X, Shield, DollarSign,
  BookOpen, HeartHandshake, ArrowRight,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

const Logo3D = lazy(() => import("../../components/Logo3D"))

export default function ModernHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Glow de fondo único (indigo → violeta), estático y sutil */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-brand-from/20 blur-[130px]" />
        <div className="absolute top-1/3 right-0 h-[380px] w-[380px] rounded-full bg-brand-to/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/isotipoWhite.png"
                alt="Logo de Entradita"
                className="h-9 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-semibold tracking-tight">entradita</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/pricing">Precios</NavLink>
              <NavLink to="/documentacion">Documentación</NavLink>
              <NavLink to="/contact">Contacto</NavLink>
              <div className="mx-2 h-5 w-px bg-border" />
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link to="/login">
                <Button className="ml-1 text-sm font-semibold">Crear cuenta</Button>
              </Link>
            </nav>

            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
              <div className="container flex flex-col py-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-2 py-3 text-base font-semibold hover:text-primary transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-2 py-3 text-base font-semibold text-primary hover:opacity-80 transition-opacity">
                  Crear cuenta
                </Link>
                <div className="my-1 h-px bg-border" />
                <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Precios</Link>
                <Link to="/documentacion" onClick={() => setIsMenuOpen(false)} className="px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Documentación</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Contacto</Link>
              </div>
            </div>
          )}
        </header>

        <main className="flex-grow container">
          {/* Hero */}
          <section className="flex flex-col items-center text-center py-16 sm:py-24 lg:py-32">
            <div className="mb-8 h-40 w-40 sm:h-52 sm:w-52 animate-fade-up">
              <Suspense fallback={<div className="h-full w-full" />}>
                <Logo3D />
              </Suspense>
            </div>

            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Tickets QR · gestión simple
            </span>

            <h1 className="animate-fade-up mt-6 max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              La forma simple de vender y{" "}
              <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
                controlar tus eventos
              </span>
            </h1>

            <p className="animate-fade-up mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Creá entradas con QR seguro, gestioná vendedores y verificá el acceso
              en segundos. Todo desde una plataforma clara y sin fricción.
            </p>

            <div className="animate-fade-up mt-10 flex w-full flex-col sm:flex-row justify-center items-center gap-3">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/documentacion" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-medium">
                  Ver documentación
                </Button>
              </Link>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Todo lo que necesitás para tu evento
              </h2>
              <p className="mt-4 text-muted-foreground">
                Herramientas pensadas para organizadores, vendedores y asistentes.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard icon={QrCode} title="Entradas con QR seguro" description="Cada ticket lleva un QR único y encriptado, imposible de duplicar." />
              <FeatureCard icon={Zap} title="Verificación instantánea" description="Escaneá y validá el acceso en milisegundos desde el celular." />
              <FeatureCard icon={Users} title="Gestión de vendedores" description="Asigná cupos, controlá y medí el rendimiento de cada vendedor." />
              <FeatureCard icon={Shield} title="Datos protegidos" description="Seguridad de punta a punta para tu evento y tus asistentes." />
              <FeatureCard icon={DollarSign} title="Reportes claros" description="Seguí ventas e ingresos de cada evento con métricas simples." />
              <FeatureCard icon={MessageSquareText} title="Soporte cercano" description="Te acompañamos por WhatsApp cuando lo necesites." />
            </div>
          </section>

          {/* CTA / secciones de contenido */}
          <section className="pb-16 sm:pb-24">
            <div className="grid gap-4 md:grid-cols-2">
              <ContentCard
                icon={BookOpen}
                title="Documentación completa"
                description="Aprendé a crear eventos, cargar entradas y gestionar vendedores paso a paso."
                buttonText="Ver documentación"
                href="/documentacion"
              />
              <ContentCard
                icon={HeartHandshake}
                title="¿Tenés una causa benéfica?"
                description="Auspiciamos las entradas de eventos benéficos. Contanos tu causa por WhatsApp."
                buttonText="Solicitar auspicio"
                href="https://wa.me/5493482275737"
                external
              />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/60 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                ¿Listo para tu próximo evento?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Creá tu cuenta gratis y empezá a vender entradas en minutos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 font-semibold">
                    Crear cuenta gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/5493482275737" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-medium">
                    <FaWhatsapp className="mr-2 h-4 w-4" />
                    Hablar con nosotros
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/60 py-10">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/GaulabPng.svg" alt="gaulab.com logo" className="h-9 w-auto" />
              <div>
                <p className="text-xs text-muted-foreground">Powered by</p>
                <p className="font-semibold">Gaulab</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/documentacion" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentación</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contacto</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Precios</Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2026 entradita.com · Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
      {children}
    </Link>
  )
}
NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-primary/40 hover:bg-card">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

function ContentCard({ icon: Icon, title, description, buttonText, href, external }) {
  const button = (
    <Button variant="outline" className="mt-6 font-medium">
      {buttonText}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card/60 p-8">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-from/20 to-brand-to/20 text-primary ring-1 ring-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-auto">
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer">{button}</a>
        ) : (
          <Link to={href}>{button}</Link>
        )}
      </div>
    </div>
  )
}
ContentCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  external: PropTypes.bool,
}
