"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { QrCode, Zap, Users, MessageSquareText, Menu, X, Star, Shield, DollarSign, BookOpen, LogIn, HeartHandshake, Link2, ArrowRight, ChevronDown, Rocket } from 'lucide-react'
import { FaWhatsapp } from "react-icons/fa"

export default function ModernHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    const particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      particles.length = 0
      const particleCount = Math.min(60, Math.floor(window.innerWidth / 25))

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? "59, 130, 246" : "147, 51, 234",
          velocity: {
            x: (Math.random() - 0.5) * 1,
            y: (Math.random() - 0.5) * 1,
          },
          opacity: Math.random() * 0.3 + 0.1,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Create connections between nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${particle.color}, ${0.1 * (1 - distance / 80)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`
        ctx.fill()

        // Update position
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y *= -1
        }
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    initParticles()
    drawParticles()

    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" /> {/* Adjusted z-index to move canvas behind everything */}

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 z-[0]" />

      <div className="relative z-10 flex-grow">
        {/* Header */}
        <header className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center group">
                <div className="relative">
                  <img
                    src="/isotipoWhite.png"
                    alt="Logo de Entradita"
                    className="h-12 w-auto mr-2 sm:h-16 sm:mr-3 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  entradita.com
                </h1>
              </div>

              <nav className="hidden lg:flex items-center space-x-2">
                <Link to="/contact">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm">
                    Contacto
                  </Button>
                </Link>
                <Link to="/documentacion">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentación
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700  text-white border-0 text-sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
              </nav>

              <Button variant="ghost" className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden mt-3 p-3 backdrop-blur-md bg-slate-800/90 rounded-xl border border-slate-700/50">
                <div className="flex flex-col space-y-2">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white text-sm py-2">
                      Contacto
                    </Button>
                  </Link>
                  <Link to="/documentacion" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white text-sm py-2">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Documentación
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 text-sm py-2">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4">
          {/* Hero Section - Reduced height for mobile */}
          <section className="min-h-[80vh] sm:min-h-screen flex items-center justify-center relative py-8 sm:py-0">
            <div className="text-center max-w-5xl mx-auto" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4 sm:mb-8 backdrop-blur-sm">
                <Rocket className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mr-2" />
                <span className="text-xs sm:text-sm text-blue-200">Next gen of events</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-3 sm:mb-6">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Revoluciona tus{" "}
                </span>
                <span className="bg-gradient-to-t from-blue-400 via-green-300 to-green-200 bg-clip-text text-transparent">
                  Eventos
                </span>
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-300 mb-3 sm:mb-6 max-w-3xl mx-auto">
                Tickets QR seguros y gestión simplificada
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed px-4 sm:px-0">
                Simplifica la venta y verificación de tickets con nuestra plataforma intuitiva y segura. Potencia tus
                eventos con tecnología de vanguardia.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-16 px-4 sm:px-0">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group"
                  >
                    Empezar ahora
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="entraditaTertiary"
                    size="lg"
                    className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg backdrop-blur-sm"
                  >
                    Ver precios
                  </Button>
                </Link>
              </div>

              <div className="animate-bounce hidden sm:block">
                <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 mx-auto" />
              </div>
            </div>
          </section>

          {/* Features Section - Reduced spacing */}
          <section id="features" className="py-12 sm:py-24">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Características Principales
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto px-4 sm:px-0">
                Descubre las herramientas que transformarán la gestión de tus eventos
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<QrCode className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />}
                title="Generación de QR Avanzada"
                description="Crea tickets QR únicos y seguros para cada asistente con información personalizada y encriptada."
                delay={0}
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-yellow-400" />}
                title="Verificación Instantánea"
                description="Escanea y verifica tickets en milisegundos con nuestra aplicación móvil de alto rendimiento."
                delay={100}
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-400" />}
                title="Gestión de Vendedores Inteligente"
                description="Asigna, controla y analiza el rendimiento de múltiples vendedores en tiempo real para cada evento."
                delay={200}
              />
              <FeatureCard
                icon={<Star className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-400" />}
                title="Experiencia de Usuario Premium"
                description="Interfaz intuitiva y amigable que facilita la compra y gestión de tickets tanto para organizadores como para asistentes."
                delay={300}
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-400" />}
                title="Seguridad de Datos Avanzada"
                description="Protección de datos de última generación para garantizar la privacidad y seguridad de todos los usuarios."
                delay={400}
              />
              <FeatureCard
                icon={<DollarSign className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-400" />}
                title="Análisis Financiero Detallado"
                description="Obtén insights valiosos sobre las ventas y el rendimiento financiero de tus eventos con nuestros reportes avanzados."
                delay={500}
              />
            </div>
          </section>

          {/* Content Sections - Reduced spacing */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16 pb-12 sm:pb-24">
            <ContentSection
              icon={<BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />}
              title="Documentación Completa"
              description="Accede a nuestra guía detallada para aprender a utilizar todas las funcionalidades de entradita. Desde la creación de eventos hasta la gestión de vendedores y tickets, encontrarás todo lo que necesitas para sacar el máximo provecho de nuestra plataforma."
              buttonText="Ver Documentación"
              buttonIcon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
              href="/documentacion"
            />

            <ContentSection
              icon={<HeartHandshake className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400" />}
              title="¿Tienes una causa benéfica?"
              description="En entradita, creemos en el poder de la comunidad y en apoyar causas que marcan la diferencia. Si organizas un evento benéfico, queremos ser parte de tu misión auspiciando las entradas."
              additionalText="Por favor, envíanos un mensaje con los detalles de tu causa y cómo podemos ayudarte a hacerla realidad."
              buttonText="Solicita tu auspicio"
              buttonIcon={<Link2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
              href="https://wa.me/543482586525"
              external
            />

            <ContentSection
              icon={<MessageSquareText className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />}
              title="Contáctanos"
              description="¿Listo para llevar tus eventos al siguiente nivel? Estamos aquí para ayudarte."
              buttonText="Envíanos un whatsapp"
              buttonIcon={<FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
              href="https://wa.me/543482586525"
              external
            />

            <ContentSection
              icon={<BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />}
              title="Sobre Nosotros"
              description="entradita nació de la pasión por simplificar la gestión de eventos y elevar la experiencia de los asistentes. Nuestra misión es proporcionar una plataforma innovadora y fácil de usar que empodere a organizadores, vendedores y asistentes, permitiéndoles enfocarse en lo que realmente importa: crear momentos inolvidables."
            />
          </div>
        </main>
      </div>

      {/* Footer - Reduced padding */}
      <footer className="backdrop-blur-md bg-slate-900/80 border-t border-slate-700/50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
            <a href="https://gaulab.com" target="_blank" rel="noopener noreferrer" className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/GaulabPng.svg" alt="gaulab.com logo" className="h-8 w-auto sm:h-12 mr-2 sm:mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Powered by</p>
                <h3 className="font-bold text-white text-base sm:text-lg">Gaulab.com</h3>
              </div>
              </div>
            </a>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link to="/documentacion" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base">
                Documentación
              </Link>
              <Link to="/contact" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base">
                Contacto
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-400">© 2025 entradita.com todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import PropTypes from 'prop-types';

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <Card
      className="group backdrop-blur-md bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
        <div className="flex justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <CardTitle className="text-white text-lg sm:text-xl font-semibold group-hover:text-blue-200 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-slate-300 text-center leading-relaxed text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  )
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

function ContentSection({ icon, title, description, additionalText, buttonText, buttonIcon, href, external }) {
ContentSection.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  additionalText: PropTypes.string,
  buttonText: PropTypes.string,
  buttonIcon: PropTypes.node,
  href: PropTypes.string,
  external: PropTypes.bool,
};
  return (
    <section className="backdrop-blur-md bg-slate-800/40 border border-slate-700/50 py-8 sm:py-12 px-4 sm:px-8 rounded-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            {icon}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">{title}</h2>

        <p className="text-base sm:text-lg text-slate-300 mb-3 sm:mb-4 leading-relaxed">{description}</p>

        {additionalText && <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed">{additionalText}</p>}

        {buttonText && href && (
          <div className="flex justify-center">
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 px-6 sm:px-8 py-3 sm:py-4"
                >
                  {buttonIcon}
                  {buttonText}
                </Button>
              </a>
            ) : (
              <Link to={href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700  text-white border-0 px-6 sm:px-8 py-3 sm:py-4"
                >
                  {buttonIcon}
                  {buttonText}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
