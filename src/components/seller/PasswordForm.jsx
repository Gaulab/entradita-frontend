"use client"

import PropTypes from "prop-types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PasswordForm({ password, setPassword, verifyPassword, passwordError }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <Card className="bg-gray-800 border-gray-700 p-6 max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="text-white text-xl">Ingrese la contraseña del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifyPassword()
              }
            }}
          />
          {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
          <Button onClick={verifyPassword} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Verificar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

PasswordForm.propTypes = {
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  verifyPassword: PropTypes.func.isRequired,
  passwordError: PropTypes.string,
}
