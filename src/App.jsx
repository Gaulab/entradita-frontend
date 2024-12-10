import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import OldEventDetails from './pages/EventDetail/EventsDetail';
import CreateTicket from './pages/CreateTicket';
import EditEvent from './pages/EditEvent';
import TicketPage from './pages/TicketPage';
import VendorView from './pages/VendedorView';
import CreateTicketBySeller from './pages/CreateTicektBySeller';
import ScannerView from './pages/ScannerView';
import Contact from './pages/Contact';
import EventPage from './pages/EventPage';
import Economy from './pages/Economy';
import TicketShare from './pages/TicketShare';

function App() {
  return (
    <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
          <Route path="/ticket/:ticket_uuid" element={<TicketPage />} />
          <Route path="/vendedor/:uuid" element={<VendedorWrapper />} />
          <Route path="/vendedor/:uuid/create-ticket" element={<CreateTicketBySeller />} />
          <Route path="/escaner/:uuid" element={<EscanerWrapper />} />
          <Route path="/ticketShare/:uuid" element={<TicketShare />} />
        {/* Rutas protegidas */}
          <Route path="/eventPage/:id" element={<EventPage />} />
          <Route path="/dashboard" element={<AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>} />
          <Route path="/create-event" element={<AuthProvider><PrivateRoute><CreateEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/details" element={<AuthProvider><PrivateRoute><OldEventDetails /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/create-ticket" element={<AuthProvider><PrivateRoute><CreateTicket /></PrivateRoute></AuthProvider>} />
          <Route path="/edit-event/:id" element={<AuthProvider><PrivateRoute><EditEvent /></PrivateRoute></AuthProvider>} />
          <Route path="event/:id/economy" element={<AuthProvider><PrivateRoute><Economy /></PrivateRoute></AuthProvider>} />
        </Routes>
    </Router>
  );
}

const VendedorWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <VendorView uuid={uuid} />; // Pasa el UUID al componente VendorView
};

const EscanerWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <ScannerView uuid={uuid} />; // Pasa el UUID al componente VendorView
};

export default App;
