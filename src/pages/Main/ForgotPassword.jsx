import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, Sparkles, CheckCircle } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { requestPasswordReset } from "../../api/userApi"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animationFrameId
    const particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      particles.length = 0
      const count = Math.min(40, Math.floor(window.innerWidth / 30))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? "59, 130, 246" : "147, 51, 234",
          velocity: { x: (Math.random() - 0.5) * 0.8, y: (Math.random() - 0.5) * 0.8 },
          opacity: Math.random() * 0.3 + 0.1,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((o) => {
          const dx = p.x - o.x, dy = p.y - o.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${p.color}, ${0.1 * (1 - d / 80)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(o.x, o.y)
            ctx.stroke()
          }
        })
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`
        ctx.fill()
        p.x += p.velocity.x
        p.y += p.velocity.y
        if (p.x < 0 || p.x > canvas.width) p.velocity.x *= -1
        if (p.y < 0 || p.y > canvas.height) p.velocity.y *= -1
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    resizeCanvas()
    initParticles()
    draw()
    window.addEventListener("resize", () => { resizeCanvas(); initParticles() })
    return () => { window.removeEventListener("resize", resizeCanvas); cancelAnimationFrame(animationFrameId) }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch {
      setErrorMessage("Ocurrió un error. Intentá nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 w-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 z-[1]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center fixed top-8 left-8 text-slate-300 hover:text-white transition-colors group z-10"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Volver al inicio de sesión</span>
        </Link>

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

        <Card className="backdrop-blur-md bg-slate-800/60 border-slate-700/50 shadow-2xl shadow-blue-500/10">
          <CardHeader className="space-y-1 text-center pb-4 sm:pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              Recuperar contraseña
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm sm:text-base">
              Ingresá tu correo y te enviamos un enlace para restablecerla
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle className="h-14 w-14 text-emerald-400" />
                <p className="text-white font-semibold text-lg">¡Listo!</p>
                <p className="text-slate-300 text-sm">
                  Si el correo <span className="text-white font-medium">{email}</span> está registrado,
                  vas a recibir un enlace en los próximos minutos.
                </p>
                <p className="text-slate-400 text-xs">Revisá también tu carpeta de spam.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 text-sm sm:text-base font-medium">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@email.com"
                      className="pl-10 sm:pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                    <p className="text-sm text-red-400 text-center">{errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white border-0 h-10 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Enviando...
                    </div>
                  ) : (
                    "Enviar enlace"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          {!submitted && (
            <CardFooter className="flex justify-center pt-2 pb-6">
              <div className="flex gap-1 text-sm items-center">
                <span className="text-slate-400">¿Recordaste la contraseña?</span>
                <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium ml-1">
                  Iniciá sesión
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
