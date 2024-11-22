// entradaFront/src/pages/CreateEvent.jsx

// React and Router
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
// Context
import AuthContext from '../context/AuthContext';
// API
import { createEvent } from '../api/eventApi';
// ICONS
import { HelpCircle, X } from 'lucide-react';


export default function CreateEvent() {
  const [requireDNI, setRequireDNI] = useState(false);
  const [categories, setCategories] = useState(['Normal']);
  const [newCategory, setNewCategory] = useState('');
  const { authToken, user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createEvent(e, authToken.access);
      if (data) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory) && categories.length < 5) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Crear Nuevo Evento</CardTitle>
          <CardDescription className="text-gray-400">Ingresa los detalles de tu nuevo evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre del Evento
              </Label>
              <Input maxLength="25" id="name" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-200">
                Fecha
              </Label>
              <Input type="date" id="date" required className="bg-gray-700 border-gray-600 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place" className="text-gray-200">
                Lugar
              </Label>
              <Input id="place" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-200">
                Capacidad
              </Label>
              <Input id="capacity" type="number" min="0" inputMode="numeric--" pattern="[0-9]*" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_address" className="text-gray-200">
                Dirección de la Imagen (Logo)
              </Label>
              <Input id="image_address" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_employee" className="text-gray-200">
                Contraseña para Empleados
              </Label>
              <Input id="password_employee" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="require-dni" className="text-gray-200">
                Requerir DNI
              </Label>
              <Switch id="require-dni" checked={requireDNI} onCheckedChange={setRequireDNI} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-gray-200">
                Categorías de Tickets
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="categories"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  maxLength="15"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Nueva categoría"
                />
                <Button type="button" onClick={addCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category, index) => (
                  <span key={index} className="bg-gray-700 text-white py-2 px-4 rounded-full text-sm flex items-center">
                    {category}
                    <button type="button" onClick={() => removeCategory(category)} className="ml-4 text-gray-400 hover:text-gray-200 bg-gray-900 p-0">
                        <X size={20} />
                      </button>
                  </span>
                ))}
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Crear Evento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
