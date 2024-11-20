import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

export default function Event({ event }) {
  const tickets_sold = (event.tickets_counter === 0) ? 1 : event.tickets_counter
  const percentage = (event.tickets_scanned / tickets_sold) * 100

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader>
        <div className="flex flex-row items-center mb-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mr-4">
            <img
              src={event.image_address}
              alt="Event Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">{event.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">
              Fecha: <span className="text-white">{event.date}</span>
            </p>
            <p className="text-gray-400">
              Lugar: <span className="text-white">{event.place}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400">
              Capacidad: <span className="text-white">{event.capacity ? event.capacity : "Ilimitada"}</span>
            </p>
            <p className="text-gray-400">
              Tickets Vendidos: <span className="text-white">{event.tickets_counter}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardContent>
          <div className="space-y-2">
            <div className="relative">
              <Progress
                value={percentage}
                className="h-2 bg-gray-800"
              />
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{percentage.toFixed(1)}%</span>
              <span>{event.tickets_scanned} personas ingresaron al evento</span>
            </div>
          </div>
        </CardContent>
    </Card>
  )
} 