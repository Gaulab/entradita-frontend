import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import AuthContext from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null); // Estado para almacenar el mensaje de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(e);
    
    if (!response.success) {
      setErrorMessage("Credenciales incorrectas, intente nuevamente.");
    } else {
      setErrorMessage(null);
      navigate('/dashboard');
    }
  };

  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleUsernameChange}
                maxLength={25}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            <Button variant="entraditaPrimary" type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            ¿Olvidó su contraseña?
            <a href="https://wa.me/543482586525?text=Olvidé%20mi%20contraseña" className="ml-1 text-blue-400 hover:text-blue-300 transition-colors"> 
            Contacte al administrador
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
