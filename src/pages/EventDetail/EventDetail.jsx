// entraditaFront/srs/pages/EventDetail/EventDetails.jsx

// react imports
import { useContext } from 'react';
// react-router imports
import { useNavigate, useParams } from 'react-router-dom';
// context imports
import EventDetailsContext from '../../context/EventDetailsContext';
// custom components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '@/components/ui/loadingspinner';
// icons
import { ArrowLeftIcon, EditIcon, Ticket, Users, ScanIcon } from 'lucide-react';
// page components
import Scanners from './Tabs/Scanners';
import Tickets from './Tabs/Tickets';
import Sellers from './Tabs/Sellers';
import Event from './Event';
// dialog components
import DialogCreateEmployee from './Dialogs/DialogCreateEmployee';
import DialogEditEmployee from './Dialogs/DialogEditEmployee';
import DialogDeleteItem from './Dialogs/DialogDeleteItem';
import DialogCreateTicket from './Dialogs/DialogCreateTicket';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, copyMessage, activeTab, setActiveTab, isLoading } = useContext(EventDetailsContext);


    // Mostrar loading si isLoading es true
    if (isLoading) {
      return <LoadingSpinner />;
    }
  
  return (
    <div className="flex justify-center space-y-6 pb-8 bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 min-h-screen w-screen ">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="entraditaTertiary" className="w-full sm:w-auto">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>
          <Button onClick={() => navigate(`/edit-event/${id}`)} variant="entraditaTertiary" className="w-full sm:w-auto">
            <EditIcon className="mr-2 h-4 w-4" /> Editar Evento
          </Button>
        </div>

        <Event event={event} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 gap-0  p-0">
            <TabsTrigger
              value="tickets"
              className="text-lg max-sm:m-0 max-sm:rounded-none max-sm:rounded-l-md max-sm:mr-0.5 bg-gradient-to-br to-gray-800 from-green-950 text-gray-100 border-gray-600"
            >
              <Ticket className="mr-2 h-4 hidden sm:block sm:h-6 sm:w-6" /> Tickets
            </TabsTrigger>
            <TabsTrigger value="sellers" className="text-lg max-sm:m-0 max-sm:rounded-none max-sm:mx-0.5  bg-gradient-to-br to-gray-800 from-purple-950 text-gray-100 border-gray-600">
              <Users className="mr-2 hidden sm:block sm:h-6 sm:w-6" /> Vendedores
            </TabsTrigger>
            <TabsTrigger
              value="scanners"
              className="text-lg max-sm:m-0 max-sm:rounded-none max-sm:rounded-r-md max-sm:ml-0.5  bg-gradient-to-br  from-sky-950 to-gray-800 text-gray-100 border-gray-600"
            >
              <ScanIcon className="mr-2 hidden sm:block  sm:h-6 sm:w-6" /> Scanners
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets">
            <Tickets />
          </TabsContent>
          <TabsContent value="sellers">
            <Sellers />
          </TabsContent>
          <TabsContent value="scanners">
            <Scanners />
          </TabsContent>
        </Tabs>

        {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

        <DialogCreateEmployee />
        <DialogCreateTicket />
        <DialogEditEmployee />
        <DialogDeleteItem />
      </div>
    </div>
  );
}
