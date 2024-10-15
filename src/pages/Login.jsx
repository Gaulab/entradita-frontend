// src/pages/Login.jsx

import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

export default function Login() {
  const { loginUser } = useContext(AuthContext)
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      
      <Link to="/" className="mb-8 text-2xl font-bold text-white hover:text-blue-400 transition-colors">
        entradita.com
      </Link>
      
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingrese sus credenciales para acceder a la cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">Username</Label>
              <Input
                id="username"
                type="username"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            ¿Olvidó su contraseña? Contacte al administrador
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
