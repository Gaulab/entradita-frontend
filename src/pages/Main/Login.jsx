"use client"

import { useNavigate, Link } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import { Eye, EyeOff, User, Lock, ArrowLeft, Sparkles } from "lucide-react"

import AuthContext from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"

export default function ModernLogin() {
  const { loginUser } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const response = await loginUser(e)

    if (!response.success) {
      setErrorMessage("Credenciales incorrectas, intente nuevamente.")
    } else {
      setErrorMessage(null)
      navigate("/dashboard")
    }

    setIsLoading(false)
  }

  const [formData, setFormData] = useState({ username: "", password: "" })

  const handleUsernameChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    })
  }

  // Animated background particles
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
      const particleCount = Math.min(40, Math.floor(window.innerWidth / 30))

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? "59, 130, 246" : "147, 51, 234",
          velocity: {
            x: (Math.random() - 0.5) * 0.8,
            y: (Math.random() - 0.5) * 0.8,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 w-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 z-[1]" />

      <div className="relative z-10 w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center fixed top-8 left-8 text-slate-300 hover:text-white transition-colors group z-10"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Volver al inicio</span>
          </Link>

          {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mr-2" />
            <span className="text-xs sm:text-sm text-blue-200">Next gen of events</span>
          </div>

          <Link to="/" className="group">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
              entradita.com
            </h1>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-md bg-slate-800/60 border-slate-700/50 shadow-2xl shadow-blue-500/10">
          <CardHeader className="space-y-1 text-center pb-4 sm:pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-slate-300 text-sm sm:text-base">
              Ingrese sus credenciales para acceder a la cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200 text-sm sm:text-base font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleUsernameChange}
                    maxLength={25}
                    required
                    placeholder="Ingrese su usuario"
                    className="pl-10 sm:pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 text-sm sm:text-base font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Ingrese su contraseña"
                    className="pl-10 sm:pl-12 pr-10 sm:pr-12 bg-slate-500/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-100 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                  <p className="text-sm text-red-400 text-center">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white border-0 h-10 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">¿Olvidó su contraseña?</p>
              <a
                href="https://wa.me/543482586525?text=Olvidé%20mi%20contraseña"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Contacte al administrador
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-slate-400">
            Al iniciar sesión, acepta nuestros{" "}
            <Link to="/terms-and-conditions" className="text-blue-400 hover:text-blue-300 transition-colors">
              términos de servicio
            </Link>{" "}
            y{" "}
            <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 transition-colors">
              política de privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
