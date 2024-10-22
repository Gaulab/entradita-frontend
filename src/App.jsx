import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventsDetail';
import CreateTicket from './pages/CreateTicket';
// import ScanTicket from './pages/ScanTicket';
import EditEvent from './pages/EditEvent';
import TicketPage from './pages/TicketPage';
import VendorView from './pages/VendedorView';
import CreateTicketBySeller from './pages/CreateTicektBySeller';
import ScannerView from './pages/ScannerView';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ticket/:ticket_uuid" element={<TicketPage />} />
          <Route path="/vendedor/:uuid" element={<VendedorWrapper />} />
          <Route path="/vendedor/:uuid/create-ticket" element={<CreateTicketBySeller />} />
          {/* <Route path="/scanner/:uuid" element={<ScanTicket />} /> */}
          <Route path="/scanner/:uuid" element={<ScannerView />} />
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
          <Route path="/event-details/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
          <Route path="/event/:id/create-ticket" element={<PrivateRoute><CreateTicket /></PrivateRoute>} />
          <Route path="/edit-event/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const VendedorWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <VendorView uuid={uuid} />; // Pasa el UUID al componente VendorView
};

export default App;
