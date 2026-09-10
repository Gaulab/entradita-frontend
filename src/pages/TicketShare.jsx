import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Share2, CheckCircle, ArrowLeft } from 'lucide-react';
import { notifyInfo } from '../utils/notify';

export default function TicketShare({ }) {
  const navigate = useNavigate();
  const { uuid } = useParams(); // Vendor's UUID
  const location = useLocation();
  const { ticketUrl } = location.state || {}; // Desestructurar ticketUrl del estado

  const handleShare = () => {
    console.log('uuid', uuid);
    if (navigator.share) {
      navigator
        .share({
          title: `🎟️ Tu ticket para el evento`,
          text: `¡Aquí está tu ticket para el evento! 🎉`,
          url: ticketUrl,
        })
        .then(() => {
          console.log('Ticket compartido exitosamente');
        })
        .catch((error) => {
          console.log('Error sharing', error);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      notifyInfo(`Comparte este enlace: ${ticketUrl}`);
      navigator.clipboard
        .writeText(ticketUrl)
        .then(() => {
          console.log('Ticket URL copiado al portapapeles');
        })
        .catch((error) => {
          console.log('Error al copiar el URL', error);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 w-screen">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
            <CheckCircle className="mr-2 text-green-500" />
            Ticket Creado con Éxito
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            El ticket ha sido generado correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleShare} 
            className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
          >
            <Share2 className="mr-2" />
            Compartir Ticket
          </Button>
          <Button 
            onClick={() => navigate(`/seller/${uuid}`)} 
            className="w-full bg-secondary hover:bg-secondary text-white flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" />
            Volver a la Página Principal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}