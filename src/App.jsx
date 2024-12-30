// entraditaFront/src/App.jsx

// React imports
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// Context imports
import { AuthProvider } from './context/AuthContext';
// Utils imports
import PrivateRoute from './utils/PrivateRoute';
// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import TermsAndConditions from './pages/TermsAndConditions';
import TicketPage from './pages/TicketPage';
import TicketShare from './pages/TicketShare';
import SellerView from './pages/SellerView';
import ScannerView from './pages/ScannerView';
import CreateTicketBySeller from './pages/CreateTicektBySeller';
// Private pages
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail/EventDetail';
import CreateEvent from './pages/CreateEvent';
import CreateTicket from './pages/CreateTicket';
import EditEvent from './pages/EditEvent';
import EventConfigInterface from './pages/EventConfigInterface';
import EventPage from './pages/EventPage';
import Economy from './pages/Economy';
// SellerWrapper is a functional component that extracts the UUID from the URL using the useParams hook and passes it as a prop to the VendorView component.
const SellerWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <SellerView uuid={uuid} />; // Pasa el UUID al componente VendorView
};
// ScannerWrapper is a functional component that extracts the UUID from the URL using the useParams hook and passes it as a prop to the ScannerView component.
const ScannerWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <ScannerView uuid={uuid} />; // Pasa el UUID al componente VendorView
};
function App() {
  return (
    <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/ticket/:ticket-uuid" element={<TicketPage />} />
          <Route path="/ticket-share/:uuid" element={<TicketShare />} />
          <Route path="/seller/:uuid" element={<SellerWrapper />} />
          <Route path="/scanner/:uuid" element={<ScannerWrapper />} />
          <Route path="/seller/:uuid/create-ticket" element={<CreateTicketBySeller />} />
        {/* Rutas protegidas */}
          <Route path="/dashboard" element={<AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/details" element={<AuthProvider><PrivateRoute><EventDetail /></PrivateRoute></AuthProvider>} />
          <Route path="/create-event" element={<AuthProvider><PrivateRoute><CreateEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/create-ticket" element={<AuthProvider><PrivateRoute><CreateTicket /></PrivateRoute></AuthProvider>} />
          <Route path="/edit-event/:id" element={<AuthProvider><PrivateRoute><EditEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/event-page-config/:id" element={<AuthProvider><PrivateRoute><EventConfigInterface /></PrivateRoute></AuthProvider>} />
          <Route path="/event-page/:id" element={<EventPage />} />
          <Route path="event/:id/economy" element={<AuthProvider><PrivateRoute><Economy /></PrivateRoute></AuthProvider>} />
        </Routes>
    </Router>
  );
}
export default App;
