// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { ArrowLeftIcon, EditIcon, Ticket, Users, ScanIcon } from "lucide-react";
import AuthContext from "../context/AuthContext";
// API
import { getEventDetails } from "../api/eventApi";

export default function EventDetails() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    name: '',
    date: '',
    place: '',
    capacity: '',
    tickets_counter: 0
  });

  useEffect(() => {
    const getEventData = async () => {
      try {
        const data = await getEventDetails(id, authToken.access);
        setEvent(data.event);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
        alert(error.message);
      }
    };

    getEventData();
  }, [id, authToken.access]);

  const handleEditEvent = () => {
    navigate(`/edit-event/${id}`);
  };

  return (
    <div className="flex justify-center space-y-6 pb-8 bg-gray-900 text-white p-4 min-h-screen w-screen">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>
          <Button onClick={handleEditEvent} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <EditIcon className="mr-2 h-4 w-4" /> Editar Evento
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">{event.name}</CardTitle>
            <CardDescription className="text-gray-400">ID del Evento: {id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Fecha: <span className="text-white">{event.date}</span></p>
                <p className="text-gray-400">Lugar: <span className="text-white">{event.place}</span></p>
              </div>
              <div>
                <p className="text-gray-400">Capacidad: <span className="text-white">{event.capacity ? event.capacity : "Ilimitada"}</span></p>
                <p className="text-gray-400">Tickets Vendidos: <span className="text-white">{event.tickets_counter}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to={`/event/${id}/tickets`} className="w-full">
            <Button className="w-full h-24 text-lg bg-blue-600 hover:bg-blue-700 text-gray-900">
              <Ticket className="mr-2 h-6 w-6" /> Tickets
            </Button>
          </Link>
          <Link to={`/event/${id}/sellers`} className="w-full">
            <Button className="w-full h-24 text-lg bg-green-600 hover:bg-green-700 text-gray-900">
              <Users className="mr-2 h-6 w-6" /> Vendedores
            </Button>
          </Link>
          <Link to={`/event/${id}/scanners`} className="w-full">
            <Button className="w-full h-24 text-lg bg-purple-600 hover:bg-purple-700 text-gray-900">
              <ScanIcon className="mr-2 h-6 w-6" /> Scanners
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}