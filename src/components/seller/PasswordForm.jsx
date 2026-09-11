"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PasswordForm({ password, setPassword, verifyPassword, passwordError, subtitle = "Panel de vendedor" }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="h-dvh flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <img src="/isotipoWhite.png" alt="Entradita" className="w-12 h-12 mb-3" />
          <span className="font-bold text-white/90 text-lg tracking-wide">entradita.com</span>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-center mb-5">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
          </div>

          <h2 className="text-white text-center font-semibold text-lg mb-1">Ingresá tu contraseña</h2>
          <p className="text-muted-foreground text-center text-sm mb-6">Para acceder al panel de ventas</p>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-border text-white placeholder-gray-500 pr-10 h-11 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    verifyPassword()
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <div className="bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-lg text-center">
                {passwordError}
              </div>
            )}

            <Button
              onClick={verifyPassword}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
            >
              Ingresar
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Powered by <span className="font-semibold text-muted-foreground">entradita.com</span>
        </p>
      </div>
    </div>
  )
}

PasswordForm.propTypes = {
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  verifyPassword: PropTypes.func.isRequired,
  passwordError: PropTypes.string,
  subtitle: PropTypes.string,
}
