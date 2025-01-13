// entraditaFront/src/App.jsx

// React imports
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// Context imports
import { AuthProvider } from './context/AuthContext';
import { EventDetailsProvider } from './context/EventDetailsContext';  // Importa el contexto de EventDetails
import { PurchaseProvider } from './context/PurchaseContext'; // Importa el contexto de Purchase
// Utils imports
import PrivateRoute from './utils/PrivateRoute';
// Public pages
import Home from './pages/Main/Home';
import Login from './pages/Login';
import Contact from './pages/Main/Contact';
import TermsAndConditions from './pages/Main/TermsAndConditions';
import TicketPage from './pages/TicketPage';
import TicketShare from './pages/TicketShare';
import SellerView from './pages/SellerView';
import ScannerView from './pages/ScannerView';
import CreateTicketBySeller from './pages/CreateTicektBySeller';
import Pricing from './pages/Main/Pricing';
import PrivacyPolicy from './pages/Main/PrivacyPolicy';
import TicketPurchasePage from './pages/EventPage/TicketPurchasePage';
import EventPageGuide from './pages/EventPage/EventPageGuide';
// Private pages
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventConfigInterface from './pages/EventPage/EventConfigInterface';
import EventPage from './pages/EventPage/EventPage';
import Economy from './pages/Economy';
import TicketPurchaseConfig from './pages/EventPage/TicketPurchaseConfig';
import PurchaseSummaryPage from './pages/EventPage/PurchaseSummaryPage';
// Trial pages
import DashboardTrial from './pages/Trial/DashboardTrial';
import TicketPage1Trial from './pages/Trial/TicketPage1Trial';

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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/ticket/:ticket_uuid" element={<TicketPage />} />
          <Route path="/ticket-share/:uuid" element={<TicketShare />} />
          <Route path="/seller/:uuid" element={<SellerWrapper />} />
          <Route path="/scanner/:uuid" element={<ScannerWrapper />} />
          <Route path="/seller/:uuid/create-ticket" element={<CreateTicketBySeller />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard-trial" element={<DashboardTrial />} />
          <Route path="/ticket-page-trial/:ticket_uuid" element={<TicketPage1Trial />} />
          {/* <Route path="/ticket-purchase/:event_id" element={<PurchaseProvider><TicketPurchasePage /></PurchaseProvider>} /> */}
          {/* <Route path="/purchase-summary" element={<PurchaseProvider><PurchaseSummaryPage /></PurchaseProvider>} /> */}
          <Route path="/event-page-guide" element={<EventPageGuide />} />
        {/* Rutas protegidas */}
          <Route path="/event/:event_id/purchase-config" element={<AuthProvider><PrivateRoute><TicketPurchaseConfig /></PrivateRoute></AuthProvider>} />
          <Route path="/dashboard" element={<AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/details" element={<AuthProvider><EventDetailsProvider><PrivateRoute><EventDetail /></PrivateRoute></EventDetailsProvider></AuthProvider>} />
          <Route path="/create-event" element={<AuthProvider><PrivateRoute><CreateEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/edit-event/:id" element={<AuthProvider><PrivateRoute><EditEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/event-page-config/:id" element={<AuthProvider><PrivateRoute><EventConfigInterface /></PrivateRoute></AuthProvider>} />
          <Route path="/event-page/:id" element={<EventPage />} />
          <Route path="event/:id/economy" element={<AuthProvider><PrivateRoute><Economy /></PrivateRoute></AuthProvider>} />
        </Routes>
    </Router>
  );
}
export default App;
