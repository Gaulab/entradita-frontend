"use client"

import { useNavigate, Link } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import { Eye, EyeOff, User, Lock, ArrowLeft, Sparkles, Mail } from "lucide-react"

import AuthContext from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export default function ModernLogin() {
  const { loginUser, loginWithGoogle, registerWithEmail, user } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // 'credentials' = Django login | 'register' = Firebase email register
  const [mode, setMode] = useState('credentials')

  const [emailForm, setEmailForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.is_staff ? "/admin" : "/dashboard", { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    const response = await loginUser(e)

    if (!response.success) {
      setErrorMessage("Credenciales incorrectas, intente nuevamente.")
    } else {
      navigate(response.user?.is_staff ? "/admin" : "/dashboard")
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setErrorMessage(null)

    const response = await loginWithGoogle()

    if (!response.success) {
      setErrorMessage("Error al iniciar sesión con Google.")
    } else {
      navigate(response.user?.is_staff ? "/admin" : "/dashboard")
    }

    setIsGoogleLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    if (!emailForm.username.trim()) {
      setErrorMessage("El nombre de usuario es obligatorio.")
      setIsLoading(false)
      return
    }

    if (emailForm.password !== emailForm.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      setIsLoading(false)
      return
    }

    if (emailForm.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    const response = await registerWithEmail(emailForm.email, emailForm.password, emailForm.username.trim())

    if (!response.success) {
      setErrorMessage(response.error || "Error al crear la cuenta. Es posible que el email o usuario ya estén registrados.")
    } else {
      navigate(response.user?.is_staff ? "/admin" : "/dashboard")
    }

    setIsLoading(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setErrorMessage(null)
    setEmailForm({ username: '', email: '', password: '', confirmPassword: '' })
  }

  const [formData, setFormData] = useState({ username: "", password: "" })

  const handleUsernameChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    })
  }

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

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`
        ctx.fill()

        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

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

      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 z-[1]" />

      <div className="relative z-10 w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center fixed top-8 left-8 text-slate-300 hover:text-white transition-colors group z-10"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Volver al inicio</span>
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
              {mode === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm sm:text-base">
              {mode === 'register'
                ? 'Registrate para acceder a la plataforma'
                : 'Ingrese sus credenciales para acceder a la cuenta'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-5">
            {/* Google button — always visible */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin mr-2" />
                  Conectando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <GoogleIcon />
                  Continuar con Google
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800/60 backdrop-blur-sm px-3 text-slate-400">o</span>
              </div>
            </div>

            {/* ── Credentials form (existing Django login) ── */}
            {mode === 'credentials' && (
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
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
                      className="p-2 absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-600/60 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
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
                      Iniciando sesión...
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            )}

            {/* ── Firebase email+password register ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-slate-200 text-sm sm:text-base font-medium">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="reg-username"
                      type="text"
                      value={emailForm.username}
                      onChange={(e) => setEmailForm({ ...emailForm, username: e.target.value.toLowerCase() })}
                      maxLength={25}
                      required
                      placeholder="Elegí tu nombre de usuario"
                      className="pl-10 sm:pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-slate-200 text-sm sm:text-base font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      required
                      placeholder="tu@email.com"
                      className="pl-10 sm:pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-slate-200 text-sm sm:text-base font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 sm:pl-12 pr-10 sm:pr-12 bg-slate-500/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-600/60 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm" className="text-slate-200 text-sm sm:text-base font-medium">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      value={emailForm.confirmPassword}
                      onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Repita la contraseña"
                      className="pl-10 sm:pl-12 bg-slate-500/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
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
                      Creando cuenta...
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-3 pt-4 sm:pt-6">
            {mode === 'credentials' && (
              <>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xs sm:text-sm text-slate-400">¿Olvidaste tu contraseña?</p>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Recuperar contraseña
                  </Link>
                </div>
                <div className="flex gap-1 text-sm items-center">
                  <span className="text-slate-400 mr-2">¿No tenés cuenta?</span>
                  <button onClick={() => switchMode('register')} className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Registrate
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="flex gap-1 text-sm items-center">
                <span className="text-slate-400">¿Ya tenés cuenta?</span>
                <button onClick={() => switchMode('credentials')} className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Iniciá sesión
                </button>
              </div>
            )}
          </CardFooter>
        </Card>

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
